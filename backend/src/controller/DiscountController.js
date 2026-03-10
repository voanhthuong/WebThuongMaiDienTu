const DiscountService = require('../services/DiscountService.js');


const createDiscount = async (req, res) => {
    try {
        const { name,
            code,
            type,
            value,
            minValue,
            maxUses,
            usesLeft,
            startDate,
            endDate,
            usersUsed,
            isActive } = req.body;
        if (!name || !code || !type || !value || !startDate || !endDate) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }
        // Kiểm tra định dạng code (chỉ chữ cái và số, không khoảng trắng)
        if (!/^[A-Z0-9]+$/.test(code)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Code can only contain uppercase letters and numbers.'
            });
        }
        if (type === 'percent' && (value < 0 || value > 100)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Value for percent type must be between 0 and 100.'
            });
        }
        if (type === 'fixed' && value < 0) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Value for fixed type must be positive.'
            });
        }
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Start date must be before end date.'
            });
        }
        if (maxUses !== undefined && maxUses < 0) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Max uses cannot be negative.'
            });
        }

        const response = await DiscountService.createDiscount(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

const updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        const data = req.body;
        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The discountId is required'
            });
        }
        // Kiểm tra dữ liệu đầu vào khi update (có thể giống create nhưng không yêu cầu tất cả)
        if (data.code && !/^[A-Z0-9]+$/.test(data.code)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Code can only contain uppercase letters and numbers.'
            });
        }
        if (data.type === 'percent' && (data.value < 0 || data.value > 100)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Value for percent type must be between 0 and 100.'
            });
        }
        if (data.type === 'fixed' && data.value < 0) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Value for fixed type must be positive.'
            });
        }
        if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Start date must be before end date.'
            });
        }
        if (data.maxUses !== undefined && data.maxUses < 0) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Max uses cannot be negative.'
            });
        }


        const response = await DiscountService.updateDiscount(discountId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

const deleteDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The discountId is required'
            });
        }
        const response = await DiscountService.deleteDiscount(discountId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

const getAllDiscount = async (req, res) => {


    try {
        const { limit, page, sort, filter } = req.query;
        const response = await DiscountService.getAllDiscount(Number(limit) || 10, Number(page) || 0, sort, filter);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

const getDetailDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The discountId is required'
            });
        }
        const response = await DiscountService.getDetailDiscount(discountId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

const updateDiscountUsage = async (req, res) => {
    try {
        const discountId = req.params.id;
        const { userId } = req.body;

        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The discountId is required'
            });
        }

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }

        const response = await DiscountService.updateDiscountUsage(discountId, userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

module.exports = {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getAllDiscount,
    getDetailDiscount,
    updateDiscountUsage
};