var express = require("express");
const User = require("../models/User");
var router = express.Router();

const UserControllers = require("./../controllers/user");
const checkAuth = require("./../middleware/auth");

router.get("/", checkAuth.verifyToken, UserControllers.getUsers);

router.post("/signup", checkAuth.verifyToken, UserControllers.signup);

router.post("/signin", UserControllers.signin);

router.patch(
  "/updateuser/:id",
  checkAuth.verifyToken,
  UserControllers.updateUser
);

router.delete(
  "/deleteuser/:id",
  checkAuth.verifyToken,
  UserControllers.deleteUser
);

router.get("/logout", UserControllers.logout);

module.exports = router;
