const express = require("express");
const router = express.Router();
const CategoryControllers = require("./../controllers/category");
const checkAuth = require("./../middleware/auth");

router.get("/", CategoryControllers.getCategories);

router.post(
  "/addcategory/",
  checkAuth.verifyToken,
  CategoryControllers.addCategory
);

router.patch(
  "/updatecategory/:categoryID",
  checkAuth.verifyToken,
  CategoryControllers.renameCategory
);

router.delete(
  "/deletecategory/:categoryID",
  checkAuth.verifyToken,
  CategoryControllers.deleteCategory
);

module.exports = router;
