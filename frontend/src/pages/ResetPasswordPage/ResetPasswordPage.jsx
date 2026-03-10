// src/pages/ResetPasswordPage/ResetPassword.jsx
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Form, Input, Button, Typography, message } from 'antd'; 
import { ResetPasswordWrapper, StyledResetPasswordCard } from './Style.js'; 

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const [form] = Form.useForm(); 
  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    const { newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/reset-password`, { token, newPassword });
      
      toast[res.data.status === 'OK' ? 'success' : 'error'](res.data.message);
      
      if (res.data.status === 'OK') {
        message.success(res.data.message);
        navigate('/login');
        form.resetFields(); 
      }
    } catch (err) {
      console.error('Lỗi khi đặt lại mật khẩu:', err);
      toast.error('Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error('Vui lòng kiểm tra lại các trường mật khẩu.');
  };

  return (
    <ResetPasswordWrapper> 
      <StyledResetPasswordCard> 
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
          Đặt lại mật khẩu
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
          Vui lòng nhập mật khẩu mới của bạn.
        </Text>

        <Form
          form={form}
          name="reset_password_form"
          onFinish={handleFormSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical" 
        >
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmNewPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item> 
            <Button type="primary" htmlType="submit" block>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </StyledResetPasswordCard>
    </ResetPasswordWrapper>
  );
};

export default ResetPassword;