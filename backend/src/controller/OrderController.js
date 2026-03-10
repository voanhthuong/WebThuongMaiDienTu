const OrderService = require("../services/OrderService")


const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            city,
            phone,
            isPaid,
            paidAt,
        } = req.body;

        if (
            paymentMethod == null ||
            itemsPrice == null ||
            shippingPrice == null ||
            totalPrice == null ||
            !fullName?.trim() ||
            !address?.trim() ||
            !city?.trim() ||
            !phone?.trim()
        ) {
            return res.status(200).json({
                status: "ERR",
                message: "The input required"
            });
        }

        const userIdFromToken = req.user.id;
        const response = await OrderService.createOrder({
            ...req.body,
            user: userIdFromToken, // ⚠️ Ghi đè user cho an toàn
        });

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || "Something went wrong"
        });
    }
};



const getAllOrder = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "userId is required"
            })
        }
        const response = await OrderService.getAllOrder(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "orderId is required"
            })
        }
        const response = await OrderService.getDetailOrder(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "orderId is required"
            })
        }
        const response = await OrderService.deleteOrder(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderByAdmin = async (req, res) => {
    try {
        const response = await OrderService.getAllOrderByAdmin()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

//Phần Thương thêm vào test
const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "orderId is required"
            })
        }
        // req.body chứa các trường cần update, ví dụ: {status: 'Completed'}
        const response = await OrderService.updateOrder(orderId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message || e
        })
    }
}
//
module.exports = {
    createOrder,
    getAllOrder,
    getDetailOrder,
    deleteOrder,
    getAllOrderByAdmin,
    updateOrder        
}