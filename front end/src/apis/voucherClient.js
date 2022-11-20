import axiosClient from './axiosClient';
const VOUCHER_API_ENDPOINT = '/voucher';

const voucherApi = {
  // Lấy danh sách voucher phù hợp với đơn hàng
  getVoucher: async (cart) => {
    let categories = [null]; // null tương ứng với voucher áp dụng cho tất cả loại sách
    cart.forEach(item => {
      //kiểm tra xem trong giỏ hàng có những loại sách nào
      let bookCategory = categories.find(category => category === item.category);
      if (!bookCategory) {
        categories.push(item.category)
      }
    });
    const url = 'admin/voucher/type'
    return axiosClient.get(
      url,
      { params: { categories } }
    )
  }
};

export default voucherApi;
