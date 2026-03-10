import styled from "styled-components";
import { Button, Col } from "antd";

export const WrapperProducts = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 768px) {
    justify-content: center;
    gap: 8px;
  }
`;

export const WrapperNavbar = styled(Col)`
  background: #fff; 
  margin-right: 10px; 
  padding: 10px; 
  border-radius: 6px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
`;

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  height: auto;
  margin-top: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 12px;
  }
`;

export const WrapperHome = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #888;
  background: #f5f7fa;
  border-radius: 20px;
  padding: 6px 18px;
  margin-right: 12px;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  cursor: pointer;

  a {
    color: #1976d2;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
    &:hover {
      color: #125ea2;
      text-decoration: underline;
    }
  }

  .breadcrumb-separator {
    margin: 0 8px;
    color: #bbb;
    font-size: 16px;
    font-weight: 700;
  }
`;

export const WrapperButtonMore = styled(Button)`
  text-align: center;
  border: 1px solid #A6B28B;
  width: 240px;
  height: 46px;
  border-radius: 4px;

  background-color: ${(props) => (props.disabled ? '#d9d9d9' : '#fff')};
  color: ${(props) => (props.disabled ? 'red' : 'rgb(11, 116, 229)')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  span {
    color: ${(props) => (props.disabled ? '#fff' : '#A6B28B')};
  }

  &:hover {
    background-color: ${(props) => props.disabled ? '#d9d9d9' : '#A6B28B'} !important;
    
    span {
      color: ${(props) => (props.disabled ? 'red' : '#fff')};
    }
  }
`;

// Thêm mới 2 styled component để phân biệt danh mục cha / con
export const ParentCategory = styled.div`
  display: inline-block;
  margin-right: 16px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, #1565c0, #1e88e5);
    transform: translateY(-2px);
  }
`;

export const ChildCategory = styled.div`
  display: inline-block;
  margin-right: 12px;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1976d2;
    color: #1976d2;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }
`;
