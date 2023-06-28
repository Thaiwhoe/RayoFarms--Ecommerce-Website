const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleWare');
const { createBlog, updateBlog, getAllBlogs, getBlog, deleteBlog, likeBlogPost, disLikeBlogPost, uploadImages } = require('../controller/blogController');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), blogImgResize, uploadImages)

router.put('/likes', authMiddleware, likeBlogPost);
router.put('/dislike',authMiddleware, disLikeBlogPost)


router.put('/:id',authMiddleware, isAdmin, updateBlog);


router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.delete('/:id',authMiddleware, isAdmin, deleteBlog);




module.exports = router;