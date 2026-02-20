import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../lib/api';
import { Printer, ArrowLeft, Loader2, FileText } from 'lucide-react';
import './Invoice.css';

export function Invoice() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const fromCheckout = location.state?.fromCheckout;
    const orderCount = location.state?.orderCount || 1;
    const guestPhoneFromState = location.state?.guestPhone;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [guestPhoneInput, setGuestPhoneInput] = useState(guestPhoneFromState || '');
    const [showGuestForm, setShowGuestForm] = useState(false);

    const fetchGuestOrder = async (phone) => {
        if (!orderId || !phone || String(phone).trim().length < 10) return;
        setLoading(true);
        setError(null);
        try {
            const res = await userAPI.getGuestOrderById(orderId, phone.trim());
            if (res.data) setOrder(res.data);
        } catch (e) {
            setError(e.message || 'Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!orderId) {
            setError('Order ID missing');
            setLoading(false);
            return;
        }
        if (isAuthenticated) {
            let cancelled = false;
            (async () => {
                try {
                    const res = await userAPI.getOrderById(orderId);
                    if (!cancelled && res.data) setOrder(res.data);
                } catch (e) {
                    if (!cancelled) setError(e.message || 'Failed to load order');
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
            return () => { cancelled = true; };
        } else if (guestPhoneFromState) {
            fetchGuestOrder(guestPhoneFromState);
        } else {
            setLoading(false);
            setShowGuestForm(true);
        }
    }, [orderId, isAuthenticated, guestPhoneFromState]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="invoice-page">
                <div className="invoice-loading">
                    <Loader2 size={48} className="animate-spin" />
                    <p>Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (showGuestForm && !order) {
        return (
            <div className="invoice-page">
                <div className="invoice-guest-form">
                    <h2>View your order</h2>
                    <p>Enter the mobile number you used when placing the order.</p>
                    <input
                        type="tel"
                        className="input"
                        placeholder="10-digit mobile number"
                        value={guestPhoneInput}
                        onChange={(e) => setGuestPhoneInput(e.target.value)}
                        maxLength={15}
                    />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => fetchGuestOrder(guestPhoneInput)}
                        disabled={!guestPhoneInput.trim() || guestPhoneInput.trim().length < 10}
                    >
                        View order
                    </button>
                    {error && <p className="invoice-guest-error">{error}</p>}
                    <button type="button" className="btn btn-ghost mt-2" onClick={() => navigate('/')}>
                        <ArrowLeft size={18} /> Back to home
                    </button>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="invoice-page">
                <div className="invoice-error">
                    <p>{error || 'Order not found'}</p>
                    <button className="btn btn-primary" onClick={() => navigate(isAuthenticated ? '/orders' : '/')}>
                        <ArrowLeft size={18} /> {isAuthenticated ? 'Back to Orders' : 'Back to home'}
                    </button>
                </div>
            </div>
        );
    }

    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : '';
    const user = order.user || {};
    const displayName = user.name || order.guestName || '—';
    const displayPhone = user.phone || order.guestPhone || '—';
    const displayEmail = user.email || '—';
    const bindingName = order.bindingType?.name || 'None';

    return (
        <div className="invoice-page">
            <div className="invoice-actions no-print">
                <button className="btn btn-ghost" onClick={() => navigate(isAuthenticated ? '/orders' : '/')}>
                    <ArrowLeft size={18} /> {isAuthenticated ? 'Back to Orders' : 'Back to home'}
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                    <Printer size={18} /> Print / Save as PDF
                </button>
            </div>
            {fromCheckout && (
                <div className="invoice-success-banner no-print">
                    Order placed successfully! {orderCount > 1 ? `This is invoice for 1 of ${orderCount} orders. View all in My Orders.` : 'Print or save this invoice below.'}
                </div>
            )}

            <div className="invoice-document">
                <header className="invoice-header">
                    <div className="invoice-brand">
                        <h1>PrintHub</h1>
                        <p>A Better Way To Print</p>
                    </div>
                    <div className="invoice-title">
                        <h2>INVOICE</h2>
                        <p className="invoice-id">{order.orderId || order._id}</p>
                    </div>
                </header>

                <div className="invoice-meta">
                    <div className="invoice-meta-block">
                        <h4>Bill To</h4>
                        <p className="name">{displayName}</p>
                        {displayEmail !== '—' && <p>{displayEmail}</p>}
                        <p>{displayPhone}</p>
                    </div>
                    <div className="invoice-meta-block">
                        <h4>Invoice Date</h4>
                        <p>{orderDate}</p>
                    </div>
                    <div className="invoice-meta-block">
                        <h4>Status</h4>
                        <p className="status">{order.status || 'pending'}</p>
                    </div>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Specifications</th>
                            <th className="num">Qty</th>
                            <th className="num">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order.items && order.items.length) ? order.items.map((item, i) => (
                            <tr key={i}>
                                <td>{item.description || 'Print order'}</td>
                                <td>
                                    {order.colorType} • {order.sideType} sided • {order.pageCount} pages • {bindingName}
                                </td>
                                <td className="num">{item.quantity}</td>
                                <td className="num">{(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td>Print order</td>
                                <td>{order.colorType} • {order.sideType} • {order.pageCount} pages • {bindingName}</td>
                                <td className="num">{order.quantity || 1}</td>
                                <td className="num">{Number(order.totalPrice || 0).toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {order.files && order.files.length > 0 && (
                    <div className="invoice-files">
                        <h4>Files</h4>
                        <ul>
                            {order.files.map((f, i) => (
                                <li key={i}><FileText size={14} /> {f.originalName}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="invoice-total">
                    <strong>Total Amount: ₹{Number(order.totalPrice || 0).toFixed(2)}</strong>
                </div>

                <footer className="invoice-footer">
                    <p>Thank you for choosing PrintHub.</p>
                    <p className="small">This is a computer-generated invoice.</p>
                </footer>
            </div>
        </div>
    );
}
