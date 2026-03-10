const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require('./EmailService')

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, email, isPaid, paidAt } = newOrder;

        const updatedProducts = []; //Lưu lại các sản phẩm đã cập nhật
        const failedItems = [];

        try {
            // Duyệt từng sản phẩm để cập nhật kho
            for (const order of orderItems) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    { 
                        $inc: {
                            countInStock: -order.amount,
                            sold: +order.amount,
                        }
                    },
                    { new: true }
                );

                if (!productData) {
                    failedItems.push(order.product);
                    break; // ngưng cập nhật tiếp nếu có lỗi
                }

                // Lưu lại sản phẩm đã cập nhật thành công để rollback nếu cần
                updatedProducts.push({ productId: order.product, amount: order.amount });
            }

            // Nếu có lỗi → rollback các sản phẩm đã cập nhật
            if (failedItems.length > 0) {
                for (const item of updatedProducts) {
                    await Product.findByIdAndUpdate(item.productId, {
                        $inc: {
                            countInStock: +item.amount,
                            sold: -item.amount,
                        }
                    });
                }

                return resolve({
                    status: 'ERR',
                    message: `Số lượng tồn kho của sản phẩm ${failedItems.join(', ')} không đủ!`
                });
            }


            const sendEmailOrder = await EmailService.sendEmailOrder({email, orderItems, totalPrice})
            // Tạo đơn hàng duy nhất sau khi kiểm tra và cập nhật kho thành công
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt,
            });

            return resolve({
                status: 'OK',
                message: 'Đơn hàng của bạn đã được tạo!',
                data: createdOrder
            });

        } catch (e) {
            // Trong trường hợp lỗi bất ngờ khác → rollback luôn
            for (const item of updatedProducts) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: {
                        countInStock: +item.amount,
                        sold: -item.amount,
                    }
                });
            }

            return reject(e);
        }
    });
};

const getAllOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy đơn hàng!"
                })
            }
            resolve({
                status: "OK",
                message: "Lấy danh sách đơn hàng thành công!",
                data: order
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getDetailOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy đơn hàng!"
                })
            }
            resolve({
                status: "OK",
                message: "Xem chi tiết đơn hàng thành công!",
                data: order
            })
        } catch (e) {
            reject(e);
        }
    })
}


const deleteOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id);
            if (!order) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy đơn hàng!"
                });
                return;
            }

            // Cập nhật lại số lượng sản phẩm
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: {
                        countInStock: item.amount,
                        sold: -item.amount
                    }
                });
            }

            // Sau khi cập nhật xong thì xóa order
            await Order.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Đã xóa đơn hàng và cập nhật lại kho hàng thành công!",
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllOrderByAdmin = () => {
    return new Promise( async(resolve, reject) => {
        try{
            const allOrders = await Order.find();    
            resolve({
                status: "OK",
                message: "Lấy tất cả đơn hàng thành công!",
                data: allOrders
            })
        }catch(e){
            reject(e);
        }
    })
}

const updateOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const order = await Order.findByIdAndUpdate(id, data, {new: true})
            if(!order) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy đơn hàng!"
                })
            }
            resolve({
                status: "OK",
                message: "Cập nhật đơn hàng thành công!",
                data: order
            })
        } catch(e){
            reject(e);
        }
    })
}




module.exports = {
    createOrder,
    getAllOrder,
    getDetailOrder,
    deleteOrder,
    getAllOrderByAdmin,
    updateOrder
}