

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginWrapper, StyledCard, StyledForm } from './Style';
// import axios from 'axios';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slice/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchCart } from '../../redux/slice/orderSlice';

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedInSuccess, setIsLoggedSuccess] = useState(true);
  const [verifyCode, setVerifyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleOnchangeEmail = (e) => setEmail(e.target.value);
  const handleOnchangePassword = (e) => setPassword(e.target.value);
  const handleOnChangeVerifyCode = (e) => setVerifyCode(e.target.value);
  const handleNavigateRegister = () => navigate('/register');
  const handleNavigateLogin = () => navigate('/login');
  const handleForgetPassword = () => navigate('/forgot-password');

  const mutation = useMutationHook(data => UserService.loginUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  const mutationVerifyCode = useMutationHook(data => UserService.verifyUser(data));
  const {
    data: dataVerifyCode,
    isPending: isPendingVerifyCode,
    isSuccess: isSuccessVerifyCode,
    isError: isErrorVerifyCode,
  } = mutationVerifyCode;

  const handleLogin = () => {
    mutation.mutate({ email, password });
  };

  const handleVerifyCode = () => {
    mutationVerifyCode.mutate({ email, verificationCode: verifyCode });
  };

  const handleGetDetailUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token'); //byRon
    const refresh_token = JSON.parse(storage); //byRon
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refresh_token })); //byRon
  };

// Xử lý kết quả đăng nhập
useEffect(() => {
  if (isSuccess) {
    if (data?.status === 'OK') {
      // Đăng nhập thành công
      message.success(data?.message);

      // Lưu token và lấy thông tin user
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        localStorage.setItem('access_token', JSON.stringify(data?.access_token));
        localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token)); //byRon
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
          dispatch(fetchCart(decoded?.id)); // Cập nhật giỏ hàng
        }
      } else {
        localStorage.clear();
      }

      // Điều hướng
      const redirectPath = location?.state?.from || '/';
      navigate(redirectPath);
    }

    else if (data?.status === 'ERR') {
      // Lỗi tài khoản chưa xác minh
      if (data?.message === 'Tài khoản của bạn chưa được xác thực, đã gửi mail xác thực tài khoản!') {
        message.warning('Tài khoản chưa xác minh. Vui lòng nhập mã được gửi tới email.');
        setIsLoggedSuccess(false);
      } 
      // Sai mật khẩu hoặc tài khoản không tồn tại
      else {
        message.error(data?.message || 'Đăng nhập thất bại');
        setIsLoggedSuccess(true);
      }
    } 
  }

  // Lỗi request hoặc server
  if (isError) {
    message.error(data?.message || 'Đăng nhập thất bại');
    setIsLoggedSuccess(true);
  }
}, [data, isSuccess, isError]);


  // Xử lý sau khi xác minh thành công
  useEffect(() => {
    if (isSuccessVerifyCode) {
      if (dataVerifyCode?.status === 'OK') {
        message.success(dataVerifyCode?.message || 'Xác minh thành công');

        localStorage.setItem('access_token', JSON.stringify(data?.access_token));
        if (data?.access_token) {
          const decoded = jwtDecode(data?.access_token);
          if (decoded?.id) {
            handleGetDetailUser(decoded?.id, data?.access_token);
          }
        }

        const redirectPath = location?.state?.from || '/login';
        navigate(redirectPath);
      } else {
        message.error(dataVerifyCode?.message || 'Xác minh thất bại');
      }
    } else if (isErrorVerifyCode) {
      setIsLoggedSuccess(false);
      message.error(dataVerifyCode?.message || 'Xác minh thất bại');
    }
  }, [isSuccessVerifyCode, isErrorVerifyCode, dataVerifyCode]);

  return (
    <LoginWrapper>
      {isLoggedInSuccess ? (
        <StyledCard>
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
            Đăng Nhập
          </Title>
          <Form name="login_form" initialValues={{ remember: true }} onFinish={handleLogin} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập"
                onChange={handleOnchangeEmail}
                value={email}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                onChange={handleOnchangePassword}
                value={password}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isPending}>
                Đăng nhập
              </Button>
            </Form.Item>

            <span style={{ color: 'red', cursor: 'pointer' }} onClick={handleForgetPassword}>
              Quên mật khẩu?
            </span>

            <div>
              <Text type="secondary">
                Chưa có tài khoản?{' '}
                <span style={{ color: 'blueviolet', cursor: 'pointer' }} onClick={handleNavigateRegister}>
                  Đăng ký
                </span>
              </Text>
            </div>
          </Form>
        </StyledCard>
      ) : (
        <StyledForm layout="vertical" onFinish={handleVerifyCode}>
          <Form.Item
            label="Nhập mã xác nhận gửi đến email"
            name="verificationCode"
            rules={[{ required: true, message: 'Hãy nhập mã xác nhận!' }]}
          >
            <Input value={verifyCode} onChange={handleOnChangeVerifyCode} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isPendingVerifyCode}>
              Xác thực
            </Button>
          </Form.Item>
          <Text type="secondary" onClick={() => setIsLoggedSuccess(true)} style={{ cursor: 'pointer' }}>
            Quay lại đăng nhập
          </Text>
        </StyledForm>
      )}
    </LoginWrapper>
  );
};

export default LoginPage;

