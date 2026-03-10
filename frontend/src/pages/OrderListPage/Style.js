// src/pages/OrderListPage/Style.js
import styled from 'styled-components';
import { Card } from 'antd';

export const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Căn trên thay vì giữa */
  min-height: 100vh;
  padding: 40px 20px; /* Thêm padding trên dưới */
  background: #f0f2f5;
`;

export const StyledOrderListCard = styled(Card)`
  width: 100%;
  max-width: 1200px; /* Rộng hơn để chứa bảng */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  .ant-card-body {
    padding: 24px;
  }
  .ant-table-wrapper {
    margin-top: 24px; /* Khoảng cách từ tiêu đề đến bảng */
  }
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: bold;
  }
`;