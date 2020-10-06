const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    contact: {
      type: Number,
      validate: {
        validator: function (value) {
          return /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(
            value
          );
        },
        message: (props) => `${props.value} is a not valid phone number.`,
      },
    },
    college: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    branch: {
      type: String,
      trim: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    resetPasswordLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    // create a temporary variable called _password
    this._password = password;

    // generate salt
    this.salt = this.makeSalt();

    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })

  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() + Math.random()) + "";
  },
};

module.exports = mongoose.model("User", userSchema);
