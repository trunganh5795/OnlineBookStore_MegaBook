import axiosClient from './axiosClient';
import cartActions from '../reducers/carts';
import productApi from './productApi';
import recombee from 'recombee-js-api-client';
const ORDER_API_ENDPOINT = '/orders';

const orderApi = {
  // api: lấy danh sách đơn hàng
  getOrderList: (userId) => {
    const url = ORDER_API_ENDPOINT + '/list';
    return axiosClient.get(url, { params: { userId } });
  },

  // api: lấy chi tiết đơn hàng
  getOrderDetails: (orderId) => {
    const url = ORDER_API_ENDPOINT;
    return axiosClient.get(url, { params: { orderId } });
  },
  getOrderProgress: (orderId) => {
    const url = ORDER_API_ENDPOINT + '/progress';
    return axiosClient.get(url, { params: { orderId } });
  },
  // api: tạo đơn hàng
  postCreateOrder: (data) => {
    const url = ORDER_API_ENDPOINT;
    return axiosClient.post(url, data);
  },

  addtoCart: (product, message, userId) => {
    if (userId) {
      productApi.client.send(
        new recombee.AddCartAddition(userId, product.bookId, {
          cascadeCreate: false,
          recommId: product.rcm
            ? product.rcm === 'undefined'
              ? null
              : product.rcm
            : null,
        }),
      );
    }
    return (dispatch) => {
      dispatch(cartActions.addToCart(product));
      message.success('Đã thêm vào giỏ');
    };
  },

  customerCancelOrder: (orderId) => {
    const url = ORDER_API_ENDPOINT + '/cancel';
    return axiosClient.put(url, { orderId });
  },
};

export default orderApi;
