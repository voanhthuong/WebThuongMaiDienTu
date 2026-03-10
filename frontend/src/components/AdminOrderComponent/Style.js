import styled from 'styled-components';
import { Upload } from 'antd';

export const WrapperHeader = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1677ff;
`;

export const WrapperUploadFile = styled(Upload)`
  .ant-upload {
    border-radius: 8px;
    border: 1px dashed #1677ff;
    background: #fafcff;
    padding: 16px;
    width: 100%;
    min-width: 120px;
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`;

