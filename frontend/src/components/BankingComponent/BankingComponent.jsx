import { Button, Typography, message, Tooltip, Row, Col, Divider, Tag } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import React, { use, useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;

const BankingComponent = ({
    accountNumber = '1025773490',
    accountName = 'VO ANH THUONG',
    bankCode = 'VCB',
    amount,
    addInfo,
    onConfirmTransfer
}) => {
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;

    const handleCopy = (value, label) => {
        navigator.clipboard.writeText(value);
        message.success(`${label} đã được sao chép`);
    };


    



    return (
        <div
            style={{
                padding: 24,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
        >
            <Title level={4} style={{ textAlign: 'center', color: '#1677ff', marginBottom: 24 }}>
                CHUYỂN KHOẢN NGÂN HÀNG
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={14}>
                    <Paragraph>
                        <Text strong>Tên người nhận:</Text> {accountName}
                    </Paragraph>

                    <Paragraph>
                        <Text strong>Số tài khoản:</Text> {accountNumber}{' '}
                        <Tooltip title="Sao chép STK">
                            <CopyOutlined
                                onClick={() => handleCopy(accountNumber, 'Số tài khoản')}
                                style={{ marginLeft: 8, cursor: 'pointer', color: '#1677ff' }}
                            />
                        </Tooltip>
                    </Paragraph>

                    <Paragraph>
                        <Text strong>Ngân hàng:</Text> <Tag color="blue">{bankCode}</Tag>
                    </Paragraph>

                    <Paragraph>
                        <Text strong>Số tiền:</Text>{' '}
                        <Tag color="red" style={{ fontSize: 16, padding: '2px 8px' }}>
                            {amount?.toLocaleString()} VND
                        </Tag>
                    </Paragraph>

                    <Paragraph>
                        <Text strong>Nội dung chuyển khoản:</Text> {addInfo}{' '}
                        <Tooltip title="Sao chép nội dung">
                            <CopyOutlined
                                onClick={() => handleCopy(addInfo, 'Nội dung')}
                                style={{ marginLeft: 8, cursor: 'pointer', color: '#1677ff' }}
                            />
                        </Tooltip>
                    </Paragraph>

                    <Divider />

                    <Paragraph type="secondary" italic>
                        ⚠️ Vui lòng chuyển đúng số tiền và nội dung. Đơn hàng sẽ được xử lý sau khi thanh toán thành công.
                    </Paragraph>

                    <Button
                        type="primary"
                        onClick={onConfirmTransfer}
                        style={{ marginTop: 16, width: '100%', maxWidth: 200 }}
                    >
                        Đã chuyển
                    </Button>
                </Col>

                <Col xs={24} md={10} style={{ textAlign: 'center' }}>
                    <img
                        src={qrUrl}
                        alt="QR Code chuyển khoản"
                        style={{
                            width: '100%',
                            maxWidth: 250,
                            borderRadius: 8,
                            border: '1px solid #ccc',
                        }}
                    />
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                        Quét mã để chuyển khoản nhanh
                    </Text>
                </Col>
            </Row>
        </div>
    );
};

export default BankingComponent;
