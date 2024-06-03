const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require('crypto');
const catchAsyncError = require("../middleware/catchAsyncError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Your Name Length Is More Than 30 Figure"],
    minLength: [2, "Your Name must be greater than 2 words"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Your Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
    minLength: [8, "Password Should Be Greater Than 8 Char"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  cart:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product'
  }],
  resetPasswordToken: String,
  resetpasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// userSchema.method.getJETToken=function(){
//     return jwt.sign({id:this._id},process.env.JWT_SECRET,{
//         expiresIn:"30d"
//     })
// }

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// Forgot Password 

userSchema.methods.getResetPasswordToken=async function (){

  // Generating Token
  const resetToken=crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

  this.resetpasswordExpire=Date.now()+15*60*1000;

  return resetToken;

}



module.exports = mongoose.model("User", userSchema);
