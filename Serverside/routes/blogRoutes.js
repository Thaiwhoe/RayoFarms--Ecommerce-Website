const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleWare');
const { createBlog, updateBlog, getAllBlogs, getBlog, deleteBlog, likeBlogPost } = require('../controller/blogController');
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, likeBlogPost)
router.put('/:id',authMiddleware, isAdmin, updateBlog)
router.get('/', getAllBlogs)
router.get('/:id', getBlog)
router.delete('/:id',authMiddleware, isAdmin, deleteBlog)




module.exports = router;