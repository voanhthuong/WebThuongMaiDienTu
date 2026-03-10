import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import { Color } from 'antd/es/color-picker';
import { Button, Input } from 'antd';


const SearchComponent = (props) => {

    const { size, placeholder, textbutton, bordered,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13, 92, 182)',
        borderRadius = '0px',
        colorButton = '#fff'
    } = props

    return (
        <div style={{ display: 'flex'}}>
            <Input
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{ backgroundColor: backgroundColorInput, borderRadius: borderRadius}}
                {...props}
            />
            <Button
                size={size}
                icon={<SearchOutlined />}
                bordered={bordered}
                style={{ background: backgroundColorButton, borderRadius: borderRadius, color: colorButton}}
                textbutton={textbutton}
                >
                {/* <span style={{ color: colorButton}}>{textbutton}</span> */}
            </Button>
        </div>
    )
}

export default SearchComponent
