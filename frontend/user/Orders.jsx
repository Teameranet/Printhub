import { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, Calendar, Download, ExternalLink,
    Package, ShieldCheck, X, FileText, ChevronRight,
    Printer, Clock, AlertCircle, RefreshCw, Layers, Sparkles
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import './Orders.css';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal" onClick={e => e.stopPropagation()}>
                <div className="order-modal-header">
                    <div className="header-title-info">
                        <h2>Order Details</h2>
                        <span className="modal-order-id">{order.id}</span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="order-modal-content">
                    {/* Status Banner */}
                    <div className={`status-banner-saas ${order.status}`}>
                        {order.status === 'delivered' ? <ShieldCheck size={20} /> : <Clock size={20} />}
                        <span>Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>

                    <div className="order-details-grid">
                        <div className="detail-section">
                            <h3><FileText size={16} /> Printing Items</h3>
                            <div className="detail-items-list">
                                {order.details?.map((item, idx) => (
                                    <div key={idx} className="detail-item-card">
                                        <div className="detail-item-header">
                                            <span className="detail-item-name">{item.name}</span>
                                            <span className="detail-item-price">₹{item.price}</span>
                                        </div>
                                        <div className="detail-specs">
                                            <span>Pages: {item.pages}</span>
                                            {item.settings && (
                                                <>
                                                    <span>• {item.settings.printColorId === 'color' ? 'Color' : 'B&W'}</span>
                                                    <span>• {item.settings.printSideId === 'double' ? 'Double-sided' : 'Single-sided'}</span>
                                                    <span>• Binding: {item.settings.bindingTypeId || 'None'}</span>
                                                    <span>• Copies: {item.settings.copies || 1}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )) || <p className="text-muted">Summary: {order.items}</p>}
                            </div>
                        </div>

                        <div className="detail-section side-info">
                            <h3>Summary Info</h3>
                            <div className="info-box-saas">
                                <div className="info-row">
                                    <span>Date</span>
                                    <span>{order.date}</span>
                                </div>
                                <div className="info-row">
                                    <span>Print Type</span>
                                    <span>{order.type}</span>
                                </div>
                                <div className="info-row total-row">
                                    <span>Total Amount</span>
                                    <span>{order.total}</span>
                                </div>
                            </div>

                            <div className="info-actions mt-4">
                                <button className="btn btn-primary btn-full btn-sm">
                                    <Download size={16} /> Download Invoice
                                </button>
                                <button className="btn btn-ghost btn-full btn-sm mt-2">
                                    <RefreshCw size={16} /> Reorder This
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Orders = ({ onNavigate }) => {
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all'); // all, today, week, month

    useEffect(() => {
        const fetchOrders = () => {
            setIsLoading(true);
            try {
                // Real-time local data
                const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');

                // Mock history
                const mockOrders = [
                    {
                        id: 'ORD-772101',
                        date: '2024-02-05',
                        status: 'delivered',
                        items: 'Study Material (Set of 4)',
                        total: '₹340',
                        type: 'Normal Print',
                    },

                    {
                        id: 'ORD-661029',
                        date: '2024-01-22',
                        status: 'cancelled',
                        items: 'Photo Album (Matte)',
                        total: '₹890',
                        type: 'Advanced Print',
                    }
                ];

                // Combine and filter by user phone for privacy/correctness in local mode
                const userPhone = user?.phone || user?.user_metadata?.phone || '';
                const userLocalOrders = localOrders.filter(o => o.userPhone === userPhone);

                const combined = [...userLocalOrders, ...mockOrders];
                setOrders(combined);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesType = typeFilter === 'all' || order.type === typeFilter;

            let matchesDate = true;
            if (dateRange !== 'all') {
                const orderDate = new Date(order.date);
                const now = new Date();
                if (dateRange === 'today') {
                    matchesDate = orderDate.toDateString() === now.toDateString();
                } else if (dateRange === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = orderDate >= weekAgo;
                } else if (dateRange === 'month') {
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    matchesDate = orderDate >= monthAgo;
                }
            }

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        });
    }, [orders, searchQuery, statusFilter, typeFilter, dateRange]);

    if (!isAuthenticated) {
        return (
            <div className="profile-page flex-center">
                <div className="auth-required-card animate-scaleIn">
                    <div className="lock-icon-circle">
                        <AlertCircle size={40} />
                    </div>
                    <h2>Access Denied</h2>
                    <p>Secure authentication is required to view your order history.</p>
                    <button className="btn btn-primary" onClick={() => onNavigate('home')}>
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <ShieldCheck size={16} />;
            case 'processing': return <Clock size={16} />;
            case 'cancelled': return <AlertCircle size={16} />;
            default: return <Package size={16} />;
        }
    };

    return (
        <div className="orders-page-saas">
            <div className="container">
                {/* Header Section */}
                <div className="orders-header-saas">
                    <div className="title-area">
                        <h1>Order History</h1>
                        <p>Track your printing projects and download invoices</p>
                    </div>
                </div>

                {/* Advanced Filtering Area */}
                <div className="filter-bar-saas card">
                    <div className="search-group-saas">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by ID, document name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters-row-saas">
                        <div className="filter-item-saas">
                            <Filter size={14} />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="filter-item-saas">
                            <Layers size={14} />
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="all">Every Type</option>
                                <option value="Normal Print">Normal Print</option>
                                <option value="Advanced Print">Advanced Print</option>
                            </select>
                        </div>

                        <div className="filter-item-saas">
                            <Calendar size={14} />
                            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                                <option value="all">Any Time</option>
                                <option value="today">Today</option>
                                <option value="week">Past Week</option>
                                <option value="month">Past Month</option>
                            </select>
                        </div>

                        {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dateRange !== 'all') && (
                            <button className="btn-clear-saas" onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                                setTypeFilter('all');
                                setDateRange('all');
                            }}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Orders Content */}
                {isLoading ? (
                    <div className="orders-loading">
                        <div className="loader-saas"></div>
                        <p>Syncing your order history...</p>
                    </div>
                ) : (
                    <div className="orders-container-saas">
                        {filteredOrders.length === 0 ? (
                            <div className="empty-orders card animate-fadeIn">
                                <div className="empty-icon-wrapper">
                                    <Package size={48} />
                                </div>
                                <h3>No orders found</h3>
                                <p>Try adjusting your search filters or start a new print job.</p>
                                <button className="btn btn-primary" onClick={() => onNavigate('normalPrint')}>
                                    New Print Job
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list-saas">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="order-card-saas animate-slideUp">
                                        <div className="card-top-saas">
                                            <div className="order-id-meta">
                                                <span className={`type-tag-saas ${(order.type || 'Normal Print').replace(' ', '-').toLowerCase()}`}>
                                                    {order.type === 'Advanced Print' ? <Sparkles size={12} /> : <Printer size={12} />}
                                                    {order.type || 'Normal Print'}
                                                </span>
                                                <h4>{order.id}</h4>
                                            </div>
                                            <div className={`status-badge-saas ${order.status || 'pending'}`}>
                                                {getStatusIcon(order.status || 'pending')}
                                                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                                            </div>
                                        </div>

                                        <div className="card-middle-saas">
                                            <div className="item-info">
                                                <p className="item-names">{order.items || 'Print Job'}</p>
                                                <div className="date-meta">
                                                    <Calendar size={12} /> {order.date}
                                                </div>
                                            </div>
                                            <div className="price-info">
                                                <span className="price-tag">{order.total}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions-saas">
                                            <button
                                                className="btn-details-saas"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <ExternalLink size={16} />
                                                View Details
                                            </button>
                                            <button className="btn-invoice-saas">
                                                <Download size={16} />
                                                Invoice
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selection Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
};

export default Orders;
