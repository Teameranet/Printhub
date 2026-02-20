import React, { useState, useEffect, useRef } from 'react';
import {
    Upload, File, CheckCircle, Loader2, X, Trash2, ChevronRight,
    Info, AlertCircle, FileText, Settings, CreditCard, Layers, Plus,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import './NormalPrint.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Map frontend color/side ids to backend price API format
const COLOR_TO_API = { bw: 'Black & White', color: 'Full Color' };
const SIDE_TO_API = { single: 'Single Sided', double: 'Double Sided' };
// Map frontend to Order model format
const COLOR_TO_ORDER = { bw: 'B&W', color: 'Color' };
const SIDE_TO_ORDER = { single: 'Single', double: 'Double' };

// Default configuration when API is unavailable
const DEFAULT_CONFIG = {
    paperSizes: [],
    paperTypes: [],
    bindingTypes: [
        { id: 'none', name: 'None' },
        { id: 'spiral', name: 'Spiral Binding' },
        { id: 'staple', name: 'Staple' },
        { id: 'hardcover', name: 'Hardcover' }
    ],
    colors: [
        { id: 'bw', name: 'Black & White' },
        { id: 'color', name: 'Full Color' }
    ],
    sides: [
        { id: 'single', name: 'Single-Sided' },
        { id: 'double', name: 'Double-Sided' }
    ],
    pagesPerSet: [
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '4', name: '4' },
        { id: '6', name: '6' },
        { id: '9', name: '9' },
        { id: '16', name: '16' }
    ]
};

export function NormalPrint({ initialSpecs, title }) {
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const fileInputRef = useRef(null);

    const getPageCount = async (file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        try {
            if (extension === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                return pdfDoc.getPageCount();
            }

            if (['docx', 'dotx'].includes(extension)) {
                const zip = await JSZip.loadAsync(file);
                const appXml = await zip.file('docProps/app.xml').async('string');
                const match = appXml.match(/<Pages>(\d+)<\/Pages>/);
                return match ? parseInt(match[1]) : 1;
            }

            if (['pptx', 'potx'].includes(extension)) {
                const zip = await JSZip.loadAsync(file);
                const slideFiles = Object.keys(zip.files).filter(path =>
                    path.startsWith('ppt/slides/slide') && path.endsWith('.xml')
                );
                return slideFiles.length || 1;
            }

            if (['jpg', 'jpeg', 'png'].includes(extension)) {
                return 1;
            }

            return 1; // Default fallback
        } catch (error) {
            console.error(`Error counting pages for ${file.name}:`, error);
            return 1;
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const [configRes, bindingRes] = await Promise.all([
                fetch(`${API_URL}/api/config`),
                fetch(`${API_URL}/api/binding/types`)
            ]);
            if (configRes.ok) {
                const data = await configRes.json();
                setConfig(prev => ({ ...prev, ...data, pagesPerSet: data.pagesPerSet || DEFAULT_CONFIG.pagesPerSet }));
            }
            // Use real binding types from DB (so we have _id for "None" and others)
            if (bindingRes.ok) {
                const { data: bindingTypes } = await bindingRes.json();
                if (bindingTypes && bindingTypes.length > 0) {
                    setConfig(prev => ({
                        ...prev,
                        bindingTypes: bindingTypes.map(t => ({ id: t._id, name: t.name }))
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    const parsePageRange = (range, maxPages) => {
        if (!range || range.trim() === '' || range.toLowerCase() === 'all') return maxPages;

        try {
            const parts = range.split(',').map(p => p.trim());
            let count = 0;
            const uniquePages = new Set();

            parts.forEach(part => {
                if (part.includes('-')) {
                    const [startStr, endStr] = part.split('-');
                    const start = parseInt(startStr);
                    const end = parseInt(endStr);

                    if (!isNaN(start) && !isNaN(end)) {
                        const s = Math.max(1, Math.min(start, end));
                        const e = Math.min(maxPages, Math.max(start, end));
                        for (let i = s; i <= e; i++) {
                            uniquePages.add(i);
                        }
                    }
                } else {
                    const page = parseInt(part);
                    if (!isNaN(page) && page >= 1 && page <= maxPages) {
                        uniquePages.add(page);
                    }
                }
            });

            return uniquePages.size > 0 ? uniquePages.size : maxPages;
        } catch (e) {
            return maxPages;
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setIsProcessing(true);
        const newFiles = [];

        for (const file of selectedFiles) {
            const pages = await getPageCount(file);

            const newFileObj = {
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                pages,
                settings: {
                    pageRange: `1-${pages}`,
                    printColorId: config.colors[0]?.id || 'bw',
                    printSideId: config.sides[0]?.id || 'single',
                    bindingTypeId: config.bindingTypes[0]?.id || 'none',
                    copies: 1,
                    pagesPerSet: '1'
                },
                price: 0
            };

            // Initial price from admin-configured pricing only
            const priceData = await calculatePrice(newFileObj);
            newFileObj.price = priceData?.total ?? 0;
            newFiles.push(newFileObj);
        }

        setFiles(prev => [...prev, ...newFiles]);
        setIsProcessing(false);
        setStep(2);
    };

    const calculatePrice = async (fileObj) => {
        const activePages = parsePageRange(fileObj.settings.pageRange, fileObj.pages);
        const copies = parseInt(fileObj.settings.copies) || 1;
        const bindingId = fileObj.settings.bindingTypeId;

        // Backend price API expects: colorType (Black & White | Full Color), sideType (Single Sided | Double Sided), pageCount, bindingType (_id), quantity
        if (bindingId && bindingId.length === 24 && /^[a-f0-9]+$/i.test(bindingId)) {
            try {
                const colorApi = COLOR_TO_API[fileObj.settings.printColorId] || 'Black & White';
                const sideApi = SIDE_TO_API[fileObj.settings.printSideId] || 'Single Sided';
                const params = new URLSearchParams({
                    colorType: colorApi,
                    sideType: sideApi,
                    pageCount: String(activePages),
                    bindingType: bindingId,
                    quantity: String(copies),
                });
                const res = await fetch(`${API_URL}/api/orders/calculate/price?${params}`);
                if (res.ok) {
                    const { data } = await res.json();
                    return { total: data.totalPrice };
                }
                const errData = await res.json().catch(() => ({}));
                console.warn('Price API:', errData.message || res.status);
            } catch (e) {
                console.warn('Price API error:', e);
            }
        }
        return { total: 0 };
    };

    const priceUpdateTimers = useRef({});

    const updateFileSettings = (id, newSettings) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.map(f => {
                if (f.id === id) {
                    return { ...f, settings: { ...f.settings, ...newSettings } };
                }
                return f;
            });

            // Debounce the price calculation to handle rapid range typing
            if (priceUpdateTimers.current[id]) {
                clearTimeout(priceUpdateTimers.current[id]);
            }

            priceUpdateTimers.current[id] = setTimeout(() => {
                const targetFile = updatedFiles.find(f => f.id === id);
                if (targetFile) {
                    calculatePrice(targetFile).then(priceData => {
                        setFiles(currentFiles => currentFiles.map(cf =>
                            cf.id === id ? { ...cf, price: priceData.total } : cf
                        ));
                    });
                }
            }, 600); // Slightly longer debounce for typing page ranges

            return updatedFiles;
        });
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        if (files.length <= 1) setStep(1);
    };

    const calculateTotalPrice = () => {
        return files.reduce((sum, f) => sum + (f.price || 0), 0);
    };

    const renderStepper = () => (
        <div className="stepper">
            {[
                { n: 1, label: 'Upload' },
                { n: 2, label: 'Configure' },
                { n: 3, label: 'Review' }
            ].map(s => (
                <div key={s.n} className={`step ${step >= s.n ? 'active' : ''}`}>
                    <div className="step-number">{s.n}</div>
                    <span className="step-label">{s.label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="normal-print-wrapper">
            <div className="container">
                {title && <h1 className="page-title">{title}</h1>}
                {renderStepper()}

                <div className="upload-card">
                    <div className="upload-header">
                        <h1>Upload your file</h1>
                        <p>Drag and drop your files here, or click to browse</p>
                    </div>

                    <div
                        className="dropzone"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            multiple
                            accept=".pdf,.doc,.docx,.pptx,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                        />
                        <div className="upload-icon-wrapper">
                            {isProcessing ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                        </div>
                        <button className="choose-files-btn">
                            <Plus size={20} />
                            Choose Files
                        </button>
                        <p className="supported-text">Supported: PDF, DOCX, PPTX, JPG (Max 100MB)</p>
                    </div>

                    {files.map(fileObj => (
                        <div key={fileObj.id} className="file-item">
                            <div className="file-item-header">
                                <div className="file-name-wrapper">
                                    <FileText className="file-icon" size={24} />
                                    <div>
                                        <span className="file-name">{fileObj.name}</span>
                                        <span className="page-count"> ({fileObj.pages} pages)</span>
                                    </div>
                                </div>
                                <button className="remove-file" onClick={() => removeFile(fileObj.id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="settings-grid">
                                <div className="setting-field">
                                    <label>Page Range</label>
                                    <input
                                        type="text"
                                        value={fileObj.settings.pageRange}
                                        onChange={(e) => updateFileSettings(fileObj.id, { pageRange: e.target.value })}
                                        placeholder="e.g., 1-14"
                                    />
                                </div>
                                <div className="setting-field">
                                    <label>Color</label>
                                    <select
                                        value={fileObj.settings.printColorId}
                                        onChange={(e) => updateFileSettings(fileObj.id, { printColorId: e.target.value })}
                                    >
                                        {config.colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="setting-field">
                                    <label>Sides</label>
                                    <select
                                        value={fileObj.settings.printSideId}
                                        onChange={(e) => updateFileSettings(fileObj.id, { printSideId: e.target.value })}
                                    >
                                        {config.sides.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="setting-field">
                                    <label>Binding</label>
                                    <select
                                        value={fileObj.settings.bindingTypeId}
                                        onChange={(e) => updateFileSettings(fileObj.id, { bindingTypeId: e.target.value })}
                                    >
                                        {config.bindingTypes.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="setting-field">
                                    <label>Copies</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={fileObj.settings.copies}
                                        onChange={(e) => updateFileSettings(fileObj.id, { copies: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="setting-field">
                                    <label>Page Per Set</label>
                                    <select
                                        value={fileObj.settings.pagesPerSet}
                                        onChange={(e) => updateFileSettings(fileObj.id, { pagesPerSet: e.target.value })}
                                    >
                                        {config.pagesPerSet.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="file-cost-footer">
                                <span className="cost-label">Estimated Cost</span>
                                <span className="cost-amount">₹{(fileObj.price || 0).toFixed(2)}</span>
                            </div>

                        </div>
                    ))}

                    {files.length > 0 && (
                        <div className="upload-footer">
                            <div className="footer-stats">
                                <div className="stat-group">
                                    <span className="stat-label">Total Files</span>
                                    <span className="stat-value">{files.length}</span>
                                </div>
                                <div className="stat-group">
                                    <span className="stat-label">Total Amount</span>
                                    <span className="stat-value">₹{calculateTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="pricing-note">Prices as per admin-configured rates (₹). Configure in Admin → Normal Print Pricing.</p>
                            <div className="footer-actions">
                                {isAuthenticated && (
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => {
                                            addToCart(files);
                                            setFiles([]);
                                            setStep(1);
                                            navigate('/cart');
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                                <button
                                    className="proceed-btn"
                                    onClick={() => {
                                        navigate('/checkout', {
                                            state: {
                                                files: [...files],
                                                totalPrice: calculateTotalPrice(),
                                                from: 'direct'
                                            }
                                        });
                                    }}
                                >
                                    Continue
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="help-section">
                    <h2 className="help-title">Upload Guidelines & Help</h2>
                    <div className="help-card">
                        <Info className="help-icon" size={24} />
                        <div className="help-content">
                            <h4>File Guidelines</h4>
                            <ul className="help-list">
                                <li>Maximum file size: 100MB</li>
                                <li>Supported formats: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG</li>
                                <li>PDF files ensure best print quality</li>
                                <li>Multiple files can be uploaded at once</li>
                            </ul>
                        </div>
                    </div>
                    <div className="help-card">
                        <Clock className="help-icon" size={24} />
                        <div className="help-content">
                            <h4>Processing Time</h4>
                            <p>Standard orders are typically ready within 2-4 hours during business hours.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
