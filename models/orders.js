let mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  orderItems: [
   {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product'
   }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    res: "User",
  },
//   paymentInfo: {
//     id: {
//       type: String,
//     },
//     status: {
//       type: String,
//     },
//   },
//   paidAt: {
//     type: Date,
//     required: true,
//   },
//   itemsPrice: {
//     type: Number,
//     default: 0,
//   },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    default: "Processing",
  },
  deliverdAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
