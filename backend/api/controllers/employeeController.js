const Order = require('../models/Order');

// @desc    Get all orders (employee view - same as admin list)
// @route   GET /api/employee/orders
// @access  Private/Employee
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10) || 50;

    const query = { isActive: true };
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Employee get orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status only (employee)
// @route   PUT /api/employee/orders/:id/status
// @access  Private/Employee
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed: pending, processing, completed, cancelled',
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    await order.populate([
      { path: 'user', select: 'name email phone userType' },
      { path: 'bindingType', select: 'name' },
    ]);

    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    console.error('Employee update order status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Print view: HTML page with user's print settings + document, auto-opens print dialog
// @route   GET /api/employee/print-view?orderId=xxx&fileIndex=0
// @access  Private/Employee (token in query allowed for new window)
const getPrintView = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const fileIndex = parseInt(req.query.fileIndex, 10) || 0;

    if (!orderId) {
      return res.status(400).send('Missing orderId');
    }

    const order = await Order.findById(orderId)
      .populate('bindingType', 'name')
      .lean();

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const files = order.files || [];
    const file = files[fileIndex];
    if (!file || !file.path) {
      return res.status(404).send('File not found');
    }

    const fileUrl = file.path.startsWith('/') ? file.path : `/${file.path}`;
    const colorType = order.colorType || '—';
    const sideType = order.sideType || '—';
    const pageCount = order.pageCount ?? '—';
    const quantity = order.quantity ?? 1;
    const bindingName = (order.bindingType && order.bindingType.name) || '—';
    const fileName = file.originalName || file.filename || 'Document';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Print — ${order.orderId || orderId}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; background: #f1f5f9; }
    .settings-card {
      background: #1e293b;
      color: #e2e8f0;
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .settings-card h2 { margin: 0 0 12px 0; font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .setting-item { background: rgba(255,255,255,0.1); padding: 10px 14px; border-radius: 8px; text-align: center; }
    .setting-item .val { font-weight: 700; font-size: 1.1rem; display: block; }
    .setting-item .lbl { font-size: 0.75rem; color: #94a3b8; }
    .doc-frame { width: 100%; height: 70vh; min-height: 400px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
    .no-print { margin-top: 12px; }
    @media print {
      body { background: #fff; padding: 0; }
      .settings-card, .no-print { display: none !important; }
      .doc-frame { height: 100vh !important; border: none !important; }
    }
  </style>
</head>
<body>
  <div class="settings-card no-print">
    <h2>Use these settings in the print dialog (customer chose)</h2>
    <div class="settings-grid">
      <div class="setting-item"><span class="lbl">Color</span><span class="val">${colorType}</span></div>
      <div class="setting-item"><span class="lbl">Sides</span><span class="val">${sideType}</span></div>
      <div class="setting-item"><span class="lbl">Copies</span><span class="val">${quantity}</span></div>
      <div class="setting-item"><span class="lbl">Pages</span><span class="val">${pageCount}</span></div>
      <div class="setting-item"><span class="lbl">Binding</span><span class="val">${bindingName}</span></div>
    </div>
    <p style="margin: 12px 0 0 0; font-size: 0.875rem; opacity: 0.9;">Order: ${order.orderId || orderId} — ${fileName}</p>
  </div>
  <iframe id="doc" class="doc-frame" src="${fileUrl}" title="${fileName}"></iframe>
  <script>
    var iframe = document.getElementById('doc');
    function doPrint() {
      try {
        if (iframe.contentWindow && iframe.contentWindow.print) {
          iframe.contentWindow.print();
        } else {
          window.print();
        }
      } catch (e) {
        window.print();
      }
    }
    iframe.onload = function() {
      setTimeout(doPrint, 500);
    };
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Employee print-view error:', error);
    res.status(500).send('Error loading print view');
  }
};

module.exports = {
  getOrders,
  updateOrderStatus,
  getPrintView,
};
