import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, Col, InputNumber, Row, Tooltip } from 'antd';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function CartItem(props) {
  const {
    bookId,
    title,
    author,
    img,
    instock,
    discount,
    price,
    amount,
    // index,
    indexInCart,
    onDelCartItem,
    onUpdateNumOfProd,
  } = props;
  return (
    <Row className="bg-white p-12" gutter={[0, 8]}>
      {/* sản phẩm */}
      <Col span={24} sm={24} md={16} lg={16} className="d-flex">
        <Avatar src={img} alt="Photo" shape="square" size={64} />
        <div className="d-flex flex-direction-column p-10 ">
          <Link to={`/product/${bookId}`} className="font-size-16px">
            <Tooltip title={title}>
              {/*will show on mouse hover */}
              {helpers.reduceProductName(title, 40)}
            </Tooltip>
          </Link>
          <span style={{ color: '#aaa' }}>
            Tác giả: {helpers.reduceProductName(author, 20)}
          </span>
        </div>
      </Col>
      {/* số lượng */}
      <Col className="d-flex align-i-center" lg={4} md={4}>
        <div>
          <InputNumber
            height={20}
            min={1}
            max={instock}
            value={amount}
            onChange={(value) => onUpdateNumOfProd(indexInCart, value)}
            size="large"
            style={{ borderColor: '#3555C5' }}
          />
        </div>
        {/* delete icon */}
        <DeleteOutlined
          className="m-l-10 icon-del-item"
          onClick={() => onDelCartItem(bookId)}
        />
      </Col>
      {/* Giá */}
      <Col
        className="d-flex flex-direction-column align-i-end justify-content-center"
        lg={4}
        md={21}>
        <b className="font-size-18px" style={{ color: '#3555C5' }}>
          {helpers.formatProductPrice(
            price - (price * discount ? discount : 0) / 100
          )}
        </b>
        {discount ? (
          <span style={{ textDecoration: 'line-through', color: '#aaa' }}>
            {helpers.formatProductPrice(price)}
          </span>
        ) : (
          ''
        )}
      </Col>
    </Row>
  );
}

CartItem.defaultProps = {
  bookId: '',
  image: '',
  code: '',
  discount: 0,
  title: '',
  price: 0,
  instock: 0,
  amount: 1,
};

CartItem.propTypes = {
  onDelCartItem: PropTypes.func,
  onUpdateNumOfProd: PropTypes.func,
  index: PropTypes.any,
  bookId: PropTypes.any,
  image: PropTypes.string,
  code: PropTypes.string,
  discount: PropTypes.number,
  amount: PropTypes.number,
  title: PropTypes.string,
  price: PropTypes.number,
  instock: PropTypes.number,
};

export default CartItem;
