import axiosClient from './axiosClient';

const STATISTIC_URL_ENDPOINT = '/statistic';

const statisticApi = {
  // api: thống kê đơn hàng tỉnh nào nhiều nhất
  countRate: (start_time, end_time) => {
    const url = STATISTIC_URL_ENDPOINT + '/countrate';
    return axiosClient.get(url, { params: { start_time, end_time } });
  },
  countOrderTotal: (start_date, end_date) => {
    //Product_Id dùng để tìm theo 1 id cụ thể or nếu null tìm tất cả
    const url = STATISTIC_URL_ENDPOINT + '/countorder';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getHistogramData: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/histogram';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getLatestOrder: (page, perPage) => {
    const url = STATISTIC_URL_ENDPOINT + '/latestorder';
    return axiosClient.get(url, { params: { page, perPage } });
  },
  getTop5Sell: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/top5sell';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getTop5Revenue: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/top5total';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getTop5RevenueLocation: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/top5locationtotal';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getTop5SellLocation: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/top5location';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getTop5SellCategory: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/top5sellByCategory';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  getTotalbyid: (start_date, end_date, productId) => {
    const url = STATISTIC_URL_ENDPOINT + '/totalbyid';
    return axiosClient.get(url, {
      params: { start_date, end_date, productId },
    });
  },
  classifyOrder: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/classifyorder';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
  numOfNewUser: (start_date, end_date) => {
    const url = STATISTIC_URL_ENDPOINT + '/numofnewuser';
    return axiosClient.get(url, { params: { start_date, end_date } });
  },
};

export default statisticApi;
