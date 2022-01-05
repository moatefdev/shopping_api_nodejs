const Category = require("./../models/Category");
const jwt = require("jsonwebtoken");

exports.getCategories = (req, res) => {
  Category.find()
    .then((result) => {
      // console.log(result.length);
      res.status(200).json({
        category: result,
      });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
};

exports.addCategory = (req, res) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            const newCategory = new Category({
              categoryName: req.body.name,
            });
            newCategory
              .save()
              .then((result) => {
                res.status(200).json({
                  message: "Category Added",
                  category: result,
                });
              })
              .catch((error) => {
                res.status(404).json({ message: error.message });
              });
          } else {
            res.status(200).json({
              message: "You are not allowed to do the operation. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};

exports.renameCategory = (req, res) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            const updatedCategory = {
              categoryName: req.body.categoryName,
            };
            Category.findOneAndUpdate(
              { _id: req.params.categoryID },
              { $set: updatedCategory }
            )
              .then((result) => {
                res.status(200).json({
                  message: "Category Renamed",
                  result: result,
                });
              })
              .catch((error) => {
                res.status(404).json({ message: error.message });
              });
          } else {
            res.status(200).json({
              message: "You are not allowed to do the operation. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};

exports.deleteCategory = (req, res) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            Category.findOneAndDelete({ _id: req.params.categoryID })
              .then((result) => {
                res.status(200).json({
                  message: "Category Deleted",
                });
              })
              .catch((error) => {
                res.status(404).json({ message: error.message });
              });
          } else {
            res.status(200).json({
              message: "You are not allowed to do the operation. Only Admins.",
            });
          }
        } else {
          res.status(404);
        }
      }
    );
  }
};
