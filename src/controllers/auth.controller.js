const User = require("../models/users.model");
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

// exports.signupController = (req, res) => {
//   const {
//     name,
//     email,
//     contact,
//     college,
//     category,
//     batch,
//     branch,
//     password,
//     confirmPassword,
//   } = req.body;

//   User.findOne({
//     email,
//   }).exec((err, user) => {
//     //If user exists
//     if (user) {
//       return res.status(403).json({
//         errorDetails: "User already exists",
//       });
//     }
//   });
//   // save to db
//   const user = new User({
//     name,
//     email,
//     contact,
//     college,
//     category,
//     batch,
//     branch,
//     password,
//   });
//   user.save((err, user) => {
//     if (err || !user) {
//       return res.status(500).json({
//         errorDetails: errorHandler(err),
//       });
//     } else {
//       return res.status(200).json({
//         responseData: "User details saved",
//         user,
//       });
//     }
//   });

//   //Generate token and send to client
//   const token = jwt.sign(
//     {
//       email,
//     },
//     process.env.JWT_ACCOUNT_ACTIVATION,
//     {
//       expiresIn: "30m",
//     }
//   );

//   //Mail details here
//   let mailDetails = {
//     from: "Navprayas <navprayas@do_not_reply.com>",
//     to: email,
//     subject: "Email Verification - Navprayas",
//     html: `
//                   <p>Hello ${name},</p>
//                   <p>Thank you for signing up on <a href="https://navprayas.in">Navprayas</a>.</p>
//                   <p>In order to activate your Navprayas account, we need to verify your email address. Please use the below link to confirm your email address and complete the signup process.<p>
//                   <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
//                   <br>
//                   <p>Thanks and regards<br>Navprayas<br>(A Group of Innovative Thoughts)</p>
//               `,
//   };

//   // send email from here
//   mailTransporter.sendMail(mailDetails, function (err, data) {
//     if (err) {
//       return res.status(451).json({
//         errorDetails: errorHandler(err),
//       });
//     } else {
//       return res.status(250).json({
//         responseData: `Please follow the account activation instructions sent to ${email}.`,
//       });
//     }
//   });
// };

// // Activation and save to db
// exports.activationController = (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     const { email } = jwt.decode(token);
//     //Verify the token if valid or not or expired
//     jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
//       if (err) {
//         User.findOneAndDelete({ email }).exec((err, data) => {
//           if (err || !data) {
//             return res
//               .status(404)
//               .json({ errorDetails: "No such user found." });
//           } else {
//             return res.status(500).json({
//               errorDetails: "Link expired. Please signup again.",
//             });
//           }
//         });
//       } else {
//         //if valid, save to database
//         //Get email and password from token

//         User.findOne({ email }).exec((err, user) => {
//           if (err || !user) {
//             res
//               .status(404)
//               .json({ errorDetails: "We were unable to find your details." });
//           } else {
//             user.emailVerified = true;
//             user.save((err, data) => {
//               if (err) {
//                 console.log("Save error", errorHandler(err));
//                 return res.status(500).json({
//                   errorDetails: errorHandler(err),
//                 });
//               } else {
//                 return res.status(200).json({
//                   responseData: "Signup success",
//                   data,
//                 });
//               }
//             });
//           }
//         });
//       }
//     });
//   } else {
//     return res.status(500).json({
//       errorDetails: "Something went wrong. Please try again",
//     });
//   }
// };

exports.signupController = (req, res) => {
  const {
    name,
    email,
    contact,
    college,
    category,
    batch,
    branch,
    password,
    confirmPassword,
  } = req.body;

  // save to db
  const user = new User({
    name,
    email,
    contact,
    college,
    category,
    batch,
    branch,
    password,
  });
  user.emailVerified = true;
  user.save((err, user) => {
    if (err || !user) {
      return res.status(500).json({
        errorDetails: errorHandler(err),
      });
    } else {
      return res.status(200).json({
        user,
      });
    }
  });

  let firstName = name.split(" ")[0];

  //Mail details here
  let mailDetails = {
    from: "Navprayas <navprayas@do_not_reply.com>",
    to: email,
    subject: "Login Credentials - Navprayas",
    html: `
                  <p>Hello ${firstName},</p>
                  <br>
                  <p>We want to inform you that we have successfully signed you up on our <strong>Alumni Forum</strong> at <a href="https://navprayas.in">Navprayas</a>.</p>
                  <p>Your login credentials are given below :<p>
                  <br>
                  <ul>
                    <li> Email ID : <strong>${email}</strong> </li>
                    <li> Password : <strong>${password}<strong> </li>
                  </ul>
                  <p>Feel free to change your password anytime after logging in.</p>
                  <br>
                  <p>Thank you for your enormous support in these years. We owe you.</p>
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

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        errorDetails: "User doesn't exist.",
      });
    }
    // check if user is verified
    if (user.emailVerified) {
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(401).json({
          errorDetails: "Incorrect email or password",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("token", token, { expiresIn: "7d" });
      const {
        _id,
        name,
        email,
        contact,
        college,
        category,
        batch,
        branch,
      } = user;

      return res.status(200).json({
        token,
        user: {
          _id,
          name,
          email,
          contact,
          college,
          category,
          batch,
          branch,
        },
      });
    } else {
      return res
        .status(400)
        .json({ errorDetails: "Your account is not activated yet." });
    }
  });
};

exports.logoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out!" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["RS256"], // req.user._id
});

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          errorDetails: "User does not exist",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
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
                      <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                      <br>
                      <p>Thanks and regards<br>Navprayas<br>(A Group of Innovative Thoughts)</p>
                  `,
      };

      return user.updateOne(
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

exports.resetPasswordController = (req, res) => {
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

      User.findOne(
        {
          resetPasswordLink,
        },
        (err, user) => {
          if (err || !user) {
            return res.status(500).json({
              errorDetails: "Something went wrong. Try later",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
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

exports.passwordController = (req, res) => {
  const token = req.headers.authorization.split(" "); // extracting token from header
  const { _id } = jwt.decode(token[1]); // decoding _id from token
  const { oldPassword, newchangePassword, confirmchangePassword } = req.body; //get oldPassword, newchangePassword, confirmchangePassword from the body
  // if no error
  User.findOne({ _id }).exec((err, user) => {
    // search for user in database
    if (err || !user) {
      // if no user
      return res.status(404).json({ errorDetails: "User doesn't exist." });
    } else {
      // if user exists
      if (!user.authenticate(oldPassword)) {
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
          user = _.extend(user, updatedFields);
          user.save((err, result) => {
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

exports.deletionController = (req, res) => {
  const token = req.headers.authorization.split(" "); // extracting token from header
  const { _id } = jwt.decode(token[1]); // decoding _id from token
  User.findByIdAndRemove({ _id }).exec((err, data) => {
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
