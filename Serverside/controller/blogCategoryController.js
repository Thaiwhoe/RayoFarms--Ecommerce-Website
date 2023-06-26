const BlogCategory = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbID = require('../utils/validateMongoDBid');


//Create blog category
const createBlogCategory = asyncHandler(async(req, res)=> {
    try{
        const newBlogCategory = await BlogCategory.create(req.body);
        res.json(newBlogCategory)
    } catch(error){
        throw new Error(error)
    }
})

//get all blog category
const getAllBlogCategory = asyncHandler(async(req, res)=> {
    try{
        const allBlogCategories = await BlogCategory.find()
        res.json(allBlogCategories)
    } catch(error){
        throw new Error(error)
    }
})
//get a blog category
const getaBlogCategory = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id);

    try{
        const aBlogCategory = await BlogCategory.findById(id)
        res.json(aBlogCategory)
    } catch(error) {
        throw new Error(error)
    }
})
//delete blog category
const deleteBlogCategory = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id)
    try{
        const deleteaBlogCategory = await BlogCategory.findByIdAndDelete(id)
        res.json(deleteaBlogCategory)
    } catch(error){
        throw new Error(error)
    }
})

//update blog category
const updateBlogCategory = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id)
    try{
        const updatedBlogcategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(updatedBlogcategory)
    } catch(error) {
        throw new Error(error)
    }
})
module.exports = { createBlogCategory, getAllBlogCategory, getaBlogCategory, deleteBlogCategory, updateBlogCategory}