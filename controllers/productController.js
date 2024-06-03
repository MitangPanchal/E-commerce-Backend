const productModel = require("../models/products");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

// Create New Product

exports.createProduct = catchAsyncError(async (req, res, next) => {

  req.body.user=req.user.user._id;
  let product = await productModel.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});


// Get All Products

exports.getAllProducts = catchAsyncError(async (req, res, next) => {

  const resultPerPage=1;
  const productCount=await productModel.countDocuments();

  const apiFeature=new ApiFeatures(productModel.find(),req.query).search().filter().pagination(resultPerPage);

  let products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage
  });
});

// Update Product

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params._id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product Not Found",
    });
  }

  product = await productModel.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params._id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  let deletedProduct = await productModel.deleteOne(product);

  res.status(200).json({
    success: true,
    message: "Product Deleted Succesfully",
  });
});

// Specific Product Details

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params._id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});


exports.createProductReview=catchAsyncError(async(req,res,next)=>{

  const{rating,comment,productId}=req.body;

  const review={
    user:req.user.user._id,
    name:req.user.user.name,
    rating:Number(rating),
    comment
  }

  const product=await productModel.findById(productId);

  const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user.user._id)

  if(isReviewed){
    product.reviews.forEach(rev=>{
      if(rev=>rev.user.toString()===req.user.user._id){
        rev.rating=rating,
        rev.comment=comment
      }
    })
  }   
  else{
    product.reviews.push(review)
    product.numOfReviews=product.reviews.length
  }

  let avg=0
  product.ratings=product.reviews.forEach((rev)=>{
    avg=avg+rev.rating
  }) 

  product.ratings=avg/product.reviews.length

  await product.save();

  res.status(200).json({
    success:true
  })

})

// Get All Reviews Of Product

exports.getProductReviews=catchAsyncError(async(req,res,next)=>{
  const product=await productModel.findById(req.query._id)

  if(!product){
    return next(ErrorHandler("Product Not Found",400))
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})

// delete review

exports.deleteReview=catchAsyncError(async(req,res,next)=>{
  const product=await productModel.findById(req.query.productId)

  if(!product){
    return next(ErrorHandler("Product Not Found",400))
  }

  const reviews =product.reviews.filter(rev=>rev._id.toString()!=req.query._id.toString());

  let avg=0
  reviews.forEach((rev)=>{
    avg=avg+rev.rating
  }) 

  const ratings=avg/reviews.length;

  const numOfReviews=reviews.length;

  await productModel.findByIdAndUpdate(req.query.productId,{
    reviews,ratings,numOfReviews
  },{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })

  

  res.status(200).json({
    success:true,
  })

})