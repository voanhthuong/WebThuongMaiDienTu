// import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
// import { Button, Checkbox, Form, Input, message, Radio } from "antd";
// import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal } from "./Style";
// import { useDispatch, useSelector } from "react-redux";
// import { decreaseAmount, increaseAmount, removeAllOrder, removeOrder, selectedOrder } from "../../redux/slice/orderSlice";
// import { convertPrice } from "../../utils";
// import ModalComponent from "../../components/ModalComponent/ModalComponent";
// import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
// import { useMutationHook } from "../../hooks/useMutationHook";
// import * as UserService from '../../services/UserService';
// import { updateUser } from "../../redux/slice/userSlice";
// import * as OrderService from '../../services/OrderService';
// import * as CartService from '../../services/CartService';
// import * as DiscountService from '../../services/DiscountService';
// import { useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode';
// import BankingComponent from "../../components/BankingComponent/BankingComponent";


// //Cũ
// // const PaymentPage = () => {
// //     const [form] = Form.useForm();
// //     const order = useSelector((state) => state.order);
// //     const user = useSelector((state) => state.user);
// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
// //     const [stateDetailUser, setStateDetailUser] = useState({
// //         name: '',
// //         address: '',
// //         phone: '',
// //         city: '',
// //     });
// //     const [delivery, setDelivery] = useState('fast');
// //     const [payment, setPayment] = useState('cash');
// //     const [showBankingInfo, setShowBankingInfo] = useState(false);
// //     let storageData = localStorage.getItem('access_token');
// //     storageData = storageData ? JSON.parse(storageData) : null;
// //     const [isSuccessBanking, setIsSuccessBanking] = useState(false)
// //     const [bankContent, setBankContent] = useState('')

// //     // Nhận state từ OrderPage
// //     const orderState = location.state || {};
// //     const {
// //         priceMemo: orderPriceMemo,
// //         priceDiscountMemo: orderPriceDiscountMemo,
// //         deliveryMemo: orderDeliveryMemo,
// //         totalPriceMemo: orderTotalPriceMemo,
// //         productDiscounts: orderProductDiscounts,
// //         listChecked: orderListChecked
// //     } = orderState;

// //     useEffect(() => {
// //         if (!orderState || Object.keys(orderState).length === 0) {
// //             if (!order?.orderItemSelected || order?.orderItemSelected?.length === 0) {
// //                 message.warning('Vui lòng chọn sản phẩm từ giỏ hàng trước khi thanh toán');
// //                 navigate('/order');
// //             }
// //         }
// //     }, [orderState, order, navigate]);

// //     useEffect(() => {
// //         if (isOpenModalUpdateInfo) {
// //             setStateDetailUser({
// //                 name: user?.name,
// //                 phone: user?.phone,
// //                 address: user?.address,
// //                 city: user?.city,
// //             });
// //         }
// //     }, [isOpenModalUpdateInfo]);

// //     useEffect(() => {
// //         form.setFieldsValue(stateDetailUser);
// //     }, [form, stateDetailUser]);

// //     const priceMemo = useMemo(() => {
// //         if (orderPriceMemo !== undefined) {
// //             return orderPriceMemo;
// //         }
// //         const result = order?.orderItemSelected?.reduce((total, current) => {
// //             return total + (current?.price * current?.amount);
// //         }, 0);
// //         return result;
// //     }, [order, orderPriceMemo]);

// //     const priceDiscountMemo = useMemo(() => {
// //         if (orderPriceDiscountMemo !== undefined) {
// //             return orderPriceDiscountMemo;
// //         }
// //         const result = order?.orderItemSelected?.reduce((total, current) => {
// //             return total + (current?.discount * current?.price * current?.amount) / 100;
// //         }, 0);
// //         return Number(result) || 0;
// //     }, [order, orderPriceDiscountMemo]);

// //     const deliveryMemo = useMemo(() => {
// //         if (orderDeliveryMemo !== undefined) {
// //             return orderDeliveryMemo;
// //         }
// //         if (priceMemo >= 500000 || order?.orderItemSelected?.length === 0) {
// //             return 0;
// //         } else if (priceMemo >= 200000 && priceMemo < 500000) {
// //             return 10000;
// //         } else {
// //             return 20000;
// //         }
// //     }, [priceMemo, orderDeliveryMemo]);

// //     const totalPriceMemo = useMemo(() => {
// //         if (orderTotalPriceMemo !== undefined) {
// //             return orderTotalPriceMemo;
// //         }
// //         return Number(priceMemo - priceDiscountMemo + deliveryMemo);
// //     }, [priceMemo, priceDiscountMemo, deliveryMemo, orderTotalPriceMemo]);

// //     const mutationAddOrder = useMutationHook(
// //         (data) => {
// //             const { token, ...rests } = data;
// //             const res = OrderService.createOrder(token, { ...rests });
// //             return res;
// //         },
// //     );
// //     const { isPending: isPendingAddOrder, data: dataAddOrder, isSuccess, isError } = mutationAddOrder;

// //     const handleAddOrder = () => {
// //         if (!storageData) {
// //             message.error('Vui lòng đăng nhập để đặt hàng');
// //             return;
// //         }

// //         if (!order?.orderItemSelected || !user?.name || !user?.address || !user?.phone || !user?.city || !priceMemo) {
// //             message.error('Vui lòng kiểm tra lại thông tin đặt hàng');
// //             return;
// //         }

// //         let userId = user?.id;
// //         if (!userId && storageData) {
// //             try {
// //                 const decoded = jwtDecode(storageData);
// //                 userId = decoded?.id;
// //             } catch (error) {
// //                 console.error('Error decoding token:', error);
// //                 message.error('Có lỗi xảy ra khi xác thực người dùng');
// //                 return;
// //             }
// //         }

// //         if (!userId) {
// //             message.error('Không thể xác định người dùng');
// //             return;
// //         }

// //         if (payment === 'banking') {
// //             setShowBankingInfo(true); // Show banking info only for bank transfer
// //         } else {
// //             // For cash payment, directly create the order
// //             mutationAddOrder.mutate({
// //                 token: storageData,
// //                 orderItems: order?.orderItemSelected,
// //                 fullName: user?.name,
// //                 address: user?.address,
// //                 phone: user?.phone,
// //                 city: user?.city,
// //                 paymentMethod: payment,
// //                 itemsPrice: priceMemo,
// //                 shippingPrice: deliveryMemo,
// //                 totalPrice: totalPriceMemo,
// //                 user: userId,
// //                 email: user?.email
// //             });
// //         }
// //     };

// //     const handleConfirmTransfer = (paidAt) => {
// //         // Confirm the bank transfer and create the order
// //         let userId = user?.id;
// //         if (!userId && storageData) {
// //             try {
// //                 const decoded = jwtDecode(storageData);
// //                 userId = decoded?.id;
// //             } catch (error) {
// //                 console.error('Error decoding token:', error);
// //                 message.error('Có lỗi xảy ra khi xác thực người dùng');
// //                 return;
// //             }
// //         }



// //         mutationAddOrder.mutate({
// //             token: storageData,
// //             orderItems: order?.orderItemSelected,
// //             fullName: user?.name,
// //             address: user?.address,
// //             phone: user?.phone,
// //             city: user?.city,
// //             paymentMethod: payment,
// //             itemsPrice: priceMemo,
// //             shippingPrice: deliveryMemo,
// //             totalPrice: totalPriceMemo,
// //             user: userId,
// //             email: user?.email,
// //             isPaid: true,
// //             paidAt: paidAt,
// //         });
// //     };



// //     useEffect(() => {
// //         if (isSuccess) {
// //             const orderArray = [];
// //             order?.orderItemSelected?.forEach(element => {
// //                 orderArray.push(element?.product);
// //             });
// //             dispatch(removeAllOrder({ listChecked: orderArray }));

// //             let userId = user?.id;
// //             if (!userId && storageData) {
// //                 try {
// //                     const decoded = jwtDecode(storageData);
// //                     userId = decoded?.id;
// //                 } catch (error) {
// //                     console.error('Error decoding token:', error);
// //                 }
// //             }

// //             if (userId) {
// //                 CartService.deleteCart(userId);
// //             }

// //             const updateDiscountUsage = async () => {
// //                 try {
// //                     const appliedDiscounts = orderProductDiscounts || {};
// //                     for (const [productId, discount] of Object.entries(appliedDiscounts)) {
// //                         if (discount && discount._id && userId) {
// //                             try {
// //                                 await DiscountService.updateDiscountUsage(
// //                                     discount._id,
// //                                     userId,
// //                                     storageData
// //                                 );
// //                                 console.log(`Đã cập nhật thông tin sử dụng mã giảm giá: ${discount.code}`);
// //                             } catch (error) {
// //                                 console.error(`Lỗi khi cập nhật mã giảm giá ${discount.code}:`, error);
// //                             }
// //                         }
// //                     }
// //                 } catch (error) {
// //                     console.error('Lỗi khi cập nhật thông tin sử dụng mã giảm giá:', error);
// //                 }
// //             };

// //             updateDiscountUsage();
// //             message.success("Đơn hàng đã được đặt thành công!");
// //             navigate('/orderSuccess', {
// //                 state: {
// //                     delivery: delivery,
// //                     paymentMethod: payment,
// //                     orders: order?.orderItemSelected,
// //                     totalPriceMemo: totalPriceMemo,
// //                 }
// //             });
// //         } else if (isError) {
// //             message.error(dataAddOrder?.message || 'Có lỗi xảy ra khi đặt hàng');
// //         }
// //     }, [isSuccess, isError, orderProductDiscounts, user?.id, storageData]);

// //     const handleCancelUpdateInfo = () => {
// //         setStateDetailUser({
// //             name: '',
// //             address: '',
// //             phone: '',
// //             city: '',
// //         });
// //         form.resetFields();
// //         setIsOpenModalUpdateInfo(false);
// //     };

// //     const mutationUpdateUser = useMutationHook(
// //         (data) => {
// //             const { id, token, ...rests } = data;
// //             const res = UserService.updateUser(id, token, { ...rests });
// //             return res;
// //         },
// //     );

// //     const handleUpdateUserInfo = () => {
// //         const { name, address, phone, city } = stateDetailUser;
// //         if (!storageData) {
// //             message.error('Vui lòng đăng nhập để cập nhật thông tin');
// //             return;
// //         }

// //         if (name && address && city && phone) {
// //             let userId = user?.id;
// //             if (!userId && storageData) {
// //                 try {
// //                     const decoded = jwtDecode(storageData);
// //                     userId = decoded?.id;
// //                 } catch (error) {
// //                     console.error('Error decoding token:', error);
// //                     message.error('Có lỗi xảy ra khi xác thực người dùng');
// //                     return;
// //                 }
// //             }

// //             if (!userId) {
// //                 message.error('Không thể xác định người dùng');
// //                 return;
// //             }

// //             const updateData = {
// //                 id: userId,
// //                 token: storageData,
// //                 name: stateDetailUser.name,
// //                 address: stateDetailUser.address,
// //                 phone: stateDetailUser.phone,
// //                 city: stateDetailUser.city
// //             };

// //             mutationUpdateUser.mutate(updateData, {
// //                 onSuccess: () => {
// //                     dispatch(updateUser({
// //                         name,
// //                         address,
// //                         phone,
// //                         city,
// //                         avatar: user?.avatar
// //                     }));
// //                     setIsOpenModalUpdateInfo(false);
// //                     message.success('Cập nhật thông tin thành công');
// //                 },
// //                 onError: (error) => {
// //                     console.error('Update user error:', error);
// //                     message.error('Có lỗi xảy ra khi cập nhật thông tin');
// //                 }
// //             });
// //         } else {
// //             message.error('Vui lòng điền đầy đủ thông tin');
// //         }
// //     };

// //     const handleOnChangeDetailUser = (e) => {
// //         setStateDetailUser({
// //             ...stateDetailUser,
// //             [e.target.name]: e.target.value
// //         });
// //     };

// //     const handleDelivery = (e) => {
// //         setDelivery(e.target.value);
// //     };

// //     const handlePayment = (e) => {
// //         setPayment(e.target.value);
// //     };


// //     const addInfo = () => {
// //         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// //         let result = '';
// //         for (let i = 0; i < 6; i++) {
// //             const randomIndex = Math.floor(Math.random() * chars.length);
// //             result += chars[randomIndex];
// //         }
// //         return result;
// //         // return `VPT${user?.id}${order?.orderItemSelected?.length}`;
// //     }


// //     // console.log('addInfo', addInfo());

// //     // console.log('order', order)


// //     //Viết hàm tạo mã ngẫu nhiên 
// //     // const addInfo = () => {
// //     //     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// //     //     let result = '';
// //     //     for (let i = 0; i < 6; i++) {
// //     //         const randomIndex = Math.floor(Math.random() * chars.length);
// //     //         result += chars[randomIndex];
// //     //     }
// //     //     return result;
// //     // }






// //     //kiểm tra xem đã chuyển khoản hay chưa
// //     async function checkPaid(totalPrice, addInfo = addInfo) {
// //         if (isSuccessBanking) {
// //             return
// //         } else {
// //             try {
// //                 const res = await fetch("https://script.google.com/macros/s/AKfycbzEf-EK7Yz8AyheoFWeOvRkCmX1fKNh0dNbN5uk2qvvKNOn9DwgumLQRVH19rlUgV6d/exec")
// //                 // console.log('checkPaid response:', res);
// //                 const data = await res.json();
// //                 console.log('checkPaid data:', data.data);
// //                 const lastPayment = data.data[data.data.length - 1];
// //                 //lấy thông tin thanh toán cuối cùng
// //                 const lastPaymentAmount = lastPayment['Giá trị'];
// //                 const lastPaymentAddInfo = lastPayment['Mô tả'];
// //                 const paidAt = lastPayment['Ngày diễn ra']

// //                 console.log('addInfo', addInfo)


// //             } catch (error) {
// //                 console.error('Error checking payment:', error);
// //                 message.error('Lỗi khi kiểm tra thanh toán. Vui lòng thử lại sau.');
// //             }
// //         }

// //     }
// //     checkPaid(totalPriceMemo, addInfo())



// //     return (
// //         <div style={{ background: '#f5f5fa', width: '100%' }}>
// //             <style>{`
// //                 @media (max-width: 1024px) {
// //                     .paymentpage-main-wrapper {
// //                         flex-direction: column !important;
// //                         gap: 0 !important;
// //                     }
// //                 }
// //             `}</style>
// //             <LoadingComponent isPending={isPendingAddOrder}>
// //                 <div
// //                     style={{
// //                         width: '100%',
// //                         maxWidth: 1270,
// //                         margin: '0 auto',
// //                         padding: '0 8px',
// //                     }}
// //                 >
// //                     <h2>Thanh toán</h2>
// //                     <div
// //                         className="paymentpage-main-wrapper"
// //                         style={{
// //                             display: 'flex',
// //                             flexDirection: 'row',
// //                             justifyContent: 'center',
// //                             alignItems: 'flex-start',
// //                             gap: 20,
// //                             flexWrap: 'wrap',
// //                         }}
// //                     >
// //                         <div style={{ flex: 2, minWidth: 320, maxWidth: 900, width: '100%' }}>
// //                             <WrapperInfo>
// //                                 <div>
// //                                     <Lable>Chọn phương thức giao hàng</Lable>
// //                                     <WrapperRadio onChange={handleDelivery} value={delivery} defaultValue={'fast'}>
// //                                         <Radio value='fast'><span style={{ color: '#ea8600', fontWeight: 'bold' }}>Fast</span> - giao hàng nhanh chóng</Radio>
// //                                         <Radio value='gojek'><span style={{ color: '#ea8600', fontWeight: 'bold' }}>GoJek</span> - giao hàng tiết kiệm</Radio>
// //                                     </WrapperRadio>
// //                                 </div>
// //                             </WrapperInfo>
// //                             <WrapperInfo>
// //                                 <Lable>Chọn phương thức thanh toán</Lable>
// //                                 <WrapperRadio onChange={handlePayment} value={payment}>
// //                                     <Radio value='cash'>Thanh toán khi nhận hàng</Radio>
// //                                     <Radio value='banking'>Thanh toán chuyển khoản</Radio>
// //                                 </WrapperRadio>
// //                                 {showBankingInfo && payment === 'banking' && (
// //                                     <div style={{ marginTop: 16, marginBottom: 16, border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
// //                                         <BankingComponent
// //                                             amount={totalPriceMemo}
// //                                             addInfo={addInfo()}
// //                                             onConfirmTransfer={handleConfirmTransfer}
// //                                         />
// //                                     </div>
// //                                 )}
// //                             </WrapperInfo>
// //                         </div>
// //                         <div style={{ flex: 1, minWidth: 260, maxWidth: 400, width: '100%' }}>
// //                             <WrapperRight>
// //                                 <div style={{ width: '100%' }}>
// //                                     <WrapperInfo>
// //                                         <div>
// //                                             <span>Địa chỉ: </span>
// //                                             <span style={{ fontWeight: 'bold' }}>{` ${user?.address} ${user?.city} `}</span>
// //                                             <span onClick={() => setIsOpenModalUpdateInfo(true)} style={{ color: 'blue', cursor: 'pointer' }}>Thay đổi</span>
// //                                         </div>
// //                                     </WrapperInfo>
// //                                     <WrapperInfo>
// //                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //                                             <span>Tạm tính</span>
// //                                             <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
// //                                         </div>
// //                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //                                             <span>Giảm giá</span>
// //                                             <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
// //                                         </div>
// //                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //                                             <span>Phí giao hàng</span>
// //                                             <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(deliveryMemo)}</span>
// //                                         </div>
// //                                     </WrapperInfo>
// //                                     <WrapperTotal>
// //                                         <span>Tổng tiền</span>
// //                                         <span style={{ display: 'flex', flexDirection: 'column' }}>
// //                                             <span style={{ color: 'rgb(254, 56, 52)', fontSize: 24, fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
// //                                             <span style={{ color: '#000', fontSize: 11 }}>(Đã bao gồm thuế nếu có)</span>
// //                                         </span>
// //                                     </WrapperTotal>
// //                                 </div>
// //                                 <Button
// //                                     onClick={handleAddOrder}
// //                                     style={{
// //                                         color: '#fff',
// //                                         background: 'rgb(75, 179, 240)',
// //                                         height: 48,
// //                                         width: '100%',
// //                                         maxWidth: 320,
// //                                         border: 'none',
// //                                         borderRadius: 4,
// //                                         fontWeight: 'bold',
// //                                         marginTop: 12,
// //                                     }}
// //                                 >Đặt hàng</Button>
// //                             </WrapperRight>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdateInfo} okText='Yes' onOk={handleUpdateUserInfo}>
// //                     <LoadingComponent isPending={mutationUpdateUser.isPending}>
// //                         <Form
// //                             name="basic"
// //                             labelCol={{ span: 4 }}
// //                             wrapperCol={{ span: 20 }}
// //                             style={{ maxWidth: 600 }}
// //                             autoComplete="off"
// //                             form={form}
// //                         >
// //                             <Form.Item
// //                                 label="Name"
// //                                 name="name"
// //                                 rules={[{ required: true, message: 'Please input your Name!' }]}
// //                             >
// //                                 <Input value={stateDetailUser.name} onChange={handleOnChangeDetailUser} name='name' />
// //                             </Form.Item>
// //                             <Form.Item
// //                                 label="City"
// //                                 name="city"
// //                                 rules={[{ required: true, message: 'Please input your City!' }]}
// //                             >
// //                                 <Input value={stateDetailUser.city} onChange={handleOnChangeDetailUser} name='city' />
// //                             </Form.Item>
// //                             <Form.Item
// //                                 label="Address"
// //                                 name="address"
// //                                 rules={[{ required: true, message: 'Please input your Address!' }]}
// //                             >
// //                                 <Input value={stateDetailUser.address} onChange={handleOnChangeDetailUser} name='address' />
// //                             </Form.Item>
// //                             <Form.Item
// //                                 label="Phone"
// //                                 name="phone"
// //                                 rules={[{ required: true, message: 'Please input your Phone!' }]}
// //                             >
// //                                 <Input value={stateDetailUser.phone} onChange={handleOnChangeDetailUser} name='phone' />
// //                             </Form.Item>
// //                         </Form>
// //                     </LoadingComponent>
// //                 </ModalComponent>
// //             </LoadingComponent>
// //         </div>
// //     );
// // };

// // export default PaymentPage;


// const PaymentPage = () => {
//     const [form] = Form.useForm();
//     const order = useSelector((state) => state.order);
//     const user = useSelector((state) => state.user);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
//     const [delivery, setDelivery] = useState('fast');
//     const [payment, setPayment] = useState('cash');
//     const [showBankingInfo, setShowBankingInfo] = useState(false);
//     const [isSuccessBanking, setIsSuccessBanking] = useState(false);

//     // Chốt "chỉ xử lý success 1 lần"
//     const successHandledRef = useRef(false);

//     let storageData = localStorage.getItem('access_token');
//     storageData = storageData ? JSON.parse(storageData) : null;

//     // Nhận state từ OrderPage (nếu có)
//     const orderState = location.state || {};
//     const {
//         priceMemo: orderPriceMemo,
//         priceDiscountMemo: orderPriceDiscountMemo,
//         deliveryMemo: orderDeliveryMemo,
//         totalPriceMemo: orderTotalPriceMemo,
//         productDiscounts: orderProductDiscounts,
//     } = orderState;

//     // Guard: nếu không có item → về trang Order
//     useEffect(() => {
//         if (!orderState || Object.keys(orderState).length === 0) {
//             if (!order?.orderItemSelected || order?.orderItemSelected?.length === 0) {
//                 message.warning('Vui lòng chọn sản phẩm từ giỏ hàng trước khi thanh toán');
//                 navigate('/order');
//             }
//         }
//     }, [orderState, order, navigate]);

//     // Chỉ set form values khi mở modal (tránh loop)
//     useEffect(() => {
//         if (isOpenModalUpdateInfo) {
//             form.setFieldsValue({
//                 name: user?.name || '',
//                 phone: user?.phone || '',
//                 address: user?.address || '',
//                 city: user?.city || '',
//             });
//         }
//     }, [isOpenModalUpdateInfo, user, form]);

//     // Tính tiền
//     const priceMemo = useMemo(() => {
//         if (orderPriceMemo !== undefined) return orderPriceMemo;
//         const result = order?.orderItemSelected?.reduce((total, current) => {
//             return total + (current?.price * current?.amount);
//         }, 0);
//         return result || 0;
//     }, [order, orderPriceMemo]);

//     const priceDiscountMemo = useMemo(() => {
//         if (orderPriceDiscountMemo !== undefined) return orderPriceDiscountMemo;
//         const result = order?.orderItemSelected?.reduce((total, current) => {
//             return total + (current?.discount * current?.price * current?.amount) / 100;
//         }, 0);
//         return Number(result) || 0;
//     }, [order, orderPriceDiscountMemo]);

//     const deliveryMemo = useMemo(() => {
//         if (orderDeliveryMemo !== undefined) return orderDeliveryMemo;
//         if (priceMemo >= 500000 || order?.orderItemSelected?.length === 0) return 0;
//         if (priceMemo >= 200000 && priceMemo < 500000) return 10000;
//         return 20000;
//     }, [priceMemo, orderDeliveryMemo, order?.orderItemSelected?.length]);

//     const totalPriceMemo = useMemo(() => {
//         if (orderTotalPriceMemo !== undefined) return orderTotalPriceMemo;
//         return Number(priceMemo - priceDiscountMemo + deliveryMemo);
//     }, [priceMemo, priceDiscountMemo, deliveryMemo, orderTotalPriceMemo]);

//     // ====== addInfo: sinh & chốt MỘT LẦN khi hiển thị banking ======
//     const generateAddInfo = useCallback(() => {
//         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//         let result = '';
//         for (let i = 0; i < 6; i++) {
//             result += chars[Math.floor(Math.random() * chars.length)];
//         }
//         return result;
//     }, []);

//     const addInfoRef = useRef('');

//     useEffect(() => {
//         if (payment === 'banking' && showBankingInfo && !addInfoRef.current) {
//             addInfoRef.current = generateAddInfo();
//         }
//         // Nếu muốn clear khi đổi phương thức, có thể bật:
//         // else if (payment !== 'banking') {
//         //   addInfoRef.current = '';
//         // }
//     }, [payment, showBankingInfo, generateAddInfo]);

//     // ====== Tạo đơn hàng ======
//     const mutationAddOrder = useMutationHook((data) => {
//         const { token, ...rests } = data;
//         const res = OrderService.createOrder(token, { ...rests });
//         return res;
//     });
//     const { isPending: isPendingAddOrder, data: dataAddOrder, isSuccess, isError } = mutationAddOrder;

//     const handleAddOrder = () => {
//         if (!storageData) {
//             message.error('Vui lòng đăng nhập để đặt hàng');
//             return;
//         }
//         if (!order?.orderItemSelected || !user?.name || !user?.address || !user?.phone || !user?.city || !priceMemo) {
//             message.error('Vui lòng kiểm tra lại thông tin đặt hàng');
//             return;
//         }

//         let userId = user?.id;
//         if (!userId && storageData) {
//             try {
//                 const decoded = jwtDecode(storageData);
//                 userId = decoded?.id;
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//                 message.error('Có lỗi xảy ra khi xác thực người dùng');
//                 return;
//             }
//         }
//         if (!userId) {
//             message.error('Không thể xác định người dùng');
//             return;
//         }

//         if (payment === 'banking') {
//             setShowBankingInfo(true); // Mở khu vực Banking; addInfo sẽ được tạo trong effect
//         } else {
//             // COD → tạo đơn ngay
//             mutationAddOrder.mutate({
//                 token: storageData,
//                 orderItems: order?.orderItemSelected,
//                 fullName: user?.name,
//                 address: user?.address,
//                 phone: user?.phone,
//                 city: user?.city,
//                 paymentMethod: payment,
//                 itemsPrice: priceMemo,
//                 shippingPrice: deliveryMemo,
//                 totalPrice: totalPriceMemo,
//                 user: userId,
//                 email: user?.email
//             });
//         }
//     };

//     const handleConfirmTransfer = (paidAt) => {
//         let userId = user?.id;
//         if (!userId && storageData) {
//             try {
//                 const decoded = jwtDecode(storageData);
//                 userId = decoded?.id;
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//                 message.error('Có lỗi xảy ra khi xác thực người dùng');
//                 return;
//             }
//         }
//         mutationAddOrder.mutate({
//             token: storageData,
//             orderItems: order?.orderItemSelected,
//             fullName: user?.name,
//             address: user?.address,
//             phone: user?.phone,
//             city: user?.city,
//             paymentMethod: payment,
//             itemsPrice: priceMemo,
//             shippingPrice: deliveryMemo,
//             totalPrice: totalPriceMemo,
//             user: userId,
//             email: user?.email,
//             isPaid: true,
//             paidAt: paidAt,
//         });
//     };

//     // ====== Polling check chuyển khoản (dùng CÙNG addInfo + dừng khi success) ======
//     async function checkPaid(totalPrice, addInfoCode) {
//         if (isSuccessBanking) return;
//         try {
//             const res = await fetch("https://script.google.com/macros/s/AKfycbzEf-EK7Yz8AyheoFWeOvRkCmX1fKNh0dNbN5uk2qvvKNOn9DwgumLQRVH19rlUgV6d/exec");
//             const data = await res.json();
//             const arr = Array.isArray(data?.data) ? data.data : [];
//             if (!arr.length) return;

//             const lastPayment = arr[arr.length - 1];
//             const lastPaymentAmount = Number(lastPayment['Giá trị']);
//             const lastPaymentAddInfo = (lastPayment['Mô tả'] || '').trim();
//             const paidAt = lastPayment['Ngày diễn ra'];

//             if (Number(totalPrice) === lastPaymentAmount && lastPaymentAddInfo.includes(addInfoCode)) {
//                 setIsSuccessBanking(true);
//                 handleConfirmTransfer(paidAt);
//             }
//         } catch (error) {
//             console.error('Error checking payment:', error);
//             message.error('Lỗi khi kiểm tra thanh toán. Vui lòng thử lại sau.');
//         }
//     }

//     useEffect(() => {
//         if (payment === 'banking' && showBankingInfo && addInfoRef.current && !isSuccessBanking && !isSuccess) {
//             // gọi ngay 1 lần
//             checkPaid(totalPriceMemo, addInfoRef.current);
//             // poll mỗi 5s
//             const id = setInterval(() => {
//                 checkPaid(totalPriceMemo, addInfoRef.current);
//             }, 5000);
//             return () => clearInterval(id);
//         }
//     }, [payment, showBankingInfo, totalPriceMemo, isSuccessBanking, isSuccess]);

//     // ====== Xử lý SAU KHI TẠO ĐƠN THÀNH CÔNG — chạy 1 lần duy nhất ======
//     useEffect(() => {
//         if (isSuccess && !successHandledRef.current) {
//             successHandledRef.current = true;

//             const orderArray = (order?.orderItemSelected || [])
//                 .map(e => e?.product)
//                 .filter(Boolean);

//             if (orderArray.length) {
//                 dispatch(removeAllOrder({ listChecked: orderArray }));
//             }

//             (async () => {
//                 let userId = user?.id;
//                 if (!userId && storageData) {
//                     try {
//                         const decoded = jwtDecode(storageData);
//                         userId = decoded?.id;
//                     } catch (e) {
//                         console.error('decode error:', e);
//                     }
//                 }

//                 if (userId) {
//                     try { await CartService.deleteCart(userId); } catch (e) { console.error(e); }
//                 }

//                 // cập nhật usage mã giảm giá (nếu có)
//                 try {
//                     const appliedDiscounts = orderProductDiscounts || {};
//                     for (const [, discount] of Object.entries(appliedDiscounts)) {
//                         if (discount && discount._id && userId) {
//                             try {
//                                 await DiscountService.updateDiscountUsage(discount._id, userId, storageData);
//                             } catch (e) {
//                                 console.error(`Update discount ${discount?.code} error:`, e);
//                             }
//                         }
//                     }
//                 } catch (e) {
//                     console.error('updateDiscountUsage wrapper error:', e);
//                 }
//             })()
//                 .finally(() => {
//                     message.success('Đơn hàng đã được đặt thành công!');
//                     navigate('/orderSuccess', {
//                         replace: true,
//                         state: {
//                             delivery,
//                             paymentMethod: payment,
//                             orders: order?.orderItemSelected,
//                             totalPriceMemo,
//                         },
//                     });
//                 });
//         }

//         if (isError && !successHandledRef.current) {
//             successHandledRef.current = true;
//             message.error(dataAddOrder?.message || 'Có lỗi xảy ra khi đặt hàng');
//         }
//         // eslint-disable-next-line
//     }, [isSuccess, isError]); // CHỈ 2 deps để tránh loop

//     // ====== Cập nhật thông tin giao hàng qua AntD Form (tránh controlled inputs) ======
//     const mutationUpdateUser = useMutationHook((data) => {
//         const { id, token, ...rests } = data;
//         const res = UserService.updateUser(id, token, { ...rests });
//         return res;
//     });

//     const handleUpdateUserInfo = async () => {
//         if (!storageData) {
//             message.error('Vui lòng đăng nhập để cập nhật thông tin');
//             return;
//         }
//         try {
//             const values = await form.validateFields();

//             let userId = user?.id;
//             if (!userId && storageData) {
//                 try {
//                     const decoded = jwtDecode(storageData);
//                     userId = decoded?.id;
//                 } catch (error) {
//                     console.error('Error decoding token:', error);
//                     message.error('Có lỗi xảy ra khi xác thực người dùng');
//                     return;
//                 }
//             }
//             if (!userId) {
//                 message.error('Không thể xác định người dùng');
//                 return;
//             }

//             const updateData = {
//                 id: userId,
//                 token: storageData,
//                 name: values.name,
//                 address: values.address,
//                 phone: values.phone,
//                 city: values.city
//             };

//             mutationUpdateUser.mutate(updateData, {
//                 onSuccess: () => {
//                     dispatch(updateUser({
//                         name: values.name,
//                         address: values.address,
//                         phone: values.phone,
//                         city: values.city,
//                         avatar: user?.avatar
//                     }));
//                     setIsOpenModalUpdateInfo(false);
//                     message.success('Cập nhật thông tin thành công');
//                 },
//                 onError: (error) => {
//                     console.error('Update user error:', error);
//                     message.error('Có lỗi xảy ra khi cập nhật thông tin');
//                 }
//             });
//         } catch {
//             // validateFields đã hiển thị lỗi
//         }
//     };

//     const handleCancelUpdateInfo = () => {
//         form.resetFields();
//         setIsOpenModalUpdateInfo(false);
//     };

//     const handleDelivery = (e) => setDelivery(e.target.value);
//     const handlePayment = (e) => setPayment(e.target.value);

//     return (
//         <div style={{ background: '#f5f5fa', width: '100%' }}>
//             <style>{`
//         @media (max-width: 1024px) {
//           .paymentpage-main-wrapper {
//             flex-direction: column !important;
//             gap: 0 !important;
//           }
//         }
//       `}</style>
//             <LoadingComponent isPending={isPendingAddOrder}>
//                 <div style={{ width: '100%', maxWidth: 1270, margin: '0 auto', padding: '0 8px' }}>
//                     <h2>Thanh toán</h2>
//                     <div
//                         className="paymentpage-main-wrapper"
//                         style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}
//                     >
//                         <div style={{ flex: 2, minWidth: 320, maxWidth: 900, width: '100%' }}>
//                             <WrapperInfo>
//                                 <div>
//                                     <Lable>Chọn phương thức giao hàng</Lable>
//                                     <WrapperRadio onChange={handleDelivery} value={delivery} defaultValue={'fast'}>
//                                         <Radio value='fast'><span style={{ color: '#ea8600', fontWeight: 'bold' }}>Fast</span> - giao hàng nhanh chóng</Radio>
//                                         <Radio value='gojek'><span style={{ color: '#ea8600', fontWeight: 'bold' }}>GoJek</span> - giao hàng tiết kiệm</Radio>
//                                     </WrapperRadio>
//                                 </div>
//                             </WrapperInfo>

//                             <WrapperInfo>
//                                 <Lable>Chọn phương thức thanh toán</Lable>
//                                 <WrapperRadio onChange={handlePayment} value={payment}>
//                                     <Radio value='cash'>Thanh toán khi nhận hàng</Radio>
//                                     <Radio value='banking'>Thanh toán chuyển khoản</Radio>
//                                 </WrapperRadio>

//                                 {showBankingInfo && payment === 'banking' && (
//                                     <div style={{ marginTop: 16, marginBottom: 16, border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
//                                         <BankingComponent
//                                             amount={totalPriceMemo}
//                                             addInfo={addInfoRef.current}   // dùng CHUNG một mã
//                                             onConfirmTransfer={handleConfirmTransfer}
//                                         />
//                                     </div>
//                                 )}
//                             </WrapperInfo>
//                         </div>

//                         <div style={{ flex: 1, minWidth: 260, maxWidth: 400, width: '100%' }}>
//                             <WrapperRight>
//                                 <div style={{ width: '100%' }}>
//                                     <WrapperInfo>
//                                         <div>
//                                             <span>Địa chỉ: </span>
//                                             <span style={{ fontWeight: 'bold' }}>{` ${user?.address} ${user?.city} `}</span>
//                                             <span onClick={() => setIsOpenModalUpdateInfo(true)} style={{ color: 'blue', cursor: 'pointer' }}>Thay đổi</span>
//                                         </div>
//                                     </WrapperInfo>

//                                     <WrapperInfo>
//                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                                             <span>Tạm tính</span>
//                                             <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
//                                         </div>
//                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                                             <span>Giảm giá</span>
//                                             <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
//                                         </div>
//                                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                                             <span>Phí giao hàng</span>
//                                             <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(deliveryMemo)}</span>
//                                         </div>
//                                     </WrapperInfo>

//                                     <WrapperTotal>
//                                         <span>Tổng tiền</span>
//                                         <span style={{ display: 'flex', flexDirection: 'column' }}>
//                                             <span style={{ color: 'rgb(254, 56, 52)', fontSize: 24, fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
//                                             <span style={{ color: '#000', fontSize: 11 }}>(Đã bao gồm thuế nếu có)</span>
//                                         </span>
//                                     </WrapperTotal>
//                                 </div>

//                                 <Button
//                                     onClick={handleAddOrder}
//                                     style={{
//                                         color: '#fff',
//                                         background: 'rgb(75, 179, 240)',
//                                         height: 48,
//                                         width: '100%',
//                                         maxWidth: 320,
//                                         border: 'none',
//                                         borderRadius: 4,
//                                         fontWeight: 'bold',
//                                         marginTop: 12,
//                                     }}
//                                 >
//                                     Đặt hàng
//                                 </Button>
//                             </WrapperRight>
//                         </div>
//                     </div>
//                 </div>

//                 <ModalComponent
//                     forceRender
//                     title="Cập nhật thông tin giao hàng"
//                     open={isOpenModalUpdateInfo}
//                     onCancel={handleCancelUpdateInfo}
//                     okText='Yes'
//                     onOk={handleUpdateUserInfo}
//                 >
//                     <LoadingComponent isPending={mutationUpdateUser.isPending}>
//                         <Form
//                             name="basic"
//                             labelCol={{ span: 4 }}
//                             wrapperCol={{ span: 20 }}
//                             style={{ maxWidth: 600 }}
//                             autoComplete="off"
//                             form={form}
//                         >
//                             <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your Name!' }]}>
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input your City!' }]}>
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your Address!' }]}>
//                                 <Input />
//                             </Form.Item>
//                             <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your Phone!' }]}>
//                                 <Input />
//                             </Form.Item>
//                         </Form>
//                     </LoadingComponent>
//                 </ModalComponent>
//             </LoadingComponent>
//         </div>
//     );
// };

// export default PaymentPage;



import { Button, Form, Input, message, Radio } from "antd";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Lable, WrapperInfo, WrapperRadio, WrapperRight, WrapperTotal } from "./Style";
import { useDispatch, useSelector } from "react-redux";
import { removeAllOrder } from "../../redux/slice/orderSlice";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from '../../services/UserService';
import { updateUser } from "../../redux/slice/userSlice";
import * as OrderService from '../../services/OrderService';
import * as CartService from '../../services/CartService';
import * as DiscountService from '../../services/DiscountService';
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import BankingComponent from "../../components/BankingComponent/BankingComponent";

const PaymentPage = () => {
  const [form] = Form.useForm();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [delivery, setDelivery] = useState('fast');
  const [payment, setPayment] = useState('cash');
  const [showBankingInfo, setShowBankingInfo] = useState(false);
  const [isSuccessBanking, setIsSuccessBanking] = useState(false);

  // chặn xử lý success lặp lại
  const successHandledRef = useRef(false);

  // token
  let storageData = localStorage.getItem('access_token');
  storageData = storageData ? JSON.parse(storageData) : null;

  // Nhận state từ OrderPage (nếu có)
  const orderState = location.state || {};
  const {
    priceMemo: orderPriceMemo,
    priceDiscountMemo: orderPriceDiscountMemo,
    deliveryMemo: orderDeliveryMemo,
    totalPriceMemo: orderTotalPriceMemo,
    productDiscounts: orderProductDiscounts,
  } = orderState;

  // Guard: nếu không có item → về trang Order
  useEffect(() => {
    if (!orderState || Object.keys(orderState).length === 0) {
      if (!order?.orderItemSelected || order?.orderItemSelected?.length === 0) {
        message.warning('Vui lòng chọn sản phẩm từ giỏ hàng trước khi thanh toán');
        navigate('/order');
      }
    }
  }, [orderState, order, navigate]);

  // Chỉ set form values khi mở modal (tránh loop)
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      form.setFieldsValue({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
      });
    }
  }, [isOpenModalUpdateInfo, user, form]);

  // Tính tiền
  const priceMemo = useMemo(() => {
    if (orderPriceMemo !== undefined) return orderPriceMemo;
    const result = order?.orderItemSelected?.reduce((total, current) => {
      return total + (current?.price * current?.amount);
    }, 0);
    return result || 0;
  }, [order, orderPriceMemo]);

  const priceDiscountMemo = useMemo(() => {
    if (orderPriceDiscountMemo !== undefined) return orderPriceDiscountMemo;
    const result = order?.orderItemSelected?.reduce((total, current) => {
      return total + (current?.discount * current?.price * current?.amount) / 100;
    }, 0);
    return Number(result) || 0;
  }, [order, orderPriceDiscountMemo]);

  const deliveryMemo = useMemo(() => {
    if (orderDeliveryMemo !== undefined) return orderDeliveryMemo;
    if (priceMemo >= 500000 || order?.orderItemSelected?.length === 0) return 0;
    if (priceMemo >= 200000 && priceMemo < 500000) return 10000;
    return 20000;
  }, [priceMemo, orderDeliveryMemo, order?.orderItemSelected?.length]);

  const totalPriceMemo = useMemo(() => {
    if (orderTotalPriceMemo !== undefined) return orderTotalPriceMemo;
    return Number(priceMemo - priceDiscountMemo + deliveryMemo);
  }, [priceMemo, priceDiscountMemo, deliveryMemo, orderTotalPriceMemo]);

  // ====== addInfo: dùng STATE để có mã NGAY lần render đầu của QR ======
  const generateAddInfo = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }, []);
  const [addInfoCode, setAddInfoCode] = useState('');

  // Nếu đổi sang phương thức khác banking → ẩn QR và có thể reset mã (tuỳ chọn)
  useEffect(() => {
    if (payment !== 'banking') {
      setShowBankingInfo(false);
      setIsSuccessBanking(false);
      // Nếu muốn sinh mã mới mỗi lần quay lại banking, giữ reset:
      setAddInfoCode('');
    }
  }, [payment]);

  // ====== Tạo đơn hàng ======
  const mutationAddOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder(token, { ...rests });
    return res;
  });
  const { isPending: isPendingAddOrder, data: dataAddOrder, isSuccess, isError } = mutationAddOrder;

  const handleAddOrder = () => {
    if (!storageData) {
      message.error('Vui lòng đăng nhập để đặt hàng');
      return;
    }
    if (!order?.orderItemSelected || !user?.name || !user?.address || !user?.phone || !user?.city || !priceMemo) {
      message.error('Vui lòng kiểm tra lại thông tin đặt hàng');
      return;
    }

    let userId = user?.id;
    if (!userId && storageData) {
      try {
        const decoded = jwtDecode(storageData);
        userId = decoded?.id;
      } catch (error) {
        console.error('Error decoding token:', error);
        message.error('Có lỗi xảy ra khi xác thực người dùng');
        return;
      }
    }
    if (!userId) {
      message.error('Không thể xác định người dùng');
      return;
    }

    if (payment === 'banking') {
      // Sinh mã NẾU CHƯA CÓ, rồi bật QR — để lần render QR đầu có ngay mã
      setAddInfoCode(prev => prev || generateAddInfo());
      setShowBankingInfo(true);
    } else {
      // COD → tạo đơn ngay
      mutationAddOrder.mutate({
        token: storageData,
        orderItems: order?.orderItemSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryMemo,
        totalPrice: totalPriceMemo,
        user: userId,
        email: user?.email
      });
    }
  };

  const handleConfirmTransfer = (paidAt) => {
    let userId = user?.id;
    if (!userId && storageData) {
      try {
        const decoded = jwtDecode(storageData);
        userId = decoded?.id;
      } catch (error) {
        console.error('Error decoding token:', error);
        message.error('Có lỗi xảy ra khi xác thực người dùng');
        return;
      }
    }
    mutationAddOrder.mutate({
      token: storageData,
      orderItems: order?.orderItemSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: deliveryMemo,
      totalPrice: totalPriceMemo,
      user: userId,
      email: user?.email,
      isPaid: true,
      paidAt: paidAt,
    });
  };

  // ====== Polling check chuyển khoản (dùng CHÍNH addInfoCode + dừng khi success) ======
  async function checkPaid(totalPrice, addInfoCodeParam) {
    if (isSuccessBanking) return;
    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbzEf-EK7Yz8AyheoFWeOvRkCmX1fKNh0dNbN5uk2qvvKNOn9DwgumLQRVH19rlUgV6d/exec");
      const data = await res.json();
      const arr = Array.isArray(data?.data) ? data.data : [];
      if (!arr.length) return;

      const lastPayment = arr[arr.length - 1];
      const lastPaymentAmount = Number(lastPayment['Giá trị']);
      const lastPaymentAddInfo = (lastPayment['Mô tả'] || '').trim();
      const paidAt = lastPayment['Ngày diễn ra'];

      if (Number(totalPrice) === lastPaymentAmount && lastPaymentAddInfo.includes(addInfoCodeParam)) {
        setIsSuccessBanking(true);
        handleConfirmTransfer(paidAt);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      message.error('Lỗi khi kiểm tra thanh toán. Vui lòng thử lại sau.');
    }
  }

  useEffect(() => {
    if (payment === 'banking' && showBankingInfo && addInfoCode && !isSuccessBanking && !isSuccess) {
      // gọi ngay 1 lần
      checkPaid(totalPriceMemo, addInfoCode);
      // poll mỗi 5s
      const id = setInterval(() => {
        checkPaid(totalPriceMemo, addInfoCode);
      }, 5000);
      return () => clearInterval(id);
    }
  }, [payment, showBankingInfo, addInfoCode, totalPriceMemo, isSuccessBanking, isSuccess]);

  // ====== Sau khi tạo đơn thành công — chạy 1 lần duy nhất ======
  useEffect(() => {
    if (isSuccess && !successHandledRef.current) {
      successHandledRef.current = true;

      const orderArray = (order?.orderItemSelected || [])
        .map(e => e?.product)
        .filter(Boolean);

      if (orderArray.length) {
        dispatch(removeAllOrder({ listChecked: orderArray }));
      }

      (async () => {
        let userId = user?.id;
        if (!userId && storageData) {
          try {
            const decoded = jwtDecode(storageData);
            userId = decoded?.id;
          } catch (e) {
            console.error('decode error:', e);
          }
        }

        if (userId) {
          try { await CartService.deleteCart(userId); } catch (e) { console.error(e); }
        }

        // cập nhật usage mã giảm giá (nếu có)
        try {
          const appliedDiscounts = orderProductDiscounts || {};
          for (const [, discount] of Object.entries(appliedDiscounts)) {
            if (discount && discount._id && userId) {
              try {
                await DiscountService.updateDiscountUsage(discount._id, userId, storageData);
              } catch (e) {
                console.error(`Update discount ${discount?.code} error:`, e);
              }
            }
          }
        } catch (e) {
          console.error('updateDiscountUsage wrapper error:', e);
        }
      })()
        .finally(() => {
          message.success('Đơn hàng đã được đặt thành công!');
          navigate('/orderSuccess', {
            replace: true,
            state: {
              delivery,
              paymentMethod: payment,
              orders: order?.orderItemSelected,
              totalPriceMemo,
            },
          });
        });
    }

    if (isError && !successHandledRef.current) {
      successHandledRef.current = true;
      message.error(dataAddOrder?.message || 'Có lỗi xảy ra khi đặt hàng');
    }
    // eslint-disable-next-line
  }, [isSuccess, isError]); // CHỈ 2 deps để tránh loop

  // ====== Cập nhật thông tin giao hàng qua AntD Form ======
  const mutationUpdateUser = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const handleUpdateUserInfo = async () => {
    if (!storageData) {
      message.error('Vui lòng đăng nhập để cập nhật thông tin');
      return;
    }
    try {
      const values = await form.validateFields();

      let userId = user?.id;
      if (!userId && storageData) {
        try {
          const decoded = jwtDecode(storageData);
          userId = decoded?.id;
        } catch (error) {
          console.error('Error decoding token:', error);
          message.error('Có lỗi xảy ra khi xác thực người dùng');
          return;
        }
      }
      if (!userId) {
        message.error('Không thể xác định người dùng');
        return;
      }

      const updateData = {
        id: userId,
        token: storageData,
        name: values.name,
        address: values.address,
        phone: values.phone,
        city: values.city
      };

      mutationUpdateUser.mutate(updateData, {
        onSuccess: () => {
          dispatch(updateUser({
            name: values.name,
            address: values.address,
            phone: values.phone,
            city: values.city,
            avatar: user?.avatar
          }));
          setIsOpenModalUpdateInfo(false);
          message.success('Cập nhật thông tin thành công');
        },
        onError: (error) => {
          console.error('Update user error:', error);
          message.error('Có lỗi xảy ra khi cập nhật thông tin');
        }
      });
    } catch {
      // validateFields đã hiển thị lỗi
    }
  };

  const handleCancelUpdateInfo = () => {
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleDelivery = (e) => setDelivery(e.target.value);
  const handlePayment = (e) => setPayment(e.target.value);

  return (
    <div style={{ background: '#f5f5fa', width: '100%' }}>
      <style>{`
        @media (max-width: 1024px) {
          .paymentpage-main-wrapper {
            flex-direction: column !important;
            gap: 0 !important;
          }
        }
      `}</style>
      <LoadingComponent isPending={isPendingAddOrder}>
        <div style={{ width: '100%', maxWidth: 1270, margin: '0 auto', padding: '0 8px' }}>
          <h2>Thanh toán</h2>
          <div
            className="paymentpage-main-wrapper"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}
          >
            <div style={{ flex: 2, minWidth: 320, maxWidth: 900, width: '100%' }}>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDelivery} value={delivery} defaultValue={'fast'}>
                    <Radio value='fast'><span style={{ color: '#ea8600', fontWeight: 'bold' }}>Fast</span> - giao hàng nhanh chóng</Radio>
                    <Radio value='gojek'><span style={{ color: '#ea8600', fontWeight: 'bold' }}>GoJek</span> - giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>

              <WrapperInfo>
                <Lable>Chọn phương thức thanh toán</Lable>
                <WrapperRadio onChange={handlePayment} value={payment}>
                  <Radio value='cash'>Thanh toán khi nhận hàng</Radio>
                  <Radio value='banking'>Thanh toán chuyển khoản</Radio>
                </WrapperRadio>

                {showBankingInfo && payment === 'banking' && (
                  <div style={{ marginTop: 16, marginBottom: 16, border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
                    <BankingComponent
                      amount={totalPriceMemo}
                      addInfo={addInfoCode}              // <-- có mã ngay lần đầu
                      onConfirmTransfer={handleConfirmTransfer}
                    />
                  </div>
                )}
              </WrapperInfo>
            </div>

            <div style={{ flex: 1, minWidth: 260, maxWidth: 400, width: '100%' }}>
              <WrapperRight>
                <div style={{ width: '100%' }}>
                  <WrapperInfo>
                    <div>
                      <span>Địa chỉ: </span>
                      <span style={{ fontWeight: 'bold' }}>{` ${user?.address} ${user?.city} `}</span>
                      <span onClick={() => setIsOpenModalUpdateInfo(true)} style={{ color: 'blue', cursor: 'pointer' }}>Thay đổi</span>
                    </div>
                  </WrapperInfo>

                  <WrapperInfo>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Tạm tính</span>
                      <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Giảm giá</span>
                      <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Phí giao hàng</span>
                      <span style={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>{convertPrice(deliveryMemo)}</span>
                    </div>
                  </WrapperInfo>

                  <WrapperTotal>
                    <span>Tổng tiền</span>
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'rgb(254, 56, 52)', fontSize: 24, fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                      <span style={{ color: '#000', fontSize: 11 }}>(Đã bao gồm thuế nếu có)</span>
                    </span>
                  </WrapperTotal>
                </div>

                <Button
                  onClick={handleAddOrder}
                  style={{
                    color: '#fff',
                    background: 'rgb(75, 179, 240)',
                    height: 48,
                    width: '100%',
                    maxWidth: 320,
                    border: 'none',
                    borderRadius: 4,
                    fontWeight: 'bold',
                    marginTop: 12,
                  }}
                >
                  Đặt hàng
                </Button>
              </WrapperRight>
            </div>
          </div>
        </div>

        <ModalComponent
          forceRender
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdateInfo}
          okText='Yes'
          onOk={handleUpdateUserInfo}
        >
          <LoadingComponent isPending={mutationUpdateUser.isPending}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 600 }}
              autoComplete="off"
              form={form}
            >
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your Name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input your City!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your Address!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your Phone!' }]}>
                <Input />
              </Form.Item>
            </Form>
          </LoadingComponent>
        </ModalComponent>
      </LoadingComponent>
    </div>
  );
};

export default PaymentPage;
