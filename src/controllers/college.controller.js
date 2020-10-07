const College = require("../models/college.model");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
//Custom error handler for database errors
const { errorHandler } = require("../helpers/dbErrorHandling");

exports.createCollegeController = (req, res) => {
  const { name, collegeID } = req.body;

  const college = new College({ name, collegeID });
  college.save((err, college) => {
    if (err || !college) {
      return res.status(500).json({
        errorDetails: errorHandler(err),
      });
    } else {
      return res.status(200).json({
        college,
      });
    }
  });
};

exports.getAllCollegesController = (req, res) => {
  College.find({}).exec((err, data) => {
    if (err || !data) {
      res.status(500).json({
        errorDetails: "We encountered some problem. We'll get back soon.",
      });
    } else {
      res.status(200).json(data);
    }
  });
};

exports.getCollegeController = (req, res) => {
  let collegeID = req.params.collegeID;
  College.find({ collegeID }).exec((err, data) => {
    if (err || !data) {
      res.status(500).json({
        errorDetails: "We encountered some problem. We'll get back soon.",
      });
    } else {
      res.status(200).json(data);
    }
  });
};

exports.updateCollegeController = (req, res) => {
  let collegeID = req.params.collegeID;
  const { review } = req.body;
  const token = req.headers.authorization.split(" "); // extracting token from header
  const { _id } = jwt.decode(token[1]); // decoding _id from token
  User.findOne({ _id }).exec((err, user) => {
    if (err || !user) {
      return res.status(500).json({
        errorDetails: "We encountered some problem. We'll get back soon.",
      });
    } else {
      let username = user.name;
      College.findOne({ collegeID }).exec((err, college) => {
        if (err || !college) {
          return res.status(500).json({
            errorDetails: "We encountered some problem. We'll get back soon.",
          });
        } else {
          college.reviews.push({
            review: review,
            postedBy: username,
          });
          college.save((err, data) => {
            // trying to save updated fields in database
            if (err) {
              // if error
              res
                .status(400)
                .json({ errorDetails: "We could not add your review." });
            } else {
              // if no error
              res.status(200).json(data);
            }
          });
        }
      });
    }
  });
};

exports.deleteCollegeController = (req, res) => {
  let collegeID = req.params.collegeID;
  College.findOneAndRemove({ collegeID }).exec((err, data) => {
    if (err || !data) {
      return res.status(500).json({
        errorDetails: "We were unable to delete that college.",
      });
    } else {
      res
        .status(200)
        .json({ responseData: "College has been deleted successfully." });
    }
  });
};

exports.reviewDeleteController = (req, res) => {
  if (!req.query.id || !req.params.collegeID) {
    return res
      .status(404)
      .json({ errorDetails: "We could not find any review." });
  } else {
    let collegeID = req.params.collegeID;
    let reviewID = req.query.id;
    College.updateOne(
      { collegeID: collegeID },
      { $pull: { reviews: { _id: reviewID } } },
      { safe: true, multi: true },
      (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ errorDetails: "We were unable to remove that review." });
        } else {
          res.status(200).json({responseData:"Review has been deleted."});
        }
      }
    );
  }
};
