// frontend/src/components/AdminDiscountComponent/style.js
import { Upload } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 16px;
    @media (max-width: 576px) {
        font-size: 15px;
        text-align: center;
        margin-bottom: 10px;
    }
`;

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload-list-item-container {
        width: 60px;
        height: 60px;
    }
    @media (max-width: 576px) {
        & .ant-upload-list-item-container {
            width: 40px;
            height: 40px;
        }
    }
`;