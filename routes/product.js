const express=require('express');
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, getProductReviews, deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser,authorizedRoles } = require('../middleware/auth');
const { createProductReview } = require('../controllers/productController');
const router=express();

router.route("/products").get(getAllProducts);

router.route("/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),createProduct);

router.route("/product/:_id").put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct);

router.route("/product/:_id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct);

router.route("/product/:_id").get(isAuthenticatedUser,getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview)

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReview)

module.exports=router;
