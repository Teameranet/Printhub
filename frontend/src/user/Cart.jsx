import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import {
    FileText, Trash2, ShoppingCart, Printer, ArrowLeft,
    Plus, Eye, Package
} from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart } = useCart();

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout', {
            state: {
                files: [...cartItems],
                totalPrice: calculateTotal(),
                from: 'cart'
            }
        });
    };

    const handlePreview = (item) => {
        if (item.file) {
            const fileUrl = URL.createObjectURL(item.file);
            window.open(fileUrl, '_blank');
            setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
        } else if (item.fileUrl) {
            window.open(item.fileUrl, '_blank');
        } else {
            alert('Preview not available.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-wrapper">
                <div className="cart-container">
                    <div className="cart-empty">
                        <div className="empty-icon">
                            <ShoppingCart size={64} />
                        </div>
                        <h2>Your Cart is Empty</h2>
                        <p>Add some files to start printing</p>
                        <button
                            className="btn-primary-cart"
                            onClick={() => navigate('/normal-print')}
                        >
                            <Plus size={20} />
                            Add Files
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-wrapper">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="cart-title">
                        <ShoppingCart size={28} />
                        <h1>Your Cart</h1>
                    </div>
                    <span className="cart-count">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={item.id || index} className="cart-item">
                                <div className="item-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="item-details">
                                    <h3 className="item-name">{item.name || 'Untitled Document'}</h3>
                                    <div className="item-specs">
                                        <span>{item.pages || 1} pages</span>
                                        <span className="dot">•</span>
                                        <span>{item.settings?.printColorId === 'color' ? 'Color' : 'B&W'}</span>
                                        <span className="dot">•</span>
                                        <span>{item.settings?.printSideId === 'double' ? 'Double-sided' : 'Single-sided'}</span>
                                        <span className="dot">•</span>
                                        <span>{item.settings?.copies || 1} {(item.settings?.copies || 1) > 1 ? 'copies' : 'copy'}</span>
                                    </div>
                                    <div className="item-binding">
                                        <Package size={14} />
                                        <span>
                                            {item.settings?.bindingTypeId === 'none' ? 'No Binding' :
                                                (item.settings?.bindingTypeId?.charAt(0).toUpperCase() + item.settings?.bindingTypeId?.slice(1)) || 'No Binding'}
                                        </span>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className="btn-preview"
                                        onClick={() => handlePreview(item)}
                                        title="Preview"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="item-price">
                                    ₹{(item.price || 0).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-sidebar">
                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>

                            <button
                                className="btn-print-now"
                                onClick={handleProceedToCheckout}
                            >
                                <Printer size={20} />
                                Print Now
                            </button>

                            <button
                                className="btn-continue-shopping"
                                onClick={() => navigate('/normal-print')}
                            >
                                <ArrowLeft size={18} />
                                Continue Shopping
                            </button>
                        </div>

                        <button
                            className="btn-clear-cart"
                            onClick={clearCart}
                        >
                            <Trash2 size={16} />
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
