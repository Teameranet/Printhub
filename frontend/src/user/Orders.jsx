import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Download, ExternalLink, Package, ShieldCheck, Loader2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../lib/api';
import './Orders.css';

const Orders = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [orderSearch, setOrderSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        setLoading(true);
        let cancelled = false;
        (async () => {
            try {
                setError(null);
                const res = await userAPI.getMyOrders({ limit: 50 });
                if (!cancelled && res.data) setOrders(res.data);
            } catch (e) {
                if (!cancelled) setError(e.message || 'Failed to load orders');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [isAuthenticated, retry]);

    const normalizedOrders = useMemo(() => {
        return orders.map(o => ({
            id: o._id,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
            status: o.status || 'pending',
            paymentStatus: o.paymentStatus || 'unpaid',
            items: (o.items && o.items[0] && o.items[0].description)
                ? o.items[0].description
                : `Order – ${o.pageCount || 0} pages`,
            total: `₹${Number(o.totalPrice || 0).toFixed(2)}`,
            type: o.bindingType && o.bindingType.name
                ? `Normal Print • ${o.bindingType.name}`
                : 'Normal Print',
        }));
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return normalizedOrders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                order.items.toLowerCase().includes(orderSearch.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [normalizedOrders, orderSearch, statusFilter]);

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

    if (loading) {
        return (
            <div className="profile-page">
                <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="auth-required">
                        <p style={{ color: 'var(--color-error)' }}>{error}</p>
                        <button className="btn btn-primary" onClick={() => setRetry(r => r + 1)}>Retry</button>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            delivered: { class: 'badge-success', label: 'Delivered' },
            completed: { class: 'badge-success', label: 'Completed' },
            processing: { class: 'badge-warning', label: 'Processing' },
            pending: { class: 'badge-warning', label: 'Pending' },
            cancelled: { class: 'badge-error', label: 'Cancelled' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`badge ${config.class}`}>{config.label}</span>;
    };

    const getPaymentBadge = (paymentStatus) => {
        const map = {
            paid: { class: 'badge-success', label: 'Paid' },
            unpaid: { class: 'badge-warning', label: 'Unpaid' },
            refunded: { class: 'badge-primary', label: 'Refunded' },
        };
        const config = map[paymentStatus] || map.unpaid;
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
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="delivered">Delivered</option>
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
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                                            {getStatusBadge(order.status)}
                                            {getPaymentBadge(order.paymentStatus)}
                                        </div>
                                    </div>
                                    <div className="order-card-mid">
                                        <div className="order-main-info">
                                            <p className="order-items-text">{order.items}</p>
                                            <span className="order-price-text">{order.total}</span>
                                        </div>
                                    </div>
                                    <div className="order-card-bot">
                                        <div className="order-actions-group">
                                            <button className="btn-action-mini" onClick={() => navigate(`/invoice/${order.id}`)}>
                                                <FileText size={14} /> Invoice
                                            </button>
                                        </div>
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
