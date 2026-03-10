// src/pages/NotFoundPage/NotFoundPage.jsx
import React from 'react';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom'; // Dùng Link để điều hướng

import { NotFoundWrapper, StyledNotFoundCard } from './Style.js';

const { Title, Text } = Typography;

const NotFoundPage = () => {
  return (
    <NotFoundWrapper>
      <StyledNotFoundCard>
        <Title level={1} style={{ fontSize: '72px', color: '#f5222d', marginBottom: '16px' }}>
          404
        </Title>
        <Title level={3} style={{ color: '#333', marginBottom: '16px' }}>
          Không tìm thấy trang này
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px', lineHeight: '1.6' }}>
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Có thể bạn đã gõ sai địa chỉ hoặc trang đã bị xóa.
        </Text>
        <Link to="/"> {/* Link về trang chủ */}
          <Button type="primary" size="large">
            Quay về trang chủ
          </Button>
        </Link>
      </StyledNotFoundCard>
    </NotFoundWrapper>
  );
};

export default NotFoundPage;