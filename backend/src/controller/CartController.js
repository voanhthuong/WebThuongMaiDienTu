const { Cart } = require("../models/CartModel");

// Get cart by userId
const getCart = async (req, res) => {
    const userId = req.params.userId

    try {
        const cart = await Cart.findOne({ userId })
            .populate('items.product') // ✅ Đúng field cần populate

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        res.status(200).json(cart)
    } catch (error) {
        console.error('Get Cart Error:', error)
        res.status(500).json({ message: error.message })
    }
}

// Add/update cart
const updateCart = async (req, res) => {
    const { userId, items } = req.body
    try {
        let cart = await Cart.findOne({ userId })
        if (cart) {
            cart.items = items
            await cart.save()
        } else {
            cart = await Cart.create({ userId, items })
        }
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete cart
const deleteCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId })
        res.status(200).json({ message: 'Cart deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    getCart,
    updateCart,
    deleteCart,
}

