import { useState, useEffect, useMemo } from 'react';
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

// Mock data generator for demo
const generateMockUsers = () => {
    let users = [];
    try {
        const parsed = JSON.parse(localStorage.getItem('local_users') || '[]');
        users = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Error parsing local_users:', e);
        users = [];
    }

    const mockUsers = [
        { id: '1', name: 'Rahul Sharma', phone: '9876543210', email: '9876543210@printhub.local', profileType: 'Regular', createdAt: '2024-01-15', lastActive: '2024-02-07', orders: 12, totalSpent: 2450 },

    ];
    return [...users.map((u, i) => ({
        id: `local_${i}`,
        name: u.name || 'User',
        phone: u.phone,
        email: u.email || `${u.phone}@printhub.local`,
        profileType: u.profileType || 'Regular',
        createdAt: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        orders: 0,
        totalSpent: 0
    })), ...mockUsers];
};

const generateMockOrders = () => {
    let localOrders = [];
    try {
        const parsed = JSON.parse(localStorage.getItem('local_orders') || '[]');
        localOrders = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Error parsing local_orders:', e);
        localOrders = [];
    }

    const mockOrders = [
        {
            id: 'ORD-001234',
            userId: '1',
            userName: 'Rahul Sharma',
            userPhone: '9876543210',
            date: '2024-02-07',
            status: 'pending',
            type: 'Advanced Print',
            total: 450,
            files: [
                { name: 'Project_Report.pdf', pages: 45, settings: { printColorId: 'bw', printSideId: 'double', bindingTypeId: 'spiral', copies: 2, pagesPerSet: '1', pageRange: '1-45' }, price: 180 },
                { name: 'Presentation.pptx', pages: 20, settings: { printColorId: 'color', printSideId: 'single', bindingTypeId: 'none', copies: 1, pagesPerSet: '1', pageRange: '1-20' }, price: 200 }
            ],
            fileUrl: 'https://example.com/files/project.pdf'
        }
    ];
    return [...localOrders, ...mockOrders];
};

// Main Admin Component
const Admin = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Data states
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states (only for dashboard quick views if needed, otherwise managed in sub-components)
    // Note: Dashboard still has "Recent Orders" and "New Users" which might need a quick view.
    // However, for simplicity, we can navigate to the respective tabs or keep a simple modal here.
    // But since UserManagement and OrderManagement handle their own modals, we might want to duplicate logic or simplify Dashboard.
    // Let's keep Dashboard simple: clicking works if we implement simple view or navigation.
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Load data
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setUsers(generateMockUsers());
            setOrders(generateMockOrders());
            setIsLoading(false);
        }, 500);

        // Set up real-time sync for local storage
        const handleStorageChange = () => {
            setUsers(generateMockUsers());
            setOrders(generateMockOrders());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Update order status
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
        // In real app, sync with backend/localStorage here
    };

    // Dashboard stats
    const stats = useMemo(() => ({
        totalUsers: users.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0),
        processingOrders: orders.filter(o => o.status === 'processing').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length
    }), [users, orders]);

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
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="recent-order-item" onClick={() => setSelectedOrder(order)}>
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
                        {users.slice(0, 5).map(u => (
                            <div key={u.id} className="recent-user-item" onClick={() => setSelectedUser(u)}>
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
            case 'orders': return <OrderManagement orders={orders} isLoading={isLoading} handleUpdateOrderStatus={handleUpdateOrderStatus} />;
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
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        {!sidebarCollapsed && <span>Dashboard</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={20} />
                        {!sidebarCollapsed && <span>Users</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingBag size={20} />
                        {!sidebarCollapsed && <span>Orders</span>}
                        {stats.pendingOrders > 0 && (
                            <span className="nav-badge">{stats.pendingOrders}</span>
                        )}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pricing')}
                    >
                        <DollarSign size={20} />
                        {!sidebarCollapsed && <span>Normal Print Pricing</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'binding' ? 'active' : ''}`}
                        onClick={() => setActiveTab('binding')}
                    >
                        <Link2 size={20} />
                        {!sidebarCollapsed && <span>Binding Management</span>}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
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