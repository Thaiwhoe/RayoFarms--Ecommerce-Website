const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleWare');
const { createBrandName, deleteBrandName, updateBrandName, getAllBrandNames, getABrandName } = require('../controller/brandCategoryController');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrandName)
router.delete('/:id', authMiddleware, isAdmin, deleteBrandName)
router.put('/:id', authMiddleware, isAdmin, updateBrandName)
router.get('/', getAllBrandNames)
router.get('/:id', getABrandName)

module.exports = router