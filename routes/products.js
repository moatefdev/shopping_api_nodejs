const express = require("express");
const router = express.Router();
const checkAuth = require("./../middleware/auth");
const productsControllers = require("./../controllers/product");

router.get("/", productsControllers.getProducts);

router.post(
  "/addproduct",
  productsControllers.upload.single("myfile"),
  checkAuth.verifyToken,
  productsControllers.addProduct
);

router.get("/:productID", productsControllers.getProduct);

router.patch(
  "/:productID",
  checkAuth.verifyToken,
  productsControllers.updateProduct
);

// Just hide the visibility of the product by setting the visiblility value to true
router.put("/:productID", productsControllers.hideProduct);

// Delete product permanently (for ever)
router.delete(
  "/:productID",
  checkAuth.verifyToken,
  productsControllers.deleteProduct
);

module.exports = router;
