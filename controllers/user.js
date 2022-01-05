require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createToken = (userRole, username, userID) => {
  return jwt.sign(
    { admin: userRole, username: username, userID: userID },
    process.env.ACCESS_TOKEN_SECRET
  );
};

exports.getUsers = (req, res) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            User.find()
              .then((result) => {
                res.status(200).json({
                  result,
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: err.message,
                });
              });
          } else {
            res.status(200).json({
              message: "You are not allowed to add users. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};

exports.signup = (req, res, next) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            User.find({ username: req.body.username })
              .then((result) => {
                if (result.length < 1) {
                  bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                      res.status(404).json({
                        message: err.message,
                      });
                    } else {
                      const newUser = new User({
                        fullname: req.body.fullname,
                        username: req.body.username,
                        password: hash,
                        admin: req.body.admin,
                      });

                      newUser
                        .save()
                        .then((result) => {
                          console.log(result);
                          const fullname = result.fullname;
                          const userID = result._id;
                          const username = result.username;
                          const userRole = result.admin;
                          const token = createToken(userRole, username, userID);
                          console.log("id", userID);
                          console.log(userRole);
                          console.log(token);
                          res.status(200).json({
                            result,
                          });
                        })
                        .catch((err) => {
                          res.status(404).json({
                            message: err.message,
                          });
                        });
                    }
                  });
                } else {
                  res.status(404).json({
                    message: "This user already created",
                  });
                }
                // console.log(result.length);
              })
              .catch((err) => {
                res.status(404).json({
                  message: err.message,
                });
              });
          } else {
            res.status(200).json({
              message: "You are not allowd to do the operation. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};

exports.signin = (req, res, next) => {
  User.find({ username: req.body.username })
    .then((user) => {
      const userID = user[0]._id;
      const username = user[0].username;
      const userRole = user[0].admin;
      const token = createToken(userRole, username, userID);
      // console.log("id", userID);
      // console.log(userRole);
      console.log(token);
      res.cookie("access_token", token);
      if (user.length >= 1) {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then((result) => {
            if (result) {
              res.status(200).json({
                message: "Signin Success",
                user,
              });
            } else {
              res.status(404).json({
                message: "Wrong Password",
              });
            }
          })
          .catch((err) => {
            res.status(404).json({
              message: err.message,
            });
          });
      } else {
        res.status(404).json({
          message: "Username not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });
};

exports.updateUser = (req, res, next) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            bcrypt
              .hash(req.body.password, 10)
              .then((hash) => {
                const newUser = {
                  username: req.body.username,
                  password: hash,
                };

                User.findOneAndUpdate({ _id: req.params.id }, { $set: newUser })
                  .then((result) => {
                    console.log(result);
                    if (result) {
                      res.status(200).json({ message: "User updated" });
                    } else {
                      res.status(404).json({ message: "User not found" });
                    }
                  })
                  .catch((err) => {
                    res.status(404).json({
                      message: err.message,
                    });
                  });
              })
              .catch((err) => {
                res.status(404).json({
                  message: err.message,
                });
              });
          } else {
            res.status(200).json({
              message: "You are not allowd to do the operation. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};

exports.deleteUser = (req, res, next) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            User.findOneAndDelete({ _id: req.params.id })
              .then((result) => {
                if (result) {
                  console.log(result);
                  res.status(200).json({ message: "User Deleted Sucessfully" });
                } else {
                  res.status(404).json({ message: "User not found" });
                }
              })
              .catch((err) => {
                res.status(404).json({
                  message: err.message,
                });
              });
          } else {
            res.status(200).json({
              message: "You are not allowd to do the operation. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};

exports.logout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
};
