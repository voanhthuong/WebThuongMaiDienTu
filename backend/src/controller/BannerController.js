

const BannerService = require('../services/BannerService');


const createBanner = async (req, res) => {
    try {
        const { image, link } = req.body;
        if (!image) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Image and link are required',
                data: null
            });
        }
        const result = await BannerService.createBanner({ image, link });
        res.status(result.status === 'OK' ? 201 : 400).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
            data: null
        });
    }
}



const getAllBanners = async (req, res) => {
    try {
        const result = await BannerService.getAllBanners();
        res.status(result.status === 'OK' ? 200 : 500).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
            data: null
        });
    }
}


const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, link } = req.body;
        if (!image || !link) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Image and link are required',
                data: null
            });
        }
        const result = await BannerService.updateBanner(id, { image, link });
        res.status(result.status === 'OK' ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
            data: null
        });
    }
}

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BannerService.deleteBanner(id);
        res.status(result.status === 'OK' ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({
            status: 'ERR',
            message: error.message,
            data: null
        });
    }
}

module.exports = {
    createBanner,
    getAllBanners,
    updateBanner,
    deleteBanner
};