require("dotenv").config();
const Product = require("./../models/Product");
const multer = require("multer");
const jwt = require("jsonwebtoken");

// const fileFilter = function (req, file, callback) {
//   if (file.mimetype === "image/jpeg") {
//     callback(null, true);
//   } else {
//     callback(new Error("please, upload `jpg or jpeg` file"), false);
//   }
// };
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./productImage/");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toDateString() + file.originalname);
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  // fileFilter: fileFilter,
});

exports.getProducts = (req, res, next) => {
  // Get all products from database
  Product.find()
    .select("_id category name price image isVisible")
    .then((result) => {
      // console.log(result);
      const results = {
        products: result.map((item) => {
          return {
            category: item.category,
            name: item.name,
            price: item.price,
            _id: item._id,
            productImage: item.image,
            isVisible: item.isVisible,
            url: {
              type: "GET",
              url_path: `products/${item._id}`,
              // url_path: `http://localhost:3000/products/${item._id}`,
            },
          };
        }),
      };
      res.status(200).json({
        ...results,
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message,
      });
    });
};

// const token = req.token;
// if (token) {
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
//     if (!error) {
//       if (decodedToken.admin === true) {
//         // code here
//       } else {
//         res.status(200).json({
//           message: "You are not allowed to do the operation. Only Admins.",
//         });
//       }
//     } else {
//       res.status(404);
//     }
//   });
// }

// Add A Product
exports.addProduct = (req, res, next) => {
  // console.log(req.file);
  const token = req.token;
  // console.log(token);
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            const newProduct = new Product({
              category: req.body.category,
              name: req.body.name,
              price: req.body.price,
              image: req.file.path,
            });
            newProduct
              .save()
              .then((result) => {
                // console.log(result);
                res.status(200).json({
                  message: "Product Added Successfully",
                  product: result,
                });
              })
              .catch((error) => {
                res.status(404).json({
                  message: error.message,
                });
              });
          } else {
            res.status(200).json({
              message: "You are not allowed to do the operation. Only Admins.",
            });
          }
        } else {
          res.sendStatus(403);
        }
      }
    );
  }
};

// Get A Product
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productID)
    .select({ __v: 0 })
    .then((result) => {
      res.status(200).json({
        product: result,
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message,
      });
    });
};

// Update A Product
exports.updateProduct = (req, res, next) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            const newProduct = {
              category: req.body.category,
              name: req.body.name,
              price: req.body.price,
              isVisible: true,
            };
            Product.updateOne(
              { _id: req.params.productID },
              { $set: newProduct }
            )
              .then((result) => {
                res.status(200).json({
                  message: "Product Updated Successfully",
                  result,
                });
              })
              .catch((error) => {
                res.status(404).json({
                  message: error.message,
                });
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

// Remove (Hide) A Product
exports.hideProduct = (req, res) => {
  Product.findOneAndUpdate({}, { $set: { isVisible: false } })
    .then((result) => {
      res.status(202).json({
        message: "Item deleted, but you can return it from admin panel.",
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message,
      });
    });
};

// Delete A Product
exports.deleteProduct = (req, res, next) => {
  const token = req.token;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (error, decodedToken) => {
        if (!error) {
          if (decodedToken.admin === true) {
            Product.deleteOne({ _id: req.params.productID })
              .then((result) => {
                res.status(200).json({
                  message: "Product Deleted Permanently",
                });
              })
              .catch((error) => {
                res.status(404).json({
                  message: error.message,
                });
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
