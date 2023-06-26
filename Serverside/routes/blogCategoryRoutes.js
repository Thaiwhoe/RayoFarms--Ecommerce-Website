const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleWare');
const { createBlogCategory, deleteBlogCategory, updateBlogCategory, getAllBlogCategory, getaBlogCategory } = require('../controller/blogCategoryController');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlogCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory)
router.put('/:id', authMiddleware, isAdmin, updateBlogCategory)
router.get('/', getAllBlogCategory)
router.get('/:id', getaBlogCategory)

module.exports = router