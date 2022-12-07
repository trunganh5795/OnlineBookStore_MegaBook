import { Col, Empty, Pagination, Row, Spin } from 'antd';
import productApi from '../../../apis/productApi';
import ProductView from '../../../components/ProductView';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
const windowWidth = window.innerWidth;
function AllProduct({ title, category }) {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    async function getAllProducts() {
      try {
        const response = await productApi.getFilterProducts(page, 8, category);
        if (response && isSubscribe) {
          const { rows, count } = response.data;
          setList(rows);
          setTotal(count);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
    getAllProducts();

    return () => (isSubscribe = false);
  }, [page, category]);

  // fn: Hiển thị sản phẩm
  const showProducts = (list) => {
    return list && (list.length === 0 ? <Empty className='ant-col-24' /> :
      (
        list.map((product, index) => {
          const { img, title, price, discount, instock, bookid, enable_discount, start_time, end_time,total_rate , stars } = product;
          return (
            <Col key={index} span={12} md={8} sm={12} lg={8} xl={6}>
              {/* span = 24 độ rộng mặc định nếu ko macth mấy cái kia */}
              <Link to={`/product/${bookid}`}>
                <ProductView
                  className="m-auto"
                  name={title}
                  price={price}
                  stock={instock}
                  avtUrl={img}
                  discount={discount}
                  enable_discount={enable_discount}
                  start_time={start_time}
                  end_time ={end_time }
                  total_rate={total_rate}
                  stars={stars}
                  height={windowWidth <= 768 ? (windowWidth <= 390 ? 260 : 380) : 400}
                  heightImg={250}
                //height of iamge
                />
              </Link>
            </Col>
          );
        })
      )
    );

  };

  return (
    <Row className="p-16" style={{ minHeight: 400 }} gutter={[16, 16]}>
      <Col span={24}>
        <h2 className="font-weight-700 category">{title}</h2>
        <div className="underline-title"></div>
      </Col>
      {isLoading ? (
        <Spin
          className="trans-center"
          tip="Loading ..."
          size="large"
        />
      ) : (
        <>
          {showProducts(list)}
          {list.length === 0 ? "" : (
            <Col span={24}>
              <Pagination
                className="t-center"
                current={page}
                pageSize={8}
                total={total}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
                showLessItems
              />
            </Col>
          )}

        </>
      )}
    </Row>
  );
}

export default AllProduct;
