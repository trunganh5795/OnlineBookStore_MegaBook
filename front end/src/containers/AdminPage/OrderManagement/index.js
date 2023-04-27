import React from 'react';
import moment from 'moment';
import { Button, Segmented, Table, DatePicker, Row, Col } from 'antd';
import {
  CarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CodeSandboxOutlined,
  DollarCircleOutlined,
  GiftOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import helpers from '../../../helpers';
import { useState } from 'react';
import AdminSearch from '../../../components/AdminSearch';
import { useEffect } from 'react';
import staffApis from '../../../apis/staffApi';
import message from '../../../configs/message.config';
import adminApi from '../../../apis/adminApi';
import { useCallback } from 'react';
import OrderDetail from '../../AccountPage/OrderList/OrderDetail';
import './index.scss';
const { RangePicker } = DatePicker;
let rangeTimeTemp = [moment().subtract(30, 'days'), moment()]; // tạo biến phụ để khi nào đổ cả start time và end time mới call lại API
let isSubscribe = true;
let selectedOption = 0;
let query = '';
// let paymentFilter = []
export default function OrderManagement() {
  const [selectedItem, setSelectedItem] = useState([]);
  const [orderStatus, setOrderStatus] = useState(1);
  const [CountAndGroupOrder, setCountAndGroupOrder] = useState([]);
  const [rangeTime, setRangeTime] = useState([
    moment().subtract(30, 'days'),
    moment(),
  ]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpenRangeTime, setIsOpenRangeTime] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [forceRunUseEffect, setForceRunUseEffect] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    orderId: '',
  });

  let columns = [
    {
      title: 'Mã đơn hàng',
      key: 'id',
      dataIndex: 'id',
      render: (v) => (
        <p
          className="order-id"
          onClick={() => {
            setOrderDetails({
              isOpen: true,
              orderId: v,
            });
          }}>
          {v}
        </p>
      ),
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
      // sortOrder: filterOps[1].field === 'total' ? filterOps[1].value : null,
      render: (value) => (
        <b style={{ color: '#333' }}>{helpers.formatProductPrice(value)}</b>
      ),
      // sorter: (a, b) => a.totalMoney - b.totalMoney,
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
      filteredValue: paymentFilter,
      render: (value) => helpers.convertPaymentMethod(value),
    },
    {
      title: 'Hành động',
      render: (_v, records) => (
        <>
          <div>
            <Button
              type="danger"
              className=" w-86px"
              onClick={() =>
                updateOrderStatus(records.id, '6', records.status)
              }>
              Hủy đơn
            </Button>
          </div>
          <div className="m-t-10">
            {/* <Button
                            className=' w-86px'
                            type="danger"
                            onClick={() => setOrderDetails({ isOpen: true, orderId: records.id })}
                        >
                            Chi tiết
                        </Button> */}
          </div>
        </>
      ),
    },
  ];

  const rowSelection = {
    selectedItem,
    onChange: setSelectedItem,
  };

  const modifiedColumns = (orderStatus, columns, paymentFilter) => {
    let orderStatusArray = [0, 1, 4, 5, 6]; // những trường hợp bỏ cột hành động
    if (orderStatusArray.includes(orderStatus)) {
      columns.splice(columns.length - 1, 1);
      if (orderStatus === 1) {
        columns.splice(columns.length - 1, 1);
      }
    } else if (orderStatus === 2) {
      columns[6].render = (_v, records) => (
        <>
          <div>
            <Button
              type="primary"
              className=" w-86px"
              onClick={() =>
                updateOrderStatus(records.id, '3', records.status)
              }>
              Xác nhận
            </Button>
          </div>
          <div className="m-t-10">
            <Button
              className=" w-86px"
              type="danger"
              onClick={() =>
                updateOrderStatus(records.id, '6', records.status)
              }>
              Hủy đơn
            </Button>
          </div>
        </>
      );
      if (paymentFilter.length === 1 && paymentFilter.includes(1)) {
        columns.splice(6, 0, {
          title: 'Khả năng hủy',
          key: 'cancelation',
          dataIndex: 'ratio',
          width: '150px',
          render: (value) => (
            <div className="t-center">
              <b>
                {value?.ratio
                  ? `${Math.floor((1 - value.ratio) * 100)} %`
                  : '-'}
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
      }
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
  const updateOrderStatus = async (orderId, status, currentStatus) => {
    try {
      await adminApi.postUpdateOrderStatus(orderId, status);
      let index = data.findIndex((item) => item.id === orderId);
      data.splice(index, 1);
      if (isSubscribe) {
        setData([...data]);
        let newCountGroupOder = [...CountAndGroupOrder];
        newCountGroupOder[+status - 1] = newCountGroupOder[+status - 1] + 1;
        newCountGroupOder[+currentStatus - 1] =
          newCountGroupOder[+currentStatus - 1] - 1;
        setCountAndGroupOrder(newCountGroupOder);
        message.success('Cập nhật thành công');
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data);
      } else {
        message.error('Có lỗi xảy ra');
      }
    }
  };

  const comfirmOrderBulk = async (ids) => {
    try {
      await staffApis.confirmOrderBulk(ids);
      for (let id of ids) {
        let index = data.findIndex((item) => item.id === id);
        if (index !== -1) {
          data.splice(index, 1);
        }
      }

      CountAndGroupOrder[1] = CountAndGroupOrder[1] - ids.length;
      CountAndGroupOrder[2] = CountAndGroupOrder[2] + ids.length;
      message.success('Cập nhật thành công');
      setCountAndGroupOrder([...CountAndGroupOrder]);
      setData([...data]);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data);
      } else {
        message.error('Có lỗi xảy ra');
      }
    }
  };

  const onSearch = useCallback(
    (value = '', option) => {
      selectedOption = option;
      query = value;
      if (page === 1) {
        setForceRunUseEffect((prev) => !prev);
      } else {
        setPage(1);
      }
    },
    [page],
  );

  useEffect(() => {
    isSubscribe = true;
    const countOrderByStatus = async () => {
      let data = await staffApis.countOrderByStatus(
        rangeTime[0].format('YYYY-MM-DD'),
        rangeTime[1].add(1, 'days').format('YYYY-MM-DD'),
      );
      //rangeTime[1].add(1, 'days').format('YYYY-MM-DD') Thêm 1 ngày để, trở thành cuối của ngày hôm trước
      let groupOrder = [0, 0, 0, 0, 0, 0];
      data.data.forEach((item, index) => {
        groupOrder[+item.status - 1] = item.total;
      });
      if (isSubscribe) setCountAndGroupOrder(groupOrder);
    };
    countOrderByStatus();
    return () => {
      isSubscribe = false;
      rangeTimeTemp = [moment().subtract(30, 'days'), moment()];
    };
  }, [rangeTime]);

  useEffect(() => {
    isSubscribe = true;
    const getOrderByStatus = async () => {
      try {
        let data = await staffApis.getOrderByStatus(
          rangeTime[0].format('YYYY-MM-DD'),
          rangeTime[1].add(1, 'days').format('YYYY-MM-DD'),
          null,
          orderStatus,
          page,
          8,
          paymentFilter,
          query,
          selectedOption,
        );
        //rangeTime[1].add(1, 'days').format('YYYY-MM-DD') Thêm 1 ngày để, trở thành cuối của ngày hôm trước
        if (isSubscribe) {
          setData(data.data.rows);
          setTotal(data.data.count);
        }
      } catch (error) {
        if (error.response) {
          message.error(error.response.data.message);
        } else {
          message.error('Có lỗi xảy ra');
        }
      }
    };
    getOrderByStatus();
    return () => {
      isSubscribe = false;
    };
  }, [orderStatus, page, rangeTime, paymentFilter, forceRunUseEffect]);

  useEffect(() => {
    isSubscribe = true;
    if (!isOpenRangeTime) {
      if (
        !(
          rangeTimeTemp[0].format('DD-MM-YYYY') ===
            rangeTime[0].format('DD-MM-YYYY') &&
          rangeTimeTemp[1].format('DD-MM-YYYY') ===
            rangeTime[1].format('DD-MM-YYYY')
        )
      ) {
        setRangeTime([...rangeTimeTemp]);
      }
    }
    return () => {
      isSubscribe = false;
    };
  }, [isOpenRangeTime]);

  return (
    <div className="staff-order-management p-5">
      <Segmented
        className=" m-auto d-block"
        defaultValue={1}
        onChange={(value) => {
          setOrderStatus(value);
          setData([]);
          setPage(1);
          setSelectedItem([]);
          query = '';
          selectedOption = 0;
          setPaymentFilter([]);
        }}
        options={[
          {
            label: (
              <div style={{ padding: 8 }}>
                <GiftOutlined className="font-size-50px" />
                <div>Tất cả</div>
                <p className="oder-value">
                  (
                  {CountAndGroupOrder.length
                    ? CountAndGroupOrder.reduce(
                        (total, item) => (total += item),
                        0,
                      )
                    : '--'}
                  )
                </p>
              </div>
            ),
            value: 0,
          },
          {
            label: (
              <div style={{ padding: 8 }}>
                <DollarCircleOutlined className="font-size-50px" />
                <p>Chờ thanh toán</p>
                <p className="oder-value">
                  ({CountAndGroupOrder[0] ? CountAndGroupOrder[0] : '--'})
                </p>
              </div>
            ),
            value: 1,
          },
          {
            label: (
              <div style={{ padding: 8 }}>
                <WalletOutlined className="font-size-50px" />
                <p>Chờ xác nhận</p>
                <p className="oder-value">
                  ({CountAndGroupOrder[1] ? CountAndGroupOrder[1] : '--'})
                </p>
              </div>
            ),
            value: 2,
          },
          {
            label: (
              <div style={{ padding: 8 }}>
                <CodeSandboxOutlined className="font-size-50px" />
                <p>Chờ lấy hàng</p>
                <p className="oder-value">
                  ({CountAndGroupOrder[2] ? CountAndGroupOrder[2] : '--'})
                </p>
              </div>
            ),
            value: 3,
          },
          {
            label: (
              <div style={{ padding: 8 }}>
                <CarOutlined className="font-size-50px" />
                <div>Đang vận chuyển</div>
                <p className="oder-value">
                  ({CountAndGroupOrder[3] ? CountAndGroupOrder[3] : '--'})
                </p>
              </div>
            ),
            value: 4,
          },
          {
            label: (
              <div style={{ padding: 8 }}>
                <CheckOutlined className="font-size-50px" />
                <div>Hoàn thành</div>
                <p className="oder-value">
                  ({CountAndGroupOrder[4] ? CountAndGroupOrder[4] : '--'})
                </p>
              </div>
            ),
            value: 5,
          },
          {
            label: (
              <div style={{ padding: 8 }}>
                <CloseCircleOutlined className="font-size-50px" />
                <div>Đơn hủy</div>
                <p className="oder-value">
                  ({CountAndGroupOrder[5] ? CountAndGroupOrder[5] : '--'})
                </p>
              </div>
            ),
            value: 6,
          },
        ]}
      />
      <div className="p-8 staff-search">
        <Row gutter={[16, 16]}>
          <Col>
            <h2 className="staff-order-management-order-day">Ngày đặt hàng</h2>
          </Col>
          <Col flex="auto">
            <RangePicker
              className="w-100"
              size="large"
              defaultValue={[rangeTime[0], rangeTime[1]]}
              format={'DD/MM/YYYY'}
              // onChange={(e) => setRangeTime(e)}
              okText="OK"
              onCalendarChange={(rangeInMoment, rangeInString) =>
                (rangeTimeTemp = rangeInMoment)
              }
              onOpenChange={(e) => setIsOpenRangeTime(e)}
            />
          </Col>
        </Row>
        <div className="d-flex">
          <AdminSearch
            options={[
              { text: 'Tất Cả', id: 0 },
              { text: 'Tên khách hàng', id: 1 },
              { text: 'Mã đơn hàng', id: 2 },
            ]}
            onSearch={onSearch}
            selectedOption={selectedOption}
          />
        </div>
        {orderStatus === 2 && selectedItem.length > 0 ? (
          <Button
            type="primary"
            // onClick={UpdateOrderStatusModal}
            onClick={() => comfirmOrderBulk(selectedItem)}>
            Xác nhận hàng loạt
          </Button>
        ) : (
          <></>
        )}
      </div>

      {modifiedColumns(orderStatus, columns, paymentFilter)}
      <Table
        className="font-size-16px"
        pagination={{
          showLessItems: true,
          showSizeChanger: false,
          position: ['bottomCenter'],
          current: page,
          pageSize: 10,
          total,
          onChange: (p) => setPage(p),
        }}
        // loading={isLoading}
        rowKey={'id'}
        rowSelection={orderStatus === 2 ? rowSelection : false}
        columns={columns}
        dataSource={data}
        onChange={(pagination, filters, sorter, extra) => {
          let forceRerender = false;
          if (!filters.payment && paymentFilter.length !== 0) {
            forceRerender = true;
          } else if (paymentFilter.length !== filters.payment.length) {
            forceRerender = true;
          } else {
            for (let item of filters.payment) {
              if (!filters.payment.includes(item)) {
                forceRerender = true;
                break;
              }
            }
          }
          if (forceRerender) {
            if (!filters.payment) {
              setPaymentFilter([]);
            } else {
              setPaymentFilter(filters.payment);
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
  );
}
