import axiosClient from './axiosClient';
const PRODUCT_API_URL = '/tracking';
////
const trackingApi = {
    sendViewToElastic: async (rcmId, index, type, bookid) => {
        
        const url = PRODUCT_API_URL + '/view';
        return axiosClient.post(url, { rcmId, index, type, bookid })
    },
    sendAddToCartToElastic: async (rcmId, index, type, bookid) => {
        const url = PRODUCT_API_URL + '/addtocart';
        return axiosClient.post(url, { rcmId, index, type, bookid })
    },
}
export default trackingApi;