import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import ProductView from '../../../components/ProductView';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import GlobalLoading from '../../Loading/Global';

// rendering ...
function RelatedProductList(props) {
  const { list, title, span, isAuth, recommId, suggestionType } = props;

  const perPage = useRef(1);
  const [page, setPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMdDevice, setIsMdDevice] = useState(false);
  // event: resize window
  useEffect(() => {
    const w = window.innerWidth;
    if (w <= 768) setIsMdDevice(true);
    else setIsMdDevice(false);

    function handleResize() {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w <= 768) setIsMdDevice(true);
      else setIsMdDevice(false);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // fn: phân trang
  const paginate = (list) => {
    const windowSize = helpers.convertWidthScreen(windowWidth);
    if (span.hasOwnProperty(windowSize))
      perPage.current = 24 / span[windowSize];
    else {
      const spanValues = Object.values(span);
      let min = Math.min(...spanValues);
      perPage.current = 24 / min;
    }
    list.forEach((item, index) => (item.index = index));
    return list.slice(perPage.current * (page - 1), perPage.current * page);
  };

  // fn: Hiển thị danh sách sản phẩm
  const showProductList = (list) => {
    const listSliced = paginate(list);

    return listSliced.map((product, index) => {
      const { title, img, price, discount, instock } = product.values;
      return (
        <Col key={index} {...span}>
          <Link
            to={`/product/${product.id}?rcm=${recommId}&index=${product.index}&type=${suggestionType}`}
            className="item">
            <ProductView
              className={isMdDevice ? 'm-auto' : ''}
              name={title}
              avtUrl={img}
              discount={discount}
              stock={instock}
              price={price}
              height={
                windowWidth <= 768 ? (windowWidth <= 390 ? 260 : 380) : 400
              }
              // heightImg={210}
            />
          </Link>
        </Col>
      );
    });
  };

  return (
    <Row
      className="Related-Products bg-white p-16"
      // gutter={[16, 8]}
      style={{ borderRadius: 8 }}>
      {title !== '' && (
        <Col span={24} className="p-8">
          <h2 className="font-weight-700 category">{title}</h2>
          <div className="underline-title"></div>
        </Col>
      )}
      <Col span={24}>
        <Row gutter={[16, 16]} className="m-t-16">
          {isAuth == null ? <GlobalLoading /> : showProductList(list, span)}
        </Row>
      </Col>

      {/* Mũi tên chuyển trang */}
      <LeftCircleOutlined
        className={`arrow arrow-left ${page <= 1 ? 'disabled' : ''}`}
        onClick={() => setPage(page - 1)}
      />

      <RightCircleOutlined
        className={`arrow arrow-right ${
          page >= Math.ceil(list.length / perPage.current) ? 'disabled' : ''
        }`}
        onClick={() => setPage(page + 1)}
      />
    </Row>
  );
}

RelatedProductList.defaultProps = {
  list: [],
  title: '',
  span: { span: 12, xs: 12, sm: 12, md: 8, lg: 8, xl: 6, xxl: 6 },
};

RelatedProductList.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
  span: PropTypes.object,
};

export default RelatedProductList;
