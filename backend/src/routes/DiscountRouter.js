// backend/src/routes/DiscountRouter.js
const express = require("express");
const DiscountController = require("../controller/DiscountController.js");


const { authMiddleWare } = require("../middleware/authMiddleware.js"); 


const router = express.Router();

// Chỉ admin mới có quyền quản lý mã giảm giá
router.post('/create', authMiddleWare, DiscountController.createDiscount); // Thêm mã giảm giá
router.put('/update/:id', authMiddleWare, DiscountController.updateDiscount); // Sửa mã giảm giá
router.delete('/delete/:id', authMiddleWare, DiscountController.deleteDiscount); // Xóa mã giảm giá

// Route cho việc cập nhật thông tin sử dụng mã giảm giá (cần đăng nhập)
router.put('/updateUsage/:id', authMiddleWare, DiscountController.updateDiscountUsage);

// Ai cũng có thể xem danh sách (có thể chỉ active) hoặc chi tiết nếu cần
router.get('/getAll', DiscountController.getAllDiscount); // Lấy tất cả mã giảm giá (có phân trang, lọc, sắp xếp)
router.get('/getDetail/:id', DiscountController.getDetailDiscount); // Lấy chi tiết mã giảm giá

module.exports = router;