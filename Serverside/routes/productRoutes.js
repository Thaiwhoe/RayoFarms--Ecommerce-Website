const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating, uploadImages } = require('../controller/productController');
const router = express.Router();

const {isAdmin, authMiddleware} = require('../middlewares/authMiddleWare');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const productCategoryModel = require('../models/productCategoryModel');

router.post("/", authMiddleware, createProduct);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
router.get("/:id", getaProduct);
router.put("/cart", authMiddleware, addToWishList)

router.put('/rating', authMiddleware, rating)

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts);




module.exports = router