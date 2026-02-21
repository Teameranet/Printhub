import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Settings, LogOut,
    ChevronDown, ChevronRight, CheckCircle, XCircle,
    AlertCircle, RefreshCw, TrendingUp,
    ChevronLeft, Clock, Package, Users, ShoppingBag, Activity, DollarSign, Link2
} from 'lucide-react';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import SettingsPage from './Settings';
import PricingManagement from './PricingManagement';
import BindingManagement from './BindingManagement';
import './admin.css';
import { adminAPI, userAPI } from '../lib/api';

// Real data will be fetched from API via adminAPI and userAPI



// Main Admin Component
const Admin = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Sync active tab with URL path
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/users')) setActiveTab('users');
        else if (path.includes('/orders')) setActiveTab('orders');
        else if (path.includes('/pricing')) setActiveTab('pricing');
        else if (path.includes('/binding')) setActiveTab('binding');
        else if (path.includes('/settings')) setActiveTab('settings');
        else setActiveTab('dashboard');
    }, [location.pathname]);

    const handleNavigation = (tab) => {
        if (tab === 'dashboard') navigate('/admin');
        else navigate(`/admin/${tab}`);
    };

    // Data states
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const normalizeOrder = (o) => {
        const userRef = o.user || o.userId;
        const filesList = Array.isArray(o.files) ? o.files.map(f => ({
            name: f.originalName || f.name || f.filename,
            pages: f.pageCount || f.pages || (o.pageCount / o.files.length) || 0,
            settings: f.settings || {
                colorType: o.colorType,
                sideType: o.sideType,
                bindingType: o.bindingType?.name || o.bindingType
            },
            path: f.path ? (f.path.includes('http') ? f.path.substring(f.path.indexOf('http')) : `${import.meta.env.VITE_API_URL || ''}${f.path.startsWith('/') ? '' : '/'}${f.path}`) : null
        })) : [];

        return {
            id: o._id || o.id || o.orderId,
            userId: userRef?._id || (userRef && userRef.id) || null,
            userName: userRef?.name || o.guestName || o.userDetails?.fullName || o.userName || 'Guest',
            userPhone: userRef?.phone || o.guestPhone || o.userDetails?.mobile || o.userPhone || 'N/A',
            date: o.createdAt || o.date,
            status: o.status || 'pending',
            type: o.type || 'Normal Print',
            total: o.totalPrice ?? o.pricing?.total ?? o.total ?? 0,
            files: filesList,
            fileUrl: filesList[0]?.path || null
        };
    };

    const fetchOrders = useCallback(async () => {
        try {
            const ordersRes = await adminAPI.getOrders({ page: 1, limit: 100 });
            console.log('API Orders Response:', ordersRes);
            const rawList = ordersRes?.data ?? ordersRes?.orders ?? (Array.isArray(ordersRes) ? ordersRes : []);
            const list = Array.isArray(rawList) ? rawList : [];
            console.log('Processed Orders List:', list);
            setOrders(list.map(normalizeOrder));
            return list.length;
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setOrders([]);
            return 0;
        }
    }, []);

    // Fetch users, orders, and dashboard stats on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [usersRes, ordersRes, statsRes] = await Promise.all([
                    userAPI.getAllUsers({ page: 1, limit: 50 }),
                    adminAPI.getOrders({ page: 1, limit: 100 }),
                    adminAPI.getDashboardStats()
                ]);

                const fetchedUsers = usersRes?.data ?? (Array.isArray(usersRes) ? usersRes : []);
                const rawOrders = ordersRes?.data ?? ordersRes?.orders ?? (Array.isArray(ordersRes) ? ordersRes : []);
                const fetchedOrders = Array.isArray(rawOrders) ? rawOrders : [];

                setUsers(fetchedUsers);
                setDashboardStats(statsRes?.data || null);
                setOrders(fetchedOrders.map(normalizeOrder));

            } catch (err) {
                console.error('Failed to fetch admin data:', err);
                setUsers([]);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Refetch orders when user opens the Orders tab (in case initial load failed or data was stale)
    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
    }, [activeTab, fetchOrders]);

    // Update order status (local state only)
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        // Optimistic update
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
    };

    // Dashboard stats: prefer API stats (total counts), fallback to computed from current page
    const stats = useMemo(() => {
        const fromApi = dashboardStats;
        return {
            totalUsers: fromApi?.totalUsers ?? users.length,
            totalOrders: fromApi?.totalOrders ?? orders.length,
            pendingOrders: fromApi?.pendingOrders ?? orders.filter(o => o.status === 'pending').length,
            totalRevenue: fromApi?.totalRevenue ?? orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? (o.total || 0) : 0), 0),
            processingOrders: fromApi?.processingOrders ?? orders.filter(o => o.status === 'processing').length,
            deliveredOrders: fromApi?.completedOrders ?? orders.filter(o => o.status === 'delivered' || o.status === 'completed').length
        };
    }, [users.length, orders, dashboardStats]);

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

    // Render Dashboard
    const renderDashboard = () => (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, {user?.name || 'Admin'}! Here's what's happening today.</p>
            </div>

            <div className="stats-grid-admin">
                <div className="stat-card-admin users">
                    <div className="stat-icon-wrapper"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.totalUsers}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                </div>
                <div className="stat-card-admin orders">
                    <div className="stat-icon-wrapper"><ShoppingBag size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.totalOrders}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
                <div className="stat-card-admin pending">
                    <div className="stat-icon-wrapper"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.pendingOrders}</span>
                        <span className="stat-label">Pending Orders</span>
                    </div>
                </div>
                <div className="stat-card-admin revenue">
                    <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-number">₹{stats.totalRevenue.toLocaleString()}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card recent-orders">
                    <div className="card-header">
                        <h3><ShoppingBag size={18} /> Recent Orders</h3>
                        <button className="btn-link" onClick={() => setActiveTab('orders')}>View All</button>
                    </div>
                    <div className="recent-orders-list">
                        {orders.slice(0, 5).map((order, idx) => (
                            <div key={order.id || order._id || `order-${idx}`} className="recent-order-item" onClick={() => setSelectedOrder(order)}>
                                <div className="order-main-info">
                                    <span className="order-id">{order.id}</span>
                                    <span className="order-customer">{order.userName}</span>
                                </div>
                                <div className="order-meta-info">
                                    <span className={`status-badge ${order.status}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                    <span className="order-amount">₹{order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card recent-users">
                    <div className="card-header">
                        <h3><Users size={18} /> New Users</h3>
                        <button className="btn-link" onClick={() => setActiveTab('users')}>View All</button>
                    </div>
                    <div className="recent-users-list">
                        {users.slice(0, 5).map((u, idx) => (
                            <div key={u._id || u.id || u.email || u.phone || `user-${idx}`} className="recent-user-item" onClick={() => setSelectedUser(u)}>
                                <div className="user-avatar">{u.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                                <div className="user-info">
                                    <span className="user-name">{u.name}</span>
                                    <span className="user-phone">{u.phone}</span>
                                </div>
                                <span className={`profile-badge ${u.profileType.toLowerCase()}`}>{u.profileType}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card order-stats">
                    <div className="card-header">
                        <h3><Activity size={18} /> Order Statistics</h3>
                    </div>
                    <div className="order-stats-list">
                        <div className="order-stat-row">
                            <span className="stat-dot pending"></span>
                            <span className="stat-name">Pending</span>
                            <span className="stat-count">{stats.pendingOrders}</span>
                        </div>
                        <div className="order-stat-row">
                            <span className="stat-dot processing"></span>
                            <span className="stat-name">Processing</span>
                            <span className="stat-count">{stats.processingOrders}</span>
                        </div>
                        <div className="order-stat-row">
                            <span className="stat-dot delivered"></span>
                            <span className="stat-name">Delivered</span>
                            <span className="stat-count">{stats.deliveredOrders}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'users': return <UserManagement users={users} orders={orders} isLoading={isLoading} />;
            case 'orders': return <OrderManagement orders={orders} isLoading={isLoading} onRefresh={fetchOrders} handleUpdateOrderStatus={handleUpdateOrderStatus} />;
            case 'pricing': return <PricingManagement />;
            case 'binding': return <BindingManagement />;
            case 'settings': return <SettingsPage user={user} />;
            default: return renderDashboard();
        }
    };

    return (
        <div className={`admin-container-new ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className="admin-sidebar-new">
                <div className="sidebar-header">
                    <div className="logo-area">
                        <img src="/Printhub_logo.png" alt="PrintHub" className="admin-logo-img" />
                        {!sidebarCollapsed && <span className="logo-text">Admin</span>}
                    </div>
                    <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleNavigation('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        {!sidebarCollapsed && <span>Dashboard</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => handleNavigation('users')}
                    >
                        <Users size={20} />
                        {!sidebarCollapsed && <span>Users</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => handleNavigation('orders')}
                    >
                        <ShoppingBag size={20} />
                        {!sidebarCollapsed && <span>Orders</span>}
                        {stats.pendingOrders > 0 && (
                            <span className="nav-badge">{stats.pendingOrders}</span>
                        )}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`}
                        onClick={() => handleNavigation('pricing')}
                    >
                        <DollarSign size={20} />
                        {!sidebarCollapsed && <span>Normal Print Pricing</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'binding' ? 'active' : ''}`}
                        onClick={() => handleNavigation('binding')}
                    >
                        <Link2 size={20} />
                        {!sidebarCollapsed && <span>Binding Management</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => handleNavigation('settings')}
                    >
                        <Settings size={20} />
                        {!sidebarCollapsed && <span>Settings</span>}
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
                        {!sidebarCollapsed && (
                            <div className="admin-user-details">
                                <span className="admin-name">{user?.name || 'Admin'}</span>
                                <span className="admin-role">Administrator</span>
                            </div>
                        )}
                    </div>
                    <button className="logout-btn-new" onClick={onLogout}>
                        <LogOut size={20} />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main-new">
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;