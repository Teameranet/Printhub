import React, { useState, useMemo } from 'react';
import {
    ShoppingBag, Search, Activity, Package, Calendar, TrendingUp, X,
    RefreshCw, User, FileText, Printer, Download, ExternalLink, Clock,
    CheckCircle, XCircle, AlertCircle, Phone, Eye
} from 'lucide-react';
import './OrderManagement.css';

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
    if (!order) return null;

    const statusOptions = ['pending', 'processing', 'ready', 'delivered', 'cancelled'];

    const getBindingName = (id) => {
        const bindings = { none: 'No Binding', spiral: 'Spiral Binding', staple: 'Staple', hardcover: 'Hardcover' };
        return bindings[id] || id || 'None';
    };

    const handlePrint = (file) => {
        if (order.fileUrl) {
            window.open(order.fileUrl, '_blank');
        } else {
            alert(`Printing: ${file.name}`);
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal order-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-info">
                        <h2>Order Details</h2>
                        <span className="order-id-badge">{order.id}</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Customer Info */}
                    <div className="detail-section">
                        <h3><User size={16} /> Customer Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Name</span>
                                <span className="info-value">{order.userName || 'Unknown'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{order.userPhone || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Order Date</span>
                                <span className="info-value">{order.date || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Order Type</span>
                                <span className={`type-badge ${order.type ? 'pt-' + order.type.replace(' ', '-').toLowerCase() : 'unknown'}`}>{order.type || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="detail-section">
                        <h3><Activity size={16} /> Order Status</h3>
                        <div className="status-update-row">
                            <select
                                value={order.status || 'pending'}
                                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                                className={`status-select ${order.status || 'pending'}`}
                            >
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                            <button className="btn-update-status" onClick={() => onUpdateStatus(order.id, order.status)}>
                                <RefreshCw size={16} /> Update Status
                            </button>
                        </div>
                    </div>

                    {/* Files & Print Specifications */}
                    <div className="detail-section">
                        <h3><FileText size={16} /> Files & Specifications</h3>
                        <div className="files-list">
                            {Array.isArray(order.files) && order.files.map((file, idx) => (
                                <div key={idx} className="file-detail-card">
                                    <div className="file-header">
                                        <div className="file-name-info">
                                            <FileText size={20} className="file-icon" />
                                            <div>
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-pages">{file.pages} pages</span>
                                            </div>
                                        </div>
                                        <div className="file-actions">
                                            <button className="btn-icon-action" onClick={() => handlePrint(file)} title="Print/View">
                                                <Printer size={16} />
                                            </button>
                                            <button className="btn-icon-action" title="Download">
                                                <Download size={16} />
                                            </button>
                                            <button className="btn-icon-action" title="Open">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="file-specs">
                                        <div className="spec-item">
                                            <span className="spec-label">Page Range</span>
                                            <span className="spec-value">{file.settings?.pageRange || 'All'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Color</span>
                                            <span className={`spec-value color-badge ${file.settings?.printColorId || 'bw'}`}>
                                                {file.settings?.printColorId === 'color' ? 'Full Color' : 'Black & White'}
                                            </span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Sides</span>
                                            <span className="spec-value">{file.settings?.printSideId === 'double' ? 'Double-Sided' : 'Single-Sided'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Binding</span>
                                            <span className="spec-value">{getBindingName(file.settings?.bindingTypeId)}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Copies</span>
                                            <span className="spec-value">{file.settings?.copies || 1}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Pages/Set</span>
                                            <span className="spec-value">{file.settings?.pagesPerSet || 1}</span>
                                        </div>
                                    </div>
                                    <div className="file-price">
                                        <span>Subtotal:</span>
                                        <span className="price-amount">₹{file.price || 0}</span>
                                    </div>
                                </div>
                            ))}
                            {(!order.files || order.files.length === 0) && (
                                <p>No files attached to this order.</p>
                            )}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="order-total-section">
                        <div className="total-row">
                            <span>Order Total</span>
                            <span className="total-amount">₹{order.total || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        <Printer size={16} /> Print Order
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderManagement = ({ orders, isLoading, handleUpdateOrderStatus }) => {
    // Filter states
    const [orderSearch, setOrderSearch] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    const [orderDateFilter, setOrderDateFilter] = useState('all');
    const [orderSortBy, setOrderSortBy] = useState('date');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Stats
    const stats = useMemo(() => ({
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
    }), [orders]);

    // Filtered and sorted orders
    const filteredOrders = useMemo(() => {
        let result = [...orders];

        // Search filter
        if (orderSearch) {
            const search = orderSearch.toLowerCase();
            result = result.filter(o =>
                o.id?.toLowerCase().includes(search) ||
                o.userName?.toLowerCase().includes(search) ||
                o.userPhone?.includes(search) ||
                o.files?.some(f => f.name.toLowerCase().includes(search))
            );
        }

        // Status filter
        if (orderStatusFilter !== 'all') {
            result = result.filter(o => o.status === orderStatusFilter);
        }

        // Type filter
        if (orderTypeFilter !== 'all') {
            result = result.filter(o => o.type === orderTypeFilter);
        }

        // Date filter
        if (orderDateFilter !== 'all') {
            const now = new Date();
            result = result.filter(o => {
                const orderDate = new Date(o.date);
                switch (orderDateFilter) {
                    case 'today':
                        return orderDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return orderDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        return orderDate >= monthAgo;
                    default: return true;
                }
            });
        }



        return result;
    }, [orders, orderSearch, orderStatusFilter, orderTypeFilter, orderDateFilter, orderSortBy]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'processing': return <RefreshCw size={14} />;
            case 'ready': return <Package size={14} />;
            case 'delivered': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <div className="management-content">
            <div className="management-header">
                <div className="header-title">
                    <h1>Order Management</h1>
                    <p>View, manage, and update order statuses</p>
                </div>
                <div className="header-stats">
                    <span className="header-stat pending"><Clock size={16} /> {stats.pendingOrders} pending</span>
                    <span className="header-stat processing"><RefreshCw size={16} /> {stats.processingOrders} processing</span>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="filter-bar-admin">
                <div className="search-box-admin">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer, or file name..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                    />
                    {orderSearch && (
                        <button className="clear-search" onClick={() => setOrderSearch('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <div className="filter-item">
                        <Activity size={14} />
                        <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <Package size={14} />
                        <select value={orderTypeFilter} onChange={(e) => setOrderTypeFilter(e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="Normal Print">Normal Print</option>
                            <option value="Advanced Print">Advanced Print</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <Calendar size={14} />
                        <select value={orderDateFilter} onChange={(e) => setOrderDateFilter(e.target.value)}>
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <TrendingUp size={14} />
                        <select value={orderSortBy} onChange={(e) => setOrderSortBy(e.target.value)}>
                            <option value="date">Sort by Date</option>
                            <option value="total">Sort by Total</option>
                            <option value="status">Sort by Status</option>
                        </select>
                    </div>

                    {(orderSearch || orderStatusFilter !== 'all' || orderTypeFilter !== 'all' || orderDateFilter !== 'all') && (
                        <button
                            className="btn-clear-filters"
                            onClick={() => {
                                setOrderSearch('');
                                setOrderStatusFilter('all');
                                setOrderTypeFilter('all');
                                setOrderDateFilter('all');
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <ShoppingBag size={48} />
                    <h3>No orders found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="orders-grid">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="order-card-admin" onClick={() => setSelectedOrder(order)}>
                            <div className="order-card-header">
                                <div className="order-id-info">
                                    <span className="order-id">{order.id}</span>
                                    <span className={`order-type-badge ${order.type ? 'pt-' + order.type.replace(' ', '-').toLowerCase() : 'unknown'}`}>
                                        {order.type || 'Unknown Type'}
                                    </span>
                                </div>
                                <span className={`status-badge ${order.status || 'pending'}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Pending'}
                                </span>
                            </div>

                            <div className="order-card-body">
                                <div className="customer-info">
                                    <User size={14} />
                                    <span className="customer-name">{order.userName || order.userId || 'Guest User'}</span>
                                    <span className="phone"><Phone size={12} /> {order.userPhone || 'N/A'}</span>
                                </div>

                                <div className="files-preview">
                                    {Array.isArray(order.files) && order.files.slice(0, 2).map((file, idx) => (
                                        <div key={idx} className="file-preview-item">
                                            <FileText size={14} className="file-icon-preview" />
                                            <span className="file-name-preview">{file.name}</span>
                                            <span className="file-pages-preview">{file.pages}p</span>
                                        </div>
                                    ))}
                                    {Array.isArray(order.files) && order.files.length > 2 && (
                                        <span className="more-files">+{order.files.length - 2} more</span>
                                    )}
                                    {(!order.files || order.files.length === 0) && (
                                        <span className="file-pages no-files">No files attached</span>
                                    )}
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <div className="order-date">
                                    <Calendar size={14} />
                                    {order.date}
                                </div>
                                <div className="order-total">₹{order.total || 0}</div>
                            </div>

                            <div className="order-card-actions">
                                <button className="btn-action-sm" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                                    <Eye size={14} /> View Details
                                </button>
                                <select
                                    className={`status-select-sm ${order.status || 'pending'}`}
                                    value={order.status || 'pending'}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="ready">Ready</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateOrderStatus}
                />
            )}
        </div>
    );
};

export default OrderManagement;
