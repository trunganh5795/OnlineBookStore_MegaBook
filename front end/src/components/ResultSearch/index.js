import { Button, Col, InputNumber, Row, Spin } from 'antd';
import productNotFoundUrl from '../../assets/imgs/no-products-found.png';
import ProductView from '../../components/ProductView';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import './index.scss';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import constants from '../../constants';

// Import Swiper styles
const windowWidth = window.innerWidth;
const sortButtons = [
  { key: 1, title: 'Giá: Cao - Thấp' },
  { key: 2, title: 'Giá: Thấp - Cao' },
  { key: 3, title: 'Mới nhất' },
];
function ResultSearch(props) {
  const { initList, onSort, sortBtnActive, setPrice, price, isLoading } = props;
  // const [isLoading, setIsLoading] = useState(false);

  // fn: Hiển thị sản phẩm
  const showProducts = (list) => {
    list = list ? list : [];
    return list.map((product, index) => {
      const {
        img,
        title,
        price,
        discount,
        instock,
        bookid,
        bookId,
        enable_discount,
        stars,
        total_rate,
      } = product;
      return (
        <Col key={index} span={12} md={8} sm={12} lg={8} xl={6}>
          <Link to={`/product/${bookid ? bookid : bookId}`}>
            <ProductView
              name={title}
              price={price}
              stock={instock}
              avtUrl={img}
              discount={discount}
              height={
                windowWidth <= 768 ? (windowWidth <= 390 ? 260 : 380) : 400
              }
              enable_discount={enable_discount}
              stars={stars}
              total_rate={total_rate}
              heightImg={250}
            />
          </Link>
        </Col>
      );
    });
  };

  // rendering ...
  return (
    <>
      <Row className="Result-Search bor-rad-8 box-sha-home bg-white m-tb-32">
        {/* header sort, search button */}
        <Col
          span={24}
          className="sort-wrapper p-10"
          style={{ overFlow: 'scroll' }}>
          <h3 className="m-r-8 font-weight-700 p-b-10">Danh mục sản phẩm</h3>
          <Swiper
            spaceBetween={10}
            // slidesPerView={1}
            // modules={[Navigation, Scrollbar, A11y]}
            // onSlideChange={() =>
            // onSwiper={(swiper) =>
            // pagination={{ clickable: true }}
            breakpoints={{
              0: {
                // width: 0,
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              992: {
                //>= 992px
                // width: 768,
                slidesPerView: 5,
              },
              1200: {
                // >=1200px
                // width: 1200,
                slidesPerView: 7,
              },
            }}>
            {constants.CATEGORIES_IMAGE.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="t-center category_img">
                  <Link to={item.to}>
                    <img src={item.url} alt="" width={100} height={160} />
                    <p className="font-size-16px p-t-5">{item.title}</p>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
        <Col span={24} className="sort-wrapper p-lr-16">
          <div className="sort p-tb-10 d-flex align-i-center">
            <h3 className="m-r-8 font-weight-700">Bộ Lọc</h3>
            {sortButtons.map((item) => (
              <Button
                className={`${
                  item.key === sortBtnActive ? 'sort-btn-active' : ''
                } m-4 bor-rad-4`}
                key={item.key}
                size="large"
                onClick={() => onSort(item.key)}>
                {item.title}
              </Button>
            ))}
            {/* search range price */}
            <div className="m-l-8">
              <InputNumber
                className="bor-rad-4"
                size="large"
                min={0}
                max={1000000000}
                style={{ width: 140 }}
                placeholder="giá thấp nhất"
                step={10000}
                onChange={(value) => {
                  setPrice((prev) => ({ ...prev, from: value }));
                }}
              />
              {` - `}
              <InputNumber
                className="bor-rad-4"
                size="large"
                min={price.from}
                max={1000000000}
                style={{ width: 140 }}
                placeholder="giá cao nhất"
                step={10000}
                onChange={(value) =>
                  setPrice((prev) => ({ ...prev, to: value }))
                }
              />

              {price.to > 0 && (
                <Button
                  type="primary"
                  size="large"
                  className="m-l-8 price-search-btn bor-rad-4"
                  onClick={() => onSort(4)}>
                  {/* key 4 là sort theo khoảng giá */}
                  Lọc
                </Button>
              )}
            </div>
          </div>
        </Col>

        {/* render list */}
        <Col span={24} className="Result-Search-list p-16">
          {!initList || initList.length === 0 ? (
            <div className="trans-center d-flex flex-direction-column pos-relative">
              <img
                className="not-found-product m-0-auto"
                src={productNotFoundUrl}
                alt="product-not-found"
              />
              <span className="font-size-16px m-t-8 t-center">
                Không tìm thấy sản phẩm phù hợp
              </span>
            </div>
          ) : isLoading ? (
            <Spin className="trans-center" tip="Đang tải ..." size="large" />
          ) : (
            <Row gutter={[16, 16]}>{showProducts(initList)}</Row>
          )}
        </Col>
      </Row>
      {/* pagination */}
    </>
  );
}

ResultSearch.defaultProps = {
  initList: [],
};

ResultSearch.propTypes = {
  initList: PropTypes.array,
};

export default ResultSearch;
