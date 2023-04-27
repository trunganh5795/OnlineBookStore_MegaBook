import axiosClient from './axiosClient';

const STAFF_API_ENDPOINT = '/staff';

const staffApis = {
  // api: lấy danh sách đơn hàng
  countOrderByStatus: (start_date, end_date) => {
    const url = STAFF_API_ENDPOINT + '/countoderbystatus';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getOrderByStatus: (
    start_date,
    end_date,
    paymentType = null,
    status,
    page,
    perPage = 10,
    filters = null,
    search = '',
    option = 999,
  ) => {
    const url = STAFF_API_ENDPOINT + '/getorderbystatus';
    return axiosClient.get(url, {
      params: {
        start_date,
        end_date,
        paymentType,
        status,
        page,
        perPage,
        filters,
        search,
        option,
      },
    });
  },
  confirmOrderBulk: (ids) => {
    const url = STAFF_API_ENDPOINT + '/confimorderbulk';
    return axiosClient.put(url, { ids });
  },
};

export default staffApis;
