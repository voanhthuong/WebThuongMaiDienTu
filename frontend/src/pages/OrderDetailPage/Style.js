// src/pages/OrderDetailPage/Style.js
import styled from 'styled-components';
import { Card } from 'antd';

export const OrderDetailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Căn trên */
  min-height: calc(100vh - 64px); /* Trừ đi chiều cao Header nếu có */
  padding: 40px 20px;
  background: #f0f2f5;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Khoảng cách giữa các phần tử chính */
  width: 100%;
  max-width: 1200px; /* Chiều rộng tối đa của nội dung */

  @media (min-width: 992px) { /* Cho màn hình lớn hơn, chia 2 cột */
    flex-direction: row;
    .left-column {
      flex: 2; /* Cột trái rộng hơn */
    }
    .right-column {
      flex: 1; /* Cột phải hẹp hơn */
    }
  }
`;

export const SectionCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
  margin-bottom: 20px; /* Khoảng cách nếu không dùng flex gap */

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  .ant-card-body {
    padding: 24px;
  }
`;

export const ProductItem = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px dashed #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
    }

    .product-info {
        flex-grow: 1;
    }

    .product-name {
        font-weight: 500;
        font-size: 16px;
        color: #333;
    }

    .product-price {
        font-size: 14px;
        color: #666;
    }

    .product-amount {
        font-size: 14px;
        color: #888;
    }
`;

export const PriceDetail = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    .label {
        color: #555;
    }

    .value {
        font-weight: 500;
        color: #333;
    }

    &.total {
        font-size: 18px;
        font-weight: bold;
        .value {
            color: #f5222d; /* Màu đỏ nổi bật cho tổng tiền */
        }
    }
`;