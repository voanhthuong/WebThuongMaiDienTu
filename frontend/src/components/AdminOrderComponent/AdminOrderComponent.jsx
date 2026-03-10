import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import { WrapperHeader } from "./Style";
import { jwtDecode } from "jwt-decode";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";
import { useNavigate } from "react-router-dom";


const AdminOrderComponent = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stateDetailOrder, setStateDetailOrder] = useState({});
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  let storageData = localStorage.getItem("access_token");

  let userId = null;
  if (storageData) {
    try {
      storageData = JSON.parse(storageData);

      const decodedToken = jwtDecode(storageData);
      userId = decodedToken?.id || decodedToken?.sub || decodedToken?.userId;
    } catch (e) {
      console.error("Failed to decode token:", e);
      storageData = null;
    }
  }

  const fetchGetDetailOrder = async (orderId) => {
    if (!storageData || !userId) return;
    setIsLoading(true);
    const res = await OrderService.getDetailOrder(storageData, orderId);
    if (res?.data) {
      setStateDetailOrder({
        orderId: res.data._id,
        customerName: res.data.shippingAddress?.fullName || res.data.user?.name || "Không xác định",
        // userName: res.data.user?.name || "Không xác định",
        phone: res.data.shippingAddress?.phone || "",
        shippingAddress: res.data.shippingAddress || {},
        total: res.data.totalPrice,
        isDelivered: res.data.isDelivered,
        isPaid: res.data.isPaid,
        createdAt: res.data.createdAt,
        orderItems: res.data.orderItems || [],
      });
    }
    setIsLoading(false);
  };


  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailOrder(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    form.setFieldsValue(stateDetailOrder);
  }, [form, stateDetailOrder]);

  const mutationDeleteOrder = useMutationHook((data) => {
    const { id, token } = data;
    return OrderService.deleteOrder(token, id);
  });

  const mutationUpdateOrder = useMutationHook((data) => {
    const { id, token, ...updateData } = data;
    return OrderService.updateOrder(id, token, updateData);
  });

  const getAllOrders = async () => {
    if (!storageData || !userId) return { data: [] };
    const res = await OrderService.getAllOrders(storageData, userId);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    retry: 3,
    retryDelay: 1000,
    onError: () => {
      message.error("Không thể tải danh sách đơn hàng.");
    },
  });
  const { data } = queryOrder

  // console.log('queryOrder', data?.data[0].shippingAddress.fullName)

  useEffect(() => {
    if (mutationDeleteOrder.isSuccess && mutationDeleteOrder.data?.status === "OK") {
      message.success(mutationDeleteOrder.data?.message);
      setIsModalOpenDelete(false);
      queryOrder.refetch();
    }
  }, [mutationDeleteOrder.isSuccess]);

  useEffect(() => {
    if (mutationUpdateOrder.isSuccess && mutationUpdateOrder.data?.status === "OK") {
      message.success(mutationUpdateOrder.data?.message);
      setIsOpenDrawer(false);
      queryOrder.refetch();
    }
  }, [mutationUpdateOrder.isSuccess]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Tìm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Đặt lại
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (open) => {
      if (open) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const statusColors = {
    Pending: "orange",
    Shipping: "blue",
    true: "green",
    false: "red",
  };

  const columns = [
    // {
    //   title: "Mã đơn",
    //   dataIndex: "_id",
    // },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      render: (total) => total.toLocaleString('vi-VN')
    },
    {
      title: "Giao hàng",
      dataIndex: "isDelivered",
      filters: [
        { text: "Chưa giao hàng", value: false },
        { text: "Đã giao hàng", value: true },
      ],
      onFilter: (value, record) => record.isDelivered === value,
      render: (isDelivered) => <Tag color={statusColors[isDelivered] || "default"}>{isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}</Tag>,
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      filters: [
        { text: "Chưa thanh toán", value: false },
        { text: "Đã thanh toán", value: true },
      ],
      onFilter: (value, record) => record.isPaid === value,
      render: (isPaid) => <Tag color={statusColors[isPaid] || "default"}>{isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</Tag>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <DeleteOutlined
            style={{ color: "red", fontSize: 20, marginRight: 12 }}
            onClick={(e) => {
              e.stopPropagation();
              setRowSelected(record._id);
              setIsModalOpenDelete(true);
            }}
          />
          <EditOutlined
            style={{ color: "blue", fontSize: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              setRowSelected(record._id);
              setIsOpenDrawer(true);
            }}
          />
        </>
      ),
    },
  ];

  const dataTable = queryOrder?.data?.data?.map((order) => ({
    ...order,
    key: order._id,
    customerName: order?.shippingAddress?.fullName || order.user?.name || "Không xác định",
    phone: order.shippingAddress?.phone || "",
    total: order.totalPrice,
    isDelivered: order.isDelivered,
    isPaid: order.isPaid,
  })) || [];

  const handleDeleteOrder = () => {
    if (storageData && rowSelected) {
      mutationDeleteOrder.mutate({ id: rowSelected, token: storageData });
    }
  };


  const handleUpdateOrder = (values) => {
    const { isDelivered, isPaid } = values;

    if (storageData && rowSelected) {
      mutationUpdateOrder.mutate({ ...data, id: rowSelected, token: storageData, isDelivered, isPaid });
    }
  };


  const navigate = useNavigate()
  const handleGetDetailProduct = async(productId) => {
    navigate(`/productDetail/${productId}`)
  }


  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>

      <TableComponent
        columns={columns}
        isPending={queryOrder.isLoading}
        data={dataTable}
        onRow={(record) => ({
          onClick: () => {
            setRowSelected(record._id);
            setIsOpenDrawer(true);
          },
        })}
      />

      <ModalComponent
        title={`Chi tiết đơn hàng - ${stateDetailOrder?.orderId || ""}`}
        open={isOpenDrawer}
        width="50%"
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        <LoadingComponent isPending={isLoading || mutationUpdateOrder.isPending}>
          <Form layout="vertical" form={form} onFinish={handleUpdateOrder} forceRender >
            <Form.Item label="Khách hàng" name="customerName">
              <Input disabled />
            </Form.Item>
            <Form.Item label="SĐT" name="phone">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Địa chỉ" name={["shippingAddress", "address"]}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tổng tiền" name="total">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Giao hàng" name="isDelivered" rules={[{ required: true, message: "Chọn trạng thái" }]}>
              <Select>
                <Select.Option value={true}>Đã giao hàng</Select.Option>
                <Select.Option value={false}>Chưa giao hàng</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Thanh toán" name="isPaid" rules={[{ required: true, message: "Chọn trạng thái" }]}>
              <Select>
                <Select.Option value={true}>Đã thanh toán</Select.Option>
                <Select.Option value={false}>Chưa thanh toán</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Cập nhật</Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 24 }}>
            <b>Sản phẩm:</b>
            <ul>
              {(stateDetailOrder.orderItems || []).map((item, idx) => (

                <li key={idx}>
                  <img 
                  onClick={() => handleGetDetailProduct(item?.product)} 
                  src={item?.image} 
                  style={{ 
                    width: 60, 
                    height: 60, 
                    objectFit: 'cover', 
                    borderRadius: 6 }} 
                    alt={item?.name} /> {item.name} x {item.amount}: {item.price.toLocaleString()} VNĐ (Giá chưa giảm)
                </li>
              ))}
            </ul>
          </div>
        </LoadingComponent>
      </ModalComponent>

      <ModalComponent
        title="Xóa đơn hàng"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        okText="Xóa"
        onOk={handleDeleteOrder}
      >
        <LoadingComponent isPending={mutationDeleteOrder.isPending}>
          <div>Bạn có chắc muốn xóa đơn hàng này không?</div>
        </LoadingComponent>
      </ModalComponent>
    </div>
  );
};

export default AdminOrderComponent;
