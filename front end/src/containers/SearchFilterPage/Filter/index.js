import { message, Pagination, Spin} from 'antd';
import productApi from '../../../apis/productApi';
import ResultSearch from '../../../components/ResultSearch';
// import constants from '../../../constants/index';
// import helpers from '../../../helpers';
import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import ProductCarousel from '../ProductCarousel';
import './index.scss';
import { useParams } from 'react-router-dom';

// fn: main
let prevType = '';
let isSubscribe = true;
function FilterResult() {
  const { type } = useParams()
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState({ from: 0, to: 0 });
  const [sortBtnActive, setSortBtnActive] = useState(0);
  const perPage = 16;
  const onSort = (type = 0) => {
    if (type) {
      if (type === sortBtnActive) {
        setSortBtnActive(0);
        getFilterProducts(1, isSubscribe, 0)
        
        return;
      } else {
        // loading
        // setIsLoading(true);
        setSortBtnActive(type);
      }
      switch (type) {
        // theo giá giảm dần
        case 1:
          getFilterProducts(1, isSubscribe, 1);
          
          break;
        // theo giá tăng dần
        case 2:
          getFilterProducts(1, isSubscribe, 2)
          break;
        // Năm xuất bản gần nhất
        case 3:
          getFilterProducts(1, isSubscribe, 3)
          break;
        case 4:
          getFilterProducts(1, isSubscribe, 4)
          break;
        default:
          break;
      }
    }
  };
  // fn: filter function
  async function getFilterProducts(currentPage, isSubscribe, sortType = 0) {
    try {
      // setIsLoading(true);
      const productList = await productApi.getFilterProducts(
        page,
        perPage,
        type,
        sortType,
        price.from,
        price.to
      );
      if (productList && isSubscribe) {
        //isSubscribe dùng để stop render khi component unmounted
        const { count, rows } = productList.data;
        setTotal(count);
        setList(rows);
        setIsLoading(false);
      }
    } catch (error) {
      message.error(error.response?.data)
      setTotal(0);
      setList([]);
    }
  }


  useEffect(() => {
    isSubscribe = true;
    if (prevType !== type) {
      prevType = type;
      if (page !== 1) {
        setPage(1)
      } else {
        getFilterProducts(1, isSubscribe)
      }
    } else {
      getFilterProducts(page, isSubscribe)
    }
    return () => {
      isSubscribe = false;
    };
  }, [page, type]);

  // rendering...
  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      {isLoading ? (
        <Spin
          className="trans-center"
          tip="Đang tải ..."
          size="large"
        />
      ) : (
        <>
          <ResultSearch initList={list} price={price} setPrice={setPrice} sortBtnActive={sortBtnActive} onSort={onSort} isLoading={isLoading} />
          {total > 0 && (
            <Pagination
              className="m-tb-16 t-center"
              total={total}
              current={page}
              showSizeChanger={false}
              pageSize={perPage}
              onChange={(p) => setPage(p)}
            />
          )}
        </>
      )}

      {/* <Link to="/filter/4">Link 4</Link>
      <Link to="/filter/5">Link 5</Link>
      <Link to="/filter/6">Link 6</Link>
      <Link to="/filter/7">Link 7</Link>
      {
      <Button onClick={() => setPage(Math.random())}>Set Page</Button> */}
    </div>
  );
}

export default FilterResult;
