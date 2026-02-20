import React, { useState, useEffect } from 'react';
import {
    Plus, Minus, Save, AlertCircle, CheckCircle,
    Edit2, Trash2, X, Link2, Layers
} from 'lucide-react';
import { adminAPI } from '../lib/api';
import './BindingManagement.css';

const BindingManagement = () => {
    const [bindingTypes, setBindingTypes] = useState([]);
    const [bindingPrices, setBindingPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

    // Modal states
    const [showAddTypeModal, setShowAddTypeModal] = useState(false);
    const [showAddPriceModal, setShowAddPriceModal] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [editingPrice, setEditingPrice] = useState(null);

    // New binding type form
    const [newTypeName, setNewTypeName] = useState('');

    // New price rule form
    const initialPriceRow = {
        bindingType: '',
        pageRangeStart: 1,
        pageRangeEnd: 100,
        studentPrice: 10.00,
        institutePrice: 10.00,
        regularPrice: 15.00
    };
    const [newPriceRows, setNewPriceRows] = useState([initialPriceRow]);

    // Load data from API
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load binding types
            const typesResponse = await adminAPI.getBindingTypes();
            if (typesResponse.success && typesResponse.data) {
                setBindingTypes(typesResponse.data);
            } else {
                setSaveMessage({ type: 'error', text: 'Failed to load binding types' });
            }

            // Load binding prices with includeAll to see active and inactive
            const pricesResponse = await adminAPI.getBindingPrices({ includeAll: 'true' });
            if (pricesResponse.success && pricesResponse.data) {
                setBindingPrices(pricesResponse.data);
            } else {
                setSaveMessage({ type: 'error', text: 'Failed to load binding prices' });
            }
        } catch (e) {
            console.error('Error loading binding data:', e);
            setSaveMessage({ type: 'error', text: 'Failed to load binding data' });
        }
        setIsLoading(false);
    };

    const saveBindingType = async (type) => {
        try {
            if (type._id) {
                // Update existing
                const response = await adminAPI.updateBindingType(type._id, { name: type.name });
                if (response.success) {
                    setSaveMessage({ type: 'success', text: 'Binding type updated successfully!' });
                    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to update binding type' });
                }
            } else {
                // Create new
                const response = await adminAPI.createBindingType({ name: type.name });
                if (response.success) {
                    setSaveMessage({ type: 'success', text: 'Binding type created successfully!' });
                    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                    await loadData();
                    return;
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to create binding type' });
                }
            }
            await loadData();
        } catch (e) {
            console.error('Error saving binding type:', e);
            setSaveMessage({ type: 'error', text: 'Failed to save binding type' });
        }
    };

    const saveBindingPrice = async (price) => {
        try {
            if (price._id) {
                // Update existing
                const updateData = {
                    bindingType: price.bindingType,
                    pageRangeStart: parseInt(price.pageRangeStart),
                    pageRangeEnd: parseInt(price.pageRangeEnd),
                    studentPrice: parseFloat(price.studentPrice),
                    institutePrice: parseFloat(price.institutePrice),
                    regularPrice: parseFloat(price.regularPrice)
                };
                const response = await adminAPI.updateBindingPrice(price._id, updateData);
                if (response.success) {
                    setSaveMessage({ type: 'success', text: 'Binding price updated successfully!' });
                    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to update binding price' });
                }
            } else {
                // Create new
                const createData = {
                    bindingType: price.bindingType,
                    pageRangeStart: parseInt(price.pageRangeStart),
                    pageRangeEnd: parseInt(price.pageRangeEnd),
                    studentPrice: parseFloat(price.studentPrice),
                    institutePrice: parseFloat(price.institutePrice),
                    regularPrice: parseFloat(price.regularPrice)
                };
                const response = await adminAPI.createBindingPrice(createData);
                if (response.success) {
                    setSaveMessage({ type: 'success', text: 'Binding price created successfully!' });
                    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                    await loadData();
                    return;
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to create binding price' });
                }
            }
            await loadData();
        } catch (e) {
            console.error('Error saving binding price:', e);
            setSaveMessage({ type: 'error', text: 'Failed to save binding price' });
        }
    };

    // Binding Type CRUD
    const handleAddType = async () => {
        if (!newTypeName.trim()) return;

        const newType = {
            name: newTypeName.trim()
        };

        await saveBindingType(newType);
        setNewTypeName('');
        setShowAddTypeModal(false);
    };

    const handleUpdateType = (typeId, field, value) => {
        const updated = bindingTypes.map(t =>
            t._id === typeId ? { ...t, [field]: value } : t
        );
        setBindingTypes(updated);
    };

    const handleSaveType = async (typeId) => {
        const type = bindingTypes.find(t => t._id === typeId);
        if (type) {
            await saveBindingType(type);
        }
        setEditingType(null);
    };

    const handleDeleteType = async (typeId) => {
        // Check if any prices use this type
        const pricesUsingType = bindingPrices.filter(p => {
            const priceTypeId = p.bindingType?._id || p.bindingType;
            return priceTypeId === typeId;
        });
        if (pricesUsingType.length > 0) {
            setSaveMessage({ type: 'error', text: 'Cannot delete: There are price rules using this binding type' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            return;
        }

        try {
            const response = await adminAPI.deleteBindingType(typeId);
            if (response.success) {
                setSaveMessage({ type: 'success', text: 'Binding type deleted successfully!' });
                setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                await loadData();
            } else {
                setSaveMessage({ type: 'error', text: 'Failed to delete binding type' });
            }
        } catch (e) {
            console.error('Error deleting binding type:', e);
            setSaveMessage({ type: 'error', text: 'Failed to delete binding type' });
        }
    };

    const toggleTypeStatus = async (typeId) => {
        const type = bindingTypes.find(t => t._id === typeId);
        if (type) {
            try {
                const response = await adminAPI.updateBindingType(typeId, { isActive: !type.isActive });
                if (response.success) {
                    setSaveMessage({ type: 'success', text: `Binding type ${!type.isActive ? 'activated' : 'deactivated'} successfully!` });
                    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                    await loadData();
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to update binding type status' });
                }
            } catch (e) {
                console.error('Error toggling type status:', e);
                setSaveMessage({ type: 'error', text: 'Failed to update binding type status' });
            }
        }
    };

    // Conflict Detection for Price Ranges
    const checkPriceConflict = (bindingType, start, end, excludeId = null) => {
        return bindingPrices.some(p => {
            if (p._id === excludeId) return false; // Exclude the current price being edited
            
            // Handle bindingType as either an object (populated) or a string (ID)
            const priceTypeId = p.bindingType?._id || p.bindingType;
            if (priceTypeId !== bindingType) return false;
            
            if (!p.isActive) return false; // Only check against active prices
            
            start = parseInt(start);
            end = parseInt(end);
            const pStart = parseInt(p.pageRangeStart);
            const pEnd = parseInt(p.pageRangeEnd);
            
            // Check for overlap
            return !(end < pStart || start > pEnd);
        });
    };

    // Binding Price CRUD
    const handleAddPrices = async () => {
        const pricesToAdd = newPriceRows.filter(row => row.bindingType);

        if (pricesToAdd.length === 0) {
            setSaveMessage({ type: 'error', text: 'Please select a binding type for at least one price rule' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            return;
        }

        // Check for conflicts
        for (const price of pricesToAdd) {
            if (checkPriceConflict(price.bindingType, price.pageRangeStart, price.pageRangeEnd)) {
                setSaveMessage({ 
                    type: 'error', 
                    text: `Page range conflict for ${price.bindingType}: ${price.pageRangeStart}-${price.pageRangeEnd}` 
                });
                setTimeout(() => setSaveMessage({ type: '', text: '' }), 5000);
                return;
            }
        }

        // Create all prices
        try {
            const promises = pricesToAdd.map(price =>
                adminAPI.createBindingPrice({
                    bindingType: price.bindingType,
                    pageRangeStart: parseInt(price.pageRangeStart),
                    pageRangeEnd: parseInt(price.pageRangeEnd),
                    studentPrice: parseFloat(price.studentPrice),
                    institutePrice: parseFloat(price.institutePrice),
                    regularPrice: parseFloat(price.regularPrice)
                })
            );

            const results = await Promise.all(promises);
            const allSuccess = results.every(r => r.success);

            if (allSuccess) {
                setSaveMessage({ type: 'success', text: `${pricesToAdd.length} binding price(s) created successfully!` });
                setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                setShowAddPriceModal(false);
                setNewPriceRows([initialPriceRow]);
                await loadData();
            } else {
                setSaveMessage({ type: 'error', text: 'Some prices failed to create' });
            }
        } catch (e) {
            console.error('Error creating prices:', e);
            setSaveMessage({ type: 'error', text: 'Failed to create binding prices' });
        }
    };

    const addNewPriceRow = () => {
        const lastRow = newPriceRows[newPriceRows.length - 1];
        setNewPriceRows([...newPriceRows, {
            ...initialPriceRow,
            bindingType: lastRow.bindingType,
            pageRangeStart: (parseInt(lastRow.pageRangeEnd) || 0) + 1,
            pageRangeEnd: (parseInt(lastRow.pageRangeEnd) || 0) + 100
        }]);
    };

    const removePriceRow = (index) => {
        if (newPriceRows.length > 1) {
            const updated = newPriceRows.filter((_, i) => i !== index);
            setNewPriceRows(updated);
        }
    };

    const updateNewPriceRow = (index, field, value) => {
        const updated = [...newPriceRows];
        updated[index] = { ...updated[index], [field]: value };
        setNewPriceRows(updated);
    };

    const handleUpdatePrice = (priceId, field, value) => {
        const updated = bindingPrices.map(p =>
            p._id === priceId ? { ...p, [field]: value } : p
        );
        setBindingPrices(updated);
    };

    const handleSavePrice = async (priceId) => {
        const price = bindingPrices.find(p => p._id === priceId);
        if (price) {
            // Check for conflicts excluding current price
            if (checkPriceConflict(price.bindingType, price.pageRangeStart, price.pageRangeEnd, priceId)) {
                setSaveMessage({ 
                    type: 'error', 
                    text: `Page range conflict: ${price.pageRangeStart}-${price.pageRangeEnd}` 
                });
                setTimeout(() => setSaveMessage({ type: '', text: '' }), 5000);
                return;
            }
            await saveBindingPrice(price);
        }
        setEditingPrice(null);
    };

    const handleDeletePrice = async (priceId) => {
        try {
            const response = await adminAPI.deleteBindingPrice(priceId);
            if (response.success) {
                setSaveMessage({ type: 'success', text: 'Binding price deleted successfully!' });
                setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                await loadData();
            } else {
                setSaveMessage({ type: 'error', text: 'Failed to delete binding price' });
            }
        } catch (e) {
            console.error('Error deleting price:', e);
            setSaveMessage({ type: 'error', text: 'Failed to delete binding price' });
        }
    };

    const handleTogglePriceStatus = async (priceId) => {
        const price = bindingPrices.find(p => p._id === priceId);
        if (price) {
            try {
                const response = await adminAPI.updateBindingPrice(priceId, { isActive: !price.isActive });
                if (response.success) {
                    setSaveMessage({ 
                        type: 'success', 
                        text: `Price ${!price.isActive ? 'activated' : 'deactivated'} successfully!` 
                    });
                    setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                    await loadData();
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to update price status' });
                }
            } catch (e) {
                console.error('Error toggling price status:', e);
                setSaveMessage({ type: 'error', text: 'Failed to update price status' });
            }
        }
    };

    // Helper functions
    const getBindingTypeName = (typeData) => {
        // Handle both cases: populated object { _id, name } or just ID string
        if (typeof typeData === 'object' && typeData?._id) {
            return typeData.name || typeData._id;
        }
        const type = bindingTypes.find(t => t._id === typeData);
        return type?.name || typeData;
    };

    const getActiveBindingTypes = () => {
        return bindingTypes.filter(t => t.isActive);
    };

    if (isLoading) {
        return (
            <div className="binding-loading">
                <div className="loading-spinner"></div>
                <p>Loading binding settings...</p>
            </div>
        );
    }

    return (
        <div className="management-content binding-management">
            {/* Header */}
            <div className="management-header">
                <div>
                    <h1>Binding Management</h1>
                    <p>Configure binding types and prices based on user type and page ranges</p>
                </div>
            </div>

            {saveMessage.text && (
                <div className={`save-message ${saveMessage.type}`}>
                    {saveMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {saveMessage.text}
                </div>
            )}

            {/* Binding Types Section */}
            <div className="binding-section">
                <div className="section-header">
                    <div className="section-title">
                        <Link2 size={20} />
                        <h2>Binding Types</h2>
                    </div>
                    <button className="btn-add-rule" onClick={() => setShowAddTypeModal(true)}>
                        <Plus size={18} />
                        Add Binding Type
                    </button>
                </div>

                <div className="binding-types-grid">
                    {bindingTypes.map(type => (
                        <div key={type._id} className={`binding-type-card ${!type.isActive ? 'inactive' : ''}`}>
                            {editingType === type._id ? (
                                <div className="type-edit-form">
                                    <input
                                        type="text"
                                        value={type.name}
                                        onChange={(e) => handleUpdateType(type._id, 'name', e.target.value)}
                                        className="type-name-input"
                                        autoFocus
                                    />
                                    <div className="type-edit-actions">
                                        <button className="btn-save-small" onClick={() => handleSaveType(type._id)}>
                                            <Save size={14} />
                                        </button>
                                        <button className="btn-cancel-small" onClick={() => {
                                            loadData();
                                            setEditingType(null);
                                        }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="type-info">
                                        <span className="type-name">{type.name}</span>
                                        <span className={`type-status ${type.isActive ? 'active' : 'inactive'}`}>
                                            {type.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="type-actions">
                                        <>
                                            <button
                                                className={`btn-toggle ${type.isActive ? 'active' : ''}`}
                                                onClick={() => toggleTypeStatus(type._id)}
                                                title={type.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {type.isActive ? 'On' : 'Off'}
                                            </button>
                                            <button
                                                className="btn-edit-small"
                                                onClick={() => setEditingType(type._id)}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                className="btn-delete-small"
                                                onClick={() => handleDeleteType(type._id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Binding Prices Section */}
            <div className="binding-section">
                <div className="section-header">
                    <div className="section-title">
                        <Layers size={20} />
                        <h2>Binding Prices</h2>
                    </div>
                    <button className="btn-add-rule" onClick={() => {
                        const activeTypes = getActiveBindingTypes();
                        if (activeTypes.length === 0) {
                            setSaveMessage({ type: 'error', text: 'Please add at least one active binding type first' });
                            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
                            return;
                        }
                        setNewPriceRows([{ ...initialPriceRow, bindingType: activeTypes[0]._id }]);
                        setShowAddPriceModal(true);
                    }}>
                        <Plus size={18} />
                        Add Price Rule
                    </button>
                </div>

                <div className="pricing-rules-container">
                    <div className="pricing-table-wrapper">
                        <table className="pricing-table">
                            <thead>
                                <tr>
                                    <th>Binding Type</th>
                                    <th>From Page</th>
                                    <th>To Page</th>
                                    <th>Student Price (₹)</th>
                                    <th>Institute Price (₹)</th>
                                    <th>Regular Price (₹)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bindingPrices.map(price => (
                                    <tr key={price._id} className={`${editingPrice === price._id ? 'editing' : ''} ${!price.isActive ? 'inactive-row' : ''}`}>
                                        <td>
                                            {editingPrice === price._id ? (
                                                <select
                                                    value={price.bindingType?._id || price.bindingType}
                                                    onChange={(e) => handleUpdatePrice(price._id, 'bindingType', e.target.value)}
                                                    className="edit-select"
                                                >
                                                    {getActiveBindingTypes().map(t => (
                                                        <option key={t._id} value={t._id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="binding-badge">
                                                    {getBindingTypeName(price.bindingType)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price._id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={price.pageRangeStart}
                                                    onChange={(e) => handleUpdatePrice(price._id, 'pageRangeStart', parseInt(e.target.value) || 1)}
                                                    className="edit-input small"
                                                />
                                            ) : (
                                                <span className="page-value">{price.pageRangeStart}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price._id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={price.pageRangeEnd}
                                                    onChange={(e) => handleUpdatePrice(price._id, 'pageRangeEnd', parseInt(e.target.value) || 1)}
                                                    className="edit-input small"
                                                />
                                            ) : (
                                                <span className="page-value">{price.pageRangeEnd}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price._id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={price.studentPrice}
                                                    onChange={(e) => handleUpdatePrice(price._id, 'studentPrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value student">₹{price.studentPrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price._id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={price.institutePrice}
                                                    onChange={(e) => handleUpdatePrice(price._id, 'institutePrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value institute">₹{price.institutePrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price._id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={price.regularPrice}
                                                    onChange={(e) => handleUpdatePrice(price._id, 'regularPrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value regular">₹{price.regularPrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${price.isActive ? 'active' : 'inactive'}`}>
                                                {price.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {editingPrice === price._id ? (
                                                    <>
                                                        <button
                                                            className="btn-save-row"
                                                            onClick={() => handleSavePrice(price._id)}
                                                            title="Save"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-cancel-row"
                                                            onClick={() => {
                                                                loadData();
                                                                setEditingPrice(null);
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
                                                            onClick={() => setEditingPrice(price._id)}
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        {price.isActive ? (
                                                            <button
                                                                className="btn-deactivate-row"
                                                                onClick={() => handleTogglePriceStatus(price._id)}
                                                                title="Deactivate"
                                                            >
                                                                ✕
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-activate-row"
                                                                onClick={() => handleTogglePriceStatus(price._id)}
                                                                title="Activate"
                                                            >
                                                                ✓
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

                    {bindingPrices.length === 0 && (
                        <div className="no-rules">
                            <Layers size={48} />
                            <h3>No Pricing Rules</h3>
                            <p>Add your first binding price rule to get started</p>
                            <button className="btn-add-first" onClick={() => setShowAddPriceModal(true)}>
                                <Plus size={18} />
                                Add First Rule
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="pricing-info">
                <AlertCircle size={18} />
                <p>
                    <strong>How it works:</strong> When calculating binding costs, the system finds the matching price based on
                    binding type and page count. Prices are applied per copy based on the user's profile type
                    (Student, Institute, or Regular). If no matching rule is found, no binding cost is applied.
                </p>
            </div>

            {/* Add Binding Type Modal */}
            {showAddTypeModal && (
                <div className="modal-overlay" onClick={() => setShowAddTypeModal(false)}>
                    <button className="modal-close-outer" onClick={() => setShowAddTypeModal(false)}>
                        <X size={24} />
                    </button>
                    <div className="add-rule-modal small-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Plus size={20} /> Add Binding Type</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group floating-label">
                                <input
                                    type="text"
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    placeholder=" "
                                    autoFocus
                                />
                                <label>Binding Type Name</label>
                            </div>
                        </div>
                        <div className="modal-divider"></div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowAddTypeModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-add-gradient"
                                onClick={handleAddType}
                                disabled={!newTypeName.trim()}
                            >
                                <Plus size={18} />
                                Add Type
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Price Rule Modal */}
            {showAddPriceModal && (
                <div className="modal-overlay" onClick={() => setShowAddPriceModal(false)}>
                    <button className="modal-close-outer" onClick={() => setShowAddPriceModal(false)}>
                        <X size={24} />
                    </button>
                    <div className="add-rule-modal multi-rule" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Plus size={20} /> Add Binding Price Rules</h3>
                        </div>
                        <div className="modal-body">
                            {newPriceRows.map((row, index) => (
                                <div key={index} className="pricing-rule-block">
                                    {index > 0 && <div className="rule-divider"><span>RANGE WISE PRICE {index + 1}</span></div>}
                                    <div className="form-grid">
                                        <div className="form-group floating-label full-width">
                                            <select
                                                value={row.bindingType}
                                                onChange={(e) => updateNewPriceRow(index, 'bindingType', e.target.value)}
                                            >
                                                <option value="">Select Binding Type</option>
                                                {getActiveBindingTypes().map(t => (
                                                    <option key={t._id} value={t._id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <label>Binding Type</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.pageRangeStart}
                                                onChange={(e) => updateNewPriceRow(index, 'pageRangeStart', parseInt(e.target.value) || 0)}
                                            />
                                            <label>From Page</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.pageRangeEnd}
                                                onChange={(e) => updateNewPriceRow(index, 'pageRangeEnd', parseInt(e.target.value) || 0)}
                                            />
                                            <label>To Page</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                value={row.studentPrice}
                                                onChange={(e) => updateNewPriceRow(index, 'studentPrice', parseFloat(e.target.value) || 0)}
                                            />
                                            <label>Student Price</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                value={row.institutePrice}
                                                onChange={(e) => updateNewPriceRow(index, 'institutePrice', parseFloat(e.target.value) || 0)}
                                            />
                                            <label>Institute Price</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.5"
                                                value={row.regularPrice}
                                                onChange={(e) => updateNewPriceRow(index, 'regularPrice', parseFloat(e.target.value) || 0)}
                                            />
                                            <label>Regular Price</label>
                                        </div>
                                        <div className="add-more-container">
                                            <span className="add-more-label">Add More</span>
                                            <div className="add-more-actions">
                                                <button className="btn-circle-add" onClick={addNewPriceRow} title="Add another range">
                                                    <Plus size={16} />
                                                </button>
                                                <button
                                                    className={`btn-circle-remove ${newPriceRows.length === 1 ? 'disabled' : ''}`}
                                                    onClick={() => removePriceRow(index)}
                                                    title="Remove this range"
                                                    disabled={newPriceRows.length === 1}
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
                            <button className="btn-cancel" onClick={() => setShowAddPriceModal(false)}>
                                Cancel
                            </button>
                            <button className="btn-add-gradient" onClick={handleAddPrices}>
                                <Plus size={18} />
                                Add {newPriceRows.length > 1 ? `${newPriceRows.length} Rules` : 'Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BindingManagement;
