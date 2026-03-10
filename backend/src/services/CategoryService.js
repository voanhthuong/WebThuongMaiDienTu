const Category = require("../models/CategoryModel");

const createCategory = async ({ name, parent }) => {
  try {
    
    // Kiểm tra xem đã tồn tại category cùng tên trong cùng parent chưa
    const existingCategory = await Category.findOne({ name, parent });
    
    if (existingCategory) {
      return {
        status: 'ERR',
        message: `Đã tồn tại loại sản phẩm "${name}" trong danh mục này`,
        data: null
      };
    }

    const category = new Category({ name, parent });
    const saved = await category.save();
    return {
      status: 'OK',
      message: 'Tạo loại sản phẩm thành công',
      data: saved
    };
  } catch (error) {
    // Xử lý lỗi duplicate key error từ compound index
    if (error.code === 11000) {
      return {
        status: 'ERR',
        message: `Đã tồn tại loại sản phẩm "${name}" trong danh mục này`,
        data: null
      };
    }
    return {
      status: 'ERR',
      message: error.message,
      data: null
    };
  }
};

const getAllCategories = async () => {
  try {
    const categories = await Category.find().populate("parent");
    return {
      status: 'OK',
      message: 'Lấy tất cả loại sản phẩm thành công',
      data: categories
    };
  } catch (error) {
    return {
      status: 'ERR',
      message: error.message,
      data: null
    };
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id).populate("parent");
    if (!category) {
      return {
        status: 'ERR',
        message: 'Không tìm thấy loại sản phẩm',
        data: null
      };
    }
    return {
      status: 'OK',
      message: 'Lấy loại sản phẩm thành công',
      data: category
    };
  } catch (error) {
    return {
      status: 'ERR',
      message: error.message,
      data: null
    };
  }
};

const updateCategory = async (id, { name, parent }) => {
  try {
    // Kiểm tra xem đã tồn tại category cùng tên trong cùng parent chưa (trừ category hiện tại)
    const existingCategory = await Category.findOne({ 
      name, 
      parent,
      _id: { $ne: id } // Loại trừ category hiện tại
    });
    if (existingCategory) {
      return {
        status: 'ERR',
        message: `Đã tồn tại loại sản phẩm "${name}" trong danh mục này`,
        data: null
      };
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, parent },
      { new: true }
    );
    if (!updated) {
      return {
        status: 'ERR',
        message: 'Không tìm thấy loại sản phẩm để cập nhật',
        data: null
      };
    }
    return {
      status: 'OK',
      message: 'Cập nhật loại sản phẩm thành công',
      data: updated
    };
  } catch (error) {
    // Xử lý lỗi duplicate key error từ compound index
    if (error.code === 11000) {
      return {
        status: 'ERR',
        message: `Đã tồn tại loại sản phẩm "${name}" trong danh mục này`,
        data: null
      };
    }
    return {
      status: 'ERR',
      message: error.message,
      data: null
    };
  }
};

const deleteCategory = async (id) => {
  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return {
        status: 'ERR',
        message: 'Không tìm thấy loại sản phẩm để xóa',
        data: null
      };
    }
    return {
      status: 'OK',
      message: 'Xóa loại sản phẩm thành công',
      data: deleted
    };
  } catch (error) {
    return {
      status: 'ERR',
      message: error.message,
      data: null
    };
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}; 