const ProducService = require("../services/ProductService")


const createProduct = async (req, res) => {
    try {
        const { name, images, type, price, countInStock, rating, description, sold, discount } = req.body;

        if (
            !name ||
            !images ||
            !type ||
            price == null ||
            countInStock == null ||
            rating == null ||
            sold == null ||
            discount == null
        ) {
            return res.status(200).json({
                status: "ERR",
                message: "ALL FIELDS ARE REQUIRED!"
            });
        }
        const response = await ProducService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        if (!productId) {
            return res.status(200).json({
                status: "ERR",
                message: "PRODUCT'S ID REQUIRED!"
            })
        }
        const response = await ProducService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: "ERR",
                message: "PRODUCT'S ID REQUIRED!"
            })
        }
        const response = await ProducService.getDetailProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: "ERR",
                message: "PRODUCT'S ID REQUIRED!"
            })
        }
        const response = await ProducService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyProduct = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) {
            return res.status(200).json({
                status: "ERR",
                message: "Product IDs is required"
            })
        }
        const response = await ProducService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const response = await ProducService.getAllProduct(limit || null, page || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllTypeProduct = async (req, res) => {
    try {
        const response = await ProducService.getAllTypeProduct()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const addComment = async (req, res) => {
    const { productId } = req.params;
    const { comment } = req.body;
    const user = req.user.id;
    const result = await ProducService.addComment(productId, { user, comment });
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

const updateComment = async (req, res) => {
    const { productId, commentId } = req.params;
    const { comment } = req.body;
    const user = req.user.id;
    const result = await ProducService.updateComment(productId, commentId, { user, comment });
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};


const addRating = async (req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user.id;
    const result = await ProducService.addRating(productId, { user, rating, comment });
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

const getReviews = async (req, res) => {
    const { productId } = req.params;
    const result = await ProducService.getReviews(productId);
    res.status(result.status === 'OK' ? 200 : 404).json(result);
};

// Thêm phản hồi cho review
const addReplyToReview = async (req, res) => {
    const { productId, reviewId } = req.params;
    const { comment } = req.body;
    const user = req.user.id;
    const result = await ProducService.addReplyToReview(productId, reviewId, { user, comment });
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

// Sửa phản hồi cho review
const updateReplyOfReview = async (req, res) => {
    const { productId, reviewId, replyId } = req.params;
    const { comment } = req.body;
    const user = req.user.id;
    const result = await ProducService.updateReplyOfReview(productId, reviewId, replyId, { user, comment });
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

// Xóa phản hồi cho review
const deleteReplyOfReview = async (req, res) => {
    const { productId, reviewId, replyId } = req.params;
    const user = req.user.id;
    const result = await ProducService.deleteReplyOfReview(productId, reviewId, replyId, user);
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

// xóa cmt của chính mình
const deleteReview = async (req, res) => {
    const { productId, reviewId } = req.params;
    const user = req.user.id;
    const result = await ProducService.deleteReview(productId, reviewId, user);
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

// Kiểm tra quyền đánh giá sản phẩm
const checkRatingPermission = async (req, res) => {
    const { productId } = req.params;
    const user = req.user.id;
    const result = await ProducService.checkRatingPermission(user, productId);
    res.status(result.status === 'OK' ? 200 : 400).json(result);
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllTypeProduct,
    addComment,
    updateComment,
    addRating,
    getReviews,
    addReplyToReview,
    updateReplyOfReview,
    deleteReplyOfReview,
    deleteReview, //Thương thêm vào
    checkRatingPermission
}