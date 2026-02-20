import { useState, useEffect, useCallback } from 'react';
import {
    ShoppingBag, LogOut, RefreshCw, Clock, CheckCircle, XCircle,
    AlertCircle, User, Phone, Calendar, Printer, FileText
} from 'lucide-react';
import { employeeAPI } from '../lib/api';
import './employee.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled'];

const normalizeOrder = (o) => {
    const userRef = o.user || o.userId;
    const bindingName = o.bindingType?.name || o.bindingType || '—';
    const filesList = Array.isArray(o.files) ? o.files.map(f => ({
        name: f.originalName || f.name,
        path: f.path,
        url: f.path ? `${API_URL}${f.path.startsWith('/') ? '' : '/'}${f.path}` : null,
    })) : [];
    return {
        id: o._id || o.id || o.orderId,
        orderId: o.orderId || o._id || o.id,
        userName: userRef?.name || o.guestName || o.userName || '',
        userPhone: userRef?.phone || o.guestPhone || o.userPhone || '',
        date: o.createdAt || o.date,
        status: o.status || 'pending',
        total: o.totalPrice ?? o.total ?? 0,
        colorType: o.colorType || '—',
        sideType: o.sideType || '—',
        pageCount: o.pageCount ?? '—',
        quantity: o.quantity ?? '—',
        bindingType: bindingName,
        notes: o.notes || '',
        files: filesList,
    };
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'pending': return <Clock size={14} />;
        case 'processing': return <RefreshCw size={14} />;
        case 'completed': return <CheckCircle size={14} />;
        case 'cancelled': return <XCircle size={14} />;
        default: return <AlertCircle size={14} />;
    }
};

export default function Employee({ onLogout, user }) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await employeeAPI.getOrders({ page: 1, limit: 100 });
            const raw = res?.data ?? res?.orders ?? (Array.isArray(res) ? res : []);
            const list = Array.isArray(raw) ? raw : [];
            setOrders(list.map(normalizeOrder));
        } catch (err) {
            console.error('Employee fetch orders:', err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await employeeAPI.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error('Update status failed:', err);
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const printOrderSlip = (order) => {
        const win = window.open('', '_blank', 'width=600,height=700');
        if (!win) {
            alert('Please allow popups to print the order slip.');
            return;
        }
        const dateStr = order.date ? new Date(order.date).toLocaleString() : '—';
        win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order ${order.orderId || order.id}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; max-width: 520px; margin: 0 auto; }
    h1 { font-size: 1.25rem; margin: 0 0 8px 0; border-bottom: 2px solid #1e293b; padding-bottom: 8px; }
    .row { display: flex; justify-content: space-between; margin: 6px 0; }
    .label { color: #64748b; }
    .section { margin-top: 16px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .section-title { font-weight: 700; margin-bottom: 8px; }
    ul { margin: 0; padding-left: 20px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>Print Order — ${order.orderId || order.id}</h1>
  <div class="row"><span class="label">Status</span><strong>${order.status}</strong></div>
  <div class="row"><span class="label">Date</span>${dateStr}</div>
  <div class="section">
    <div class="section-title">Customer</div>
    <div class="row"><span class="label">Name</span>${order.userName || '—'}</div>
    <div class="row"><span class="label">Phone</span>${order.userPhone || '—'}</div>
  </div>
  <div class="section">
    <div class="section-title">Print specs</div>
    <div class="row"><span class="label">Color</span>${order.colorType}</div>
    <div class="row"><span class="label">Sides</span>${order.sideType}</div>
    <div class="row"><span class="label">Pages</span>${order.pageCount}</div>
    <div class="row"><span class="label">Quantity</span>${order.quantity}</div>
    <div class="row"><span class="label">Binding</span>${order.bindingType}</div>
    <div class="row"><span class="label">Total</span>₹${order.total ?? 0}</div>
  </div>
  <div class="section">
    <div class="section-title">Files</div>
    <ul>${(order.files && order.files.length) ? order.files.map(f => `<li>${f.name || 'File'}</li>`).join('') : '<li>No files</li>'}</ul>
  </div>
  ${order.notes ? `<div class="section"><div class="section-title">Notes</div><p>${order.notes}</p></div>` : ''}
  <p style="margin-top:20px;font-size:12px;color:#94a3b8;">PrintHub — Order slip</p>
</body>
</html>`);
        win.document.close();
        win.focus();
        setTimeout(() => {
            win.print();
            win.onafterprint = () => win.close();
        }, 300);
    };

    const openFileForPrint = (fileUrl, fileName) => {
        if (!fileUrl) {
            alert('No file available to open.');
            return;
        }
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    };

    // Single-click print: open print-view (user's settings + document) and auto-open print dialog
    const printWithUserSettings = (order, fileIndex = 0) => {
        if (!order.files?.length) {
            alert('No file to print for this order.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in again.');
            return;
        }
        const url = `${API_URL}/api/employee/print-view?orderId=${encodeURIComponent(order.id)}&fileIndex=${fileIndex}&token=${encodeURIComponent(token)}`;
        const win = window.open(url, '_blank', 'width=900,height=800');
        if (!win) alert('Please allow popups to print.');
    };

    return (
        <div className="employee-container">
            <aside className="employee-sidebar">
                <div className="employee-sidebar-header">
                    <img src="/Printhub_logo.png" alt="PrintHub" className="employee-logo" />
                    <span className="employee-sidebar-title">Employee</span>
                </div>
                <nav className="employee-nav">
                    <button type="button" className="employee-nav-btn active">
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </button>
                </nav>
                <div className="employee-sidebar-footer">
                    <div className="employee-user">
                        <div className="employee-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'E'}</div>
                        <div className="employee-user-info">
                            <span className="employee-name">{user?.name || 'Employee'}</span>
                            <span className="employee-role">Employee</span>
                        </div>
                    </div>
                    <button type="button" className="employee-logout" onClick={onLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="employee-main">
                <div className="employee-content">
                    <div className="employee-header">
                        <div>
                            <h1>Orders</h1>
                            <p>View orders and update status</p>
                        </div>
                        <button type="button" className="employee-refresh-btn" onClick={fetchOrders} disabled={isLoading}>
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="employee-loading">
                            <div className="employee-spinner" />
                            <p>Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="employee-empty">
                            <ShoppingBag size={48} />
                            <h3>No orders found</h3>
                            <p>Orders will appear here when customers place them.</p>
                            <button type="button" className="employee-refresh-btn" onClick={fetchOrders}>
                                <RefreshCw size={18} /> Refresh
                            </button>
                        </div>
                    ) : (
                        <div className="employee-orders-grid">
                            {orders.map((order) => (
                                <div key={order.id} className="employee-order-card">
                                    <div className="employee-order-header">
                                        <span className="employee-order-id">{order.id}</span>
                                        <span className={`employee-status-badge ${order.status}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="employee-order-body">
                                        <div className="employee-order-customer">
                                            <User size={14} />
                                            <span>{order.userName || '—'}</span>
                                            <span className="employee-order-phone"><Phone size={12} /> {order.userPhone || '—'}</span>
                                        </div>
                                        <div className="employee-order-specs">
                                            <span>{order.colorType}</span>
                                            <span>{order.sideType}</span>
                                            <span>{order.pageCount} pg</span>
                                            <span>×{order.quantity}</span>
                                            <span>{order.bindingType}</span>
                                        </div>
                                        <div className="employee-order-meta">
                                            <span><Calendar size={14} /> {order.date ? new Date(order.date).toLocaleDateString() : '—'}</span>
                                            <span className="employee-order-total">₹{order.total ?? 0}</span>
                                        </div>
                                    </div>
                                    <div className="employee-order-actions">
                                        <div className="employee-order-actions-row">
                                            <button
                                                type="button"
                                                className="employee-btn employee-btn-print"
                                                onClick={(e) => { e.stopPropagation(); printOrderSlip(order); }}
                                                title="Print order slip (job ticket)"
                                            >
                                                <Printer size={16} />
                                                Print slip
                                            </button>
                                            {order.files?.length > 0 ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="employee-btn employee-btn-print-doc"
                                                        onClick={(e) => { e.stopPropagation(); printWithUserSettings(order, 0); }}
                                                        title="Print document with customer's settings (color, sides, copies)"
                                                    >
                                                        <Printer size={16} />
                                                        Print
                                                    </button>
                                                    {order.files.length > 1 && (
                                                        <div className="employee-file-btns">
                                                            {order.files.slice(1).map((file, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    className="employee-btn employee-btn-print-doc-sm"
                                                                    onClick={(e) => { e.stopPropagation(); printWithUserSettings(order, idx + 1); }}
                                                                    title={file.name}
                                                                >
                                                                    Print {idx + 2}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="employee-btn employee-btn-file"
                                                        onClick={(e) => { e.stopPropagation(); openFileForPrint(order.files[0].url, order.files[0].name); }}
                                                        title="Open file in new tab"
                                                    >
                                                        <FileText size={16} />
                                                        Open
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="employee-no-files">No files</span>
                                            )}
                                        </div>
                                        <div className="employee-order-actions-row employee-status-row">
                                            <label className="employee-status-label">Status:</label>
                                            <select
                                                className={`employee-status-select ${order.status}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={updatingId === order.id}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                            {updatingId === order.id && <span className="employee-updating">Updating...</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
