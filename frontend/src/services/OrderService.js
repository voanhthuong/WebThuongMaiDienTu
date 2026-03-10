import { axiosJWT } from "./UserService";



// export const createProduct = async (data) => {
//     const res = await axios.post(
//         `${process.env.REACT_APP_API_URL_BACKEND}/product/createProduct`, data, {
//         withCredentials: true
//     })
//     return res.data;
// };



export const createOrder = async (access_token, data) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/createOrder`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    })
    return res.data;
};


export const getAllOrder = async (access_token, id) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/getAllOrder/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    })
    return res.data;
};


export const getDetailOrder = async (access_token, id) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/getDetailOrder/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    })
    return res.data;
};


export const deleteOrder = async (access_token, id) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/deleteOrder/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    })
    return res.data;
};


export const getAllOrders = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/getAllOrders`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    })
    return res.data;
};
//Thương thêm QL đơn hàng
export const updateOrder = async (id, token, updateData) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/order/updateOrder/${id}`, updateData, {
            headers: {
                token: `Bearer ${token}`,
            }
        }
    )
    return res.data;
}
//

