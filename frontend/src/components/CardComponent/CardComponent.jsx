import React from 'react'
import { StyledLogo, StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './Style';
import { StarFilled } from '@ant-design/icons';
import logo from '../../assets/images/check.png'
import { Image, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'
import testIMG from '../../assets/images/GYJ.jpg'

const { Title, Text } = Typography;
const CardComponent = (props) => {

  const { countInStock, description, image, name, price, rating, type, discount, sold, id } = props

  const navigate = useNavigate()

  const handleDetailProduct = (id) => {
    navigate(`/productDetail/${id}`)
  }

  const priceAfterDiscount = price - (price * (discount / 100))
  return (
    <WrapperCardStyle
      hoverable
      styles={{
        header: { width: '200px', height: '200px' },
        body: { padding: '10px' }
      }}
      cover={<img alt="example" src={image} />}
      onClick={() => countInStock !== 0 && handleDetailProduct(id)}
      disabled={countInStock === 0}
    >

      {/* <Image src={logo} preview={false} style={{ width: '200px', height: '200px', position: 'absolute', bottom: 25, left: -11 }} /> */}
      <StyledLogo src={image} preview={false} />
      <StyleNameProduct>{name || 'Demo'}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: '4px' }}>
          <span>{(typeof rating === 'number' ? rating.toFixed(1).replace('.', ',') : (Number.parseFloat(rating)?.toFixed(1).replace('.', ',') || '2,0'))} </span> {<StarFilled style={{ fontSize: '12px', color: 'yellow' }} />}
        </span>
        <WrapperStyleTextSell> | Đã bán {sold || 5}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <Text delete style={{ marginRight: '8px' }}>{convertPrice(price) || 100000}</Text>
        <Text style={{ marginRight: '8px', color: 'red' }}>{convertPrice(priceAfterDiscount) || 100000} <WrapperDiscountText>- {discount || 5}%</WrapperDiscountText></Text>
        {/* <span style={{ marginRight: '8px' }}>{convertPrice(price) || 100000}</span> */}
        {/* <WrapperDiscountText>- {discount || 5}%</WrapperDiscountText> */}
      </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent
