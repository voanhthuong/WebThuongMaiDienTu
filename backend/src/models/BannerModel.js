
const mongoose = require('mongoose');

// BannerModel: Lưu thông tin banner quảng cáo
// - image: Đường dẫn đến hình ảnh banner
// - link: Liên kết đến trang đích khi người dùng nhấp vào banner
const bannerSchema = new mongoose.Schema(
    {
        image: { type: String, required: true }, // Đường dẫn đến hình ảnh banner
        link: { type: String }, // Liên kết đến trang đích khi người dùng nhấp vào banner
    },
    { timestamps: true } // Tự động thêm trường createdAt và updatedAt
);

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;