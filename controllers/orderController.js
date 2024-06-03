let orderModel = require("../models/orders");
let productModel = require("../models/products");
let catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
let userModel = require("../models/users");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    address,
    city,
    state,
    pincode,
    country,
    phoneNo,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderItems
  } = req.body;

  const order = await orderModel.create({
    address,
    city,
    state,
    country,
    pincode,
    phoneNo,
    orderItems,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//   get single order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params._id)
    .populate("user", "name email");

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user.user._id)
  const orders = await orderModel.find({ user: req.user.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params._id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliverdAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(_id, quantity) {
    const product = await productModel.findById(_id);
  
    product.stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }



  // Delete Order

  exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await orderModel.findByIdAndDelete(req.params._id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
  
    res.status(200).json({
      success: true,
    });
  });