const BrandCategory = require('../models/brandCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbID = require('../utils/validateMongoDBid');
const { all } = require('../routes/authRoutes');


//Create Brand name
const createBrandName = asyncHandler(async(req, res)=> {
    try{
    const newBrandName = await BrandCategory.create(req.body);
    res.json(newBrandName)
    } catch(error){
        throw new Error(error)
    }
})
//Update brand name
const updateBrandName = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id)

    try{
        const updatedBrandName = await BrandCategory.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBrandName)
    } catch(error){
        throw new Error(error)
    }
})
//delete brand name
const deleteBrandName = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id)
    try{
    const deletedBrandName = await BrandCategory.findByIdAndDelete(id)
    res.json(deletedBrandName)
    } catch(error){
        throw new Error(error)
    }
})
//get all brand names
const getAllBrandNames = asyncHandler(async(req, res)=> {
   try{
    const allBrandNames = await BrandCategory.find();
    res.json(allBrandNames)
   } catch(error){
    throw new Error(error)
   }
})
//get a brand name
const getABrandName = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id)
    try{
        const aBrandName = await BrandCategory.findById(id);
        res.json(aBrandName)
    } catch(error){
        throw new Error(error)
    }
})


module.exports = {createBrandName, updateBrandName, getABrandName, getAllBrandNames, deleteBrandName}