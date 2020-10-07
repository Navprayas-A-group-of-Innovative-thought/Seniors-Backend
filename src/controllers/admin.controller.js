const Admin = require("../models/admin.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
//Custom error handler for database errors
const { errorHandler } = require("../helpers/dbErrorHandling");
//Using nodemailer to send verification mails
const nodemailer = require("nodemailer");

//Configuring nodemailer
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.adminSignupController = (req, res) => {
  const { name, email, contact, password, confirmPassword } = req.body;

  // save to db
  const admin = new Admin({
    name,
    email,
    contact,
    password,
  });
  admin.emailVerified = true;
  admin.save((err, admin) => {
    if (err || !admin) {
      return res.status(500).json({
        errorDetails: errorHandler(err),
      });
    } else {
      return res.status(200).json({
        admin,
      });
    }
  });

  let firstName = name.split(" ")[0];

  //Mail details here
  let mailDetails = {
    from: "Navprayas <navprayas@do_not_reply.com>",
    to: email,
    subject: "Admin Login Credentials - Navprayas",
    html: `
                    <p>Hello ${firstName},</p>
                    <p>We want to inform you that you are now an Admin on our <strong>Alumni Forum</strong> at <a href="https://navprayas.in">Navprayas</a>.</p>
                    <p>Your login credentials are given below :<p>
                    <ul>
                      <li> Email ID : <strong>${email}</strong> </li>
                      <li> Password : <strong>${password}<strong> </li>
                    </ul>
                    <p>Feel free to change your password anytime after logging in.</p>
                    <br>
                    <p>If there is any mistake, feel free to contact <a href="https://navprayas.in">Navprayas</a>.</p>
                    <br>
                    <p>Thanks and regards<br>Navprayas<br>(A Group of Innovative Thoughts)</p>
                `,
  };

  // send email from here
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      return res.status(451).json({
        errorDetails: errorHandler(err),
      });
    } else {
      return res.status(250).json({
        responseData: `Login credentials successfully sent to ${email}.`,
      });
    }
  });
};

exports.adminLoginController = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  Admin.findOne({ email }).exec((err, admin) => {
    if (err || !admin) {
      return res.status(404).json({
        errorDetails: "User doesn't exist.",
      });
    }
    // check if user is verified
    if (admin.emailVerified && admin.isAdmin) {
      // authenticate
      if (!admin.authenticate(password)) {
        return res.status(401).json({
          errorDetails: "Incorrect email or password",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: admin._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("token", token, { expiresIn: "7d" });
      const { _id, name, email, contact } = admin;

      return res.status(200).json({
        token,
        admin: {
          _id,
          name,
          email,
          contact,
        },
      });
    } else {
      return res.status(400).json({
        errorDetails:
          "Your account is not activated yet or you are not an admin.",
      });
    }
  });
};

exports.adminLogoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out!" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["RS256"], // req.user._id
});

exports.adminForgotPasswordController = (req, res) => {
  const { email } = req.body;
  Admin.findOne(
    {
      email,
    },
    (err, admin) => {
      if (err || !admin) {
        return res.status(404).json({
          errorDetails: "User does not exist",
        });
      }

      const token = jwt.sign(
        {
          _id: admin._id,
          email,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: "10m",
        }
      );

      let mailDetails = {
        from: "Navprayas <navprayas@do_not_reply.com>",
        to: email,
        subject: `Password Reset Link - Navprayas`,
        html: `
                        <p>Hello ,</p>
                        <p>It's common to forget our password. Don't worry, we at <a href="http://navprayas.in">Navprayas</a> are here to assist you..</p>
                        <p>In order to reset your Navprayas account password, we need to verify if it's nobody but you trying to reset your password. Please use the below link to confirm your email address and complete the reset password process.<p>
                        <p>${process.env.CLIENT_URL}/admin/password/reset/${token}</p>
                        <br>
                        <p>Thanks and regards<br>Navprayas<br>(A Group of Innovative Thoughts)</p>
                    `,
      };

      return admin.updateOne(
        {
          resetPasswordLink: token,
        },
        (err, success) => {
          if (err) {
            return res.status(500).json({
              errorDetails:
                "Something went wrong while processing your request.",
            });
          } else {
            // send email from here
            mailTransporter.sendMail(mailDetails, function (err, data) {
              if (err) {
                return res.status(451).json({
                  errorDetails: errorHandler(err),
                });
              } else {
                return res.status(250).json({
                  responseData: `Please follow the account activation instructions sent to ${email}.`,
                });
              }
            });
          }
        }
      );
    }
  );
};

exports.adminResetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(410).json({
          errorDetails: "Expired link. Try again",
        });
      }

      Admin.findOne(
        {
          resetPasswordLink,
        },
        (err, admin) => {
          if (err || !admin) {
            return res.status(500).json({
              errorDetails: "Something went wrong. Try later",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          admin = _.extend(admin, updatedFields);

          admin.save((err, result) => {
            if (err) {
              return res.status(400).json({
                errorDetails: "Error resetting user password",
              });
            }
            res.status(200).json({
              responseData: `Great! Now you can login with your new password`,
            });
          });
        }
      );
    });
  }
};

exports.adminPasswordController = (req, res) => {
  const token = req.headers.authorization.split(" "); // extracting token from header
  const { _id } = jwt.decode(token[1]); // decoding _id from token
  const { oldPassword, newchangePassword, confirmchangePassword } = req.body; //get oldPassword, newchangePassword, confirmchangePassword from the body
  // if no error
  Admin.findOne({ _id }).exec((err, admin) => {
    // search for user in database
    if (err || !admin) {
      // if no user
      return res.status(404).json({ errorDetails: "User doesn't exist." });
    } else {
      // if user exists
      if (!admin.authenticate(oldPassword)) {
        // compare oldPassword with the password in database
        return res.status(401).json({
          errorDetails: "Incorrect old password",
        });
      } else {
        // check if password and confirm password is same
        if (newchangePassword == confirmchangePassword) {
          // if same, update the password
          const updatedFields = {
            password: newchangePassword,
          };
          admin = _.extend(admin, updatedFields);
          admin.save((err, result) => {
            // trying to save updated fields in database
            if (err) {
              // if error
              res.status(400).json({ errorDetails: "Error changing password" });
            } else {
              // if no error
              res
                .status(200)
                .json({ responseData: "Password changed successfully" });
            }
          });
        } else {
          // if password and confirm password don't match
          res.status(400).json({
            errorDetails: "Confrim Password doesn't match with New Password.",
          });
        }
      }
    }
  });
};

exports.adminDeletionController = (req, res) => {
  const token = req.headers.authorization.split(" "); // extracting token from header
  const { _id } = jwt.decode(token[1]); // decoding _id from token
  Admin.findByIdAndRemove({ _id }).exec((err, data) => {
    if (err || !data) {
      res
        .status(500)
        .json({ errorDetails: "We could not process your request." });
    } else {
      res.clearCookie("token")
      res.status(200).json({ responseData: "Account deleted successfully." });
    }
  });
};
