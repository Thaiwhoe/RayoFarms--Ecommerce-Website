const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const saltRounds = 10;

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "user"
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    cart:{
        type: Array,
        default: [],
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken:{
        type: String,
    }
},{timestamps: true });


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSaltSync(saltRounds);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function (passwordInputed){
    return await bcrypt.compare(passwordInputed, this.password)
}
//Export the model
module.exports = mongoose.model('User', userSchema);