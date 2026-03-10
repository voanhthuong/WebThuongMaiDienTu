// src/pages/ForgotPasswordPage/ForgotPassword.jsx
import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Form, Input, Button, Typography, message } from 'antd';
import { ForgotPasswordWrapper, StyledForgotPasswordCard } from './Style.js';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const handleFormSubmit = async (values) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/forget-password`, { email: values.email });

      toast[res.data.status === 'OK' ? 'success' : 'error'](res.data.message);

      if (res.data.status === 'OK') {
        message.success(res.data.message)
        form.resetFields();
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
      toast.error('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error('Vui lòng kiểm tra lại thông tin email.');
  };

  const handleNavigateLogin = () => {
    navigate('/login')
  }

  return (
    <ForgotPasswordWrapper>
      <StyledForgotPasswordCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
          Quên mật khẩu?
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
          Vui lòng nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu.
        </Text>

        <Form
          form={form}
          name="forgot_password_form"
          onFinish={handleFormSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email của bạn!',
              },
              {
                type: 'email',
                message: 'Email không đúng định dạng!',
              },
            ]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi yêu cầu
            </Button>

            <Text type="secondary" >
              Đã có tài khoản? <span style={{ color: 'blueviolet', cursor: 'pointer' }} onClick={handleNavigateLogin}>Đăng nhập</span>
            </Text>
          </Form.Item>
        </Form>
      </StyledForgotPasswordCard>
    </ForgotPasswordWrapper>
  );
};

export default ForgotPassword;