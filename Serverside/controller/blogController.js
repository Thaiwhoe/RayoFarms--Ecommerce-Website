const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbID = require('../utils/validateMongoDBid')

const createBlog = asyncHandler(async(req, res)=> {
    try{
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "success",
            newBlog,
        })
    }catch(error){
        throw new Error(error)
    }
})

const getAllBlogs = asyncHandler(async(req, res)=> {
    try{
        const getBlogs = await Blog.find()
        res.json(getBlogs)
    }
    catch(error){
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async(req, res)=> {
    const { id } = req.params
    validateMongoDbID(id)
    try{
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(id, {
            $inc: {numOfViews: 1}
        },{ new: true})
        res.json(getBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const likeBlogPost = asyncHandler(async(req, res)=> {
    const { blogId } = req.body;
    validateMongoDbID(blogId)

    //find the blog that would be liked
    const blog = await Blog.findById(blogId);
    //make sure user is Logged in
    const loginUserId = req?.user?._id;
    //Check if user has liked the post
    const isLiked = blog?.isLiked
    //Check if user has disliked the post
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString())
    //this would check for the user in dislikes array in the model (i.e if the user has disliked the post)
    //then pull the ID from the dislike array and set isDisliked in the Model to false 
    if (alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        res.json(blog)
    }

    //this would check for the user in the likes Array in the model(i.e if user has liked the post)
    //then pull the ID from the likes array and set isLiked in the model to false
    //(user would neither like nor dislike blogpost)
    if (isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        res.json(blog)
    } 

    //this would would push the user ID to the likes Array in the model making the user like the post
    else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        }, { new: true });
        res.json(blog)
    }
});

const disLikeBlogPost = asyncHandler(async(req, res)=> {
    const { blogId } = req.body;
    validateMongoDbID(blogId)

    //find the blog that would be liked
    const blog = await Blog.findById(blogId);
    //make sure user is Logged in
    const loginUserId = req?.user?._id;
    //Check if user has liked the post
    const isDisliked = blog?.isDisliked
    //Check if user has disliked the post
    const alreadyliked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString())
    //this would check for the user in likes array in the model (i.e if the user has liked the post)
    //then pull the ID from the like array and set isliked in the Model to false 
    if (alreadyliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        res.json(blog)
    }
   
    //this would check for the user in the likes Array in the model(i.e if user has liked the post)
    //then pull the ID from the likes array and set isLiked in the model to false
    //(user would neither like nor dislike blogpost)
    if (isDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        res.json(blog)
    } 

    //this would would push the user ID to the likes Array in the model making the user like the post
    else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        }, { new: true });
        res.json(blog)
    }
});


const updateBlog = asyncHandler(async(req, res)=> {
    const { id }= req.params
    validateMongoDbID(id)
    try{
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updatedBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async(req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id)
    try{
    const deletedBlog = await Blog.findOneAndDelete(id)
    res.json(deletedBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

module.exports = { createBlog, updateBlog, getAllBlogs, getBlog, deleteBlog, likeBlogPost, disLikeBlogPost }