const express = require('express');
const { createCategory, updateCategory, deleteCategory, getAllCategory, getaCategory } = require('../controller/productCategoryController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleWare');
const router = express.Router();

router.post('/',authMiddleware, isAdmin, createCategory)
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)
router.get('/', getAllCategory)
router.get('/:id', getaCategory)



module.exports = router