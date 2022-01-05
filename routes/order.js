const express = require("express");
const router = express.Router();
const OrdersControllers = require("./../controllers/order");

router.get("/", OrdersControllers.getAllOrders);

router.post("/addorder", OrdersControllers.addOrder);

router.patch("/updateorder/:orderID", OrdersControllers.updateOrder);

router.delete("/:orderID", OrdersControllers.deleteOrder);

module.exports = router;
