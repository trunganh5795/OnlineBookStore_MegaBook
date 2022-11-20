import { Pagination, Spin } from 'antd';
import productApi from '../../../apis/productApi';
import ResultSearch from '../../../components/ResultSearch';
import helpers from '../../../helpers';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
let isSubscribe = true;
function SearchResult() {
  // get query param
  const search = useLocation().search;
  const query = helpers.queryString(search);
  // const { id } = useSelector((state) => state.user);
  // keyword search
  let keyword = query.find((item) => item.hasOwnProperty('keyword'));
  let keywordValue = '';
  if (keyword !== undefined)
    keywordValue = decodeURI(keyword.keyword.replace(/[+]/gi, ' '));

  // state pagination
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBtnActive, setSortBtnActive] = useState(0);
  const [price, setPrice] = useState({ from: 0, to: 0 });
  const prevQueryValue = useRef();
  const prevPage = useRef();
  // event: sắp xếp danh sách theo các tiêu chí, type = 0 -> break
  const onSort = (type = 0) => {
    
    if (type) {
      if (type === sortBtnActive && type !== 4) {
        getSearchProducts(1, isSubscribe, 0)
        setSortBtnActive(0);
        return;
      } else {
        // loading
        setIsLoading(true);
        setSortBtnActive(type);
        // setPrevSortType(type)
      }
      switch (type) {
        // theo giá giảm dần
        case 1:
          getSearchProducts(1, isSubscribe, 1)
          break;
        // theo giá tăng dần
        case 2:
          getSearchProducts(1, isSubscribe, 2)
          break;
        // Năm xuất bản gần nhất
        case 3:
          getSearchProducts(1, isSubscribe, 3)
          break;
        case 4:
          
          getSearchProducts(1, isSubscribe, 4)
          break;
        default:
          break;
      }
      // delay
      setIsLoading(false);
    }
  };
  // fn: tìm kiếm
  async function getSearchProducts(currentPage, isSubscribe, sortType = 0) {
    try {
      let perPage = 16;
      const result = await productApi.getSearchProducts(
        keywordValue,
        currentPage,
        perPage,
        //16 sản phẩm một trang
        sortType,
        price
      );
      if (result && isSubscribe) {
        setList(result.data.data);
        setIsLoading(false);
        setTotal(result.data.count)
      }
    } catch (error) {
      setList([]);
      setIsLoading(false);
    }
  }

  // event: Lấy dữ liệu tìm kiếm
  useEffect(() => {
    isSubscribe = true;
    setIsLoading(true);
    if (prevQueryValue.current !== search) {
      prevQueryValue.current = search;
      prevPage.current = 1;
      getSearchProducts(1, isSubscribe, sortBtnActive);
      setPage(1)
    } else if (prevPage.current !== page) {
      prevPage.current = page;
      getSearchProducts(page, isSubscribe, sortBtnActive);
    }
    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [search, page]);

  // rendering...
  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      {/* loading */}
      {isLoading ? (
        <Spin
          className="trans-center"
          tip="Đang tải"
          size="large"
        />
      ) : (
        <>
          {/* Kết quả lọc, tìm kiếm */}
          <ResultSearch
            initList={list}
            onSort={onSort}
            sortBtnActive={sortBtnActive}
            setPrice={setPrice}
            price={price}
          />
          {total > 0 && (
            <Pagination
              className="m-tb-16 t-center"
              total={total}
              current={page}
              showSizeChanger={false}
              pageSize={16}
              onChange={(p) => {
                setPage(p)
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SearchResult;
