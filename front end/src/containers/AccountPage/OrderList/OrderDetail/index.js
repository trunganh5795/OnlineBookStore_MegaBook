import { Col, Modal, Row, Spin, Table, Tooltip, Timeline } from 'antd';
import orderApi from '../../../../apis/orderApi';
import helpers from '../../../../helpers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './index.scss';
function OrderDetail(props) {
  const { orderId, onClose } = props;
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [orderProgress, setOrderProgress] = useState([]);
  const [isLoadingProgess, setIsLoadingProgress] = useState(true);
  // event: lấy chi tiết đơn hàng
  useEffect(() => {
    let isSubscribe = true;
    async function getOrderDetails() {
      try {
        const response = await orderApi.getOrderDetails(orderId);
        if (isSubscribe && response) {
          setOrder(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setIsLoading(false);
          setOrder(null);
        }
      }
    }
    async function getOrderProgress() {
      try {
        const response = await orderApi.getOrderProgress(orderId);

        if (isSubscribe && response) {
          setOrderProgress(response.data);
          setIsLoadingProgress(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setIsLoadingProgress(false);
          // setOrder(null);
        }
      }
    }
    getOrderDetails();
    getOrderProgress();
    return () => {
      isSubscribe = false;
    };
  }, [orderId]);

  // cột cho bảng chi tiết sản phẩm
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (product, record) => {
        return (
          <Link to={`/product/${product.bookId}`}>
            <Tooltip title={product.title}>
              {helpers.reduceProductName(product.title, 40)}
            </Tooltip>
          </Link>
        );
      },
    },
    {
      title: 'Giá',
      dataIndex: 'product',
      key: 'price',
      render: (product, record) => helpers.formatProductPrice(product.price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'prod',
      render: (discount, record) => discount ? `${discount} %` : "--",
    },
    {
      title: 'Tổng',
      dataIndex: 'product',
      key: 'totalMoney',
      render: (product, record) => {
        const { price } = product;
        return helpers.formatProductPrice(
          price * ((100 - record.discount) / 100) * record.quantity
        );
      },
    },
  ];

  // rendering...
  return (
    <Modal
      width={1000}
      centered
      visible={visible}
      onCancel={() => {
        setVisible(false);
        onClose();
      }}
      maskClosable={false}
      footer={null}
      title={
        <p className="font-size-18px m-b-0">
          Chi tiết đơn hàng
          {/* {order && ( */}
          {order && (
            <>
              <span style={{ color: '#4670FF' }}>{` #${order.id}`}</span>
            </>
          )}
        </p>
      }>
      <>
        {(isLoading || !order) ? (
          <div className="pos-relative" style={{ minHeight: 180 }}>
            <Spin
              className="trans-center"
              tip="Đang tải ..."
              size="large"
            />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {/* thời gian đặt hàng */}
            <Col span={24} className="t-right">
              <b className="font-size-14px">
                {`Ngày đặt:  ${helpers.formatOrderDate(
                  order.createdAt,
                  1,
                )}`}
              </b>
            </Col>

            {/* địa chỉ người nhận */}
            <Col span={24} sm={12}>
              {order && (
                <>
                  <h3 className="t-center m-b-12">Địa chỉ giao hàng</h3>
                  <div
                    className="p-tb-12 p-lr-16 bg-gray bor-rad-8"
                    style={{ minHeight: 150 }}>
                    <h3 className="m-b-8">
                      <b>{order.ShippingAddress.reciver.toUpperCase()}</b>
                    </h3>
                    <p className="m-b-8">{`Địa chỉ: ${order.ShippingAddress.details}, ${order.ShippingAddress.ward.prefix} ${order.ShippingAddress.ward.name}, ${order.ShippingAddress.ward.district.prefix} ${order.ShippingAddress.ward.district.name}, ${order.ShippingAddress.ward.district.province.name}.`}</p>
                    <p className="m-b-8">
                      SĐT: {order.ShippingAddress.phone}
                    </p>
                  </div>
                </>
              )}
            </Col>

            {/* Hình thức thanh toán */}
            <Col span={24} sm={12}>
              {order && (
                <>
                  <h3 className="t-center m-b-12">Phương thức thanh toán</h3>
                  <div
                    className="p-tb-12 p-lr-16 bg-gray bor-rad-8 d-flex justify-content-center align-i-center"
                    style={{ minHeight: 150 }}>
                    <b className="m-b-8 font-size-20px">
                      {/* {helpers.convertPaymentMethod(order.paymentMethod)} */}
                      {helpers.convertPaymentMethod(order.payment)}
                    </b>
                  </div>
                </>
              )}
            </Col>
            {order && (
              <>
                {/* Chi tiết sản phẩm đã mua */}
                <Col span={24}>
                  <Table
                    scroll={{
                      x: 700
                    }}
                    pagination={false}
                    columns={columns}
                    dataSource={order.order_detail}
                    rowKey={'book_id'}
                  />
                </Col>

                {/* Tổng cộng */}
                <Col span={24} className="t-right">
                  <div className="d-flex font-weight-500 justify-content-end">
                    <p style={{ color: '#bbb' }}>Tiền hàng</p>
                    <span
                      className="m-l-32"
                      style={{ color: '#888', minWidth: 180 }}>
                      {helpers.formatProductPrice(order.total)}
                    </span>
                  </div>
                  <div className="d-flex font-weight-500 justify-content-end">
                    <p style={{ color: '#bbb' }}>Vận chuyển</p>
                    <span
                      className="m-l-32"
                      style={{ color: '#888', minWidth: 180 }}>
                      {/* {helpers.formatProductPrice(order.transportFee)} */}
                      {helpers.formatProductPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="d-flex font-weight-500 justify-content-end">
                    <p style={{ color: '#bbb' }}>Voucher</p>
                    <span
                      className="m-l-32"
                      style={{ color: '#888', minWidth: 180 }}>
                      {helpers.formatProductPrice(order.voucher_discount)}
                    </span>
                  </div>
                  <div className="d-flex font-weight-500 justify-content-end">
                    <p style={{ color: '#bbb' }}>Tổng</p>
                    <span
                      className="m-l-32 font-size-18px"
                      style={{ color: '#ff2000', minWidth: 180 }}>
                      {/* {helpers.formatProductPrice(helpers.calTotalOrderFee(order))} */}
                      {helpers.formatProductPrice(order.total + order.shipping - order.voucher_discount)}
                    </span>
                  </div>
                </Col>
                <Col span={24} md={12}>
                  {isLoadingProgess ?
                    <Spin
                      className="progress_loading"
                      tip="Đang tải ..."
                      size="large"
                    />
                    :
                    <Timeline mode="left">
                      {orderProgress.map((item, index) => (
                        <Timeline.Item key={index} label={moment(item.createdAt).format('DD-MM-YYYY')}>{item.text}</Timeline.Item>
                      ))}
                    </Timeline>
                  }
                </Col>
              </>
            )}
          </Row>
        )}
      </>
    </Modal>
  );
}

OrderDetail.propTypes = {
  orderId: PropTypes.number,
  onClose: PropTypes.func,
};

export default OrderDetail;
