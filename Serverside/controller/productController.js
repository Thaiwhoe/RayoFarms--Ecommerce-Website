const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
const User = require('../models/userModel');
const validateMongoDbID = require('../utils/validateMongoDBid');
const cloudinaryUploadIMG  = require('../utils/cloudinary');
const fs = require('fs')


const createProduct = asyncHandler(async(req, res)=> {
    try{
        if (req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    }
    catch(error){
        throw new Error(error)
    }
})


const updateProduct = asyncHandler(async (req, res)=> {
    const { id } = req.params;
    try{
        if (req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteProduct = asyncHandler(async(req, res)=> {
    const { id } = req.params
    try{
        const deleteProduct = await Product.findByIdAndDelete( id )
        res.json(deleteProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const getaProduct = asyncHandler(async(req, res)=> {
    const { id } = req.params
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct)
    }
    catch(error){
        throw new Error(error)
    }
})


const getAllProducts = asyncHandler(async(req, res)=> {
    try{
        //Filtering search results
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr))

        //Sorting search results
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }

        //Limiting fields
        if (req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields)
        }else{
            query = query.select("-__v")
        }

        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page -1) * limit
        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const numOfProduct = await Product.countDocuments();
            if (skip>=numOfProduct) throw new Error('This Page does not exist')
        }
        console.log(page, limit, skip)

        const product = await query

        res.json(product)
    }
    catch(error){
        throw new Error(error)
    }
})

const addToWishList = asyncHandler(async(req, res)=>{
    const { _id } = req.user;
    const { prodId } = req.body;

    try{
        const user = await User.findById(_id);
        const alreadyAdded = await user.wishList.find((id)=>id.toString() === prodId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate({ _id }, {
                $pull: {wishList: prodId}
            }, {
                new: true,
            });
            res.json(user)
        } else {
            let user = await User.findByIdAndUpdate({ _id }, {
                $push: {wishList: prodId}
            }, {
                new: true,
            })
            res.json(user)
        }
    }catch(error){
        throw new Error(error)
    }
})


const rating = asyncHandler(async(req, res)=>{
    const { _id } = req.user;
    const {star, prodId, comment} = req.body;

    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId)=> userId.postedby.toString() === _id.toString());

        if(alreadyRated){
            const updateRating = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: { "ratings.$.star": star , "ratings.$.comment": comment }
            }, { new: true })
        } 
        else{
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedby: _id,
                    }
                }
            }, { new: true })
        }
        const getAllRatings = await Product.findById(prodId)
        let totalRating = getAllRatings.ratings.length;
        let ratingsum = getAllRatings.ratings
            .map((item)=> item.star)
            .reduce((prev, curr)=> prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating)
        let finalrating = await Product.findByIdAndUpdate(prodId, {
            totalRating: actualRating
        }, {new: true})
        res.json(finalrating)
    } catch(error){
        throw new Error(error)
    }
})

const uploadImages = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id);
    try{
        const uploader = (path)=> cloudinaryUploadIMG(path, "images");
        const urls = []
        const files = req.files;
        console.log(files.urls);
        for (const file of files) {
            const {path} = file;
            const newpath = await uploader(path)
            urls.push(newpath);
            fs.unlinkSync(path)
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map((file)=>{
                return file
            })
        }, {
            new: true,
        })
        res.json(findProduct)
    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating, uploadImages}