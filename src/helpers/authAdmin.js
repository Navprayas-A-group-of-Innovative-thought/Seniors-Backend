// Imports here
const Admin = require("../models/admin.model");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

// Middleware to check if the user is admin or not
exports.authAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" "); // extracting token from header
    const { _id } = jwt.decode(token[1]); // decoding _id from token
    Admin.findOne({ _id }).exec((err, admin) => {
      // searching for user in db
      if (err || !admin) {
        // if user not found
        return res.status(404).json({
          errorDetails: "User doesn't exist.",
        });
      } else {
        // check if user is admin or not
        if (admin.isAdmin === false)
          return res.status(403).json({
            errorDetails: "You are not an admin.",
          });
        else {
          next();
        }
      }
    });
  } catch (e) {
    return res.status(401).json({
      errorDetails: "You are not an admin.",
    });
  }
};
