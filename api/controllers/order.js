const Order = require("./../models/Order");

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .populate("user", "username")
    .then((result) => {
      res.status(200).json({
        message: result,
      });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
};

exports.addOrder = (req, res, next) => {
  const newOrder = new Order({
    user: req.body.user,
    product: req.body.product,
  });
  newOrder
    .save()
    .then((result) => {
      res.status(200).json({
        message: result,
      });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
};

exports.updateOrder = (req, res, next) => {
  let newProduct = req.body.product;
  console.log(newProduct);
  Order.find({ _id: req.params.orderID })
    .then((result) => {
      let oldProduct = result[0].product;
      for (
        let indexOfNewProduct = 0;
        indexOfNewProduct < newProduct.length;
        indexOfNewProduct++
      ) {
        for (
          let indexOfOldProduct = 0;
          indexOfOldProduct < oldProduct.length;
          indexOfOldProduct++
        ) {
          if (
            newProduct[indexOfNewProduct]._id ===
            oldProduct[indexOfOldProduct]._id
          ) {
            oldProduct[indexOfOldProduct].quantity =
              Number(oldProduct[indexOfOldProduct].quantity) +
              Number(newProduct[indexOfNewProduct].quantity);
            newProduct.splice(indexOfNewProduct, 1);
            break;
          }
        }
      }

      // console.log("new: ", newProduct);
      // console.log("old: ", oldProduct);

      // oldProduct = oldProduct.concat(newProduct);
      oldProduct.push(...newProduct);

      console.log(oldProduct);
      const newOrder = {
        product: oldProduct,
      };

      Order.updateOne({ _id: req.params.orderID }, { $set: newOrder })
        .then((result) => {
          res.status(200).json({
            message: result,
          });
        })
        .catch((error) => {
          res.status(404).json({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
};

exports.deleteOrder = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderID })
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
      });
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
};
