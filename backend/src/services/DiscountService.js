const Discount = require("../models/DiscountModel.js");

const createDiscount = (newDiscount) => {
    return new Promise(async (resolve, reject) => {
        const { name, code, type, value, minValue, maxUses, usesLeft, startDate, endDate, isActive } = newDiscount;
        try {
            const checkDiscountCode = await Discount.findOne({ code: code });
            if (checkDiscountCode !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Mã giảm giá này đã tồn tại'
                });
            } else {
                const createdDiscount = await Discount.create({
                    name,
                    code,
                    type,
                    value,
                    minValue,
                    maxUses,
                    usesLeft: usesLeft || maxUses, // Mặc định usesLeft = maxUses nếu không truyền
                    startDate,
                    endDate,
                    isActive: isActive !== undefined ? isActive : true // Mặc định true
                });
                if (createdDiscount) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createdDiscount
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateDiscount = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDiscount = await Discount.findOne({ _id: id });
            if (checkDiscount === null) {
                resolve({
                    status: 'ERR',
                    message: 'Mã giảm giá không tồn tại'
                });
            }

            const updatedDiscount = await Discount.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedDiscount
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteDiscount = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDiscount = await Discount.findOne({ _id: id });
            if (checkDiscount === null) {
                resolve({
                    status: 'ERR',
                    message: 'Mã giảm giá không tồn tại'
                });
            }

            await Discount.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Delete discount success'
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllDiscount = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalDiscount = await Discount.countDocuments();
            let allDiscount = [];

            if (filter) {
                const label = filter[0];
                const objectFilter = {};
                objectFilter[label] = { '$regex': filter[1], '$options': 'i' };
                allDiscount = await Discount.find(objectFilter)
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 });
            } else if (sort) {
                const objectSort = {};
                objectSort[sort[0]] = sort[1];
                allDiscount = await Discount.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
            } else {
                allDiscount = await Discount.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort({ createdAt: -1, updatedAt: -1 }); // Sắp xếp theo mới nhất
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allDiscount,
                total: totalDiscount,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalDiscount / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailDiscount = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const discount = await Discount.findOne({ _id: id });
            if (discount === null) {
                resolve({
                    status: 'ERR',
                    message: 'Mã giảm giá không tồn tại'
                });
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: discount
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateDiscountUsage = (discountId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const discount = await Discount.findOne({ _id: discountId });
            if (discount === null) {
                resolve({
                    status: 'ERR',
                    message: 'Mã giảm giá không tồn tại'
                });
                return;
            }

            // Kiểm tra xem người dùng đã sử dụng mã này chưa
            // const userAlreadyUsed = discount.usersUsed.includes(userId);
            // if (userAlreadyUsed) {
            //     resolve({
            //         status: 'ERR',
            //         message: 'Người dùng đã sử dụng mã giảm giá này'
            //     });
            //     return;
            // }

            // Cập nhật thông tin sử dụng
            const updatedDiscount = await Discount.findByIdAndUpdate(
                discountId,
                {
                    $push: { usersUsed: userId },
                    $inc: { usesLeft: -1 } // Giảm số lượt sử dụng còn lại
                },
                { new: true }
            );

            resolve({
                status: 'OK',
                message: 'Cập nhật thông tin sử dụng mã giảm giá thành công',
                data: updatedDiscount
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getAllDiscount,
    getDetailDiscount,
    updateDiscountUsage
};