const Category = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');

const validateMongoDbId = require('../utils/validateMongoDBid');


const createCategory = asyncHandler(async(req, res)=> {
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory)
    } catch(error){
        throw new Error(error)
    }
})

const updateCategory = asyncHandler(async(req, res)=> {
    const { id } = req.params
    validateMongoDbId(id)

    try{
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedCategory)
    } catch(error){
        throw new Error(error);
    }
});


const deleteCategory = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbId(id)
    try{
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory)
    } catch(error) {
        throw new Error(error)
    }
})


const getAllCategory = asyncHandler(async(req, res)=> {
    try{
        const allCategory = await Category.find()
        res.json(allCategory)
    } catch(error) {
        throw new Error(error)
    }
})

const getaCategory = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    try{
        const aCategory = await Category.findById(id)
        res.json(aCategory)
    } catch(error) {
        throw new Error(error)
    }
})


module.exports = { createCategory, updateCategory, deleteCategory, getAllCategory, getaCategory }