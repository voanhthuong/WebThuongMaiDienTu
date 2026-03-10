const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");


router.post("/register", UserController.createUser);
router.post("/verify", UserController.verifyAccount)
router.post("/login", UserController.loginUser)
router.post("/logout", UserController.logoutUser)
router.post("/forget-password", UserController.forgetPassword)
router.post("/reset-password", UserController.resetPassword)
router.put("/updateUser/:id", authUserMiddleWare, UserController.updateUser)
router.delete("/deleteUser/:id", authMiddleWare, UserController.deleteUser)
router.get("/getAll", authMiddleWare, UserController.getAllUser)
router.get("/getDetailUser/:id", authUserMiddleWare, UserController.getDetailUser)
router.post("/refreshToken", UserController.refreshToken)
// router.post("/deleteManyUser", authMiddleWare, UserController.deleteManyUser)







module.exports = router;