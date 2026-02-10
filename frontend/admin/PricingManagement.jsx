import React, { useState, useEffect } from 'react';
import {
    Plus, Minus, Save, DollarSign, AlertCircle, CheckCircle,
    Edit2, Trash2, X, Layers
} from 'lucide-react';
import './PricingManagement.css';

const DEFAULT_PRICING_RULES = [
    {
        id: 'default-bw-single-1',
        colorType: 'bw',
        sideType: 'single',
        fromPage: 1,
        toPage: 50,
        studentPrice: 1.50,
        institutePrice: 1.50,
        regularPrice: 2.00
    },
    {
        id: 'default-bw-single-2',
        colorType: 'bw',
        sideType: 'single',
        fromPage: 51,
        toPage: 200,
        studentPrice: 1.25,
        institutePrice: 1.25,
        regularPrice: 1.75
    },
    {
        id: 'default-bw-double-1',
        colorType: 'bw',
        sideType: 'double',
        fromPage: 1,
        toPage: 50,
        studentPrice: 1.20,
        institutePrice: 1.20,
        regularPrice: 1.60
    },
    {
        id: 'default-color-single-1',
        colorType: 'color',
        sideType: 'single',
        fromPage: 1,
        toPage: 50,
        studentPrice: 8.00,
        institutePrice: 8.00,
        regularPrice: 10.00
    },
    {
        id: 'default-color-double-1',
        colorType: 'color',
        sideType: 'double',
        fromPage: 1,
        toPage: 50,
        studentPrice: 7.00,
        institutePrice: 7.00,
        regularPrice: 9.00
    }
];

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

    // Load pricing rules from localStorage
    useEffect(() => {
        loadPricingRules();
    }, []);

    const loadPricingRules = () => {
        setIsLoading(true);
        try {
            const saved = localStorage.getItem('normal_printing_prices');
            if (saved) {
                const parsed = JSON.parse(saved);
                setPricingRules(Array.isArray(parsed) ? parsed : DEFAULT_PRICING_RULES);
            } else {
                setPricingRules(DEFAULT_PRICING_RULES);
                // Save defaults to localStorage
                localStorage.setItem('normal_printing_prices', JSON.stringify(DEFAULT_PRICING_RULES));
            }
        } catch (e) {
            console.error('Error loading pricing rules:', e);
            setPricingRules(DEFAULT_PRICING_RULES);
        }
        setIsLoading(false);
    };

    const savePricingRules = (rules) => {
        try {
            localStorage.setItem('normal_printing_prices', JSON.stringify(rules));
            setSaveMessage({ type: 'success', text: 'Pricing rules saved successfully!' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            // Trigger storage event for other tabs
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error('Error saving pricing rules:', e);
            setSaveMessage({ type: 'error', text: 'Failed to save pricing rules' });
        }
    };

    const handleAddRules = () => {
        const timestamp = Date.now();
        const rulesToAdd = newRuleRows.map((rule, index) => ({
            ...rule,
            id: `rule-${timestamp}-${index}`
        }));

        const updatedRules = [...pricingRules, ...rulesToAdd];
        setPricingRules(updatedRules);
        savePricingRules(updatedRules);
        setShowAddModal(false);
        setNewRuleRows([initialRuleRow]);
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

    const handleSaveRule = (ruleId) => {
        savePricingRules(pricingRules);
        setEditingRule(null);
    };

    const handleDeleteRule = (ruleId) => {
        const updatedRules = pricingRules.filter(rule => rule.id !== ruleId);
        setPricingRules(updatedRules);
        savePricingRules(updatedRules);
    };

    const getColorName = (id) => COLOR_OPTIONS.find(c => c.id === id)?.name || id;
    const getSideName = (id) => SIDE_OPTIONS.find(s => s.id === id)?.name || id;

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
                <button className="btn-add-rule" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Price Rule
                </button>
            </div>

            {saveMessage.text && (
                <div className={`save-message ${saveMessage.type}`}>
                    {saveMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {saveMessage.text}
                </div>
            )}

            <div className="pricing-rules-container">
                <div className="pricing-table-wrapper">
                    <table className="pricing-table">
                        <thead>
                            <tr>
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
                                <tr key={rule.id} className={editingRule === rule.id ? 'editing' : ''}>
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
                                                            loadPricingRules(); // Reset changes
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
                                                    <button
                                                        className="btn-delete-row"
                                                        onClick={() => handleDeleteRule(rule.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pricingRules.length === 0 && (
                    <div className="no-rules">
                        <Layers size={48} />
                        <h3>No Pricing Rules</h3>
                        <p>Add your first pricing rule to get started</p>
                        <button className="btn-add-first" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} />
                            Add First Rule
                        </button>
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
