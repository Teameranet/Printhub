import React, { useState, useMemo } from 'react';
import {
    Users, Search, Filter, TrendingUp, X, Phone, Eye,
    ShoppingBag, DollarSign, Calendar, Activity, Mail
} from 'lucide-react';
import './UserManagement.css';

// User Details Modal Component
const UserDetailsModal = ({ user, onClose, orders }) => {
    if (!user) return null;

    const userOrders = orders.filter(o => o.userPhone === user.phone);

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal user-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-info">
                        <h2>User Profile</h2>
                        <span className={`profile-type-badge ${user.profileType.toLowerCase()}`}>{user.profileType}</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="user-profile-header">
                        <div className="user-avatar-large">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-profile-info">
                            <h3>{user.name}</h3>
                            <p><Phone size={14} /> {user.phone}</p>
                        </div>
                    </div>

                    <div className="user-stats-grid">
                        <div className="user-stat-card">
                            <div className="stat-icon orders"><ShoppingBag size={20} /></div>
                            <div className="stat-content">
                                <span className="stat-value">{user.orders}</span>
                                <span className="stat-label">Total Orders</span>
                            </div>
                        </div>
                        <div className="user-stat-card">
                            <div className="stat-icon spent"><DollarSign size={20} /></div>
                            <div className="stat-content">
                                <span className="stat-value">₹{user.totalSpent}</span>
                                <span className="stat-label">Total Spent</span>
                            </div>
                        </div>
                        <div className="user-stat-card">
                            <div className="stat-icon joined"><Calendar size={20} /></div>
                            <div className="stat-content">
                                <span className="stat-value">{user.createdAt}</span>
                                <span className="stat-label">Joined</span>
                            </div>
                        </div>
                        <div className="user-stat-card">
                            <div className="stat-icon active"><Activity size={20} /></div>
                            <div className="stat-content">
                                <span className="stat-value">{user.lastActive}</span>
                                <span className="stat-label">Last Active</span>
                            </div>
                        </div>
                    </div>

                    {userOrders.length > 0 && (
                        <div className="detail-section">
                            <h3><ShoppingBag size={16} /> Recent Orders</h3>
                            <div className="user-orders-list">
                                {userOrders.slice(0, 5).map(order => (
                                    <div key={order.id} className="user-order-item">
                                        <div className="order-info">
                                            <span className="order-id">{order.id}</span>
                                            <span className="order-date">{order.date}</span>
                                        </div>
                                        <span className={`status-badge-mini ${order.status}`}>{order.status}</span>
                                        <span className="order-total">₹{order.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const UserManagement = ({ users, orders, isLoading }) => {
    // Filter states
    const [userSearch, setUserSearch] = useState('');
    const [userTypeFilter, setUserTypeFilter] = useState('all');
    const [userSortBy, setUserSortBy] = useState('name');
    const [selectedUser, setSelectedUser] = useState(null);

    // Filtered and sorted users
    const filteredUsers = useMemo(() => {
        let result = [...users];

        // Search filter
        if (userSearch) {
            const search = userSearch.toLowerCase();
            result = result.filter(u =>
                u.name?.toLowerCase().includes(search) ||
                u.phone?.includes(search) ||
                u.email?.toLowerCase().includes(search)
            );
        }

        // Type filter
        if (userTypeFilter !== 'all') {
            result = result.filter(u => u.profileType === userTypeFilter);
        }

        // Sorting
        result.sort((a, b) => {
            switch (userSortBy) {
                case 'name': return (a.name || '').localeCompare(b.name || '');
                case 'orders': return b.orders - a.orders;
                case 'spent': return b.totalSpent - a.totalSpent;
                case 'recent': return new Date(b.lastActive) - new Date(a.lastActive);
                default: return 0;
            }
        });

        return result;
    }, [users, userSearch, userTypeFilter, userSortBy]);

    return (
        <div className="management-content">
            <div className="management-header">
                <div className="header-title">
                    <h1>User Management</h1>
                    <p>Manage all registered users and their details</p>
                </div>
                <div className="header-stats">
                    <span className="header-stat"><Users size={16} /> {filteredUsers.length} users</span>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="filter-bar-admin">
                <div className="search-box-admin">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />
                    {userSearch && (
                        <button className="clear-search" onClick={() => setUserSearch('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <div className="filter-item">
                        <Filter size={14} />
                        <select value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="Regular">Regular</option>
                            <option value="Student">Student</option>
                            <option value="Institute">Institute</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <TrendingUp size={14} />
                        <select value={userSortBy} onChange={(e) => setUserSortBy(e.target.value)}>
                            <option value="name">Sort by Name</option>
                            <option value="orders">Sort by Orders</option>
                            <option value="spent">Sort by Spent</option>
                            <option value="recent">Sort by Activity</option>
                        </select>
                    </div>

                    {(userSearch || userTypeFilter !== 'all') && (
                        <button
                            className="btn-clear-filters"
                            onClick={() => { setUserSearch(''); setUserTypeFilter('all'); }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="empty-state">
                    <Users size={48} />
                    <h3>No users found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone</th>
                                <th>Profile Type</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id} onClick={() => setSelectedUser(u)}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm">{u.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                                            <div className="user-cell-info">
                                                <span className="user-name">{u.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><Phone size={14} /> {u.phone}</td>
                                    <td>
                                        <span className={`profile-badge ${u.profileType.toLowerCase()}`}>
                                            {u.profileType}
                                        </span>
                                    </td>
                                    <td>{u.orders}</td>
                                    <td>₹{u.totalSpent.toLocaleString()}</td>
                                    <td>{u.lastActive}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action" onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}>
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    orders={orders}
                />
            )}
        </div>
    );
};

export default UserManagement;
