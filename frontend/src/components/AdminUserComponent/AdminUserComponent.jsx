import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './Style'
import { Button, Checkbox, Form, Input, message, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
// import InputComponent from '../InputComponent/InputComponent'
import { useMutationHook } from '../../hooks/useMutationHook'
// import * as message from '../../components/MessageComponent/MessageComponent'
import * as UserService from '../../services/UserService'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getBase64 } from '../../utils'

const AdminUserComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isloading, setIsLoading] = useState(false)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    //tại sao lại sử dụng localStorage. Vì nếu dùng useSelector để gọi access_token thì sẽ bị lỗi auth
    //Tại sao lỗi auth. vì access_token lúc này sẽ bị "". vẫn chưa tìm đc cách khắc phục
    let storageData = localStorage.getItem('access_token');
    storageData = JSON.parse(storageData);

    //đã tìm đc cách khắc phục vấn đề ở trên
    // let access_token = JSON.parse(user?.access_token)


    const handleDetailUser = () => {
        if (rowSelected) {
            setIsOpenDrawer(true)
        }
    }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleteUser.mutate({ id: rowSelected, token: storageData }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const onUpdateUser = () => {
        mutationUpdateUser.mutate({ id: rowSelected, token: storageData, ...stateDetailUser }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'yellow', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailUser} />
            </div>
        )

    }
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        avatar: '',
    });

    const [stateDetailUser, setStateDetailUser] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        avatar: '',
    });

    const [form] = Form.useForm()


    const mutationUpdateUser = useMutationHook(
        (data) => {
            const { id, token, ...rests } = data
            const res = UserService.updateUser(id, token, { ...rests })
            handleCloseDrawer()
            return res
        },
    )

    const mutationDeleteUser = useMutationHook(
        (data) => {
            const { id, token } = data
            const res = UserService.deleteUser(id, token)
            handleCloseDrawer()
            return res
        },
    )

    const handleDeleteManyUser = (ids) => {
        mutationDeleteManyUser.mutate({ ids: ids, token: storageData }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })

    }

    const mutationDeleteManyUser = useMutationHook(
        (data) => {
            const { token, ...ids } = data
            const res = UserService.deleteManyUser(ids, token)
            return res
        },
    )


    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdateUser
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleteUser
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteManyUser


    const fetchGetDetailUser = async (rowSelected, storageData) => {
        const res = await UserService.getDetailUser(rowSelected, storageData)
        if (res?.data) {
            setStateDetailUser({
                name: res?.data?.name,
                email: res?.data?.email,
                address: res?.data?.address,
                phone: res?.data?.phone,
                avatar: res?.data?.avatar,
            })
        }
        return res
    }


    //gọi api để lấy thông tin chi tiết
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsPendingUpdate(true)
            fetchGetDetailUser(rowSelected, storageData)
        }
        setIsPendingUpdate(false)
    }, [rowSelected, isOpenDrawer])

    //tự động điền thông tin từ api vào form
    useEffect(() => {
        form.setFieldsValue(stateDetailUser)
    }, [form, stateDetailUser])

    //Tự động tắt form và thông báo khi đã xóa người dùng thành công
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success(dataDeleted?.message)
            handleCancelDelete()
        }
    }, [isSuccessDeleted])

    //Tự động tắt form và thông báo khi đã xóa loạt người dùng thành công
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success(dataDeletedMany?.message)
        }
    }, [isSuccessDeletedMany])

    //Tự động tắt form và thông báo khi đã cập nhật SP thành công
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            setIsPendingUpdate(false);
            message.success(dataUpdated?.message);
            handleCloseDrawer();
        }
    }, [isSuccessUpdated]);




    const getAllUser = async () => {
        const res = await UserService.getAllUser(storageData)
        return res
    }

    const queryUser = useQuery({
        queryKey: ['users'],
        queryFn: getAllUser,
        retry: 3,
        retryDelay: 1000
    });
    const { data: users, isLoading: isLoadingUser } = queryUser

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         // <Highlighter
        //         //     highlightStyle={{
        //         //         backgroundColor: '#ffc069',
        //         //         padding: 0,
        //         //     }}
        //         //     searchWords={[searchText]}
        //         //     autoEscape
        //         //     textToHighlight={text ? text.toString() : ''}
        //         // />
        //     ) : (
        //         text
        //     ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            ...getColumnSearchProps('name') //sort by name
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps('email') //sort by name
        },
        {
            title: 'Address',
            dataIndex: 'address',

            //Lọc sản phẩm theo đánh giá (rating) //Kịch bản chỉ lọc theo Sp nhỏ hơn 3 sao và lớn hơn 3 sao
            // filters: [
            //     {
            //         text: '>= 3',
            //         value: '>=',
            //     },
            //     {
            //         text: '<= 3',
            //         value: '<=',
            //     },
            // ],
            // onFilter: (value, record) => {
            //     if (value === '>=') {
            //         return record.rating >= 3
            //     } else if (value === '<=') {
            //         return record.rating <= 3
            //     }
            // },

        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone') //sort by name

        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (text) => <img src={text} style={{
                height: '60px',
                width: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginLeft: '10px'
            }} alt='avatar' />,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },

    ];

    //Xuất dữ liệu ra từ bảng, số lượng được định nghĩa ở Controller Backend
    const dataTable = users?.data?.length && users?.data.map((user) => {
        return {
            ...user,
            key: user._id,
        }
    })


    const handleCloseDrawer = () => {
        setStateDetailUser({
            name: '',
            email: '',
            address: '',
            phone: '',
            avatar: '',
        })
        form.resetFields()
        setIsModalOpen(false);
        setIsOpenDrawer(false)
    };




    const handleOnChange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeDetailUser = (e) => {
        setStateDetailUser({
            ...stateDetailUser,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            avatar: file.preview,

        })
    }

    const handleOnchangeDetailAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateDetailUser({
            ...stateDetailUser,
            avatar: file.preview,

        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>

            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} isPending={isLoadingUser} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setRowSelected(record._id)
                            setIsOpenDrawer(true) 
                            //Tại sao lại setIsOpenDrawer trong khi ở dưới lại dùng Modal? Vì ngay từ đầu đã dùng DrawerComponent
                            //Nhưng không thấy đẹp nên đổi sang ModalComponent.

                        }, // click row
                    };
                }} />
            </div>

            <ModalComponent 
            title='Chi tiết người dùng' 
            open={isOpenDrawer} 
            onCancel={() => setIsOpenDrawer(false)} 
            width="40%"
            footer={null}
            forceRender 
            >
                <LoadingComponent isPending={isPendingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onUpdateUser}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your Name!' }]}
                        >
                            <Input value={stateDetailUser.name} onChange={handleOnChangeDetailUser} name='name' />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input value={stateDetailUser.email} onChange={handleOnChangeDetailUser} name='email' />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your Address!' }]}
                        >
                            <Input value={stateDetailUser.address} onChange={handleOnChangeDetailUser} name='address' />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your Phone!' }]}
                        >
                            <Input value={stateDetailUser.phone} onChange={handleOnChangeDetailUser} name='phone' />
                        </Form.Item>

                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[{ required: true, message: 'Please input your Avatar!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeDetailAvatar} maxCount={1}>
                                <Button>Upload</Button>
                                {stateDetailUser?.avatar && (
                                    <img src={stateDetailUser?.avatar} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt='avatar' />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item label={null} wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </ModalComponent>

            <ModalComponent 
            forceRender 
            title="Xóa người dùng" 
            open={isModalOpenDelete} 
            onCancel={handleCancelDelete} 
            okText='Yes' 
            onOk={handleDeleteUser} 
            loading={isloading}
            >
                <LoadingComponent isPending={isPendingDeleted}>
                    <div>Bạn có chắc muốn xóa người dùng này không?</div>
                </LoadingComponent>
            </ModalComponent>
        </div>
    )
}

export default AdminUserComponent
