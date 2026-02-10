import React, { useState, useEffect } from 'react';
import {
    Plus, Minus, Save, AlertCircle, CheckCircle,
    Edit2, Trash2, X, Link2, Layers
} from 'lucide-react';
import './BindingManagement.css';

// Default binding types and pricing rules
const DEFAULT_BINDING_TYPES = [
    { id: 'none', name: 'No Binding', isActive: true },
    { id: 'spiral', name: 'Spiral Binding', isActive: true },
    { id: 'staple', name: 'Staple', isActive: true }
];

const DEFAULT_BINDING_PRICES = [
    {
        id: 'default-spiral-1',
        bindingTypeId: 'spiral',
        fromPage: 1,
        toPage: 100,
        studentPrice: 15.00,
        institutePrice: 15.00,
        regularPrice: 20.00
    },
    {
        id: 'default-spiral-2',
        bindingTypeId: 'spiral',
        fromPage: 101,
        toPage: 500,
        studentPrice: 25.00,
        institutePrice: 25.00,
        regularPrice: 35.00
    },
    {
        id: 'default-staple-1',
        bindingTypeId: 'staple',
        fromPage: 1,
        toPage: 50,
        studentPrice: 3.00,
        institutePrice: 3.00,
        regularPrice: 5.00
    }
];

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
        bindingTypeId: '',
        fromPage: 1,
        toPage: 100,
        studentPrice: 10.00,
        institutePrice: 10.00,
        regularPrice: 15.00
    };
    const [newPriceRows, setNewPriceRows] = useState([initialPriceRow]);

    // Load data from localStorage
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);
        try {
            // Load binding types
            const savedTypes = localStorage.getItem('binding_types');
            if (savedTypes) {
                const parsed = JSON.parse(savedTypes);
                setBindingTypes(Array.isArray(parsed) ? parsed : DEFAULT_BINDING_TYPES);
            } else {
                setBindingTypes(DEFAULT_BINDING_TYPES);
                localStorage.setItem('binding_types', JSON.stringify(DEFAULT_BINDING_TYPES));
            }

            // Load binding prices
            const savedPrices = localStorage.getItem('binding_prices');
            if (savedPrices) {
                const parsed = JSON.parse(savedPrices);
                setBindingPrices(Array.isArray(parsed) ? parsed : DEFAULT_BINDING_PRICES);
            } else {
                setBindingPrices(DEFAULT_BINDING_PRICES);
                localStorage.setItem('binding_prices', JSON.stringify(DEFAULT_BINDING_PRICES));
            }
        } catch (e) {
            console.error('Error loading binding data:', e);
            setBindingTypes(DEFAULT_BINDING_TYPES);
            setBindingPrices(DEFAULT_BINDING_PRICES);
        }
        setIsLoading(false);
    };

    const saveBindingTypes = (types) => {
        try {
            localStorage.setItem('binding_types', JSON.stringify(types));
            setSaveMessage({ type: 'success', text: 'Binding types saved successfully!' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error('Error saving binding types:', e);
            setSaveMessage({ type: 'error', text: 'Failed to save binding types' });
        }
    };

    const saveBindingPrices = (prices) => {
        try {
            localStorage.setItem('binding_prices', JSON.stringify(prices));
            setSaveMessage({ type: 'success', text: 'Binding prices saved successfully!' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            window.dispatchEvent(new Event('storage'));
        } catch (e) {
            console.error('Error saving binding prices:', e);
            setSaveMessage({ type: 'error', text: 'Failed to save binding prices' });
        }
    };

    // Binding Type CRUD
    const handleAddType = () => {
        if (!newTypeName.trim()) return;

        const newType = {
            id: `binding-${Date.now()}`,
            name: newTypeName.trim(),
            isActive: true
        };

        const updated = [...bindingTypes, newType];
        setBindingTypes(updated);
        saveBindingTypes(updated);
        setNewTypeName('');
        setShowAddTypeModal(false);
    };

    const handleUpdateType = (typeId, field, value) => {
        const updated = bindingTypes.map(t =>
            t.id === typeId ? { ...t, [field]: value } : t
        );
        setBindingTypes(updated);
    };

    const handleSaveType = (typeId) => {
        saveBindingTypes(bindingTypes);
        setEditingType(null);
    };

    const handleDeleteType = (typeId) => {
        if (typeId === 'none') {
            setSaveMessage({ type: 'error', text: 'Cannot delete "No Binding" option' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            return;
        }

        // Check if any prices use this type
        const pricesUsingType = bindingPrices.filter(p => p.bindingTypeId === typeId);
        if (pricesUsingType.length > 0) {
            setSaveMessage({ type: 'error', text: 'Cannot delete: There are price rules using this binding type' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            return;
        }

        const updated = bindingTypes.filter(t => t.id !== typeId);
        setBindingTypes(updated);
        saveBindingTypes(updated);
    };

    const toggleTypeStatus = (typeId) => {
        if (typeId === 'none') return;

        const updated = bindingTypes.map(t =>
            t.id === typeId ? { ...t, isActive: !t.isActive } : t
        );
        setBindingTypes(updated);
        saveBindingTypes(updated);
    };

    // Binding Price CRUD
    const handleAddPrices = () => {
        const timestamp = Date.now();
        const pricesToAdd = newPriceRows
            .filter(row => row.bindingTypeId) // Only add rows with selected binding type
            .map((row, index) => ({
                ...row,
                id: `price-${timestamp}-${index}`
            }));

        if (pricesToAdd.length === 0) {
            setSaveMessage({ type: 'error', text: 'Please select a binding type for at least one price rule' });
            setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
            return;
        }

        const updated = [...bindingPrices, ...pricesToAdd];
        setBindingPrices(updated);
        saveBindingPrices(updated);
        setShowAddPriceModal(false);
        setNewPriceRows([initialPriceRow]);
    };

    const addNewPriceRow = () => {
        const lastRow = newPriceRows[newPriceRows.length - 1];
        setNewPriceRows([...newPriceRows, {
            ...initialPriceRow,
            bindingTypeId: lastRow.bindingTypeId,
            fromPage: (parseInt(lastRow.toPage) || 0) + 1,
            toPage: (parseInt(lastRow.toPage) || 0) + 100
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
            p.id === priceId ? { ...p, [field]: value } : p
        );
        setBindingPrices(updated);
    };

    const handleSavePrice = (priceId) => {
        saveBindingPrices(bindingPrices);
        setEditingPrice(null);
    };

    const handleDeletePrice = (priceId) => {
        const updated = bindingPrices.filter(p => p.id !== priceId);
        setBindingPrices(updated);
        saveBindingPrices(updated);
    };

    // Helper functions
    const getBindingTypeName = (id) => {
        const type = bindingTypes.find(t => t.id === id);
        return type?.name || id;
    };

    const getActiveBindingTypes = () => {
        return bindingTypes.filter(t => t.isActive && t.id !== 'none');
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
                        <div key={type.id} className={`binding-type-card ${!type.isActive ? 'inactive' : ''}`}>
                            {editingType === type.id ? (
                                <div className="type-edit-form">
                                    <input
                                        type="text"
                                        value={type.name}
                                        onChange={(e) => handleUpdateType(type.id, 'name', e.target.value)}
                                        className="type-name-input"
                                        autoFocus
                                    />
                                    <div className="type-edit-actions">
                                        <button className="btn-save-small" onClick={() => handleSaveType(type.id)}>
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
                                        {type.id !== 'none' && (
                                            <>
                                                <button
                                                    className={`btn-toggle ${type.isActive ? 'active' : ''}`}
                                                    onClick={() => toggleTypeStatus(type.id)}
                                                    title={type.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {type.isActive ? 'On' : 'Off'}
                                                </button>
                                                <button
                                                    className="btn-edit-small"
                                                    onClick={() => setEditingType(type.id)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    className="btn-delete-small"
                                                    onClick={() => handleDeleteType(type.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
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
                        setNewPriceRows([{ ...initialPriceRow, bindingTypeId: activeTypes[0].id }]);
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bindingPrices.map(price => (
                                    <tr key={price.id} className={editingPrice === price.id ? 'editing' : ''}>
                                        <td>
                                            {editingPrice === price.id ? (
                                                <select
                                                    value={price.bindingTypeId}
                                                    onChange={(e) => handleUpdatePrice(price.id, 'bindingTypeId', e.target.value)}
                                                    className="edit-select"
                                                >
                                                    {getActiveBindingTypes().map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="binding-badge">
                                                    {getBindingTypeName(price.bindingTypeId)}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price.id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={price.fromPage}
                                                    onChange={(e) => handleUpdatePrice(price.id, 'fromPage', parseInt(e.target.value) || 1)}
                                                    className="edit-input small"
                                                />
                                            ) : (
                                                <span className="page-value">{price.fromPage}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price.id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={price.toPage}
                                                    onChange={(e) => handleUpdatePrice(price.id, 'toPage', parseInt(e.target.value) || 1)}
                                                    className="edit-input small"
                                                />
                                            ) : (
                                                <span className="page-value">{price.toPage}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price.id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={price.studentPrice}
                                                    onChange={(e) => handleUpdatePrice(price.id, 'studentPrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value student">₹{price.studentPrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price.id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={price.institutePrice}
                                                    onChange={(e) => handleUpdatePrice(price.id, 'institutePrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value institute">₹{price.institutePrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingPrice === price.id ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={price.regularPrice}
                                                    onChange={(e) => handleUpdatePrice(price.id, 'regularPrice', parseFloat(e.target.value) || 0)}
                                                    className="edit-input price"
                                                />
                                            ) : (
                                                <span className="price-value regular">₹{price.regularPrice.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {editingPrice === price.id ? (
                                                    <>
                                                        <button
                                                            className="btn-save-row"
                                                            onClick={() => handleSavePrice(price.id)}
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
                                                            onClick={() => setEditingPrice(price.id)}
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-delete-row"
                                                            onClick={() => handleDeletePrice(price.id)}
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
                                                value={row.bindingTypeId}
                                                onChange={(e) => updateNewPriceRow(index, 'bindingTypeId', e.target.value)}
                                            >
                                                <option value="">Select Binding Type</option>
                                                {getActiveBindingTypes().map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                            <label>Binding Type</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.fromPage}
                                                onChange={(e) => updateNewPriceRow(index, 'fromPage', parseInt(e.target.value) || 0)}
                                            />
                                            <label>From Page</label>
                                        </div>
                                        <div className="form-group floating-label">
                                            <input
                                                type="number"
                                                min="1"
                                                value={row.toPage}
                                                onChange={(e) => updateNewPriceRow(index, 'toPage', parseInt(e.target.value) || 0)}
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
