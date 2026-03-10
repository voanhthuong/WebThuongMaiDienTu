import HomePage from "../pages/HomePage/HomePage";
import LoginPage from '../pages/LoginPage/LoginPage'
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import ProfileUserPage from '../pages/ProfileUserPage/ProfileUserPage';
import AdminPage from "../pages/AdminPage/AdminPage";

import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage.jsx";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";

import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage.jsx";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage.jsx";

import OrderListPage from "../pages/OrderListPage/OrderListPage.jsx";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isPrivate: false,
        isShowHeader: true
    },
    
    {
        path: '/login', 
        page: LoginPage,
        isPrivate: false,
        isShowHeader: true
    },

    {
        path: '/register', 
        page: RegisterPage,
        isPrivate: false,
        isShowHeader: true
    },

    {
        path: '/productDetail/:id',
        page: ProductDetailPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/profileUser',
        page: ProfileUserPage,
        isPrivate: false,
        isShowHeader: true
    },

    {
        path: '/system/admin', 
        page: AdminPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/forgot-password', 
        page: ForgotPasswordPage,
        isPrivate: false,
        isShowHeader: true

    },

    {
        path: '/reset-password', 
        page: ResetPasswordPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/myOrder',
        page: OrderListPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/orderDetail/:orderId',
        page: OrderDetailPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '/orderSuccess',
        page: OrderSuccessPage,
        isPrivate: false,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: true

    }
];