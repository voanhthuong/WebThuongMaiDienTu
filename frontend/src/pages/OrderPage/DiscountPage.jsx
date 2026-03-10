// import React, { useState } from "react";
// import { Button, List, message } from "antd";
// import { convertPrice } from "../../utils";

// const DiscountPage = ({ discounts, onApply, itemPrice }) => {
//     const [selectedCode, setSelectedCode] = useState("");

//     const handleSelectDiscount = (code) => {
//         setSelectedCode(code);
//     };

//     const handleApply = () => {
//         if (selectedCode) {
//             const selectedDiscount = discounts.find(d => d.code === selectedCode);
//             if (selectedDiscount) {
//                 if (itemPrice < selectedDiscount.minValue) {
//                     message.error(`Giá trị đơn hàng tối thiểu phải là ${convertPrice(selectedDiscount.minValue)}`);
//                     return;
//                 }
//                 if (selectedDiscount.usesLeft <= 0) {
//                     message.error("Mã giảm giá này đã hết lượt sử dụng");
//                     return;
//                 }
//                 onApply(selectedCode);
//                 setSelectedCode("");
//             }
//         } else {
//             message.error("Vui lòng chọn một mã giảm giá");
//         }
//     };

//     return (
//         <div>
//             <List
//                 itemLayout="horizontal"
//                 dataSource={discounts}
//                 renderItem={(discount) => {
//                     const isDisabled = itemPrice < discount.minValue || discount.usesLeft <= 0;
//                     return (
//                         <List.Item
//                             actions={[<Button key="apply" onClick={() => handleSelectDiscount(discount.code)} disabled={isDisabled}>Chọn</Button>]}
//                         >
//                             <List.Item.Meta
//                                 title={<span style={{ color: isDisabled ? '#888' : '#000' }}>{discount.code} - {discount.type === 'percent' ? `${discount.value}%` : convertPrice(discount.value)}</span>}
//                                 description={`Min: ${convertPrice(discount.minValue)}, Uses left: ${discount.usesLeft}, Valid until: ${new Date(discount.endDate).toLocaleDateString()}`}
//                             />
//                         </List.Item>
//                     );
//                 }}
//             />
//             <Button onClick={handleApply} style={{ marginTop: 10 }}>Áp dụng mã đã chọn</Button>
//         </div>
//     );
// };

// export default DiscountPage;