// src/pages/ResetPasswordPage/Style.js
import styled from 'styled-components';
import { Card } from 'antd'; // Import Card từ Ant Design để styled nó

// Wrapper cho toàn bộ trang, để căn giữa card
export const ResetPasswordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Đảm bảo wrapper chiếm toàn bộ chiều cao màn hình */
  background: #f0f2f5; 
`;

// Card chứa form đặt lại mật khẩu
export const StyledResetPasswordCard = styled(Card)`
  width: 100%;
  max-width: 600px; /* Giới hạn chiều rộng của card */
  padding: 16px; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 

  .ant-card-body {
    padding: 24px; 
  }

  .ant-form-item {
    margin-bottom: 16px;
  }
  .ant-input, .ant-input-password {
    border-radius: 6px;
  }
  .ant-btn {
    border-radius: 6px;
    height: 40px;
    font-size: 16px;
  }
`;