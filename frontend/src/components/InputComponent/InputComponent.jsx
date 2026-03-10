// D:\PROJECT_VPTMART\DoAnThucTap\frontend\src\components\InputComponent\InputComponent.jsx
import React from 'react';
import { Input } from 'antd'; // Import Input từ antd

const InputComponent = ({ size, placeholder, bordered, style, ...rests }) => {
    return (
        <Input
            size={size}
            placeholder={placeholder}
            bordered={bordered}
            style={style}
            {...rests} // Truyền tất cả các props còn lại (như value, onChange, name, vv.)
        />
    );
};

export default InputComponent;