const Forum = require("../models/forum.model");
const College = require("../models/college.model");
const Tag = require("../models/tag.model");
const User = require("../models/users.model");
const formidable = require("formidable");
const slugify = require("slugify");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
//Custom error handler for database errors
const { errorHandler } = require("../helpers/dbErrorHandling");

// Create Question
exports.createQuestionController = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(500).json({ errorDetails: "Something went wrong." });
    }
    const { question, college, tags } = fields;

    if (!question) {
      return res.status(400).json({
          errorDetails: 'Question is required'
      });
  }

    // Question
    const ques = new Forum({ question: question });

    // College and Tags Arrays
    let arrayCollege = college && college.split(",");
    let arrayTags = tags && tags.split(",");

    ques.save((err, result) => {
      if (err) {
        return res.status(500).json({ errorDetails: errorHandler(err) });
      }
      console.log("Result ", result._id);

      // Find Question and Update the colleges and tags
      Forum.findByIdAndUpdate(
        result._id,
        { $push: { college: arrayCollege } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          console.log("Error 2 : ", err);
          res.status(500).json({ errorDetails: errorHandler(err) });
        } else {
          Forum.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              console.log("Error 3 : ", err);
              res.status(500).json({ errorDetails: errorHandler(err) });
            } else {
              console.log(result);
              return res.json(result);
            }
          });
        }
      });
    });
  });
};

exports.listQuestionController = (req, res) => {
  Forum.find({})
    .populate("college", "_id name collegeID")
    .populate("tags", "_id name slug")
    .select("_id question college tags answers createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({ errorDetails: errorHandler(err) });
      } else if (data === null) {
        res.status(404).json("We have no such question our forum.");
      } else {
        res.json(data);
      }
    });
};

exports.getQuestionController = (req, res) => {
  const qid = req.params.qid;
  Forum.findOne({ _id: qid })
    .populate("college", "_id name collegeID")
    .populate("tags", "_id name slug")
    .select("_id question college tags answers createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          errorDetails: errorHandler(err),
        });
      } else if (data === null) {
        res.status(404).json("We have no such question our forum.");
      } else {
        res.json(data);
      }
    });
};

exports.removeQuestionController = (req, res) => {
  const qid = req.params.qid;
  Forum.findOneAndRemove({ _id: qid }).exec((err, data) => {
    if (err) {
      return res.status(500).json({ errorDetails: errorHandler(err) });
    } else if (data === null) {
      res.status(404).json({ errorDetails: "We were unable to find that question." });
    } else {
      res.status(200).json({ responseData: "Question deleted successfully." });
    }
  });
};

exports.updateQuestionController = (req, res) => {
  const qid = req.params.qid;
  const { answer } = req.body;
  const token = req.headers.authorization.split(" "); // extracting token from header
  const { _id } = jwt.decode(token[1]); // decoding _id from token
  User.findOne({ _id }).exec((err, user) => {
    if (err || !user) {
      return res.status(500).json({
        errorDetails: "We encountered some problem. We'll get back soon.",
      });
    } else {
      let username = user.name;

      Forum.findOne({ _id: qid }).exec((err, question) => {
        if (err || !question) {
          return res.status(500).json({ errorDetails: errorHandler(err) });
        } else {
          question.answers.push({
            answer: answer,
            answeredBy: username,
          });
          question.save((err, data) => {
            if (err) {
              res
                .status(400)
                .json({ errorDetails: "We could not add your answer." });
            } else {
              res.status(200).json(data);
            }
          });
        }
      });
    }
  });
};
