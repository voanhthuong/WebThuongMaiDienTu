const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const Order = require("../models/OrderProduct");




const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, images, type, price, countInStock, rating, description, sold, discount } = newProduct;

        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct != null) {
                resolve({
                    status: "OK",
                    message: "Tên sản phẩm đã tồn tại!"
                })
            }
            const createdProduct = await Product.create({
                name, images, type, price, countInStock, rating, description, sold, discount
            })
            if (createdProduct) {
                resolve({
                    status: "OK",
                    message: "Thêm sản phẩm thành công!",
                    data: createdProduct
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy sản phẩm!"
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, { ...data, images: data.images }, { new: true });


            resolve({
                status: "OK",
                message: "Cập nhật sản phẩm thành công!",
                data: updatedProduct
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy sản phẩm"
                })
            }

            resolve({
                status: "OK",
                message: "Xem chi tiết sản phẩm thành công!",
                data: checkProduct
            })
        } catch (e) {
            reject(e);
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy sản phẩm"
                })
            }

            await Product.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Đã xóa sản phẩm thành công!",
            })
        } catch (e) {
            reject(e);
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });
            resolve({
                status: "OK",
                message: "Đã xóa các sản phẩm đã chọn thành công!",
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();
            let allProduct = [];
            // console.log("Filter: ", filter)
            if (filter && filter[0] === "type") {
                // Tìm category cha theo tên
                const parentCategory = await Category.findOne({ name: filter[1] });
                if (!parentCategory) {
                    return resolve({
                        status: "OK",
                        message: "Không tìm thấy loại sản phẩm!",
                        total: 0,
                        data: [],
                        currentPage: Number(page) + 1,
                        totalPage: 0
                    });
                }
                // Tìm các category con
                const childCategories = await Category.find({ parent: parentCategory._id });
                const categoryIds = [parentCategory._id, ...childCategories.map(cat => cat._id)];

                // Lọc sản phẩm theo danh sách _id
                const allProductFilter = await Product.find({
                    type: { $in: categoryIds }
                }).limit(limit).skip(page * limit).populate("type");
                return resolve({
                    status: "OK",
                    message: "Lọc danh sách sản phẩm theo loại thành công!",
                    total: allProductFilter.length,
                    data: allProductFilter,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(allProductFilter.length / limit)
                });
            }

            if (filter && filter[0] === "typeId") {
                // Tìm category cha theo _id
                const parentCategory = await Category.findById(filter[1]);
                if (!parentCategory) {
                    return resolve({
                        status: "OK",
                        message: "Không tìm thấy loại sản phẩm!",
                        total: 0,
                        data: [],
                        currentPage: Number(page) + 1,
                        totalPage: 0
                    });
                }
                // Tìm các category con
                const childCategories = await Category.find({ parent: parentCategory._id });
                const categoryIds = [parentCategory._id, ...childCategories.map(cat => cat._id)];

                // Lọc sản phẩm theo danh sách _id
                const allProductFilter = await Product.find({
                    type: { $in: categoryIds }
                }).limit(limit).skip(page * limit).populate("type");
                return resolve({
                    status: "OK",
                    message: "Lọc danh sách sản phẩm theo loại (typeId) thành công!",
                    total: allProductFilter.length,
                    data: allProductFilter,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(allProductFilter.length / limit)
                });
            }

            if (filter && filter[0] === "name") {
                const allProductFilter = await Product.find({
                    name: { $regex: filter[1], $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
                }).limit(limit).skip(page * limit).populate("type");
                return resolve({
                    status: "OK",
                    message: "Lọc danh sách sản phẩm theo tên thành công!",
                    total: allProductFilter.length,
                    data: allProductFilter,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(allProductFilter.length / limit)
                });
            }

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort);
                resolve({
                    status: "OK",
                    message: "Lọc sản phẩm thành công!",
                    total: totalProduct,
                    data: allProductSort,
                    currentPage: Number(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (!limit) {
                allProduct = await Product.find()
            } else {
                allProduct = await Product.find().limit(limit).skip(page * limit).sort({
                    name: 1  //acending = 1, descending = -1 | default set = name
                });
            }
            resolve({
                status: "OK",
                message: "Lấy danh sách các sản phẩm thành công!",
                total: totalProduct,
                data: allProduct,
                currentPage: Number(page) + 1,
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const AllType = await Product.distinct('type')
            resolve({
                status: "OK",
                message: "Lấy tất cả danh sách loại sản phẩm thành công!",
                data: AllType,
            })
        } catch (e) {
            reject(e);
        }
    })
}

const addComment = async (productId, { user, comment }) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        }

        // Thêm comment mới, chỉ lưu comment
        const review = {
            user,
            comment,
            createdAt: new Date()
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        await product.save();
        return { status: 'OK', message: 'Bình luận thành công!', data: product };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};


const updateComment = async (productId, commentId, { user, comment }) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        const review = product.reviews.id(commentId);
        if (!review) return { status: 'ERROR', message: 'Không tìm thấy bình luận!', data: null };
        if (String(review.user) !== String(user)) return { status: 'ERROR', message: 'Không có quyền sửa bình luận này!', data: null };
        review.comment = comment;
        review.createdAt = new Date();
        await product.save();
        return { status: 'OK', message: 'Cập nhật bình luận thành công!', data: review };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};




const addRating = async (productId, { user, rating, comment }) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        }

        // Kiểm tra quyền đánh giá trước khi cho phép
        const permissionCheck = await checkRatingPermission(user, productId);
        if (permissionCheck.status === 'ERROR') {
            return permissionCheck;
        }

        // Kiểm tra xem user đã đánh giá sản phẩm này chưa
        // const existingReview = product.reviews.find(review => String(review.user) === String(user));
        // if (existingReview) {
        //     return { status: 'ERROR', message: 'Bạn đã đánh giá sản phẩm này rồi!', data: null };
        // }

        const existingRating = product.reviews.find(
            review => String(review.user) === String(user) && typeof review.rating === 'number' && !isNaN(review.rating)
        );
        if (existingRating) {
            return { status: 'ERROR', message: 'Bạn đã đánh giá sản phẩm này rồi!', data: null };
        }

        // Thêm rating mới, chỉ lưu rating
        const review = {
            user,
            rating: Number(rating),
            comment: comment,
            createdAt: new Date()
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        // Tính averageRating chỉ dựa trên các review có rating hợp lệ
        const ratingReviews = product.reviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
        if (ratingReviews.length > 0) {
            product.averageRating = ratingReviews.reduce((acc, item) => acc + item.rating, 0) / ratingReviews.length;
        } else {
            product.averageRating = 0;
        }
        await product.save();
        return { status: 'OK', message: 'Đánh giá thành công!', data: product };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};

const getReviews = async (productId) => {
    try {
        // Populates name, avatar, and isAdmin from User for reviews and replies
        const product = await Product.findById(productId)
            .populate('reviews.user', 'name avatar isAdmin')
            .populate('reviews.replies.user', 'name avatar isAdmin');
        if (!product) {
            return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        }
        return { status: 'OK', message: 'Lấy đánh giá thành công!', data: product.reviews };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};

// Thêm phản hồi cho review
const addReplyToReview = async (productId, reviewId, { user, comment }) => {
    try {
        const product = await Product.findById(productId);

        if (!product) return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        const review = product.reviews.id(reviewId);
        if (!review) return { status: 'ERROR', message: 'Không tìm thấy bình luận!', data: null };
        review.replies.push({ user, comment });
        await product.save();

        // Populate user info for the newly added reply
        const updatedProduct = await Product.findById(productId)
            .populate('reviews.user', 'name avatar isAdmin')
            .populate('reviews.replies.user', 'name avatar isAdmin');
        const updatedReview = updatedProduct.reviews.id(reviewId);
        return { status: 'OK', message: 'Thêm phản hồi thành công!', data: updatedReview.replies };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};

// Sửa phản hồi cho review
const updateReplyOfReview = async (productId, reviewId, replyId, { user, comment }) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        const review = product.reviews.id(reviewId);
        if (!review) return { status: 'ERROR', message: 'Không tìm thấy bình luận!', data: null };
        const reply = review.replies.id(replyId);
        if (!reply) return { status: 'ERROR', message: 'Không tìm thấy phản hồi!', data: null };
        if (String(reply.user) !== String(user)) return { status: 'ERROR', message: 'Không có quyền sửa phản hồi này!', data: null };
        reply.comment = comment;
        reply.createdAt = new Date();
        await product.save();

        // Populate user info for the updated reply
        const updatedProduct = await Product.findById(productId)
            .populate('reviews.user', 'name avatar isAdmin')
            .populate('reviews.replies.user', 'name avatar isAdmin');
        const updatedReview = updatedProduct.reviews.id(reviewId);
        const updatedReply = updatedReview.replies.id(replyId);
        return { status: 'OK', message: 'Cập nhật phản hồi thành công!', data: updatedReply };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};

// Xóa phản hồi cho review
const deleteReplyOfReview = async (productId, reviewId, replyId, user) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        const review = product.reviews.id(reviewId);
        if (!review) return { status: 'ERROR', message: 'Không tìm thấy bình luận!', data: null };
        const reply = review.replies.id(replyId);
        if (!reply) return { status: 'ERROR', message: 'Không tìm thấy phản hồi!', data: null };
        if (String(reply.user) !== String(user)) return { status: 'ERROR', message: 'Không có quyền xóa phản hồi này!', data: null };
        // Xóa reply bằng filter
        review.replies = review.replies.filter(r => String(r._id) !== String(replyId));
        await product.save();
        return { status: 'OK', message: 'Xóa phản hồi thành công!', data: null };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};

// Thêm thêm vào xóa cmt của bản thân
const deleteReview = async (productId, reviewId, user) => {
    try {
        const product = await Product.findById(productId);
        if (!product) return { status: 'ERROR', message: 'Không tìm thấy sản phẩm!', data: null };
        const review = product.reviews.id(reviewId);
        if (!review) return { status: 'ERROR', message: 'Không tìm thấy bình luận!', data: null };
        if (String(review.user) !== String(user)) return { status: 'ERROR', message: 'Không có quyền xóa bình luận này!', data: null };
        // Xóa review bằng filter
        product.reviews = product.reviews.filter(r => String(r._id) !== String(reviewId));
        product.numReviews = product.reviews.length;
        // Cập nhật averageRating 
        const ratingReviews = product.reviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
        if (ratingReviews.length > 0) {
            product.averageRating = ratingReviews.reduce((acc, item) => acc + item.rating, 0) / ratingReviews.length;
        } else {
            product.averageRating = 0;
        }
        await product.save();
        return { status: 'OK', message: 'Xóa bình luận thành công!', data: null };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: null };
    }
};

// Kiểm tra quyền đánh giá sản phẩm
const checkRatingPermission = async (userId, productId) => {
    try {
        // Tìm tất cả đơn hàng của user có trạng thái isDelivered = true
        const deliveredOrders = await Order.find({
            user: userId,
            isDelivered: true
        });

        // Kiểm tra xem có đơn hàng nào chứa sản phẩm cần đánh giá không
        for (const order of deliveredOrders) {
            const hasProduct = order.orderItems.some(item =>
                String(item.product) === String(productId)
            );
            if (hasProduct) {
                return { status: 'OK', message: 'Có quyền đánh giá!', data: true };
            }
        }

        return { status: 'ERROR', message: 'Bạn chưa mua sản phẩm này hoặc đơn hàng chưa được giao!', data: false };
    } catch (error) {
        return { status: 'ERROR', message: error.message, data: false };
    }
};


module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllTypeProduct,
    addRating,
    addComment,
    updateComment,
    getReviews,
    addReplyToReview,
    updateReplyOfReview,
    deleteReplyOfReview,
    deleteReview, //Thương thêm vào
    checkRatingPermission
}