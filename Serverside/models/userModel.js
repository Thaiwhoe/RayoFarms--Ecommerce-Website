const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const saltRounds = 10;
const crypto = require('crypto')

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
        type: String,
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
    address:{
        type: String,
    },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken:{
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},{timestamps: true });


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSaltSync(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.isPasswordMatched = async function (passwordInputed){
    return await bcrypt.compare(passwordInputed, this.password)
}

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() +30 * 60 * 1000;//That is 10 minutes
    return resetToken;
}

//Export the model
module.exports = mongoose.model('User', userSchema);