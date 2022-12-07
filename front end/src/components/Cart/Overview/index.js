import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import CartItem from './CartItem';
import './index.scss';
import cartReducer from '../../../reducers/carts';
import { Button, Popconfirm } from 'antd';

function CartOverview(props) {
  const { carts } = props;
  const dispatch = useDispatch();

  // event: xoá 1 sản phẩm trong cart
  const onDelCartItem = (key) => {
    dispatch(cartReducer.delCartItem(key));
  };

  // event: cập nhật số lượng sản phẩm trong cart
  const onUpdateNumOfProd = (indexInCart, value) => {
    dispatch(cartReducer.updateCartItem(indexInCart, value));
  };

  const onDelAllCarts = () => {
    dispatch(cartReducer.resetCart());
  };

  // rendering...
  return (
    <>
      {carts.map((item, index) => (
        <div key={index}>
          <CartItem
            indexInCart={index}
            {...item}
            onDelCartItem={onDelCartItem}
            onUpdateNumOfProd={onUpdateNumOfProd}
          />
        </div>
      ))}
      <div className="bg-white p-12 m-b-12 p-t-0 t-right">
        <Popconfirm
          title="Bạn muốn xóa tất cả ?"
          placement="left"
          okButtonProps={{ type: 'danger' }}
          onConfirm={onDelAllCarts}
          okText="Đồng ý"
          cancelText="Hủy">
          <Button type="primary" danger size="large">
            Xóa tất cả
          </Button>
        </Popconfirm>
      </div>
    </>
  );
}

CartOverview.defaultProps = {
  carts: [],
};

CartOverview.propTypes = {
  carts: PropTypes.array,
};

export default CartOverview;
