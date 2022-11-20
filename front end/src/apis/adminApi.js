import axiosClient from './axiosClient';
import axios from 'axios';
import helpers from '../helpers';
const ADMIN_API_ENDPOINT = '/admin';

const adminApi = {
  // fn: thêm sản phẩm
  postAddProduct: (product) => {
    const url = ADMIN_API_ENDPOINT + '/products/add';
    return axiosClient.post(url, product);
  },
  // fn: lấy danh sách sản phẩm theo loại và trang
  getProductListByType: (type = 0, page = 1, perPage = 1) => {
    const url = ADMIN_API_ENDPOINT + '/products';
    return axiosClient.get(url, {
      params: { type, page, perPage },
    });
  },
  // fn: Xoá 1 sản phẩm (admin page)
  removeProduct: (id) => {
    const url = ADMIN_API_ENDPOINT + '/products/remove';
    return axiosClient.delete(url, { params: { id } });
  },
  // fn: Cập nhật 1 sản phẩm
  updateProduct: (product) => {
    const url = ADMIN_API_ENDPOINT + '/products/update';
    return axiosClient.put(url, product);
  },
  //
  searchByName: (value, page, perPage, option, filterOps) => { //ElasticSearch
    const url = ADMIN_API_ENDPOINT + '/product-search-by-name';
    return axiosClient.get(url, { params: { value, page, perPage, option, filterField: filterOps[0].field, filterValue: filterOps[0].value, sorterField: filterOps[1].field, sorterValue: filterOps[1].value } });
  },
  // fn: đăng nhập với quyền admin
  postLogin: (account) => {
    const url = ADMIN_API_ENDPOINT + '/login';
    return axiosClient.post(url, account);
  },

  // fn: lấy danh sách admin user
  getUserAdminList: () => {
    const url = ADMIN_API_ENDPOINT + '/users';
    return axiosClient.get(url);
  },

  // fn: lấy danh sách khách hàng
  getCustomerList: (page = 1) => {
    const url = ADMIN_API_ENDPOINT + '/customer';
    return axiosClient.get(url, { params: page });
  },
  getCustomerListBy: (page = 1, option, value, filterStatus, filterRole) => {

    const url = ADMIN_API_ENDPOINT + '/customer/by';
    return axiosClient.get(url, { params: { page, option, value, filterStatus, filterRole } });
  },
  // fn: xoá 1 khách hàng
  delCustomer: (userId) => {
    const url = ADMIN_API_ENDPOINT + '/customer/del';
    return axiosClient.delete(url, { params: { userId } });
  },
  releaseCustomer: (userId) => {
    const url = ADMIN_API_ENDPOINT + '/customer/release';
    return axiosClient.put(url, {userId});
  },
  // fn: Lấy danh sách đơn hàng
  getOrderList: (page, perPage, filterStatusValue, filterPaymentValue, sorterField, sorterValue) => {
    const url = ADMIN_API_ENDPOINT + '/order';
    return axiosClient.get(url, { params: { page, perPage, filterStatusValue, filterPaymentValue, sorterField, sorterValue } });
  },
  // Tìm đơn hàng theo tên, mã đơn hàng, All
  getOrderListBy: (value = '', option, page, perPage, filterStatusValue, filterPaymentValue, sorterField, sorterValue) => {
    const url = ADMIN_API_ENDPOINT + '/order/by';
    return axiosClient.get(url, { params: { value, option, page, perPage, filterStatusValue, filterPaymentValue, sorterField, sorterValue } });
  },
  // fn: cập nhật trạng thái đơn hàng
  postUpdateOrderStatus: (id, orderStatus) => {
    const url = ADMIN_API_ENDPOINT + '/order';
    return axiosClient.post(url, { id, orderStatus });
  },

  addNewVoucher: (data) => {

    const url = ADMIN_API_ENDPOINT + '/voucher';
    return axiosClient.post(url, { data });
  },
  getAllVoucher: (page, perPage, stateFilterValue) => {
    const url = ADMIN_API_ENDPOINT + '/voucher';
    return axiosClient.get(url, { params: { page, perPage, stateFilterValue } });
  },
  getVoucherListBy: (value, option, page, perPage, stateFilterValue) => {
    const url = ADMIN_API_ENDPOINT + '/voucher/by';
    return axiosClient.get(url, { params: { value, option, page, perPage, stateFilterValue } });
  },
  updateVoucher: (data) => {
    const url = ADMIN_API_ENDPOINT + '/voucher';
    return axiosClient.put(url, { data });
  },
  deleteVoucher: (code) => {
    const url = ADMIN_API_ENDPOINT + '/voucher';
    return axiosClient.delete(url, { params: { code } });
  },
  updateNumOfContact: (orderId) => {
    const url = ADMIN_API_ENDPOINT + '/update-num-contact';
    return axiosClient.put(url, { orderId });
  },
  getRecombeeToken: () => {
    const url = ADMIN_API_ENDPOINT + '/recombeetoken';
    return axiosClient.get(url);
  },
  getViewByTimeRecombee: (token, since, until, frequency) => {
    return axios({
      method: 'POST',
      url: 'https://gui-api.recombee.net/graphql',
      data: helpers.graphqlQuery(since, until, frequency),
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': '*/*',
      }
    })

  }
};

export default adminApi;
