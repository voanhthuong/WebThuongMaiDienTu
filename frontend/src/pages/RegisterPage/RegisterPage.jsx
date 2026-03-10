import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import axios from 'axios';
import { Container, StyledForm, RegisterWrapper, Styled1Card, StyledCard } from './Style';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;


const RegisterPage = () => {
  const [isSentCode, setIsSentCode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [verifyCode, setVerifyCode] = useState('')
  const navigate = useNavigate()
  const location = useLocation()



  const handleOnChangeName = (e) => {
    setName(e.target.value)
  }

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleOnChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleOnChangePhone = (e) => {
    setPhone(e.target.value)
  }

  const handleOnChangeAddress = (e) => {
    setAddress(e.target.value)
  }

  const handleOnChangeCity = (e) => {
    setCity(e.target.value)
  }

  const handleOnChangeVerifyCode = (e) => {
    setVerifyCode(e.target.value)
  }

  const handleNavigateLogin = () => {
    navigate('/login')
  }

  // console.log('LOG: ', name, email, password, confirmPassword, phone, address, city)


  const mutationRegister = useMutationHook(
    data => UserService.registerUser(data)
  )
  const { data: dataRegister, isPending: isPendingRegister, isSuccess: isSuccessRegister, isError: isErrorRegister } = mutationRegister

  const handleRegister = () => {
    mutationRegister.mutate({
      name,
      email,
      password,
      confirmPassword,
      phone,
      address,
      city,
    })
  }


  const mutationVerifyCode = useMutationHook(
    data => UserService.verifyUser(data)
  )

  const { data: dataVerifyCode, isPending: isPendingVerifyCode, isSuccess: isSuccessVerifyCode, isError: isErrorVerifyCode } = mutationVerifyCode

  const handleVerifyCode = () => {
    mutationVerifyCode.mutate({
      email,
      verificationCode: verifyCode,
    })

  };

  useEffect(() => {
    if (isSuccessRegister) {
      message.success(dataRegister?.message)
      setIsSentCode(true)
    } else if (isErrorRegister) {
      message.error(dataRegister?.message)
    }
  }, [dataRegister, isSuccessRegister, isErrorRegister])

  useEffect(() => {
    if (isSuccessVerifyCode) {
      if( dataVerifyCode?.status === 'ERR') {
        message.error(dataVerifyCode?.message)
        setIsSentCode(true);
      } else if (dataVerifyCode?.status === 'OK') {
      message.success(dataVerifyCode?.message)
        setIsSentCode(false);
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      handleNavigateLogin()
      }
    } else if (isErrorVerifyCode) {
      message.error(dataRegister?.message)
    }
  }, [dataVerifyCode, isSuccessVerifyCode, isErrorVerifyCode])


  return (
    <Container>
      <RegisterWrapper>
        <Styled1Card>
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>Đăng ký</Title>
          {!isSentCode ? (
            <StyledForm layout="vertical" onFinish={handleRegister}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                value={name}
              >
                <Input onChange={handleOnChangeName} />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
                value={email}
              >
                <Input onChange={handleOnChangeEmail} />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                value={password}
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password onChange={handleOnchangePassword} />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                value={confirmPassword}
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password onChange={handleOnChangeConfirmPassword} />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                value={phone}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input onChange={handleOnChangePhone} />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                value={address}
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input onChange={handleOnChangeAddress} />
              </Form.Item>
              <Form.Item
                label="Thành phố"
                name="city"
                value={city}
                rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
              >
                <Input onChange={handleOnChangeCity} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng ký
                </Button>
              </Form.Item>

              <Text type="secondary" >
                Đã có tài khoản? <span style={{ color: 'blueviolet', cursor: 'pointer' }} onClick={handleNavigateLogin}>Đăng nhập</span>
              </Text>
            </StyledForm>
          ) : (
            <StyledForm layout="vertical" onFinish={handleVerifyCode}>
              <Form.Item
                label="Nhập mã xác nhận gửi đến email"
                name="verificationCode"
                rules={[{ required: true, message: 'Hãy nhập mã xác nhận!' }]}
                value={verifyCode}
              >
                <Input onChange={handleOnChangeVerifyCode} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Xác thực
                </Button>
              </Form.Item>
            </StyledForm>
          )}
        </Styled1Card>
      </RegisterWrapper>
    </Container>
  );
};

export default RegisterPage;
