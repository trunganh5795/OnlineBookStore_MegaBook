import axiosClient from './axiosClient';

const NOTIFICATION_API_URL = '/notification';

const notifyApi = {
  // api: Lấy danh sách thông báo, theo id người dùng, id gửi kèm theo cookie
  getAllNotify: (page = 1) => {
    const url = NOTIFICATION_API_URL;
    return axiosClient.get(url, { params: { page } });
  },
  // api: marsk đã đọc thông báo
  marskAsRead: (notifyId) => {
    const url = NOTIFICATION_API_URL;

    return axiosClient.post(url, notifyId);
  },
};

export default notifyApi;
