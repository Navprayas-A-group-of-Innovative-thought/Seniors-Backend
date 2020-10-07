const Tag = require("../models/tag.model");
const slugify = require("slugify");
//Custom error handler for database errors
const { errorHandler } = require("../helpers/dbErrorHandling");

exports.createTagController = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  let tag = new Tag({ name, slug });
  tag.save((err, data) => {
    if (err) {
      return res.status(500).json({ errorDetails: errorHandler(err) });
    }
    res.status(200).json(data);
  });
};

exports.listTagController = (req, res) => {
  Tag.find({}).exec((err, data) => {
    if (err) {
      return res.status(500).json({ errorDetails: errorHandler(err) });
    }
    res.status(200).json(data);
  });
};

exports.readTagController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Tag.findOne({ slug }).exec((err, tag) => {
    if (err) {
      return res.status(500).json({ errorDetails: errorHandler(err) });
    } else if (tag === null) {
      res.status(404).json({ errorDetails: "We were unable to find that tag." });
    } else {
      res.status(200).json(tag);
    }
  });
};

exports.removeTagController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Tag.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(500).json({ errorDetails: errorHandler(err) });
    } else if (data === null) {
      res.status(404).json({ errorDetails: "We were unable to find that tag." });
    } else {
      res.status(200).json({ reponseData: "Tag deleted successfully!" });
    }
  });
};
