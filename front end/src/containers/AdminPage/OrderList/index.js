import { Button, message, Modal, Radio, Table } from 'antd';
import adminApi from '../../../apis/adminApi';
import helpers from '../../../helpers';
import React, { useCallback, useEffect, useState } from 'react';
import OrderDetail from '../../AccountPage/OrderList/OrderDetail/index';
import AdminSearch from '../../../components/AdminSearch';
import moment from 'moment';
let isSubscribe = true;
let selectedOption = 0;
let query = '';
let filterOps = [
  { field: 'status', value: [] },
  { field: undefined, value: undefined },
  { field: 'payment', value: [] },
];
function generateFilterOrder() {
  let result = [];
  for (let i = 1; i < 7; ++i) {
    result.push({ value: i, text: helpers.convertOrderStatus(i) });
  }
  return result;
}

function OrderList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    orderId: '',
  });
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [forceRunUseEffect, setForceRunUseEffect] = useState(false);
  // event: Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (id, orderStatus) => {
    try {
      const response = await adminApi.postUpdateOrderStatus(id, orderStatus);
      if (response) {
        message.success('Cập nhật thành công');
        setData((data) =>
          data.map((item) =>
            item.id === id ? { ...item, status: orderStatus } : { ...item },
          ),
        );
      }
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };
  const updateNumOfContact = async (orderId) => {
    try {
      if (orderId) {
        let result = await adminApi.updateNumOfContact(orderId);
        if (result.data) {
          message.success('Cập nhật thành công');
          setData((data) =>
            data.map((item) =>
              item.id === orderId
                ? {
                    ...item,
                    ratio: {
                      ...item.ratio,
                      contact_time: item.ratio.contact_time + 1,
                    },
                  }
                : { ...item },
            ),
          );
        }
      } else {
        message.error('Không thể cập nhật, vui lòng kiểm tra lại');
      }
    } catch (error) {
      message.error('Xảy ra lỗi');
    }
  };
  // modal cập nhật trạng thái đơn hàng
  function UpdateOrderStatusModal(defaultVal = 0, orderId) {
    let valueCurr = defaultVal;
    const modal = Modal.info({
      width: 768,
      title: `Cập nhật trạng thái đơn hàng #${orderId}`,
      content: (
        <Radio.Group
          defaultValue={defaultVal}
          onChange={(v) => (valueCurr = v.target.value)}
          className="m-t-12">
          {generateFilterOrder().map((item, index) => (
            <Radio
              className="m-b-8"
              key={index}
              value={item.value}
              disabled={defaultVal === item.value ? true : false}>
              {item.text}
            </Radio>
          ))}
        </Radio.Group>
      ),
      centered: true,
      icon: null,
      okText: 'Cập nhật',
      onOk: () => {
        updateOrderStatus(orderId, valueCurr);
        modal.destroy();
      },
    });
  }

  let columns = [
    {
      title: 'Mã đơn hàng',
      key: 'id',
      dataIndex: 'id',
      render: (id) => <p>{id}</p>,
    },
    {
      title: 'Mã KH',
      key: 'user_id',
      dataIndex: 'user_id',
    },
    {
      title: 'Tên',
      key: 'user',
      dataIndex: 'user',
      render: (value) => value.name,
    },
    {
      title: 'Ngày đặt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (value) => moment(value).format('DD-MM-YYYY'),
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      dataIndex: 'total',
      sortOrder: filterOps[1].field === 'total' ? filterOps[1].value : null,
      render: (value) => (
        <b style={{ color: '#333' }}>{helpers.formatProductPrice(value)}</b>
      ),
      sorter: (a, b) => a.totalMoney - b.totalMoney,
    },
    {
      title: 'HT thanh toán',
      key: 'payment',
      dataIndex: 'payment',
      filters: [
        { text: 'COD', value: 1 },
        { text: 'Card', value: 3 },
        { text: 'QRcode', value: 2 },
      ],
      filteredValue: filterOps[2].value,
      render: (value) => helpers.convertPaymentMethod(value),
    },
    {
      title: 'Trạng thái đơn hàng',
      key: 'status',
      dataIndex: 'status',
      filteredValue: filterOps[0].value,
      filters: generateFilterOrder(),
      render: (value) => helpers.convertOrderStatus(+value),
    },
    {
      title: 'Hành động',
      render: (_v, records) => (
        <>
          <div>
            <Button
              type="primary"
              className=" w-86px"
              onClick={() =>
                UpdateOrderStatusModal(
                  +records.status,
                  // truyền order status vào dạng text luôn lưu ý format chữ in hoa in thường
                  records.id,
                )
              }>
              Cập nhật
            </Button>
          </div>
          <div className="m-t-10">
            <Button
              className=" w-86px"
              type="danger"
              onClick={() =>
                setOrderDetails({ isOpen: true, orderId: records.id })
              }>
              Chi tiết
            </Button>
          </div>
        </>
      ),
    },
  ];
  const onSearch = useCallback(
    (value = '', option) => {
      selectedOption = option;
      query = value;
      filterOps = [
        { field: 'status', value: [] },
        { field: undefined, value: undefined },
        { field: 'payment', value: [] },
      ];
      if (page === 1) {
        setForceRunUseEffect((prev) => !prev);
      } else {
        setPage(1);
      }
    },
    [page],
  );
  const getOrderList = useCallback(
    async (value = '', page, perPage, option, filterOps) => {
      // addColumn();
      if (option === 0) {
        const response = await adminApi.getOrderList(
          page,
          perPage,
          filterOps[0].value,
          filterOps[2].value,
          filterOps[1].field,
          filterOps[1].value,
        );
        if (response.data && isSubscribe) {
          const { count, rows } = response.data;
          setTotalPage(count);
          setData(rows);
          setIsLoading(false);
        }
      } else {
        const response = await adminApi.getOrderListBy(
          value,
          option,
          page,
          perPage,
          filterOps[0].value,
          filterOps[2].value,
          filterOps[1].field,
          filterOps[1].value,
        );
        if (response.data && isSubscribe) {
          const { count, rows } = response.data;
          setTotalPage(count);
          setData(rows);
          setIsLoading(false);
        }
      }
    },
  );
  let addColumn = (filterOps) => {
    if (
      filterOps[0].value.findIndex((item) => item === 3) !== -1 &&
      filterOps[2].value.findIndex((item) => item === 1) !== -1 &&
      columns[columns.length - 1].dataIndex !== 'cancelation' &&
      filterOps[0].value.length === 1 &&
      filterOps[2].value.length === 1
    ) {
      columns.push({
        title: 'Khả năng hủy',
        key: 'cancelation',
        dataIndex: 'ratio',
        render: (value) => (
          <div className="t-center">
            <b>
              {value?.ratio ? `${Math.floor((1 - value.ratio) * 100)} %` : '-'}
            </b>
            <br />
            <Button
              type="primary"
              onClick={() => updateNumOfContact(value?.order_id)}
              disabled={value?.contact_time >= 3 ? true : false}>
              Liên hệ ({value?.contact_time})
            </Button>
          </div>
        ),
      });
    } else if (
      filterOps[2].value.findIndex((item) => item === 1) === -1 &&
      columns[columns.length - 1].dataIndex === 'cancelation'
    ) {
      columns.splice(columns.length - 1, 1);
    }
  };
  useEffect(() => {
    isSubscribe = true;
    getOrderList(query, page, 10, selectedOption, filterOps);
    return () => {
      isSubscribe = false;
    };
  }, [page, forceRunUseEffect]);

  return (
    <>
      <div className="m-lr-10 m-t-10">
        <AdminSearch
          options={[
            { text: 'Tất Cả', id: 0 },
            { text: 'Tên khách hàng', id: 1 },
            { text: 'Mã đơn hàng', id: 2 },
          ]}
          onSearch={onSearch}
          selectedOption={selectedOption}
        />
        {addColumn(filterOps)}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            showLessItems: true,
            position: ['bottomCenter'],
            total: totalPage,
            onChange: (p) => setPage(p),
          }}
          loading={isLoading}
          onChange={(pagination, filters, sorter, extra) => {
            let flag = false;

            filters.status?.forEach((item) => {
              let index = filterOps[0].value?.findIndex((i) => item === i);
              if (index === -1) flag = true;
            });

            filters.payment?.forEach((item) => {
              let index = filterOps[2].value?.findIndex((i) => item === i);
              if (index === -1) flag = true;
            });

            if (
              (!filters.status && filterOps[0].value.length !== 0) ||
              filters.status?.length !== filterOps[0].value.length ||
              (!filters.payment && filterOps[2].value.length !== 0) ||
              filters.payment?.length !== filterOps[2].value.length ||
              sorter.field !== filterOps[1].field ||
              sorter.order !== filterOps[1].value
            )
              flag = true;
            if (flag) {
              filterOps[0].value = filters.status ? filters.status : [];
              filterOps[2].value = filters.payment ? filters.payment : [];
              filterOps[1].field = sorter.field;
              filterOps[1].value = sorter.order;
              if (page === 1) {
                return setForceRunUseEffect((prev) => !prev);
              } else {
                setPage(1);
              }
            }
          }}
        />
        {orderDetails.isOpen && (
          <OrderDetail
            orderId={orderDetails.orderId}
            onClose={() => setOrderDetails({ isOpen: false })}
          />
        )}
      </div>
    </>
  );
}

export default OrderList;
