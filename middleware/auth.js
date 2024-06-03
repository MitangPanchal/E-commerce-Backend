const { getUser } = require("../service/auth");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  let token = req.cookies?.uid;

  if (!token) {
    return res.send("Please Login")
  }

  let user = getUser(token);

  req.user = user;

  // console.log(req.user)
  next();
});

exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user.role)) {
      return next(new ErrorHandler(`UnAuthorized`, 403));
    }
    next();
  };
};
