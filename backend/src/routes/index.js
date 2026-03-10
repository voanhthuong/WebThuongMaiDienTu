const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter")
const OrderRouter = require("./OrderRouter")
const CartRouter = require("./CartRouter")
const CategoryRouter = require("./CategoryRouter")
const DiscountRouter = require("./DiscountRouter")
const BannerRouter = require("./BannerRouter");


const routes = (app) =>{
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/cart', CartRouter)
    app.use('/api/category', CategoryRouter)
    app.use('/api/discount', DiscountRouter)
    app.use('/api/banner', BannerRouter);
}

module.exports = routes;    