const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const userModel = require("../models/users");
const productModel=require('../models/products');

const { setUser } = require("../service/auth");

const sendEmail=require('../utils/sendEmail');

const crypto =require('crypto');

// Register User

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is sample id",
      url: "Sample URL",
    },
  });

  let token = setUser(user);

  res.cookie("uid", token);

  res.status(201).json({
    success: true,
    user,
    token,
  });
});

// Login User

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password", 400));
  }

  let user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    // return next(new ErrorHandler("Invalid Email Or Password",400));
    return res.send("Invalid Email")
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    // return next(new ErrorHandler("Invalid Email Or Password",400));
    return res.status(400).json({
      success:false,
      message:"Invalid Email"
    })

  }

  let token = setUser(user);

  res.cookie("uid", token, {
    expires: new Date(Date.now() + 1000 * 60000),
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    user,
    token,
  });
});

// Logout User

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("uid", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite:"lax"
  });

  res.status(200).json({
    success: true,
    message: "Logout SuccessFully",
  });
});


// Forgot password

exports.forgotPassword=catchAsyncError(async (req,res,next)=>{

  const user=await userModel.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler("User Not Found",404));
  }

  // Get Reset Password token

  const resetToken= await user.getResetPasswordToken();
  await user.save();

  const resetPasswordUrl=`http://localhost/password/reset/${resetToken}`;

  const message=`Yor password reset token is : \n\n ${resetPasswordUrl}`;

  try{

    await sendEmail({
      email:user.email,
      subject:'Mitang Password recovery',
      message
    });

    res.status(200).json({
      success:true,
      message:`email send to user successfully to ${user.email}`

    })

  }
  catch(error){
    user.resetPasswordToken=undefined;
    user.resetpasswordExpire=undefined;

    await user.save({validateBeforeSave:false})

    return next(new ErrorHandler(error.message,500))
  }
})


// Reset Password
exports.resetPassword=catchAsyncError(async(req,res,next)=>{
  
  const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user=await userModel.findOne({
    resetPasswordToken,
    resetpasswordExpire:{$gt:Date.now()},
  })

  if(!user){
    return next(new ErrorHandler("Reset Password Token Is Invalid",400));
  }

  if(req.body.password!==req.body.confirmPassword){
    return next(new ErrorHandler("Password Does Not Match",400));
  }

  user.password=req.body.password;
  user.resetPasswordToken=undefined;
  user.resetpasswordExpire=undefined;

  await user.save();

  let token=setUser(user);

  res.cookie("uid", token, {
    expires: new Date(Date.now() + 1000 * 60000),
    httpOnly: true,
    sameSite: "lax",
  });
})


// get user details

exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
  let user=await userModel.findById(req.user.user._id);

  if(!user){
    return res.json({
      success:false,
      message:"User not Found"
    })
  }

  res.status(200).json({
    success:true,
    user
  })

})


// Update Password

exports.updatePassword=catchAsyncError(async(req,res,next)=>{
  let user=await userModel.findById(req.user.user._id).select("+password");

  let isPasswordMatched=await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new ErrorHandler("Old Password is Incorrect",400));

  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password Not Match",400))
  }

  user.password=req.body.newPassword;

  await user.save();

  let token=setUser(user)

  res.cookie("uid", token, {
    expires: new Date(Date.now() + 1000 * 60000),
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success:true,
    user
  })

})


// Update Profile

exports.updateProfile=catchAsyncError(async(req,res,next)=>{
  // let user=await userModel.findById(req.user.user._id)


  let user=await userModel.findOneAndUpdate({_id:req.user.user._id},{"$set": {name:req.body.name,email:req.body.email}}); 


  res.status(200).json({
    success:true,
  })

})


// Admin get all user

exports.getAllUsers=catchAsyncError(async(req,res,next)=>{

  let users=await userModel.find();

  res.status(200).json({
    success:true,
    users
  })
});

// Admin get particular user

exports.getParticularUser=catchAsyncError(async(req,res,next)=>{
  let user=await userModel.findOne({_id:req.params._id});

  if(!user){
    return next(new ErrorHandler("User Not Found",404));
  }

  res.status(200).json({
    success:true,
    user
  })
})


// Update Role

exports.updateProfileRole=catchAsyncError(async(req,res,next)=>{
  // let user=await userModel.findById(req.user.user._id)

  let user=await userModel.findOneAndUpdate({_id:req.params._id},{"$set": {role:req.body.role}}); 


  res.status(200).json({
    success:true,
    user
  })

})

exports.deleteUser=catchAsyncError(async(req,res,next)=>{

  let user=await userModel.findByIdAndDelete(req.params._id);

  if(!user){
    return next(new ErrorHandler("User Not Found",404));
  }
  res.status(200).json({
    success:true,
  })
})


// Create Review



// Add to cart

exports.addToCart=catchAsyncError(async(req,res)=>{
  let {product_id}=req.body
  console.log(product_id)
  let user=await userModel.findById(req.user.user._id);
  user.cart.push(product_id)
  await user.save();
  res.send(user)
})


// get cart details
exports.getcart=catchAsyncError(async(req,res)=>{
  let data=await userModel.findById(req.user.user._id).populate('cart')
  // console.log(data)
  res.status(200).json({
    success:true,
    data,
    cart:data.cart
  })
})

// remove from cart
exports.removeCart=catchAsyncError(async(req,res)=>{
  let {i}=req.body
  let user=await userModel.findById(req.user.user._id)

  user.cart.splice(i,1)
  await user.save();

  res.send(user)
})


