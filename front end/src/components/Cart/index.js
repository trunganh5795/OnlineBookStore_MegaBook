import { HomeOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './index.scss';
import CartOverview from './Overview';
import CartPayment from './Payment';

function Cart() {
  const carts = useSelector((state) => state.carts);

  // rendering ...
  return (
    <div
      className="Cart-Detail-View container m-t-20"
      style={{ minHeight: '80vh' }}>
      <Row gutter={[16, 16]}>
        {/* gutter={[16,16]} => grid spacing horizontal and vertical */}
        {/* Hiển thị đường dẫn trang */}
        <Col span={24} className="d-flex page-position">
          <Link to="/">
            <HomeOutlined className="p-12 icon-home font-size-16px bg-white" />
          </Link>
          <span className="r-arrow p-lr-8 font-weight-500">{`>`}</span>
          <span className="cart-name p-8 font-weight-500 bg-white">
            Giỏ hàng
          </span>
        </Col>

        {carts.length > 0 ? (
          <>
            {/* Chi tiết giỏ hàng */}
            <Col span={24} md={16}>
              <CartOverview carts={carts} />
            </Col>
            {/* Thanh toán */}
            <Col span={24} md={8}>
              <CartPayment carts={carts} />
            </Col>
          </>
        ) : (
          <Col span={24} className="t-center" style={{ minHeight: '90vh' }}>
            <h2 className="m-tb-16" style={{ color: '#888' }}>
              Không có sản phẩm trong giỏ
            </h2>
            <Link to="/">
              <Button type="primary" size="large">
                Mua sắm ngay
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default Cart;
