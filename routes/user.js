const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getParticularUser,
  updateProfileRole,
  deleteUser,
  addToCart,
  getcart,
  removeCart,
} = require("../controllers/userController");
const router = express.Router();

let { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

router
  .route("/admin/user/:_id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getParticularUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProfileRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);


router.post("/addTocart",isAuthenticatedUser,addToCart);

router.get("/getcart",isAuthenticatedUser,getcart);

router.post("/removecart",isAuthenticatedUser,removeCart)

module.exports = router;
