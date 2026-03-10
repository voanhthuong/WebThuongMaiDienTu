const express = require("express");
const router = express.Router();
const OrderController = require("../controller/OrderController")
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");



router.post("/createOrder", authUserMiddleWare, OrderController.createOrder)
router.get("/getAllOrder/:id", authUserMiddleWare, OrderController.getAllOrder) //Order của user
router.get("/getDetailOrder/:id", authUserMiddleWare, OrderController.getDetailOrder)
router.delete("/deleteOrder/:id", authUserMiddleWare, OrderController.deleteOrder)
router.get("/getAllOrders", authMiddleWare, OrderController.getAllOrderByAdmin)
router.put('/updateOrder/:id', OrderController.updateOrder) // Thương thêm ở chức năng QL đơn hàng






module.exports = router;