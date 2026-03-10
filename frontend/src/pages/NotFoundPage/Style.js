// src/pages/NotFoundPage/Style.js
import styled from 'styled-components';
import { Card } from 'antd';

export const NotFoundWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5; /* Màu nền nhẹ nhàng */
  text-align: center;
  flex-direction: column; /* Đảm bảo nội dung xếp chồng lên nhau */
`;

export const StyledNotFoundCard = styled(Card)`
  width: 100%;
  max-width: 500px; /* Kích thước phù hợp cho thông báo lỗi */
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Bóng đổ rõ hơn */
  background: #fff; /* Nền trắng */
`;