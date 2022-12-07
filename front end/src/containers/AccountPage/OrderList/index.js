import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Spin, Table, Tooltip } from 'antd';
import orderApi from '../../../apis/orderApi';
import helpers from '../../../helpers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OrderDetail from './OrderDetail';
import './index.scss';
import PostCommentModal from './PostCommentModal/PostCommentModal';
import commentApi from '../../../apis/commentApi';
// fn: tạo danh sách lọc cho trạng thái đơn hàng
function generateOrderStaFilter() {
  let result = [];
  for (let i = 1; i < 7; ++i) {
    result.push({ value: i, text: helpers.convertOrderStatus(i) });
  }
  return result;
}
function OrderList() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [orderListShowMore, setShowMore] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    isOpen: false,
    orderId: '',
  });
  const [ratingOrder, setRatingOrder] = useState({
    isOpen: false,
    products: []
  });
  const user = useSelector((state) => state.user);

  // các cột cho bảng danh sách đơn hàng
  const orderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 60,
      align: 'center',
      render: (orderCode, records) => (
        <Button
          className='t-center p-lr-0'
          type="link"
          onClick={() =>
            setOrderDetails({ isOpen: true, orderId: records.id })
          }>
          <b>{orderCode}</b>
        </Button>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      width: 120,
      key: 'createdAt',
      render: (createdAt) => helpers.formatOrderDate(createdAt),
      sorter: (a, b) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      },
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'order_detail',
      key: 'order_detail',
      width: 250,
      render: (orderProd, records) => {
        let findIdx = orderListShowMore.findIndex((id) => id === records.id);
        //orderListShowMore các đơn hàng bấm showMore
        return (
          <>
            {findIdx !== -1 ? orderProd.map((item, index) => (
              <div key={index}>
                <Link to={`/product/${item.book_id}`}>
                  <Tooltip title={item.title}>
                    {helpers.reduceProductName(item.product.title, 22)} x {item.quantity}
                  </Tooltip>
                </Link>
              </div>
            )) : (
              <Link to={`/product/${orderProd[0]?.book_id}`}>
                <Tooltip title={orderProd[0]?.name}>
                  {helpers.reduceProductName(orderProd[0]?.product.title, 22)} x {orderProd[0]?.quantity}
                </Tooltip>
              </Link>
            )}
            <h3 className="t-center see-more"
              onClick={() => {
                if (findIdx !== -1) {
                  orderListShowMore.splice(findIdx, 1);
                  setShowMore([...orderListShowMore]);
                } else {
                  setShowMore((prev) => [...prev, records.id]);
                }
              }}
            >
              {findIdx !== -1 ? <CaretUpOutlined /> : <CaretDownOutlined />}
            </h3>
          </>);
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: (value, record) => helpers.formatProductPrice(record.total + record.shipping - record.voucher_discount),
      sorter: (a, b) => (helpers.calTotalOrderFee(a.order_detail) + a.shipping - a.voucher_discount) - (helpers.calTotalOrderFee(b.order_detail) + b.shipping - b.voucher_discount),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      fixed: 'right',
      width: 150,
      key: 'status',
      filters: generateOrderStaFilter(),
      onFilter: (value, record) => record.status == value,
      render: (orderStatus, record) => (<>
        <p className='m-b-0'>{helpers.convertOrderStatus(+orderStatus)}</p>
        {(orderStatus == 5 && !record.isRate) ? <Button
          type="primary"
          onClick={() => {
            setRatingOrder({ isOpen: true, products: record });
          }}
        >
          Đánh giá
        </Button> : ((orderStatus == 2 || orderStatus == 1) ? (
          <div>
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đơn hàng này ?"
              onConfirm={() => userCancelOrder(record.id)}
              // onCancel={cancel}
              okText="Đồng ý"
              cancelText="Thoát">
              <Button
                type="danger"
                className='w-100'>
                Hủy
              </Button>
            </Popconfirm>
            {orderStatus == 1 ?
              <Link to={{ pathname: record.paylink }} target="_blank">
                <Button
                  className='w-100 m-t-5'
                  type="primary"
                >Thanh toán</Button>
              </Link>
              : ""}

          </div>
        ) : " ")}
      </>),
    },
  ];
  // fn: hiển thị danh sách đơn hàng
  function showOrderList(list) {
    return list && list.length === 0 ? (
      <h3 className="m-t-16 t-center" style={{ color: '#888' }}>
        Bạn không có đơn hàng nào
      </h3>
    ) : (
      <Table
        className="order-detail"
        columns={orderColumns}
        scroll={{
          x: 700
        }}
        dataSource={list}
        rowKey="id"
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          position: ['bottomRight'],
        }}
      />
    );
  }
  const postComment = async (orderId, dataComments, setLoading, onClose) => {
    try {
      for (let i = 0; i < dataComments.length; i++) {
        if (!(dataComments[i].rate)) return message.error("Vui lòng chọn đánh giá");
      }
      setLoading(true);
      await commentApi.postComment({ orderId, data: dataComments });
      let dataIndex = orderList.findIndex((item, index) => item.id === orderId);
      setTimeout(() => {
        setLoading(false);
        onClose();
        if (dataIndex !== -1) {
          orderList[dataIndex].isRate = true;
          setOrderList([...orderList]);
        }
      }, 2000);
    } catch (error) {
      message.error("Xãy ra lỗi");
    }
  };
  const userCancelOrder = async (orderId) => {
    try {
      await orderApi.customerCancelOrder(orderId);
      let dataIndex = orderList.findIndex((item, index) => item.id === orderId);
      if (dataIndex !== -1) {
        if (dataIndex !== -1) {
          orderList[dataIndex].status = "6";
          setOrderList([...orderList]);
        }
      }
    } catch (error) {
      message.error("Xãy ra lỗi");
    }
  };
  // event: Lấy danh sách
  useEffect(() => {
    let isSubscribe = true;
    async function getOrderList() {
      try {
        setIsLoading(true);
        const response = await orderApi.getOrderList(user.id); //getAll
        if (response && isSubscribe) {
          const { list } = response.data;
          setOrderList(
            list.map((item, index) => {
              return { ...item, key: index };
            }),
          );
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setIsLoading(false);
          setOrderList([]);
        }
      }
    }
    if (user.id) getOrderList();
    return () => {

      isSubscribe = false;
    };
  }, [user]);

  // rendering ...
  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-48">
          <Spin tip="Đang tải..." size="large" />
        </div>
      ) : (
        showOrderList(orderList)
      )}
      {orderDetails.isOpen && (
        <OrderDetail
          orderId={orderDetails.orderId}
          onClose={() => setOrderDetails({ isOpen: false })}
        />
      )}
      {ratingOrder.products.order_detail?.length > 0 ?
        <PostCommentModal
          visible={ratingOrder.isOpen}
          ratingOrder={ratingOrder.products}
          setRatingOrder={setRatingOrder}
          postComment={postComment}
        />
        : <>
        </>}

    </>
  );
}

export default OrderList;
