import React, { useState, useEffect } from 'react';
import {
    Plus, Minus, Save, DollarSign, AlertCircle, CheckCircle,
    Edit2, Trash2, X, Layers
} from 'lucide-react';
import './PricingManagement.css';

const COLOR_OPTIONS = [
    { id: 'bw', name: 'Black & White' },
    { id: 'color', name: 'Full Color' }
];

const SIDE_OPTIONS = [
    { id: 'single', name: 'Single Sides' },
    { id: 'double', name: 'Both Sides' }
];

const PricingManagement = () => {
    const [pricingRules, setPricingRules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
    const [editingRule, setEditingRule] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Support multiple rules at once
    const initialRuleRow = {
        colorType: 'bw',
        sideType: 'single',
        fromPage: 1,
        toPage: 1000,
        studentPrice: 1.50,
        institutePrice: 1.50,
        regularPrice: 2.00
    };
    const [newRuleRows, setNewRuleRows] = useState([initialRuleRow]);

    // Load pricing rules from backend
    useEffect(() => {
        fetchPricingRules();
    }, []);

    const fetchPricingRules = async () => {
        setIsLoading(true);
        try {
            const api = (await import('../lib/api')).adminAPI;
            // Fetch ALL rules from database including inactive ones
            const res = await api.getPrintingPrices({ includeAll: 'true' });
            console.log('Pricing API Response:', res);
            
            const prices = res?.data || [];
            console.log(`Fetched ${prices.length} pricing rules from backend`);
            
            if (!prices || prices.length === 0) {
                console.warn('No pricing rules found in database');
                setPricingRules([]);
                return;
            }
            
            const mapped = prices.map(p => {
                console.log(`Mapping pricing rule:`, p);
                return {
                    id: p._id,
                    colorType: mapColorTypeToUI(p.colorType),
                    sideType: mapSideTypeToUI(p.sideType),
                    fromPage: p.pageRangeStart,
                    toPage: p.pageRangeEnd,
                    studentPrice: p.studentPrice,
                    institutePrice: p.institutePrice,
                    regularPrice: p.regularPrice,
                    description: p.description || '',
                    isActive: p.isActive
                };
            });
            
            console.log('Mapped pricing rules:', mapped);
            setPricingRules(mapped);
        } catch (e) {
            console.error('Error fetching pricing rules:', e);
            setSaveMessage({ type: 'error', text: `Error loading prices: ${e.message}` });
            setPricingRules([]);
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
        } finally {
            setIsLoading(false);
        }
    };

    const savePricingRules = async (rules) => {
        // Not used for bulk save; individual create/update/delete handled separately
        try {
            setSaveMessage({ type: 'success', text: 'Pricing rules updated locally.' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        } catch (e) {
            console.error('Error saving pricing rules:', e);
            setSaveMessage({ type: 'error', text: 'Failed to save pricing rules' });
        }
    };

    const handleAddRules = async () => {
        // Map UI rows to API shape and call bulk create
        const rulesToCreate = newRuleRows.map(r => ({
            serviceType: 'Normal Print',
            colorType: mapColorTypeToBackend(r.colorType),
            sideType: mapSideTypeToBackend(r.sideType),
            pageRangeStart: parseInt(r.fromPage, 10) || 1,
            pageRangeEnd: parseInt(r.toPage, 10) || 1,
            studentPrice: Number(r.studentPrice) || 0,
            institutePrice: Number(r.institutePrice) || 0,
            regularPrice: Number(r.regularPrice) || 0,
            description: r.description || ''
        }));

        // Check for conflicts before creating
        try {
            setIsLoading(true);
            const api = (await import('../lib/api')).adminAPI;
            
            // Check each rule for conflicts
            const conflicts = [];
            for (const rule of rulesToCreate) {
                const checkRes = await api.checkExistingPrice({
                    serviceType: rule.serviceType,
                    colorType: rule.colorType,
                    sideType: rule.sideType,
                    pageRangeStart: rule.pageRangeStart,
                    pageRangeEnd: rule.pageRangeEnd
                });

                if (checkRes.conflicting && checkRes.conflicts.length > 0) {
                    conflicts.push({
                        rule: `${rule.colorType} - ${rule.sideType} (${rule.pageRangeStart}-${rule.pageRangeEnd})`,
                        conflicts: checkRes.conflicts
                    });
                }
            }

            if (conflicts.length > 0) {
                const conflictDetails = conflicts.map(c => 
                    `${c.rule}: overlaps with ${c.conflicts.length} existing rule(s)`
                ).join('\n');
                
                const shouldContinue = confirm(
                    `⚠️ Conflicts detected:\n\n${conflictDetails}\n\nContinue anyway?`
                );
                
                if (!shouldContinue) {
                    setIsLoading(false);
                    return;
                }
            }

            const res = await api.bulkCreatePrintingPrices(rulesToCreate);
            // Refresh list
            await fetchPricingRules();
            setSaveMessage({ type: 'success', text: res.message || 'Rules added' });
            setShowAddModal(false);
            setNewRuleRows([initialRuleRow]);
        } catch (err) {
            console.error('Failed to add rules:', err);
            setSaveMessage({ type: 'error', text: err.message || 'Failed to add rules' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        }
    };

    const addNewRow = () => {
        const lastRow = newRuleRows[newRuleRows.length - 1];
        setNewRuleRows([...newRuleRows, {
            ...initialRuleRow,
            fromPage: (parseInt(lastRow.toPage) || 0) + 1,
            toPage: (parseInt(lastRow.toPage) || 0) + 50
        }]);
    };

    const removeRow = (index) => {
        if (newRuleRows.length > 1) {
            const updatedRows = newRuleRows.filter((_, i) => i !== index);
            setNewRuleRows(updatedRows);
        }
    };

    const updateNewRuleRow = (index, field, value) => {
        const updatedRows = [...newRuleRows];
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        setNewRuleRows(updatedRows);
    };

    const handleUpdateRule = (ruleId, field, value) => {
        const updatedRules = pricingRules.map(rule => {
            if (rule.id === ruleId) {
                return { ...rule, [field]: value };
            }
            return rule;
        });
        setPricingRules(updatedRules);
    };

    const handleSaveRule = async (ruleId) => {
        const rule = pricingRules.find(r => r.id === ruleId);
        if (!rule) return;
        try {
            setIsLoading(true);
            const api = (await import('../lib/api')).adminAPI;
            const updates = {
                colorType: mapColorTypeToBackend(rule.colorType),
                sideType: mapSideTypeToBackend(rule.sideType),
                pageRangeStart: parseInt(rule.fromPage, 10) || 1,
                pageRangeEnd: parseInt(rule.toPage, 10) || 1,
                studentPrice: Number(rule.studentPrice) || 0,
                institutePrice: Number(rule.institutePrice) || 0,
                regularPrice: Number(rule.regularPrice) || 0,
                description: rule.description || ''
            };
            const res = await api.updatePrintingPrice(ruleId, updates);
            setSaveMessage({ type: 'success', text: res.message || 'Rule updated' });
            await fetchPricingRules();
            setEditingRule(null);
        } catch (err) {
            console.error('Failed to update rule:', err);
            setSaveMessage({ type: 'error', text: err.message || 'Failed to update rule' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleDeleteRule = async (ruleId) => {
        const rule = pricingRules.find(r => r.id === ruleId);
        if (!confirm('Deactivate this pricing rule?')) return;
        try {
            setIsLoading(true);
            const api = (await import('../lib/api')).adminAPI;
            const res = await api.updatePrintingPrice(ruleId, { isActive: false });
            setSaveMessage({ type: 'success', text: 'Rule deactivated successfully' });
            await fetchPricingRules();
        } catch (err) {
            console.error('Failed to deactivate rule:', err);
            setSaveMessage({ type: 'error', text: err.message || 'Failed to deactivate rule' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleRestoreRule = async (ruleId) => {
        if (!confirm('Activate this pricing rule?')) return;
        try {
            setIsLoading(true);
            const api = (await import('../lib/api')).adminAPI;
            const res = await api.updatePrintingPrice(ruleId, { isActive: true });
            setSaveMessage({ type: 'success', text: 'Rule activated successfully' });
            await fetchPricingRules();
        } catch (err) {
            console.error('Failed to activate rule:', err);
            setSaveMessage({ type: 'error', text: err.message || 'Failed to activate rule' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleInitializeDefaults = async () => {
        const confirmed = confirm(
            'Initialize default pricing rules?\n\n' +
            '✓ Black & White Single Sided (1-50, 51-200 pages)\n' +
            '✓ Black & White Double Sided (1-50 pages)\n' +
            '✓ Full Color Single Sided (1-50 pages)\n' +
            '✓ Full Color Double Sided (1-50 pages)\n\n' +
            'This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            setIsLoading(true);
            const api = (await import('../lib/api')).adminAPI;
            const res = await api.initializeDefaultPrices();
            setSaveMessage({ type: 'success', text: res.message });
            await fetchPricingRules();
        } catch (err) {
            console.error('Failed to initialize defaults:', err);
            setSaveMessage({ type: 'error', text: err.message || 'Failed to initialize defaults' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
        }
    };

    const getColorName = (id) => COLOR_OPTIONS.find(c => c.id === id)?.name || id;
    const getSideName = (id) => SIDE_OPTIONS.find(s => s.id === id)?.name || id;

    // Map UI enum values to backend enum values
    const mapColorTypeToBackend = (uiValue) => {
        const map = { 'bw': 'Black & White', 'color': 'Full Color', 'both': 'Both' };
        return map[uiValue] || uiValue;
    };
    const mapSideTypeToBackend = (uiValue) => {
        const map = { 'single': 'Single Sided', 'double': 'Double Sided', 'both': 'Both' };
        return map[uiValue] || uiValue;
    };
    // Map backend enum values back to UI
    const mapColorTypeToUI = (backendValue) => {
        const map = { 'Black & White': 'bw', 'Full Color': 'color', 'Both': 'both' };
        return map[backendValue] || backendValue;
    };
    const mapSideTypeToUI = (backendValue) => {
        const map = { 'Single Sided': 'single', 'Double Sided': 'double', 'Both': 'both' };
        return map[backendValue] || backendValue;
    };

    if (isLoading) {
        return (
            <div className="pricing-loading">
                <div className="loading-spinner"></div>
                <p>Loading pricing rules...</p>
            </div>
        );
    }

    return (
        <div className="management-content">
            <div className="management-header">
                <div>
                    <h1>Normal Printing Prices</h1>
                    <p>Configure printing prices based on user type, colour, sides, and page ranges</p>
                </div>
                <div className="header-buttons">
                    {pricingRules.filter(r => r.isActive).length === 0 && (
                        <button className="btn-init-defaults" onClick={handleInitializeDefaults} title="Initialize default pricing rules">
                            <DollarSign size={18} />
                            Initialize Defaults
                        </button>
                    )}
                    <button className="btn-add-rule" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} />
                        Add Price Rule
                    </button>
                </div>
            </div>

            {saveMessage.text && (
                <div className={`save-message ${saveMessage.type}`}>
                    {saveMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {saveMessage.text}
                </div>
            )}

            <div className="pricing-rules-container">
                {pricingRules.length > 0 ? (
                    <div className="pricing-table-wrapper">
                        <table className="pricing-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Printed Colour</th>
                                    <th>Print Sides</th>
                                    <th>From Page</th>
                                    <th>To Page</th>
                                    <th>Student Price (₹)</th>
                                    <th>Institute Price (₹)</th>
                                    <th>Regular Price (₹)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricingRules.map(rule => (
                                    <tr key={rule.id} className={`${editingRule === rule.id ? 'editing' : ''} ${!rule.isActive ? 'inactive-row' : ''}`}>
                                        <td>
                                            {rule.isActive ? (
                                                <span className="status-badge active">Active</span>
                                            ) : (
                                                <span className="status-badge inactive">Deleted</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <select
                                                    value={rule.colorType}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'colorType', e.target.value)}
                                                    className="edit-select"
                                                >
                                                    {COLOR_OPTIONS.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`color-badge ${rule.colorType}`}>
                                                    {getColorName(rule.colorType)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <select
                                                    value={rule.sideType}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'sideType', e.target.value)}
                                                    className="edit-select"
                                                >
                                                    {SIDE_OPTIONS.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`side-badge ${rule.sideType}`}>
                                                    {getSideName(rule.sideType)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={rule.fromPage}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'fromPage', parseInt(e.target.value) || 1)}
                                                    className="edit-input small"
                                                />
                                            ) : (
                                                <span className="page-value">{rule.fromPage}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={rule.toPage}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'toPage', parseInt(e.target.value) || 1)}
                                                    className="edit-input small"
                                                />
                                            ) : (
                                                <span className="page-value">{rule.toPage}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={rule.studentPrice}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'studentPrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value student">₹{rule.studentPrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={rule.institutePrice}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'institutePrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value institute">₹{rule.institutePrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingRule === rule.id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={rule.regularPrice}
                                                    onChange={(e) => handleUpdateRule(rule.id, 'regularPrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value regular">₹{rule.regularPrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {editingRule === rule.id ? (
                                                    <>
                                                        <button
                                                            className="btn-save-row"
                                                            onClick={() => handleSaveRule(rule.id)}
                                                            title="Save"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-cancel-row"
                                                            onClick={() => {
                                                                fetchPricingRules(); // Reset changes
                                                                setEditingRule(null);
                                                            }}
                                                            title="Cancel"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="btn-edit-row"
                                                            onClick={() => setEditingRule(rule.id)}
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        {rule.isActive ? (
                                                            <button
                                                                className="btn-deactivate-row"
                                                                onClick={() => handleDeleteRule(rule.id)}
                                                                title="Deactivate"
                                                            >
                                                                ✕ Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-activate-row"
                                                                onClick={() => handleRestoreRule(rule.id)}
                                                                title="Activate"
                                                            >
                                                                ✓ Activate
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-rules">
                        <Layers size={48} />
                        <h3>No Pricing Rules Found</h3>
                        <p>Get started by initializing default prices or adding custom rules</p>
                        <div className="empty-state-buttons">
                            <button className="btn-init-empty" onClick={handleInitializeDefaults}>
                                <DollarSign size={18} />
                                Initialize Defaults
                            </button>
                            <button className="btn-add-empty" onClick={() => setShowAddModal(true)}>
                                <Plus size={18} />
                                Add Custom Rule
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Rule Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <button className="modal-close-outer" onClick={() => setShowAddModal(false)}>
                        <X size={24} />
                    </button>

                    <div className="add-rule-modal multi-rule" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Plus size={20} /> Add New Price Rules</h3>
                        </div>
                        <div className="modal-body">
                            {newRuleRows.map((row, index) => (
                                <div key={index} className="pricing-rule-block">
                                    {index > 0 && <div className="rule-divider"><span>RANGE WISE PRICE {index + 1}</span></div>}
                                    <div className="form-grid">
                                        <div className="form-group floating-label">
                                            <select
                                                value={row.colorType}
                                                onChange={(e) => updateNewRuleRow(index, 'colorType', e.target.value)}
                                            >
                                                {COLOR_OPTIONS.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <label>Printed Colour</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <select
                                                value={row.sideType}
                                                onChange={(e) => updateNewRuleRow(index, 'sideType', e.target.value)}
                                            >
                                                {SIDE_OPTIONS.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <label>Print Sides</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.fromPage}
                                                onChange={(e) => updateNewRuleRow(index, 'fromPage', parseInt(e.target.value) || 0)}
                                            />
                                            <label>From Page</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.toPage}
                                                onChange={(e) => updateNewRuleRow(index, 'toPage', parseInt(e.target.value) || 0)}
                                            />
                                            <label>To Page</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={row.studentPrice}
                                                onChange={(e) => updateNewRuleRow(index, 'studentPrice', parseFloat(e.target.value) || 0)}
                                            />
                                            <label>Student Price</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={row.institutePrice}
                                                onChange={(e) => updateNewRuleRow(index, 'institutePrice', parseFloat(e.target.value) || 0)}
                                            />
                                            <label>Institute Price</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={row.regularPrice}
                                                onChange={(e) => updateNewRuleRow(index, 'regularPrice', parseFloat(e.target.value) || 0)}
                                            />
                                            <label>Regular Users Price</label>
                                        </div>
                                        <div className="add-more-container">
                                            <span className="add-more-label">Add More</span>
                                            <div className="add-more-actions">
                                                <button className="btn-circle-add" onClick={addNewRow} title="Add another range">
                                                    <Plus size={16} />
                                                </button>
                                                <button
                                                    className={`btn-circle-remove ${newRuleRows.length === 1 ? 'disabled' : ''}`}
                                                    onClick={() => removeRow(index)}
                                                    title="Remove this range"
                                                    disabled={newRuleRows.length === 1}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="modal-divider"></div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-add-gradient" onClick={handleAddRules}>
                                <Plus size={18} />
                                Add {newRuleRows.length > 1 ? `${newRuleRows.length} Rules` : 'Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pricing-info">
                <AlertCircle size={18} />
                <p>
                    <strong>How it works:</strong> When calculating prices, the system will find the matching rule based on colour, sides, and the page count falling within the page range.
                    If no matching rule is found, default prices will be used. Rules with more specific page ranges take precedence.
                </p>
            </div>
        </div>
    );
};

export default PricingManagement;
