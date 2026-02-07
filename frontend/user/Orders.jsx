import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Download, ExternalLink, Package, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import './Profile.css'; // Reusing profile styles as they fit anyway

const Orders = ({ onNavigate }) => {
    const { user, isAuthenticated } = useAuth();
    const [orderSearch, setOrderSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock order history
    const [orders] = useState([
        {
            id: 'ORD-DEMO-001',
            date: '2024-02-06',
            status: 'delivered',
            items: 'Demo User Order - Quality Check Document',
            total: '₹450',
            type: 'Advanced Print',
        },
        {
            id: 'ORD-2024-001',
            date: '2024-02-01',
            status: 'delivered',
            items: 'Document Print (25 pages)',
            total: '₹125',
            type: 'Normal Print',
        },
        {
            id: 'ORD-2024-002',
            date: '2024-01-28',
            status: 'processing',
            items: 'Business Cards (100 pcs)',
            total: '₹500',
            type: 'Advanced Print',
        },
        {
            id: 'ORD-2024-003',
            date: '2024-01-15',
            status: 'cancelled',
            items: 'Poster Print (A2)',
            total: '₹200',
            type: 'Normal Print',
        },
    ]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                order.items.toLowerCase().includes(orderSearch.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, orderSearch, statusFilter]);

    if (!isAuthenticated) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="auth-required">
                        <div className="auth-required-icon">🔒</div>
                        <h2>Please Login</h2>
                        <p>You need to be logged in to view your order history</p>
                        <button className="btn btn-primary" onClick={() => onNavigate('home')}>
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            delivered: { class: 'badge-success', label: 'Delivered' },
            processing: { class: 'badge-warning', label: 'Processing' },
            pending: { class: 'badge-warning', label: 'Pending' },
            cancelled: { class: 'badge-error', label: 'Cancelled' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="content-header" style={{ marginBottom: '2rem' }}>
                    <div className="header-title-group">
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Orders</h1>
                        <p style={{ color: 'var(--color-gray-500)' }}>View and manage your printing orders</p>
                    </div>
                </div>

                <div className="tab-content order-history" style={{ display: 'block' }}>
                    <div className="content-header-advanced" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-gray-100)', marginBottom: '2rem' }}>
                        <div className="advanced-filters">
                            <div className="search-box-mini">
                                <Search size={16} className="search-icon-mini" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or item..."
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <div className="select-wrapper">
                                    <Filter size={14} className="select-icon" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="processing">Processing</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <p>No orders found matching your criteria</p>
                            {statusFilter !== 'all' || orderSearch !== '' ? (
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setOrderSearch('');
                                    }}
                                >
                                    Clear Filters
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => onNavigate('normalPrint')}
                                >
                                    Start Printing
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="order-card-advanced">
                                    <div className="order-card-top">
                                        <div className="order-id-meta">
                                            <span className="order-tag">{order.type}</span>
                                            <h4 className="order-id-text">{order.id}</h4>
                                            <span className="order-date-text">
                                                <Calendar size={12} /> {order.date}
                                            </span>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <div className="order-card-mid">
                                        <div className="order-main-info">
                                            <p className="order-items-text">{order.items}</p>
                                            <span className="order-price-text">{order.total}</span>
                                        </div>
                                    </div>
                                    <div className="order-card-bot">
                                        <div className="order-actions-group">
                                            <button className="btn-action-mini">
                                                <ExternalLink size={14} /> Details
                                            </button>
                                            {order.status === 'delivered' && (
                                                <button className="btn-action-mini primary">
                                                    <Download size={14} /> Invoice
                                                </button>
                                            )}
                                        </div>
                                        {order.status === 'delivered' && (
                                            <button className="btn-reorder-link">
                                                Reorder Item
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
