// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel.js");
const  {createError}  = require ("../utils/error.js");

// const protect = async (req, res, next) => {

//   try {
//     let token;

//   if (
//     //send token to headers
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
      
//       token = req.headers.authorization.split(" ")[1];

//       //decodes token id
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       return next();
//     } catch (error) {
//       return next(createError(401, "Not authorized, token failed"));
//     }
//   }

//   if (!token) {
//     return next(createError(401, "Not authorized, no token"));
//   }
// };

// module.exports = { protect };
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
// const asyncHandler = require("express-async-handler");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return next(createError(401, "You are not authorized, token failed"));
    }
  }

  // if (!token) {
  //   return next(createError(401, "You are not authorized, no token"));
  // }
};

module.exports = { protect };