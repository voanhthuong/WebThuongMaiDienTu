const User = require("../models/UserModel");
const bcrypto = require("bcrypt");
const { genToken, refresh_genToken } = require("./JwtService");
const EmailService = require("../services/EmailService")
const PasswordResetToken = require('../models/PasswordResetToken');
const { response } = require("express");



const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone, address, city } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser != null) {
                resolve({
                    status: "ERR",
                    message: "Email đã tồn tại!"
                })
            }
            const hashedPassword = bcrypto.hashSync(password, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
            const result = await EmailService.verifyAccount({ email, verificationCode })
            const createdUser = await User.create({
                name,
                email,
                password: hashedPassword,
                phone,
                address,
                city,
                verificationCode: verificationCode,
            })
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "Đăng ký thành công!",
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

const verifyAccount = (user) => {
    return new Promise(async (resolve, reject) => {
        const { email, verificationCode } = user
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (!checkUser) {
                return resolve({
                    status: "ERR",
                    message: "Không tìn thấy người dùng!"
                })
            }
            if (checkUser.verificationCode !== verificationCode) {
                return resolve({
                    status: "ERR",
                    message: "Mã xác thực không hợp lệ!"
                })
            }

            checkUser.isVerified = true;
            checkUser.verificationCode = undefined;
            const response = await checkUser.save()
            if (response) {
                resolve({
                    status: "OK",
                    message: "Xác thực tài khoản thành công!",
                    data: checkUser
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

const resetPassword = async (token, newPassword) => {
    const resetToken = await PasswordResetToken.findOne({ token });

    if (!resetToken) {
        return { success: false, message: 'Token không hợp lệ!' };
    }

    if (resetToken.used) {
        return { success: false, message: 'Token đã được sử dụng!' };
    }

    if (resetToken.expiresAt < Date.now()) {
        return { success: false, message: 'Token đã hết hạn!' };
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
        return { success: false, message: 'Không tìm thấy người dùng' };
    }

    // Update password
    const hashedPassword = await bcrypto.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();


    // Mark token as used
    resetToken.used = true;
    await resetToken.save();



    return { success: true };
};



const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                return resolve({
                    status: "ERR",
                    message: "Không tìm thấy người dùng"
                });
            }
            const decryptedPassword = bcrypto.compareSync(password, checkUser.password);

            if (!decryptedPassword) {
                return resolve({
                    status: "ERR",
                    message: "Sai tên đăng nhập hoặc mật khẩu!",
                })
            }


            //Xử lý phần nếu ngườiho dùng đã tạo tài kản nhưng ko xác thực, sẽ chặn truy cập
            if (checkUser.isVerified === false) {
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
                const sendMailToVerifyAgain = EmailService.verifyAccount({ email, verificationCode })
                checkUser.verificationCode = verificationCode
                checkUser.save()
                return resolve({
                    status: "ERR",
                    message: "Tài khoản của bạn chưa được xác thực, đã gửi mail xác thực tài khoản!",
                })
            }

            const access_token = await genToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            const refresh_token = await refresh_genToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: "OK",
                message: "Đăng nhập thành công!",
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e);
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng"
                })
            }

            if (data.password) {
                const hashedPassword = bcrypto.hashSync(data.password, 10);
                data.password = hashedPassword;
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });



            resolve({
                status: "OK",
                message: "Cập nhật tài khoản thành công!",
                data: updatedUser,
            })
        } catch (e) {
            reject(e);
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng"
                })
            }

            await User.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Xóa người dùng thành công!",
            })
        } catch (e) {
            reject(e);
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids });
            resolve({
                status: "OK",
                message: "Xóa hàng loạt người dùng thành công!",
            })
        } catch (e) {
            reject(e);
        }
    })
}



const getAllUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve({
                status: "OK",
                message: "Lấy danh sách người dùng thành công!",
                data: allUser
            })
        } catch (e) {
            reject(e);
        }
    })
}

const getDetailUser = (id, user) => {
    return new Promise(async (resolve, reject) => {
        try {


            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng"
                })
            }

            resolve({
                status: "OK",
                message: "Xem chi tiết người dùng thành công!",
                data: checkUser
            })



        } catch (e) {
            reject(e);
        }
    })
}

const forgetPassword = (userInfo) => {
    return new Promise(async (resolve, reject) => {
        const { email } = userInfo
        try {
            const checkUser = await User.findOne({
                email: email,
            })
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng!"
                })
            }

            const token = await genToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })

            const response = await PasswordResetToken.create({
                userId: checkUser.id,
                token: token,
                expiresAt: Date.now() + 5 * 60 * 1000,
            })


            const sendMail = EmailService.recoveryPassword({ email, token })


            // Trả về kết quả
            resolve({
                status: "OK",
                message:
                    "Đã gửi email khôi phục mật khẩu!",
                data: {
                    email: checkUser.email,
                    token: token,
                },
            });
        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    createUser,
    verifyAccount,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    forgetPassword,
    deleteManyUser,
    resetPassword
}