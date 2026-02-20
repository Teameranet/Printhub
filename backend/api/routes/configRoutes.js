const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
    res.json(DEFAULT_CONFIG);
});

module.exports = router;
