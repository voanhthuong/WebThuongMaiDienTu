import React from 'react';
import { Layout } from 'antd';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import FooterComponent from '../FooterComponent/FooterComponent';

const { Content } = Layout;

const LayoutComponent = ({ children }) => {
  return (
    <Layout>
      <HeaderComponent />
      <Content style={{ padding: '100px 50px', background: '#f5f5f5' }}>
        {children}
      </Content>
      <FooterComponent /> 
    </Layout>
  );
};

export default LayoutComponent;
