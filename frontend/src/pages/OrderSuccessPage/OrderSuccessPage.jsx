// src/pages/OrderSuccessPage/OrderSuccessPage.jsx
import React from 'react';
import { Result, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { OrderSuccessWrapper } from './Style'; // Import styled component

const { Title, Text } = Typography;

const OrderSuccessPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Điều hướng về trang chủ
    };

    return (
        <OrderSuccessWrapper>
            <Result
                status="success"
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} // Màu xanh lá cho biểu tượng thành công
                title={<Title level={2}>Đặt hàng thành công!</Title>}
                subTitle={<Text>Cảm ơn bạn đã mua hàng của chúng tôi. Đơn hàng của bạn đang được xử lý.</Text>}
                extra={[
                    <Button type="primary" key="console" onClick={handleGoHome}>
                        Về trang chủ
                    </Button>,
                    // Bạn có thể thêm nút "Xem chi tiết đơn hàng" ở đây nếu muốn
                    // <Button key="buy">Xem chi tiết đơn hàng</Button>,
                ]}
            />
        </OrderSuccessWrapper>
    );
};

export default OrderSuccessPage;