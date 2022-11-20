import axiosClient from './axiosClient';

const ADDRESS_API_ENDPOINT = '/address';

const addressApi = {
  // api: lấy danh sách các tỉnh thành
  getProvince: () => {
    const url = ADDRESS_API_ENDPOINT + '/province';
    return axiosClient.get(url);
  },

  // api: lấy danh sách huyện/quận theo id tỉnh
  getDistrict: (provinceId) => {
    const url = ADDRESS_API_ENDPOINT + '/district';
    return axiosClient.get(url, { params: { id: provinceId } });
  },

  // api: lấy danh sách huyện/quận theo id tỉnh
  getWardStreetList: (districtId) => {
    const url = ADDRESS_API_ENDPOINT + '/ward';
    return axiosClient.get(url, {
      params: { district: districtId },
    });
  },

  // api: Lấy danh sách địa chỉ nhận hàng, flag = 1 lấy địa chỉ thô chưa convert sang string
  getDeliveryAddressList: () => {
    const url = ADDRESS_API_ENDPOINT + '/delivery';
    return axiosClient.get(url);
  },

  // api: Thêm địa chỉ nhận hàng
  postAddDeliveryAddress: (userId, newAddress) => {
    const url = ADDRESS_API_ENDPOINT + '/delivery';
    return axiosClient.post(url, { userId, newAddress });
  },

  // api: Xoá 1 địa chỉ giao nhận
  delDeliveryAddress: (addressId) => {
    const url = ADDRESS_API_ENDPOINT + '/delivery';
    return axiosClient.delete(url, { params: { addressId } });
  },

  // api: sửa mặc định địa chỉ giao
  putSetDefaultDeliveryAddress: (addressId) => {
    const url = ADDRESS_API_ENDPOINT + '/delivery';
    // 
    return axiosClient.put(url, { addressId });
  },
  getShippingCost: (numOfProduct, provinceId) => {
    const url = ADDRESS_API_ENDPOINT + '/shippingcost';
    return axiosClient.get(url, { params: { numOfProduct, provinceId } });
  }
};

export default addressApi;
