const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numOfViews:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?size=626&ext=jpg&ga=GA1.1.759001102.1686581267&semt=sph"
    },
    author: {
        type: String,
        default: "Admin"
    },
},{
    toJSON: {
        virtuals: true
    },
    toObjects:{
        virtuals: true
    },
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);