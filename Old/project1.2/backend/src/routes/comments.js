const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    const newComment = new Comment({
      productId,
      userId,
      userName,
      rating,
      comment
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update a comment
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { rating, comment, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 