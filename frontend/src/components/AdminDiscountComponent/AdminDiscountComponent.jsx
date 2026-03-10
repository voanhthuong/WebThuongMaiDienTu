// frontend/src/components/AdminDiscountComponent/AdminDiscountComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, Select, DatePicker, Table, Space, Popconfirm, message, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { WrapperHeader, WrapperUploadFile } from './Style'; // Import styles

import useMutationHook from '../../hooks/useMutationHook';
import * as DiscountService from '../../services/DiscountService.js'; // Sẽ tạo service này sau
import { useQuery } from '@tanstack/react-query';
import InputComponent from '../InputComponent/InputComponent.jsx';
import Loading from '../LoadingComponent/LoadingComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useSelector } from 'react-redux'; // Để lấy access_token

import { getBase64 } from '../../utils'; // Giả sử bạn có hàm này để convert image sang base64
import moment from 'moment'; // Để xử lý DatePicker

const { Option } = Select;

// const AdminDiscountComponent = () => {
//     const [rowSelected, setRowSelected] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
//     const [isModalOpenEdit, setIsModalOpenEdit] = useState(false); // Modal cho chức năng sửa

//     const user = useSelector((state) => state.user); // Lấy user từ Redux store để lấy access_token

//     const [stateDiscount, setStateDiscount] = useState({
//         name: '',
//         code: '',
//         type: 'percent', // Mặc định là percent
//         value: 0,
//         minValue: 0,
//         maxUses: 1,
//         startDate: null,
//         endDate: null,
//         isActive: true,
//     });

//     // State cho form chỉnh sửa
//     const [stateDiscountDetails, setStateDiscountDetails] = useState({
//         name: '',
//         code: '',
//         type: 'percent',
//         value: 0,
//         minValue: 0,
//         maxUses: 1,
//         startDate: null,
//         endDate: null,
//         isActive: true,
//         // usesLeft: 0 // usesLeft sẽ được lấy từ database, không cho chỉnh sửa trực tiếp qua form này
//     });


//     const [form] = Form.useForm(); // Form cho chức năng thêm
//     const [formEdit] = Form.useForm(); // Form cho chức năng sửa

//     // Mutation cho chức năng CREATE
//     const mutation = useMutationHook(
//         (data) => DiscountService.createDiscount(data, JSON.parse(user?.access_token))
//     );
//     const { data, isLoading, isSuccess, isError } = mutation;

//     useEffect(() => {
//         if (isSuccess && data?.status === 'OK') {
//             message.success('Tạo mã giảm giá thành công!');
//             setIsModalOpen(false);
//             form.resetFields(); // Reset form sau khi thêm thành công
//             queryDiscount.refetch(); // Cập nhật lại danh sách
//         } else if (data?.status === 'ERR') {
//             message.error(data?.message || 'Tạo mã giảm giá thất bại.');
//         }
//     }, [isSuccess, isError, data]);


//     // Mutation cho chức năng UPDATE
//     const mutationUpdate = useMutationHook(
//         (data) => DiscountService.updateDiscount(rowSelected, data, JSON.parse(user?.access_token))
//     );
//     const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;

//     useEffect(() => {
//         if (isSuccessUpdate && dataUpdate?.status === 'OK') {
//             message.success('Cập nhật mã giảm giá thành công!');
//             setIsModalOpenEdit(false);
//             queryDiscount.refetch(); // Cập nhật lại danh sách
//         } else if (dataUpdate?.status === 'ERR') {
//             message.error(dataUpdate?.message || 'Cập nhật mã giảm giá thất bại.');
//         }
//     }, [isSuccessUpdate, isErrorUpdate, dataUpdate]);


//     // Mutation cho chức năng DELETE
//     const mutationDelete = useMutationHook(
//         (id) => DiscountService.deleteDiscount(id, JSON.parse(user?.access_token))
//     );
//     const { data: dataDelete, isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete;

//     useEffect(() => {
//         if (isSuccessDelete && dataDelete?.status === 'OK') {
//             message.success('Xóa mã giảm giá thành công!');
//             setIsModalOpenDelete(false);
//             queryDiscount.refetch(); // Cập nhật lại danh sách
//         } else if (dataDelete?.status === 'ERR') {
//             message.error(dataDelete?.message || 'Xóa mã giảm giá thất bại.');
//         }
//     }, [isSuccessDelete, isErrorDelete, dataDelete]);


//     // Lấy tất cả mã giảm giá
//     const fetchAllDiscount = async (context) => {
//         const limit = context?.queryKey && context?.queryKey[1];
//         const page = context?.queryKey && context?.queryKey[2];
//         const res = await DiscountService.getAllDiscount(limit, page);
//         return res;
//     };

//     const queryDiscount = useQuery({ queryKey: ['discounts', 10, 0], queryFn: fetchAllDiscount }); // Limit 10, page 0
//     const { isLoading: isLoadingDiscounts, data: discounts } = queryDiscount;


//     const handleOnchange = (e) => {
//         setStateDiscount({
//             ...stateDiscount,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleOnchangeDetails = (e) => {
//         setStateDiscountDetails({
//             ...stateDiscountDetails,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleOnchangeType = (value) => {
//         setStateDiscount({ ...stateDiscount, type: value });
//     };

//     const handleOnchangeTypeDetails = (value) => {
//         setStateDiscountDetails({ ...stateDiscountDetails, type: value });
//     };

//     const handleOnchangeStartDate = (date, dateString) => {
//         setStateDiscount({ ...stateDiscount, startDate: dateString });
//     };

//     const handleOnchangeEndDate = (date, dateString) => {
//         setStateDiscount({ ...stateDiscount, endDate: dateString });
//     };

//     const handleOnchangeStartDateDetails = (date, dateString) => {
//         setStateDiscountDetails({ ...stateDiscountDetails, startDate: dateString });
//     };

//     const handleOnchangeEndDateDetails = (date, dateString) => {
//         setStateDiscountDetails({ ...stateDiscountDetails, endDate: dateString });
//     };


//     const handleAddDiscount = () => {
//         setIsModalOpen(true);
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//         form.resetFields();
//     };

//     const handleCancelEdit = () => {
//         setIsModalOpenEdit(false);
//         formEdit.resetFields();
//     };

//     const handleCancelDelete = () => {
//         setIsModalOpenDelete(false);
//     };

//     const onFinish = () => {
//         // Chuyển đổi giá trị thành số nếu cần
//         const dataToSend = {
//             ...stateDiscount,
//             value: Number(stateDiscount.value),
//             minValue: Number(stateDiscount.minValue),
//             maxUses: Number(stateDiscount.maxUses),
//             // usesLeft sẽ được backend tự set nếu không truyền vào
//         };
//         mutation.mutate(dataToSend);
//     };

//     const onUpdateDiscount = () => {
//         // Chuyển đổi giá trị thành số nếu cần
//         const dataToSend = {
//             ...stateDiscountDetails,
//             value: Number(stateDiscountDetails.value),
//             minValue: Number(stateDiscountDetails.minValue),
//             maxUses: Number(stateDiscountDetails.maxUses),
//             // usesLeft không được cập nhật qua đây
//         };
//         mutationUpdate.mutate(dataToSend);
//     };

//     const handleDeleteDiscount = () => {
//         mutationDelete.mutate(rowSelected);
//     };

//     // Hàm gọi khi nhấn nút sửa
//     const handleEditDiscount = async (id) => {
//         setIsModalOpenEdit(true);
//         setRowSelected(id);
//         const response = await DiscountService.getDetailDiscount(id);
//         if (response?.status === 'OK') {
//             const data = await response.data;
//             console.log('data từ AdminDiscount:', data)
//             setStateDiscountDetails({
//                 name: data.name,
//                 code: data.code,
//                 type: data.type,
//                 value: data.value,
//                 minValue: data.minValue,
//                 maxUses: data.maxUses,
//                 startDate: data.startDate ? moment(data.startDate) : null, // Dùng moment cho DatePicker
//                 endDate: data.endDate ? moment(data.endDate) : null,     // Dùng moment cho DatePicker
//                 isActive: data.isActive,
//                 usesLeft: data.usesLeft // Hiển thị nhưng không cho phép chỉnh sửa
//             });
//             formEdit.setFieldsValue({
//                 name: data.name,
//                 code: data.code,
//                 type: data.type,
//                 value: data.value,
//                 minValue: data.minValue,
//                 maxUses: data.maxUses,
//                 startDate: data.startDate ? moment(data.startDate) : null,
//                 endDate: data.endDate ? moment(data.endDate) : null,
//                 isActive: data.isActive,
//                 usesLeft: data.usesLeft // Hiển thị nhưng không cho phép chỉnh sửa
//             });
//         } else if (response?.status === 'ERR') {
//             message.error(response?.message || 'Không tìm thấy mã giảm giá!');
//         }
//     };


//     const renderAction = (record) => {
//         return (
//             <Space size="middle">
//                 <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }} onClick={() => handleEditDiscount(record._id)} />
//                 <Popconfirm
//                     title="Xác nhận xóa"
//                     description="Bạn có chắc chắn muốn xóa mã giảm giá này?"
//                     onConfirm={() => {
//                         setRowSelected(record._id);
//                         setIsModalOpenDelete(true);
//                     }}
//                     okText="Có"
//                     cancelText="Không"
//                 >
//                     <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
//                 </Popconfirm>
//             </Space>
//         );
//     };

//     const columns = [
//         {
//             title: 'Tên mã',
//             dataIndex: 'name',
//             sorter: (a, b) => a.name.length - b.name.length,
//             // ...getColumnSearchProps('name') // Nếu có search
//         },
//         {
//             title: 'Mã Code',
//             dataIndex: 'code',
//             sorter: (a, b) => a.code.length - b.code.length,
//         },
//         {
//             title: 'Loại',
//             dataIndex: 'type',
//             render: (text) => (text === 'percent' ? 'Phần trăm' : 'Cố định')
//         },
//         {
//             title: 'Giá trị',
//             dataIndex: 'value',
//             sorter: (a, b) => a.value - b.value,
//             render: (text, record) => record.type === 'percent' ? `${text}%` : `${text?.toLocaleString('vi-VN')} VNĐ`
//         },
//         {
//             title: 'Tối thiểu',
//             dataIndex: 'minValue',
//             sorter: (a, b) => a.minValue - b.minValue,
//             render: (text) => `${text?.toLocaleString('vi-VN')} VNĐ`
//         },
//         {
//             title: 'Lượt dùng tối đa',
//             dataIndex: 'maxUses',
//             sorter: (a, b) => a.maxUses - b.maxUses,
//         },
//         {
//             title: 'Còn lại',
//             dataIndex: 'usesLeft',
//             sorter: (a, b) => a.usesLeft - b.usesLeft,
//         },
//         {
//             title: 'Bắt đầu',
//             dataIndex: 'startDate',
//             render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
//         },
//         {
//             title: 'Kết thúc',
//             dataIndex: 'endDate',
//             render: (text) => moment(text).format('DD/MM/YYYY HH:mm')
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'isActive',
//             render: (text) => (text ? 'Hoạt động' : 'Không hoạt động')
//         },
//         {
//             title: 'Hành động',
//             dataIndex: 'action',
//             render: (text, record) => renderAction(record),
//         },
//     ];



//     const dataTable = discounts?.data ? discounts.data.map((discount) => ({
//     ...discount,
//     key: discount._id,
// })) : [];

//     // console.log('discounts:', dataTable);

//     console.log('stateDiscountDetails:', stateDiscountDetails);



//     return (
//         <div>
//             <WrapperHeader>Quản lý Mã giảm giá</WrapperHeader>
//             <div style={{ marginTop: '10px' }}>
//                 <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={handleAddDiscount}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
//             </div>
//             <div style={{ marginTop: '20px' }}>
//                 {/* <Loading isLoading={isLoadingDiscounts}> */}
//                     <Table
//                         columns={columns}
//                         dataSource={dataTable}
//                         pagination={{
//                             pageSize: 10, // Số item trên mỗi trang
//                             total: discounts?.total,
//                             current: (discounts?.currentPage || 1),
//                             onChange: (page, pageSize) => queryDiscount.refetch({ queryKey: ['discounts', pageSize, page - 1] })
//                         }}
//                     />
//                 {/* </Loading> */}
//             </div>

//             {/* Modal thêm mã giảm giá */}
//             <ModalComponent forceRender title="Thêm mã giảm giá" open={isModalOpen} onCancel={handleCancel} footer={null}>
//                 {/* <Loading isLoading={isLoading}> */}
//                     <Form
//                         name="basic"
//                         labelCol={{ span: 6 }}
//                         wrapperCol={{ span: 18 }}
//                         onFinish={onFinish}
//                         autoComplete="off"
//                         form={form}
//                     >
//                         <Form.Item
//                             label="Tên mã"
//                             name="name"
//                             rules={[{ required: true, message: 'Vui lòng nhập tên mã giảm giá!' }]}
//                         >
//                             <InputComponent value={stateDiscount.name} onChange={handleOnchange} name="name" />
//                         </Form.Item>
//                         <Form.Item
//                             label="Mã Code"
//                             name="code"
//                             rules={[{ required: true, message: 'Vui lòng nhập mã code!' },
//                                 { pattern: /^[A-Z0-9]+$/, message: 'Mã code chỉ chứa chữ cái in hoa và số!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscount.code} onChange={handleOnchange} name="code" />
//                         </Form.Item>
//                         <Form.Item
//                             label="Loại"
//                             name="type"
//                             rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
//                         >
//                             <Select value={stateDiscount.type} onChange={handleOnchangeType} >
//                                 <Option value="percent">Phần trăm (%)</Option>
//                                 <Option value="fixed">Cố định (VNĐ)</Option>
//                             </Select>
//                         </Form.Item>
//                         <Form.Item
//                             label="Giá trị"
//                             name="value"
//                             rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' },
//                                 { type: 'number', message: 'Giá trị phải là số!', transform: (value) => Number(value) },
//                                 stateDiscount.type === 'percent'
//                                     ? { min: 0, max: 100, message: 'Phần trăm phải từ 0 đến 100!' }
//                                     : { min: 0, message: 'Giá trị cố định phải dương!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscount.value} onChange={handleOnchange} name="value" />
//                         </Form.Item>
//                         <Form.Item
//                             label="Tối thiểu"
//                             name="minValue"
//                             rules={[{ required: true, message: 'Vui lòng nhập giá trị tối thiểu!' },
//                                 { type: 'number', message: 'Giá trị phải là số!', transform: (value) => Number(value) },
//                                 { min: 0, message: 'Giá trị tối thiểu không âm!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscount.minValue} onChange={handleOnchange} name="minValue" />
//                         </Form.Item>
//                         <Form.Item
//                             label="Lượt dùng tối đa"
//                             name="maxUses"
//                             rules={[{ required: true, message: 'Vui lòng nhập số lượt dùng tối đa!' },
//                                 { type: 'number', message: 'Số lượt phải là số!', transform: (value) => Number(value) },
//                                 { min: 1, message: 'Số lượt phải lớn hơn 0!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscount.maxUses} onChange={handleOnchange} name="maxUses" />
//                         </Form.Item>
//                         <Form.Item
//                             label="Ngày bắt đầu"
//                             name="startDate"
//                             rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
//                         >
//                             <DatePicker
//                                 showTime
//                                 format="YYYY-MM-DD HH:mm:ss"
//                                 onChange={handleOnchangeStartDate}
//                                 style={{ width: '100%' }}
//                             />
//                         </Form.Item>
//                         <Form.Item
//                             label="Ngày kết thúc"
//                             name="endDate"
//                             rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
//                         >
//                             <DatePicker
//                                 showTime
//                                 format="YYYY-MM-DD HH:mm:ss"
//                                 onChange={handleOnchangeEndDate}
//                                 style={{ width: '100%' }}
//                             />
//                         </Form.Item>

//                         <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
//                             <Button type="primary" htmlType="submit">
//                                 Thêm mới
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 {/* </Loading> */}
//             </ModalComponent>

//             {/* Modal chỉnh sửa mã giảm giá */}
//             <ModalComponent forceRender title="Chỉnh sửa mã giảm giá" open={isModalOpenEdit} onCancel={handleCancelEdit} footer={null}>
//                 {/* <Loading isLoading={isLoadingUpdate}> */}
//                     <Form
//                         name="formEdit"
//                         labelCol={{ span: 6 }}
//                         wrapperCol={{ span: 18 }}
//                         onFinish={onUpdateDiscount}
//                         autoComplete="off"
//                         form={formEdit}
//                     >
//                         <Form.Item label="Tên mã" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên mã giảm giá!' }]}>
//                             <InputComponent value={stateDiscountDetails.name} onChange={handleOnchangeDetails} name="name" />

//                         </Form.Item>
//                         <Form.Item label="Mã Code" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã code!' }, { pattern: /^[A-Z0-9]+$/, message: 'Mã code chỉ chứa chữ cái in hoa và số!' }]}>
//                             <InputComponent value={stateDiscountDetails.code} onChange={handleOnchangeDetails} name="code" />

//                         </Form.Item>
//                         <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}>
//                             <Select value={stateDiscountDetails.type} onChange={handleOnchangeTypeDetails}>
//                                 <Option value="percent">Phần trăm (%)</Option>
//                                 <Option value="fixed">Cố định (VNĐ)</Option>
//                             </Select>
//                         </Form.Item>
//                         <Form.Item
//                             label="Giá trị"
//                             name="value"
//                             rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' },
//                                 { type: 'number', message: 'Giá trị phải là số!', transform: (value) => Number(value) },
//                                 stateDiscountDetails.type === 'percent'
//                                     ? { min: 0, max: 100, message: 'Phần trăm phải từ 0 đến 100!' }
//                                     : { min: 0, message: 'Giá trị cố định phải dương!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscountDetails.value} onChange={handleOnchangeDetails} name="value" />

//                         </Form.Item>
//                         <Form.Item
//                             label="Tối thiểu"
//                             name="minValue"
//                             rules={[{ required: true, message: 'Vui lòng nhập giá trị tối thiểu!' },
//                                 { type: 'number', message: 'Giá trị phải là số!', transform: (value) => Number(value) },
//                                 { min: 0, message: 'Giá trị tối thiểu không âm!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscountDetails.minValue} onChange={handleOnchangeDetails} name="minValue" />

//                         </Form.Item>
//                         <Form.Item
//                             label="Lượt dùng tối đa"
//                             name="maxUses"
//                             rules={[{ required: true, message: 'Vui lòng nhập số lượt dùng tối đa!' },
//                                 { type: 'number', message: 'Số lượt phải là số!', transform: (value) => Number(value) },
//                                 { min: 1, message: 'Số lượt phải lớn hơn 0!' }
//                             ]}
//                         >
//                             <InputComponent value={stateDiscountDetails.maxUses} onChange={handleOnchangeDetails} name="maxUses" />

//                         </Form.Item>
//                          <Form.Item
//                             label="Ngày bắt đầu"
//                             name="startDate"
//                             rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
//                         >
//                             <DatePicker
//                                 showTime
//                                 format="YYYY-MM-DD HH:mm:ss"
//                                 onChange={handleOnchangeStartDateDetails}
//                                 style={{ width: '100%' }}
//                             />
//                         </Form.Item>
//                         <Form.Item
//                             label="Ngày kết thúc"
//                             name="endDate"
//                             rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
//                         >
//                             <DatePicker
//                                 showTime
//                                 format="YYYY-MM-DD HH:mm:ss"
//                                 onChange={handleOnchangeEndDateDetails}
//                                 style={{ width: '100%' }}
//                             />
//                         </Form.Item>
//                          {/* usesLeft có thể hiển thị nhưng không cho phép chỉnh sửa trực tiếp */}
//                         <Form.Item label="Còn lại" name="usesLeft">
//                              <InputComponent value={stateDiscountDetails.usesLeft} name="usesLeft" disabled />
//                         </Form.Item>

//                         <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
//                             <Button type="primary" htmlType="submit">
//                                 Cập nhật
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 {/* </Loading> */}
//             </ModalComponent>


//             {/* Modal xác nhận xóa */}
//             <ModalComponent title="Xóa mã giảm giá" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteDiscount}>
//                 {/* <Loading isLoading={isLoadingDelete}> */}
//                     <div>Bạn có chắc chắn muốn xóa mã giảm giá này không?</div>
//                 {/* </Loading> */}
//             </ModalComponent>
//         </div>
//     );
// };

// export default AdminDiscountComponent;



const AdminDiscountComponent = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

    const user = useSelector((state) => state.user);

    const [form] = Form.useForm();       // Form thêm
    const [formEdit] = Form.useForm();   // Form sửa

    // -------- Pagination state ----------
    const [page, setPage] = useState(0);       // backend dùng page từ 0
    const [limit, setLimit] = useState(10);

    // -------- CREATE ----------
    const mutation = useMutationHook(
        (data) => DiscountService.createDiscount(data, JSON.parse(user?.access_token))
    );
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Tạo mã giảm giá thành công!');
            setIsModalOpen(false);
            form.resetFields();
            queryDiscount.refetch();
        } else if (data?.status === 'ERR') {
            message.error(data?.message || 'Tạo mã giảm giá thất bại.');
        }
    }, [isSuccess, isError, data]);

    // -------- UPDATE ----------
    const mutationUpdate = useMutationHook(
        (payload) => DiscountService.updateDiscount(rowSelected, payload, JSON.parse(user?.access_token))
    );
    const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate;

    useEffect(() => {
        if (isSuccessUpdate && dataUpdate?.status === 'OK') {
            message.success('Cập nhật mã giảm giá thành công!');
            setIsModalOpenEdit(false);
            formEdit.resetFields();
            queryDiscount.refetch();
        } else if (dataUpdate?.status === 'ERR') {
            message.error(dataUpdate?.message || 'Cập nhật mã giảm giá thất bại.');
        }
    }, [isSuccessUpdate, isErrorUpdate, dataUpdate]);

    // -------- DELETE ----------
    const mutationDelete = useMutationHook(
        (id) => DiscountService.deleteDiscount(id, JSON.parse(user?.access_token))
    );
    const { data: dataDelete, isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete;

    useEffect(() => {
        if (isSuccessDelete && dataDelete?.status === 'OK') {
            message.success('Xóa mã giảm giá thành công!');
            setIsModalOpenDelete(false);
            queryDiscount.refetch();
        } else if (dataDelete?.status === 'ERR') {
            message.error(dataDelete?.message || 'Xóa mã giảm giá thất bại.');
        }
    }, [isSuccessDelete, isErrorDelete, dataDelete]);

    // -------- QUERY LIST ----------
    const fetchAllDiscount = async (context) => {
        const qLimit = context?.queryKey?.[1];
        const qPage = context?.queryKey?.[2];
        const res = await DiscountService.getAllDiscount(qLimit, qPage);
        return res;
    };
    const queryDiscount = useQuery({ queryKey: ['discounts', limit, page], queryFn: fetchAllDiscount });
    const { isLoading: isLoadingDiscounts, data: discounts } = queryDiscount;

    // -------- Handlers --------
    const handleAddDiscount = () => {
        setIsModalOpen(true);
        form.resetFields();
        // set default values
        form.setFieldsValue({
            type: 'percent',
            value: 0,
            minValue: 0,
            maxUses: 1,
            isActive: true,
            startDate: null,
            endDate: null,
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
        formEdit.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    
    // onFinishAdd
    const onFinishAdd = (values) => {
        const payload = {
            ...values,
            value: Number(values.value ?? 0),
            minValue: Number(values.minValue ?? 0),
            maxUses: Number(values.maxUses ?? 1),
            startDate: values.startDate ? values.startDate.format('YYYY-MM-DD HH:mm:ss') : null,
            endDate: values.endDate ? values.endDate.format('YYYY-MM-DD HH:mm:ss') : null,
        };
        mutation.mutate(payload);
    };

    // onFinishEdit tương tự
    const onFinishEdit = (values) => {
        const payload = {
            ...values,
            value: Number(values.value ?? 0),
            minValue: Number(values.minValue ?? 0),
            maxUses: Number(values.maxUses ?? 1),
            startDate: values.startDate ? values.startDate.format('YYYY-MM-DD HH:mm:ss') : null,
            endDate: values.endDate ? values.endDate.format('YYYY-MM-DD HH:mm:ss') : null,
        };
        delete payload.usesLeft;
        mutationUpdate.mutate(payload);
    };





    const handleDeleteDiscount = () => {
        mutationDelete.mutate(rowSelected);
    };

    // Mở modal SỬA
    const handleEditDiscount = async (id) => {
        setRowSelected(id);
        setIsModalOpenEdit(true);
        formEdit.resetFields();
        const response = await DiscountService.getDetailDiscount(id);
        if (response?.status === 'OK') {
            const d = response.data;
            formEdit.setFieldsValue({
                name: d.name,
                code: d.code,
                type: d.type, // 'percent' | 'fixed'
                value: Number(d.value ?? 0),
                minValue: Number(d.minValue ?? 0),
                maxUses: Number(d.maxUses ?? 1),
                startDate: d.startDate ? moment(d.startDate) : null,
                endDate: d.endDate ? moment(d.endDate) : null,
                isActive: d.isActive,
                usesLeft: Number(d.usesLeft ?? 0),
            });
        } else if (response?.status === 'ERR') {
            message.error(response?.message || 'Không tìm thấy mã giảm giá!');
        }
    };

    const renderAction = (record) => {
        return (
            <Space size="middle">
                <EditOutlined
                    style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => handleEditDiscount(record._id)}
                />
                <Popconfirm
                    title="Xác nhận xóa"
                    description="Bạn có chắc chắn muốn xóa mã giảm giá này?"
                    onConfirm={() => {
                        setRowSelected(record._id);
                        setIsModalOpenDelete(true);
                    }}
                    okText="Có"
                    cancelText="Không"
                >
                    <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
                </Popconfirm>
            </Space>
        );
    };

    const columns = [
        {
            title: 'Tên mã',
            dataIndex: 'name',
            sorter: (a, b) => (a?.name || '').length - (b?.name || '').length,
        },
        {
            title: 'Mã Code',
            dataIndex: 'code',
            sorter: (a, b) => (a?.code || '').length - (b?.code || '').length,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            render: (text) => (text === 'percent' ? 'Phần trăm' : 'Cố định'),
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            sorter: (a, b) => (a?.value || 0) - (b?.value || 0),
            render: (text, record) =>
                record.type === 'percent' ? `${text}%` : `${Number(text ?? 0).toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Tối thiểu',
            dataIndex: 'minValue',
            sorter: (a, b) => (a?.minValue || 0) - (b?.minValue || 0),
            render: (text) => `${Number(text ?? 0).toLocaleString('vi-VN')} VNĐ`,
        },
        {
            title: 'Lượt dùng tối đa',
            dataIndex: 'maxUses',
            sorter: (a, b) => (a?.maxUses || 0) - (b?.maxUses || 0),
        },
        {
            title: 'Còn lại',
            dataIndex: 'usesLeft',
            sorter: (a, b) => (a?.usesLeft || 0) - (b?.usesLeft || 0),
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'startDate',
            render: (text) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : ''),
        },
        {
            title: 'Kết thúc',
            dataIndex: 'endDate',
            render: (text) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : ''),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (text) => (text ? 'Hoạt động' : 'Không hoạt động'),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            render: (text, record) => renderAction(record),
        },
    ];

    const dataTable = discounts?.data
        ? discounts.data.map((discount) => ({ ...discount, key: discount._id }))
        : [];

    return (
        <div>
            <WrapperHeader>Quản lý Mã giảm giá</WrapperHeader>

            <div style={{ marginTop: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={handleAddDiscount}
                >
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <Table
                    loading={isLoadingDiscounts}
                    columns={columns}
                    dataSource={dataTable}
                    pagination={{
                        pageSize: limit,
                        total: discounts?.total || 0,
                        current: (discounts?.currentPage || 1),
                        onChange: (p, ps) => {
                            // backend page từ 0, UI từ 1
                            setPage(p - 1);
                            setLimit(ps);
                        },
                    }}
                />
            </div>

            {/* Modal thêm mã giảm giá */}
            <ModalComponent
                forceRender
                title="Thêm mã giảm giá"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinishAdd}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item
                        label="Tên mã"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên mã giảm giá!' }]}
                    >
                        <InputComponent placeholder="Tên mã" />
                    </Form.Item>

                    <Form.Item
                        label="Mã Code"
                        name="code"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã code!' },
                            { pattern: /^[A-Z0-9]+$/, message: 'Mã code chỉ chứa chữ cái in hoa và số!' },
                        ]}
                    >
                        <InputComponent placeholder="VD: SAVE10" />
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                    >
                        <Select>
                            <Option value="percent">Phần trăm (%)</Option>
                            <Option value="fixed">Cố định (VNĐ)</Option>
                        </Select>
                    </Form.Item>

                    {/* Giá trị phụ thuộc vào type */}
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
                        {({ getFieldValue }) => {
                            const isPercent = getFieldValue('type') === 'percent';
                            return (
                                <Form.Item
                                    label="Giá trị"
                                    name="value"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                        {
                                            validator: (_, v) => {
                                                if (v === null || v === undefined || v === '') {
                                                    return Promise.reject('Vui lòng nhập giá trị giảm!');
                                                }
                                                if (typeof v !== 'number' || Number.isNaN(v)) {
                                                    return Promise.reject('Giá trị phải là số!');
                                                }
                                                if (isPercent) {
                                                    if (v < 0 || v > 100) return Promise.reject('Phần trăm phải từ 0 đến 100!');
                                                } else {
                                                    if (v < 0) return Promise.reject('Giá trị cố định phải dương!');
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} max={isPercent ? 100 : undefined} />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>

                    <Form.Item
                        label="Tối thiểu"
                        name="minValue"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá trị tối thiểu!' },
                            {
                                validator: (_, v) => {
                                    if (v === null || v === undefined || v === '') {
                                        return Promise.reject('Vui lòng nhập giá trị tối thiểu!');
                                    }
                                    if (typeof v !== 'number' || Number.isNaN(v)) {
                                        return Promise.reject('Giá trị phải là số!');
                                    }
                                    if (v < 0) return Promise.reject('Giá trị tối thiểu không âm!');
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Lượt dùng tối đa"
                        name="maxUses"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượt dùng tối đa!' },
                            {
                                validator: (_, v) => {
                                    if (v === null || v === undefined || v === '') {
                                        return Promise.reject('Vui lòng nhập số lượt dùng tối đa!');
                                    }
                                    if (typeof v !== 'number' || Number.isNaN(v)) {
                                        return Promise.reject('Số lượt phải là số!');
                                    }
                                    if (v < 1) return Promise.reject('Số lượt phải lớn hơn 0!');
                                    if (!Number.isInteger(v)) return Promise.reject('Số lượt phải là số nguyên!');
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} precision={0} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Thêm mới
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>

            {/* Modal chỉnh sửa mã giảm giá */}
            <ModalComponent
                forceRender
                title="Chỉnh sửa mã giảm giá"
                open={isModalOpenEdit}
                onCancel={handleCancelEdit}
                footer={null}
            >
                <Form
                    form={formEdit}
                    name="formEdit"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinishEdit}
                    autoComplete="off"
                    preserve={false}
                >
                    <Form.Item
                        label="Tên mã"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên mã giảm giá!' }]}
                    >
                        <InputComponent placeholder="Tên mã" />
                    </Form.Item>

                    <Form.Item
                        label="Mã Code"
                        name="code"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã code!' },
                            { pattern: /^[A-Z0-9]+$/, message: 'Mã code chỉ chứa chữ cái in hoa và số!' },
                        ]}
                    >
                        <InputComponent placeholder="VD: SAVE10" />
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                    >
                        <Select>
                            <Option value="percent">Phần trăm (%)</Option>
                            <Option value="fixed">Cố định (VNĐ)</Option>
                        </Select>
                    </Form.Item>

                    {/* Giá trị phụ thuộc vào type */}
                    <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
                        {({ getFieldValue }) => {
                            const isPercent = getFieldValue('type') === 'percent';
                            return (
                                <Form.Item
                                    label="Giá trị"
                                    name="value"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                        {
                                            validator: (_, v) => {
                                                if (v === null || v === undefined || v === '') {
                                                    return Promise.reject('Vui lòng nhập giá trị giảm!');
                                                }
                                                if (typeof v !== 'number' || Number.isNaN(v)) {
                                                    return Promise.reject('Giá trị phải là số!');
                                                }
                                                if (isPercent) {
                                                    if (v < 0 || v > 100) return Promise.reject('Phần trăm phải từ 0 đến 100!');
                                                } else {
                                                    if (v < 0) return Promise.reject('Giá trị cố định phải dương!');
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} max={isPercent ? 100 : undefined} />
                                </Form.Item>
                            );
                        }}
                    </Form.Item>

                    <Form.Item
                        label="Tối thiểu"
                        name="minValue"
                        rules={[
                            { required: true, message: 'Vui lòng nhập giá trị tối thiểu!' },
                            {
                                validator: (_, v) => {
                                    if (v === null || v === undefined || v === '') {
                                        return Promise.reject('Vui lòng nhập giá trị tối thiểu!');
                                    }
                                    if (typeof v !== 'number' || Number.isNaN(v)) {
                                        return Promise.reject('Giá trị phải là số!');
                                    }
                                    if (v < 0) return Promise.reject('Giá trị tối thiểu không âm!');
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Lượt dùng tối đa"
                        name="maxUses"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượt dùng tối đa!' },
                            {
                                validator: (_, v) => {
                                    if (v === null || v === undefined || v === '') {
                                        return Promise.reject('Vui lòng nhập số lượt dùng tối đa!');
                                    }
                                    if (typeof v !== 'number' || Number.isNaN(v)) {
                                        return Promise.reject('Số lượt phải là số!');
                                    }
                                    if (v < 1) return Promise.reject('Số lượt phải lớn hơn 0!');
                                    if (!Number.isInteger(v)) return Promise.reject('Số lượt phải là số nguyên!');
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} min={1} precision={0} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    {/* usesLeft hiển thị, không cho sửa */}
                    <Form.Item label="Còn lại" name="usesLeft">
                        <InputNumber style={{ width: '100%' }} disabled />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button type="primary" htmlType="submit" loading={isLoadingUpdate}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>

            {/* Modal xác nhận xóa */}
            <ModalComponent
                title="Xóa mã giảm giá"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteDiscount}
                confirmLoading={isLoadingDelete}
            >
                <div>Bạn có chắc chắn muốn xóa mã giảm giá này không?</div>
            </ModalComponent>
        </div>
    );
};

export default AdminDiscountComponent;
