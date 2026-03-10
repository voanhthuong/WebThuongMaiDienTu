
const express = require('express');
const router = express.Router();
const BannerController = require('../controller/BannerController');
const { authMiddleWare } = require('../middleware/authMiddleware');


// Route to get all banners
router.get('/', BannerController.getAllBanners);
// Route to create a new banner
router.post('/', authMiddleWare, BannerController.createBanner);
// Route to update a banner by ID
router.put('/:id', authMiddleWare, BannerController.updateBanner);
// Route to delete a banner by ID
router.delete('/:id', authMiddleWare, BannerController.deleteBanner);

module.exports = router;
