const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();

const {isAdmin, authMiddleware} = require('../middlewares/authMiddleWare')

router.post("/", authMiddleware, createProduct);
router.get("/:id", getaProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts);



module.exports = router