const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating } = require('../controller/productController');
const router = express.Router();

const {isAdmin, authMiddleware} = require('../middlewares/authMiddleWare')

router.post("/", authMiddleware, createProduct);
router.get("/:id", getaProduct);
router.put("/cart", authMiddleware, addToWishList)

router.put('/rating', authMiddleware, rating)

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts);




module.exports = router