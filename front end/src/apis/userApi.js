import constants from '../constants/index';
import axiosClient from './axiosClient';

const USER_API_URL = '/user';

const userApi = {
  //get admin user
  getUser: () => {
    const url = USER_API_URL;
    // nếu môi trường product thì lấy access_token trong store
    if (process.env.NODE_ENV === 'production') {
      return axiosClient.get(url, {
        params: {
          token: localStorage.getItem(constants.ACCESS_TOKEN_KEY),
        },
      });
    } else {
      //access_token được gửi kèm theo cookies, còn refresh_token thì lưu ở local
      return axiosClient.get(url);
    }
  },
  putUpdateUser: (userId = '', value = {}) => {
    const url = USER_API_URL + '/update';
    return axiosClient.put(url, { userId, value });
  },
};

export default userApi;
