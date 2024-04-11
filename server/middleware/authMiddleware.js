const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");


const protect = async (req, res, next) => {
  let token;

  if (
    //send token to headers
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
      return next(createError(401, "Not authorized, token failed"));
    }
  }

  if (!token) {
    return next(createError(401, "Not authorized, no token"));
  }
};

module.exports = { protect };
