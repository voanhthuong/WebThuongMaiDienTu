import { Radio } from "antd";
import styled from "styled-components";


export const WrapperStyleHeader = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span {
        color: rgb(36, 36, 36);
        font-weight: 400;
        font-size: 13px;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 8px;
    }
`

export const WrapperLeft = styled.div`
    width: 910px;
    @media (max-width: 1200px) {
        width: 100%;
    }
`

export const WrapperListOrder = styled.div`
    width: 100%;
`

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 8px;
    background: #fff;
    margin-top: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 4px;
    }
`

export const WrapperPriceDiscount = styled.span`
    color: #999;
    font-size: 12px;
    text-decoration: line-through;
    margin-left: 4px;
    @media (max-width: 768px) {
        font-size: 11px;
    }
`

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
    @media (max-width: 768px) {
        width: 100%;
        margin-top: 6px;
    }
`


export const WrapperRight = styled.div`
    width: 320px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    @media (max-width: 1024px) {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        margin-top: 16px;
        align-items: stretch;
    }
`

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    width: 100%;
    @media (max-width: 768px) {
        padding: 10px 8px;
    }
`

export const WrapperTotal = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 17px 20px;
    background: #fff;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 8px;
        padding: 10px 8px;
    }
`

export const Lable = styled.span`
    font-size: 12px;
    color: #000;
    font-weight: bold;
`

export const WrapperRadio = styled(Radio.Group)`
    margin-top: 6px;
    background: rgb(240, 248, 255);
    border: 1px solid rgb(194, 255, 255);
    width: 500px;
    border-radius: 4px;
    height: 100px;
    padding: 16px;
    font-weight: normal;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    @media (max-width: 768px) {
        width: 100%;
        min-width: 0;
        height: auto;
        padding: 10px 4px;
    }
`