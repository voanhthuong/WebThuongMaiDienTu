const UserService = require("../services/UserService")
const JwtService = require("../services/JwtService")

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, address, city } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        if (!email || !password || !confirmPassword || !phone || !address || !city || !name) {
            return res.status(200).json({
                status: "ERR",
                message: "All fields are required"
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Invalid email format"
            })
        } else if (confirmPassword != password) {
            return res.status(200).json({
                status: "ERR",
                message: "Passwords do not match"
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const verifyAccount = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        if (!email || !verificationCode) {
            return res.status(200).json({
                status: "ERR",
                message: "All fields are required từ verify"
            })
        }
        if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Invalid email format!"
            })
        }

        const response = await UserService.verifyAccount(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const result = await UserService.resetPassword(token, newPassword);

        if (result.success) {
            return res.status(200).json({
                status: 'OK',
                message: 'Password reset successfully'
            });
        }

        return res.status(400).json({ 
            status: 'ERR',
            message: result.message 
        });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        if (!email || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "All fields are required"
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Invalid email format!"
            })
        }
        const response = await UserService.loginUser(req.body)






        const { refresh_token, ...newRespone } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict', // Fix lỗi viết sai chữ 'sameSite'
            path: '/', // Đảm bảo cookie có hiệu lực toàn bộ trang
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),  // 🛠 Set 365 ngày
            maxAge: 365 * 24 * 60 * 60 * 1000  // 🛠 Set 365 ngày
        })


        return res.status(200).json({...newRespone, refresh_token})

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "User ID required"
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "User ID is required"
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyUser = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) {
            return res.status(200).json({
                status: "ERR",
                message: "User IDs is required"
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {

        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = req.user.id

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "User ID is required"
            })
        }
        const response = await UserService.getDetailUser(userId, user)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        // const token = req.cookies.refresh_token
        const token = req.headers.token?.split(' ')[1] // Lấy token từ header Authorization byRon

        if (!token) {
            return res.status(200).json({
                status: "ERR",
                message: "Token is required"
            })
        }
        const response = await JwtService.refreshToken(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        if (!email) {
            return res.status(200).json({
                status: "ERR",
                message: "Field required!",
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Invalid email!"
            })
        }
        const response = await UserService.forgetPassword(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    verifyAccount,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    forgetPassword,
    logoutUser,
    deleteManyUser,
    resetPassword
}