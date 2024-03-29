import { Avatar, Button, Card, List } from 'antd';
import constants from '../../../constants/index';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const { Meta } = Card;

function totalPrice(list) {
  return list.reduce((total, item) => {
    total += item.price * item.amount;
    return total;
  }, 0);
}

function CartView(props) {
  const { list } = props;
  const length = list.length;
  return (
    <div
      className="cart-view p-8"
      style={{ backgroundColor: '#fff', height: '500', width: '180' }}>
      <div className="cart-items p-8">
        <List
          itemLayout="vertical"
          size="large"
          dataSource={list}
          renderItem={(item) => (
            <Card style={{ width: 300 }}>
              <Meta
                avatar={
                  <Avatar
                    shape="square"
                    style={{ width: 60, height: 80 }}
                    src={item.img}
                  />
                }
                title={item.title}
                description={`Số lượng: ${item.amount}`}
              />
              {/* <p className="product-price">
                {helpers.formatProductPrice(item.price)}
              </p> */}
            </Card>
          )}
        />
      </div>
      <div className="cart-additional p-8">
        <h3>Tổng: {helpers.formatProductPrice(totalPrice(list))}</h3>
        <Link to={length > 0 ? constants.ROUTES.CART : '/'}>
          {length > 0 ? (
            <Button
              className="m-tb-8 d-block m-lr-auto w-100"
              type="primary"
              size="large">
              Thanh toán
            </Button>
          ) : (
            ''
          )}
        </Link>
      </div>
    </div>
  );
}

CartView.propTypes = {
  list: PropTypes.array,
};

export default CartView;
