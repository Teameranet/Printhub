import React, { useState, useEffect, useRef } from 'react';
import {
    Upload, File, CheckCircle, Loader2, X, Trash2, ChevronRight,
    Info, AlertCircle, FileText, Settings, CreditCard, Layers, Plus,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../src/context/CartContext.jsx';
import { useAuth } from '../../src/context/AuthContext.jsx';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import './NormalPrint.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();

    const fileInputRef = useRef(null);

    const getPageCount = async (file) => {
        const extension = file.name.split('.').pop().toLowerCase();

        try {
            if (extension === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                return pdfDoc.getPageCount();
            }

            if (['docx', 'dotx', 'docm'].includes(extension)) {
                try {
                    const zip = await JSZip.loadAsync(file);

                    // Method 1: Check docProps/app.xml (Standard way)
                    // Use case-insensitive search for the metadata file
                    const appXmlPath = Object.keys(zip.files).find(path =>
                        path.toLowerCase() === 'docprops/app.xml'
                    );

                    if (appXmlPath) {
                        const appXml = await zip.file(appXmlPath).async('string');
                        const match = appXml.match(/<Pages>(\d+)<\/Pages>/i);
                        if (match && parseInt(match[1]) > 0) {
                            return parseInt(match[1]);
                        }
                    }

                    // Method 2: Fallback - count page breaks in word/document.xml
                    const docXmlPath = Object.keys(zip.files).find(path =>
                        path.toLowerCase() === 'word/document.xml'
                    );

                    if (docXmlPath) {
                        const docXml = await zip.file(docXmlPath).async('string');
                        // Use multiple indicators for page breaks
                        const renderedBreaks = (docXml.match(/<w:lastRenderedPageBreak/g) || []).length;
                        const manualBreaks = (docXml.match(/<w:br\s+[^>]*w:type="page"/g) || []).length;
                        const detectedPages = Math.max(renderedBreaks, manualBreaks) + 1;
                        if (detectedPages > 1) return detectedPages;
                    }
                } catch (zipError) {
                    console.warn(`JSZip error for ${file.name}:`, zipError);
                }
            }

            if (['pptx', 'potx'].includes(extension)) {
                try {
                    const zip = await JSZip.loadAsync(file);
                    const slideFiles = Object.keys(zip.files).filter(path =>
                        path.toLowerCase().startsWith('ppt/slides/slide') && path.toLowerCase().endsWith('.xml')
                    );
                    return slideFiles.length || 1;
                } catch (zipError) {
                    console.warn(`JSZip error for ${file.name}:`, zipError);
                }
            }

            if (['jpg', 'jpeg', 'png'].includes(extension)) {
                return 1;
            }

            return 1; // Default fallback for .doc and other formats
        } catch (error) {
            console.error(`Error counting pages for ${file.name}:`, error);
            return 1;
        }
    };

    useEffect(() => {
        fetchConfig();

        // Listen for storage changes to update binding types in real-time
        const handleStorageChange = () => {
            loadBindingTypesFromStorage();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const loadBindingTypesFromStorage = () => {
        try {
            const savedBindingTypes = localStorage.getItem('binding_types');
            if (savedBindingTypes) {
                const bindingTypes = JSON.parse(savedBindingTypes);
                // Filter only active binding types
                const activeTypes = bindingTypes.filter(t => t.isActive);
                if (activeTypes.length > 0) {
                    setConfig(prev => ({
                        ...prev,
                        bindingTypes: activeTypes
                    }));
                }
            }
        } catch (e) {
            console.warn('Error loading binding types from storage:', e);
        }
    };

    const fetchConfig = async () => {
        try {
            const response = await fetch(`${API_URL}/api/config`);
            if (response.ok) {
                const data = await response.json();
                setConfig(prev => ({
                    ...DEFAULT_CONFIG,
                    ...data,
                    pagesPerSet: data.pagesPerSet || DEFAULT_CONFIG.pagesPerSet
                }));
            }
        } catch (error) {
            console.error('Error fetching config:', error);
            // Keep using DEFAULT_CONFIG
        }

        // Load binding types from localStorage (admin configured)
        loadBindingTypesFromStorage();
    };

    const parsePageRange = (range, maxPages) => {
        if (!range || range.trim() === '' || range.toLowerCase() === 'all') return maxPages;

        try {
            const parts = range.split(',').map(p => p.trim());
            const uniquePages = new Set();

            parts.forEach(part => {
                if (part.includes('-')) {
                    const [startStr, endStr] = part.split('-');
                    const start = parseInt(startStr);
                    const end = parseInt(endStr);

                    if (!isNaN(start) && !isNaN(end)) {
                        const s = Math.max(1, Math.min(start, end));
                        const e = Math.max(start, end); // Allow manual override beyond auto-detected max
                        for (let i = s; i <= e; i++) {
                            uniquePages.add(i);
                        }
                    }
                } else {
                    const page = parseInt(part);
                    if (!isNaN(page) && page >= 1) {
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
                price: 0,
                bindingCost: 0,
                singlePageCost: 0
            };

            // Initial price calculation
            const priceData = await calculatePrice(newFileObj);
            newFileObj.price = priceData?.total || pages * 2;
            newFileObj.bindingCost = priceData?.bindingCost || 0;
            newFileObj.singlePageCost = priceData?.singlePageCost || (newFileObj.settings.printColorId === 'color' ? 10 : 2);
            newFiles.push(newFileObj);
        }

        setFiles(prev => [...prev, ...newFiles]);
        setIsProcessing(false);
        setStep(2);
    };

    const calculatePrice = async (fileObj) => {
        try {
            // Load admin-configured pricing rules from localStorage
            let pricingRules = [];
            try {
                const saved = localStorage.getItem('normal_printing_prices');
                if (saved) {
                    pricingRules = JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Error loading pricing rules:', e);
            }

            // Get user profile type - normalize to lowercase
            const userProfileType = (user?.profileType || user?.user_metadata?.user_type || 'regular').toLowerCase();

            // Determine price key based on user type
            const getPriceKey = (type) => {
                if (type === 'student') return 'studentPrice';
                if (type === 'institute') return 'institutePrice';
                return 'regularPrice';
            };
            const priceKey = getPriceKey(userProfileType);

            // Local calculation logic
            const calculateLocal = (obj) => {
                const pps = parseInt(obj.settings.pagesPerSet) || 1;
                const copies = parseInt(obj.settings.copies) || 1;
                const colorType = obj.settings.printColorId === 'color' ? 'color' : 'bw';
                const sideType = obj.settings.printSideId === 'double' ? 'double' : 'single';

                // Number of document pages being printed
                const activePages = parsePageRange(obj.settings.pageRange, obj.pages);

                // Find matching pricing rule
                let pricePerPage = colorType === 'color' ? 10 : 2; // Default fallback prices

                // Sort rules by specificity (smaller page ranges first)
                const sortedRules = [...pricingRules].sort((a, b) => {
                    const rangeA = a.toPage - a.fromPage;
                    const rangeB = b.toPage - b.fromPage;
                    return rangeA - rangeB;
                });

                // Find the best matching rule
                for (const rule of sortedRules) {
                    if (rule.colorType === colorType &&
                        rule.sideType === sideType &&
                        activePages >= rule.fromPage &&
                        activePages <= rule.toPage) {
                        pricePerPage = rule[priceKey] || rule.regularPrice || pricePerPage;
                        break;
                    }
                }

                // If no exact match found, try to find a rule that matches color and side only
                if (pricePerPage === (colorType === 'color' ? 10 : 2)) {
                    for (const rule of sortedRules) {
                        if (rule.colorType === colorType && rule.sideType === sideType) {
                            pricePerPage = rule[priceKey] || rule.regularPrice || pricePerPage;
                            break;
                        }
                    }
                }

                // Effective sides needed after applying pages per set
                const sidesNeeded = Math.ceil(activePages / pps);

                let printPrice = sidesNeeded * pricePerPage;

                // Binding costs - fetch from admin settings
                let bindingCostPerUnit = 0;
                const bindingTypeId = obj.settings.bindingTypeId;

                if (bindingTypeId && bindingTypeId !== 'none') {
                    try {
                        const savedBindingPrices = localStorage.getItem('binding_prices');
                        if (savedBindingPrices) {
                            const bindingPrices = JSON.parse(savedBindingPrices);

                            // Find matching binding price rule based on type and page range
                            const matchingRule = bindingPrices.find(rule =>
                                rule.bindingTypeId === bindingTypeId &&
                                activePages >= rule.fromPage &&
                                activePages <= rule.toPage
                            );

                            if (matchingRule) {
                                bindingCostPerUnit = matchingRule[priceKey] || matchingRule.regularPrice || 0;
                            } else {
                                // If no exact range match, find any rule for this binding type
                                const typeRule = bindingPrices.find(rule => rule.bindingTypeId === bindingTypeId);
                                if (typeRule) {
                                    bindingCostPerUnit = typeRule[priceKey] || typeRule.regularPrice || 0;
                                }
                            }
                        }
                    } catch (e) {
                        console.warn('Error loading binding prices:', e);
                        // Fallback to default hardcoded values
                        switch (bindingTypeId) {
                            case 'spiral': bindingCostPerUnit = 20; break;
                            case 'staple': bindingCostPerUnit = 5; break;
                            case 'hardcover': bindingCostPerUnit = 100; break;
                            default: bindingCostPerUnit = 0;
                        }
                    }
                }

                const total = (printPrice + bindingCostPerUnit) * copies;

                return {
                    total,
                    bindingCost: bindingCostPerUnit * copies,
                    singlePageCost: pricePerPage
                };
            };

            const local = calculateLocal(fileObj);

            // Try to get price from API if available
            try {
                const response = await fetch(`${API_URL}/api/calculate-price`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...fileObj.settings,
                        pages: parsePageRange(fileObj.settings.pageRange, fileObj.pages),
                        userType: userProfileType
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return {
                        total: data.total ?? local.total,
                        bindingCost: data.bindingCost ?? local.bindingCost,
                        singlePageCost: data.singlePageCost ?? local.singlePageCost
                    };
                }
            } catch (e) {
                console.warn('API Price calculation failed, using local logic');
            }

            return local;
        } catch (error) {
            console.error('Price calculation error:', error);
            const fallbackRate = fileObj.settings.printColorId === 'color' ? 10 : 2;
            const pps = parseInt(fileObj.settings.pagesPerSet) || 1;
            const activePages = parsePageRange(fileObj.settings.pageRange, fileObj.pages);
            const sides = Math.ceil(activePages / pps);
            const printPrice = sides * fallbackRate;
            return {
                total: printPrice * (fileObj.settings.copies || 1),
                bindingCost: 0,
                singlePageCost: fallbackRate
            };
        }
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
                            cf.id === id ? {
                                ...cf,
                                price: priceData.total,
                                bindingCost: priceData.bindingCost,
                                singlePageCost: priceData.singlePageCost
                            } : cf
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
                            accept=".pdf,.doc,.docx,.docm,.dotx,.pptx,.potx,.jpg,.jpeg,.png"
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
                                        <span className="page-count"> ({fileObj.pages} {fileObj.pages === 1 ? 'page' : 'pages'})</span>
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
                                        placeholder={`e.g., 1-${fileObj.pages}`}
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
                                <span className="cost-label">Binding Cost</span>
                                <span className="cost-amount">₹{(fileObj.bindingCost || 0).toFixed(2)}</span>
                                <span className="cost-label">Per Page Cost</span>
                                <span className="cost-amount">₹{(fileObj.singlePageCost || 0).toFixed(2)}</span>
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
                                <li>Supported formats: PDF, DOC, DOCX, DOCM, PPTX, JPG, PNG</li>
                                <li>PDF and DOCX ensure the most accurate page detection</li>
                                <li>Old Word format (.doc) defaults to 1 page; please check page range</li>
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