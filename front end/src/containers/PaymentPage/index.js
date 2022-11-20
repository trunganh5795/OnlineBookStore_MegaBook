import { DollarCircleOutlined, HomeOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Image,
  Input,
  message,
  Result,
  Row,
} from 'antd';
// import addressApi from '../../apis/addressApi';
import orderApi from '../../apis/orderApi';
import CartPayment from '../../components/Cart/Payment';
import constants from '../../constants/index';
import AddressUserList from '../../containers/AccountPage/UserAddressList';
import helpers from '../../helpers';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import cartReducers from '../../reducers/carts';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';
import addressApi from '../../apis/addressApi';


function PaymentPage() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  // ghi chú đơn hàng
  const note = useRef('');
  const [paymentMethod, setPaymentMethod] = useState(1);
  const selectedVoucher = useRef(null)
  const carts = useSelector((state) => state.carts);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [qrcodeModalOpen, setQrcodeModalOpen] = useState(false);
  const [qrCodeLinkPayment, setQrCodeLinkPayment] = useState('');
  const [addressIndex, setAddressIndex] = useState(-1)
  const [transportFee, setTransportFee] = useState(null)
  // giá tạm tính
  // fn: hiển thị danh sách đơn hàng
  // Note: Chưa kiểm tra tình trạng thật của sản phẩm trong db !
  function showOrderInfo(carts) {
    return carts.map((item, index) => (
      <Card key={index}>
        <Card.Meta
          avatar={
            // <Avatar size={48} shape="square" src={item.img} alt="Photo" />
            <Image src={item.img} preview={false} width={70} />
          }
          title={helpers.reduceProductName(item.title, 40)}
          description={
            <>
              <span>{`SL: ${item.amount}`}</span>
              <p className="font-size-16px font-weight-700">
                {helpers.formatProductPrice(item.price)}
              </p>
            </>
          }
        />
      </Card>
    ));
  }

  // event: đặt hàng
  const onCheckout = async () => {
    try {
      setIsLoading(true); //loading khi server đang xử lý đơn hàng
      if (addressIndex === -1) {
        message.warn('Vui lòng chọn địa chỉ giao hàng');
        setIsLoading(false);
        return;
      }
      const { deliveryAdd, province } = addressIndex;
      // const transportMethod = transport;
      const orderDate = new Date();
      const productList = carts.map((item) => {
        const { amount, bookId, rcm, rcmtype, index } = item;
        return {
          quantity: amount,
          bookId,
          rcm,
          rcmtype,
          index
        };
      });
      const response = await orderApi.postCreateOrder({
        province,
        deliveryAdd,
        paymentMethod: paymentMethod,
        // transportMethod,
        transportFee,
        orderDate,
        productList,
        note: note.current,
        voucherId: selectedVoucher.current
      });
      if (response && response.status === 200) {
        if (paymentMethod === 1) { //COD
          setTimeout(() => {
            message.success('Đặt hàng thành công', 2);
            setIsLoading(false);
            setIsOrderSuccess(true);
            dispatch(cartReducers.resetCart());
          }, 1000);
        } else if (paymentMethod === 2) {
          setTimeout(() => {
            // message.success('Đặt hàng thành công', 2);
            setIsLoading(false);
            setQrCodeLinkPayment(response.data.direct)
            setQrcodeModalOpen(true)
            dispatch(cartReducers.resetCart());
          }, 1000);
        } else if (paymentMethod === 3) {
          window.location.replace(response.data.direct)
          dispatch(cartReducers.resetCart());
        }

      }
    } catch (error) {
      message.error('Đặt hàng thất bại, thử lại', 3);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isSubscribe = true;
    const getShippingCost = async () => {
      if (addressIndex !== -1) {
        let shippingCost = await addressApi.getShippingCost(addressIndex.province, carts.length)
        setTransportFee(shippingCost.data.cost);
      }
    }
    getShippingCost();
    return () => {
      isSubscribe = false;
    }
  }, [addressIndex])
  // rendering ...
  return (
    <>
      {carts.length <= 0 && !isOrderSuccess && !qrcodeModalOpen && (
        <Redirect to={constants.ROUTES.CART} />
      )}
      {isAuth ? (
        <div className="m-tb-32 container">
          {isOrderSuccess ? (
            <Result
              status="success"
              title="Đơn hàng của bạn đã đặt thành công."
              subTitle="Xem chi tiết đơn hàng vừa rồi"
              extra={[
                <Button type="default" key="0">
                  <Link to={constants.ROUTES.ACCOUNT + '/orders'}>
                    Xem chi tiết đơn hàng
                  </Link>
                </Button>,
                <Button key="1" type="primary">
                  <Link to="/">Tiếp tục mua sắm</Link>
                </Button>,
              ]}
            />
          ) : qrcodeModalOpen ? <div className='t-center'>
            <h2>Quét mã QR để thanh toán</h2>
            <QRCodeSVG value={qrCodeLinkPayment} level="L" includeMargin size={200} />
            <div>
              <Button key="1" type="primary">
                <Link to="/account/orders">Đi tới giỏ hàng</Link>
              </Button>
            </div>

          </div> : (
            <Row gutter={[16, 16]}>
              {/* Đường dẫn */}
              <Col span={24} className="d-flex page-position">
                <Link to="/">
                  <HomeOutlined
                    className="p-12 icon-home font-size-16px bg-white"
                    style={{ borderRadius: 50 }}
                  />
                </Link>
                <span
                  className="p-lr-8 font-weight-500"
                  style={{ lineHeight: '40px' }}>{`>`}</span>
                <span
                  className="p-8 font-weight-500 bg-white"
                  style={{ borderRadius: 50 }}>
                  Thanh toán
                </span>
              </Col>

              {/* Thông tin giao hàng  */}
              <Col span={24} md={16}>
                {/* địa chỉ giao nhận, cách thức giao */}
                <div className="p-12 bg-white bor-rad-8 m-tb-16">
                  <h2 className='m-b-5'>Địa chỉ giao hàng</h2>
                  <AddressUserList
                    isCheckout={true}
                    onChecked={(value) => (setAddressIndex(value))}
                  />
                </div>

                {/* ghi chú */}
                <div className="p-12 p-b-25 bg-white bor-rad-8">
                  <h2 className="m-b-8">Thêm ghi chú</h2>
                  <Input.TextArea
                    placeholder="ghi chú cho đơn hàng"
                    maxLength={200}
                    showCount
                    allowClear
                    onChange={(value) => (note.current = value.target.value)}
                  />
                </div>

                {/* phương thức thanh toán */}
                <div className="p-12 bg-white bor-rad-8 m-tb-16">
                  <h2 className="m-b-8">Phương thức thanh toán</h2>
                  <p>Xin vui lòng kiểm tra kỹ trước khi đặt hàng</p>
                  <Row gutter={[16, 16]}>
                    <Col span={24} md={8}
                      onClick={() => setPaymentMethod(1)}
                    >
                      <div className={paymentMethod === 1 ? "p-tb-8 p-lr-16 bg-gray item-active h-100px" : "p-tb-8 p-lr-16 bg-gray h-100px"}>
                        <b className="font-size-16px">
                          COD
                        </b>
                        <p>
                          Thanh toán khi nhận hàng <DollarCircleOutlined className="t-color-second" />
                        </p>
                      </div>
                    </Col>
                    <Col
                      span={24}
                      md={8}
                      onClick={() => {
                        setPaymentMethod(3); // 3 trên database là card direction
                      }
                      }>
                      <div className={paymentMethod === 3 ? "p-tb-8 p-lr-16 bg-gray item-active h-100px" : "p-tb-8 p-lr-16 bg-gray h-100px"}>
                        <b className="font-size-16px">
                          Card
                        </b>
                        <p>
                          Thanh toán với thẻ ngân hàng
                        </p>
                      </div>
                    </Col>
                    <Col
                      span={24}
                      md={8}
                      onClick={() => {
                        setPaymentMethod(2); //2 tương ứng qr code trên database
                      }
                      }>
                      <div className={paymentMethod === 2 ? "p-tb-8 p-lr-16 bg-gray item-active h-100px" : "p-tb-8 p-lr-16 bg-gray h-100px"}>
                        <b className="font-size-16px">
                          Quét mã QR
                        </b>
                        <p>
                          Thanh toán hộ với QRcode
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* đặt hàng */}
              <Col span={24} md={8}>
                {/* thồng tin đơn hàng */}
                <div className="p-12 bg-white bor-rad-8 m-tb-16">
                  <div className="d-flex justify-content-between">
                    <h2>Thông tin đặt hàng</h2>
                    <Button type="link" size="large">
                      <Link to={constants.ROUTES.CART}>Sửa</Link>
                    </Button>
                  </div>
                  <div>{showOrderInfo(carts)}</div>
                </div>

                {/* tiến hành đặt hàng */}
                <div className="bg-white">
                  <CartPayment
                    isLoading={isLoading}
                    carts={carts}
                    isCheckout={true}
                    transportFee={transportFee}
                    onCheckout={onCheckout}
                    selectedVoucher={selectedVoucher}
                  />
                  <div className="t-center p-b-16">
                    <span
                      style={{
                        color: '#ff5000',
                      }}>{`(Vui lòng kiểm tra đơn hàng trước khi thanh toán)`}</span>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </div>
      ) : (isAuth === false ?
        <Redirect to={constants.ROUTES.LOGIN} />
        : ""
      )
      }
    </>
  );
}

export default PaymentPage;
