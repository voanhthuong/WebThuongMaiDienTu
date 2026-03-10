import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Spin, Typography, Form, Input, Button, message, Upload, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  Container,
  FieldLabel,
  FieldValue,
  ProfileWrapper,
  InfoRow,
} from './Style';

import { updateUser } from '../../redux/slice/userSlice'

const axiosJWT = axios.create({ withCredentials: true });

const { Title } = Typography;

const ProfileUserPage = () => {
  const access_token = JSON.parse(localStorage.getItem('access_token'));
  const user = useSelector((state) => state.user);
  const id = user?.id;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const dispatch = useDispatch()

  // ✅ useCallback để tránh cảnh báo dependency
  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/getDetailUser/${id}`, {
        headers: { token: `Bearer ${access_token}` },
      });
      setUserData(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      setError(err.response?.data?.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  }, [id, access_token]);

  //Fix lỗi ở đây: không kiểm tra id và token ở hàm fetchUserInfo vì khi reload lại trang thì hàm sẽ không nhận được id và token do đó
  //dùng useEffect để kiểm tra sự thay đổi của id và token và gọi hàm ngay lập tức

  //Vẫn còn 1 vấn đề tìm ẩn mà khó có thể xảy ra nhưng ko phải ko xảy ra đó chính là liên quan đến token: ví ko có hàm kiểm tra xem token còn hạn sử dụng hay không
  //vì thế dù token hết hạn vẫn có thể thực hiện được việc cập nhật thông tin.
  useEffect(() => {
    if (id && access_token) {
      fetchUserInfo();
    }
  }, [id, access_token, fetchUserInfo]);

  const handleOnchangeDetailAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setFormValues((prev) => ({
        ...prev,
        avatar: file.preview,
      }));
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);
      const updatedData = {
        ...values,
        avatar: formValues.avatar || userData.avatar,
      };
      const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/user/updateUser/${id}`,
        updatedData,
        {
          headers: { token: `Bearer ${access_token}` },
        }
      );
      if (res?.data) {
        if (res?.data?.status === "OK") {
          message.success(res?.data?.message);
          setIsEditing(false);
          dispatch(updateUser({ ...res?.data?.data, access_token: access_token }));
          fetchUserInfo();
        } else {
          message.error(res?.data?.message);
        }
      }
      else {
        message.error(res?.data?.message);
      }
      return res.data
    } catch (err) {
      message.error('Lỗi khi cập nhật thông tin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Spin size="large" />
      </Container>
    );
  }

  if (error) {
    return <Container>Lỗi: {error}</Container>;
  }

  if (!userData) {
    return <Container>Không tìm thấy thông tin người dùng.</Container>;
  }

  return (
    <Container>
      <ProfileWrapper>
        <Title level={2}>Thông tin người dùng</Title>

        {isEditing ? (
          <Form
            layout="vertical"
            initialValues={userData}
            onFinish={handleUpdateUser}
            onValuesChange={(changed, all) => setFormValues(all)}
          >
            <Form.Item label="Họ tên" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Tỉnh/Thành" name="city">
              <Input />
            </Form.Item>

            <Form.Item label="Avatar" name="avatar">
              <Upload
                showUploadList={false}
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleOnchangeDetailAvatar}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              {(formValues.avatar || userData.avatar) && (
                // <img
                //   src={formValues.avatar || userData.avatar}
                //   alt="Avatar preview"
                //   style={{
                //     width: 60,
                //     height: 60,
                //     borderRadius: '50%',
                //     marginTop: 10,
                //     objectFit: 'cover',
                //   }}
                // />
                <Image
                  src={formValues.avatar || userData.avatar}
                  alt="Avatar preview"
                  preview={true}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    marginTop: 10,
                    objectFit: 'cover',
                  }}
                />


              )}
            </Form.Item>

            <Button htmlType="submit" type="primary">
              Lưu
            </Button>
            <Button onClick={() => setIsEditing(false)} style={{ marginLeft: 10 }}>
              Hủy
            </Button>
          </Form>
        ) : (
          <>
            <InfoRow>
              <FieldLabel>Họ tên:</FieldLabel>
              <FieldValue>{userData.name || 'Không có dữ liệu'}</FieldValue>
            </InfoRow>
            <InfoRow>
              <FieldLabel>Email:</FieldLabel>
              <FieldValue>{userData.email || 'Không có dữ liệu'}</FieldValue>
            </InfoRow>
            <InfoRow>
              <FieldLabel>Số điện thoại:</FieldLabel>
              <FieldValue>{userData.phone || 'Không có dữ liệu'}</FieldValue>
            </InfoRow>
            <InfoRow>
              <FieldLabel>Địa chỉ:</FieldLabel>
              <FieldValue>{userData.address || 'Không có dữ liệu'}</FieldValue>
            </InfoRow>
            <InfoRow>
              <FieldLabel>Tỉnh/Thành:</FieldLabel>
              <FieldValue>{userData.city || 'Không có dữ liệu'}</FieldValue>
            </InfoRow>
            <InfoRow>
              <FieldLabel>Avatar:</FieldLabel>
              <FieldValue>
                {userData.avatar ? (
                  // <img
                  //   src={userData.avatar}
                  //   alt="Avatar"
                  //   style={{
                  //     width: '100px',
                  //     height: '100px',
                  //     objectFit: 'cover',
                  //     borderRadius: '8px',
                  //   }}
                  // />
                  <Image
                    src={userData.avatar}
                    alt="Avatar"
                    preview={true}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  'Không có dữ liệu'
                )}
              </FieldValue>
            </InfoRow>
            <InfoRow>
              <FieldLabel>Quyền admin:</FieldLabel>
              <FieldValue>{userData.isAdmin ? 'Có' : 'Không'}</FieldValue>
            </InfoRow>
            <Button
              onClick={() => {
                setIsEditing(true);
                setFormValues(userData);
              }}
            >Chỉnh sửa
            </Button>
          </>
        )}
      </ProfileWrapper>
    </Container>
  );
};

export default ProfileUserPage;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
