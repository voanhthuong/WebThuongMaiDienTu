// src/pages/OrderSuccessPage/Style.js
import styled from 'styled-components';

export const OrderSuccessWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 64px); /* Trừ đi chiều cao Header nếu có */
    background: #f0f2f5;
    padding: 20px;

    .ant-result {
        background: #fff;
        padding: 48px 32px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 500px;
        width: 100%;
        text-align: center;
    }

    .ant-result-icon .anticon {
        font-size: 72px; /* Kích thước biểu tượng lớn hơn */
    }

    .ant-result-title {
        font-size: 28px;
        margin-bottom: 8px;
    }

    .ant-result-subtitle {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
        margin-bottom: 24px;
    }

    .ant-result-extra {
        margin-top: 32px;
    }
`;