

const banner = require('../models/BannerModel');


const getAllBanners = async () => {
    try {
        const banners = await banner.find();
        return {
            status: 'OK',
            message: 'Banners retrieved successfully',
            data: banners
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
            data: null
        };
    }
}


const createBanner = async ({ image, link }) => {
    try {
        const newBanner = { image, link };
        const result = banner.create(newBanner);
        return {
            status: 'OK',
            message: 'Banner created successfully',
            data: result
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
            data: null
        };
    }
}

const updateBanner = async (id, bannerData) => {
    try {
        const updatedBanner = await banner.findByIdAndUpdate(id, bannerData, { new: true });
        if (!updatedBanner) {
            return {
                status: 'ERR',
                message: 'Banner not found',
                data: null
            };
        }
        return {
            status: 'OK',
            message: 'Banner updated successfully',
            data: updatedBanner
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
            data: null
        };
    }
}

const deleteBanner = async (id) => {
    try {
        const deletedBanner = await banner.findByIdAndDelete(id);
        if (!deletedBanner) {
            return {
                status: 'ERR',
                message: 'Banner not found',
                data: null
            };
        }
        return {
            status: 'OK',
            message: 'Banner deleted successfully',
            data: deletedBanner
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
            data: null
        };
    }
}


module.exports = {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
};