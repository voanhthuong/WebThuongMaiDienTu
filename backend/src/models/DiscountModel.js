const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true }, // Tên mã giảm giá (ví dụ: SUMMER2024, FREESHIP)
        code: { type: String, required: true, unique: true, uppercase: true }, // Mã code thực tế để người dùng nhập (ví dụ: SUMMERCAMP20)
        type: { type: String, required: true, enum: ['percent', 'fixed'] }, // Loại giảm giá: phần trăm hay cố định
        value: { type: Number, required: true }, // Giá trị giảm giá (ví dụ: 10 cho 10%, hoặc 50000 cho 50.000 VNĐ)
        minValue: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu để áp dụng mã
        maxUses: { type: Number, default: 1 }, // Số lần tối đa mã có thể được sử dụng (tổng cộng)
        usesLeft: { type: Number, default: 1 }, // Số lần sử dụng còn lại (giảm dần khi được dùng)
        startDate: { type: Date, required: true }, // Ngày bắt đầu hiệu lực
        endDate: { type: Date, required: true }, // Ngày kết thúc hiệu lực
        usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách người dùng đã sử dụng mã này
        isActive: { type: Boolean, default: true }, // Trạng thái hoạt động
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;