const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel")
const asyncHandler = require('express-async-handler');
const validateMongoDbID = require("../utils/validateMongoDBid");
const generateRefreshToken = require("../config/refreshToken");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')


//Create Users
const createUser = asyncHandler (async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        //Create new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else{
        //User already exist
        throw new Error("User Already Exist")
    }
});


//Login a user
const loginUser = asyncHandler(async(req, res)=> {
    const { email, password } = req.body;
    //Check if user exists
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, { 
            refreshToken: refreshToken,
        },{ new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),

        })
    }
    else{
        throw new Error("Invalid Credentials")
    }
})

//Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No refresh Token present in DB or not matched')
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error('There is something wrong with refresh token')
        } 
        const accessToken = generateToken(user?._id)
        res.json({accessToken})
    })
})

//logout function
const logOut = asyncHandler(async (req, res)=> {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh token in Cookies")
    const refreshTokened = cookie.refreshToken;
    const user = await User.findOne({ refreshTokened });
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true, 
        });
        return res.sendStatus(204); //Forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: " ",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true, 
    });
    res.sendStatus(204); //Forbidden

})

//Get all users
const getAllUsers = asyncHandler(async (req, res)=>{
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    }
    catch (error) {
        throw new Error(error)
    }
})

//Get a user
const getUser = asyncHandler(async (req, res) => {
    const { id } =req.params;
    validateMongoDbID(id)
    try{
        const getaUser = await User.findById(id)
        res.json({
            getaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

//Delete a User
const deleteUser = asyncHandler(async (req, res)=> {
    const { id } = req.params;
    validateMongoDbID(id);

    try{
        const deleteUser = await User.findByIdAndDelete(id)
        res.json({
            deleteUser
        })
    } catch(error) {
        throw new Error(error)
    }
})

//Update A User
const updateaUser = asyncHandler(async(req, res)=> {
    const { _id } = req.user;
    validateMongoDbID(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName: req?.body?.firstName,
            lastname: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, { new: true });
        res.json({
            updatedUser
        })
    }
    catch(error){
        throw new Error(error)
    }
})

//Admin Block a user
const blockUser = asyncHandler(async(req, res)=> {
    const {id} = req.params;
    validateMongoDbID(id)

    try{
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        })
        res.json({
            message: "User blocked",
        })
    } catch(error){
        throw new Error(error);
    }
})

//Admin unBlock a user
const unblockUser = asyncHandler(async(req, res)=> {
    const { id } = req.params
    validateMongoDbID(id)

    try{
        const unBlock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        })
        res.json({
            message: "User unblocked",
        })
    } catch(error){
        throw new Error(error)
    }
})



module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    deleteUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logOut,
} 