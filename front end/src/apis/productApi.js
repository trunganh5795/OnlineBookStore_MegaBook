import axiosClient from './axiosClient';
//////////Đang test check lại ###
import recombee from 'recombee-js-api-client';
import constants from '../constants';
let client = new recombee.ApiClient(
  'bookstore-dev',
  process.env.REACT_APP_RECOMBEE_PUBLIC_KEY,
  { region: 'ap-se' },
);
/////////////////////
const PRODUCT_API_URL = '/products';

const productApi = {
  // api: Lấy 1 sản phẩm
  getProduct: (id) => {
    const url = PRODUCT_API_URL;
    return axiosClient.get(url, { params: { id } });
  },
  // api: Lấy số lượng sản phẩm đã bán
  getNumOfSell: (id) => {
    const url = PRODUCT_API_URL + '/getsellbyid';
    return axiosClient.get(url, { params: { id } });
  },
  // api: Lấy danh sách sp, type = -1 : all, trừ sản phẩm có id
  getProductList: (type = -1, brand = '', limit = 1, id) => {
    const url = PRODUCT_API_URL + '/list/related';
    return axiosClient.get(url, { params: { type, brand, limit, id } });
  },

  // api: Lấy danh sách sản phẩm và phân trang
  getAllProducts: (page = 1, perPage = 8, filterOps) => {
    const url = PRODUCT_API_URL + '/all';
    return axiosClient.get(url, {
      params: {
        page,
        perPage,
        filterField: filterOps[0].field,
        filterValue: filterOps[0].value,
        sorterField: filterOps[1].field,
        sorterValue: filterOps[1].value,
      },
    });
  },
  getBestBook: () => {
    const url = PRODUCT_API_URL + '/bestbook';
    return axiosClient.get(url);
  },
  // api: tìm kiếm sản phẩm
  getSearchProducts: (
    value = '',
    page = 1,
    perPage = 8,
    sortType = 0,
    price,
  ) => {
    const url = PRODUCT_API_URL + '/search';
    return axiosClient.get(url, {
      params: {
        value,
        page,
        perPage,
        sortType,
        price_from: price.from,
        price_to: price.to,
      },
    });
  },

  // api: lọc sản phẩm
  getFilterProducts: (
    page = 1,
    perPage = 8,
    category,
    sortType,
    price_from = 0,
    price_to = 0,
  ) => {
    const url = PRODUCT_API_URL + '/filter';

    return axiosClient.get(url, {
      params: { category, page, perPage, sortType, price_from, price_to },
    });
  },

  //Recombee
  getTrendingProduct: async (userId, numerOfproduct = 10) => {
    try {
      if (!userId) userId = localStorage.getItem('tkre_id');
      return client.send(
        new recombee.RecommendItemsToUser(userId, numerOfproduct, {
          scenario: 'Items-to-User',
          returnProperties: true,
          includedProperties: [
            'title',
            'img',
            'short_description',
            'author',
            'price',
            'discount',
            'instock',
            'author',
          ],
          filter:
            "'title' != null AND 'status' == \"active\" AND 'instock' > 0 ",
        }),
      );
    } catch (error) {}
  },
  getSimilarProducts: async (itemId, userId) => {
    try {
      if (!userId) userId = localStorage.getItem('tkre_id');
      return client.send(
        new recombee.RecommendItemsToItem(itemId, userId, 8, {
          scenario: 'items-to-item',
          returnProperties: true,
          includedProperties: [
            'title',
            'img',
            'price',
            'discount',
            'instock',
            'bookId',
          ],
          filter:
            "'title' != null AND 'status' == \"active\" AND 'instock' > 0 ",
        }),
      );
    } catch (error) {}
  },
  getHomepageProduct: async (userId) => {
    try {
      //
      if (!userId) userId = localStorage.getItem('tkre_id');
      return client.send(
        new recombee.RecommendItemsToUser(userId, 10, {
          scenario: 'homepage',
          returnProperties: true,
          includedProperties: ['title', 'img', 'price', 'discount', 'instock'],
          filter:
            "'title' != null AND 'status' == \"active\" AND 'instock' > 0 ",
        }),
      );
    } catch (error) {}
  },
  getAlsoBuy: async (
    itemId,
    userId,
    itemCount = constants.MAX_RELATED_PRODUCTS,
  ) => {
    try {
      if (!userId) userId = localStorage.getItem('tkre_id');
      return client.send(
        new recombee.RecommendItemsToItem(itemId, userId, itemCount, {
          //itemId, targetUserId, count,
          scenario: 'also-buy',
          returnProperties: true,
          includedProperties: ['title', 'img', 'price', 'discount', 'instock'],
          filter:
            "'title' != null AND 'status' == \"active\" AND 'instock' > 0 ",
        }),
      );
    } catch (error) {}
  },
  searchProduct: async () => {},
  sendProductView: async (itemId, userId) => {
    //mặc định để test thôi
    try {
      if (!userId) userId = localStorage.getItem('tkre_id');
      return client.send(
        new recombee.AddDetailView(userId, itemId, {
          cascadeCreate: true,
        }),
      );
    } catch (error) {}
  },
  sendProductPurchase: async (itemId, userId, recomId) => {
    //mặc định để test thôi
    try {
      // console.log(recomId);
      if (!userId) userId = localStorage.getItem('tkre_id');
      return client.send(
        new recombee.AddCartAddition(userId, itemId, {
          cascadeCreate: false,
          recommId: recomId,
        }),
      );
    } catch (error) {
      // console.log(error)
    }
  },
  searchItem: async (userId, query, count) => {
    if (!userId) userId = localStorage.getItem('tkre_id');
    return client.send(
      new recombee.SearchItems(userId, query, count, {
        // optional parameters:
        scenario: 'search',
      }),
    );
  },
  ////
  getTopSell: () => {
    const url = PRODUCT_API_URL + '/topsell';
    return axiosClient.get(url);
  },
  client,
};

export default productApi;
