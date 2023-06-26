const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var brandCategorySchema = new mongoose.Schema({
    brandName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
});

//Export the model
module.exports = mongoose.model('BrandCategory', brandCategorySchema);