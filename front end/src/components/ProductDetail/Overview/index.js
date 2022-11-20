import { Button, Col, Image, InputNumber, message, Rate, Row } from 'antd';
import ImgLoadFailed from '../../../assets/imgs/loading-img-failed.png';
import constants from '../../../constants/index';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';
import orderApi from '../../../apis/orderApi';
import trackingApi from '../../../apis/tracking.api';
import { useMemo } from 'react';
import { useEffect } from 'react';
import productApi from '../../../apis/productApi';

// Hàm đếm số sản phẩm đó trong giỏ hàng
function countItemInCart(productCode, carts) {
  let count = 0;
  if (carts) {
    carts.forEach((item) => {
      if (item.code === productCode) count += item.amount;
    });
  }
  return count;
}

function ProductOverview(props) {
  const { products } = props;
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search])
  const {
    bookId,
    img,
    title,
    code,
    price,
    total_rate,
    discount,
    author,
    publisher,
    publicOfYear,
    instock,
    stars
  } = products;
  const user = useSelector((state) => state.user);
  const { category } = products;
  const [numOfSell, setNumOfSell] = useState()
  const [numOfProduct, setNumberOfProduct] = useState(1);
  const carts = useSelector((state) => state.carts);
  const currentStock = instock - countItemInCart(code, carts);

  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribe = true;
    const getNumOfSell = async (id) => {
      let data = await productApi.getNumOfSell(id)
      if(isSubscribe) setNumOfSell(data.data.value)
    }
    getNumOfSell(bookId)
    return () => {
      isSubscribe = false;
    }
  }, [])


  // rendering ...
  return (
    <Row className="Product-Overview bg-white p-16">
      {/* Hình ảnh và thông số cơ bản sản phẩm */}
      <Col span={24} md={8}>
        <div
          className="d-flex align-i-center justify-content-center ">
          <Image
            style={{ maxHeight: '100%' }}
            fallback={ImgLoadFailed}
            src={img}
          />
        </div>
      </Col>
      {/* Tên và thông tin cơ bản */}
      <Col span={24} md={16} className="p-l-16">
        {/* Tên sp */}
        <h2 className="title">
          {/* {helpers.reduceProductName(title, 140)} */}
          {title}
        </h2>
        <h3>Tác giả: {author}</h3>
        <h3>NXB: {publisher}</h3>
        <h3>Năm xuất bản: {publicOfYear ? publicOfYear : "Đang cập nhật"}</h3>
        {/* Đánh giá sản phẩm */}
        <div className="p-tb-8 details d-flex">
          <div>
            <Rate disabled defaultValue={total_rate ? stars / total_rate : 0} allowHalf className='seprate p-r-8' />
          </div>
          <div className='seprate d-flex align-i-center'>
            <a href="#evaluation" className="m-l-8 p-r-8">
              {`${total_rate} Đánh giá`}
            </a>
          </div>
          <div className='d-flex align-i-center'>
            <a className='p-l-8' href='#'>Đã bán {numOfSell}</a>
          </div>
        </div>

        {/* Giá */}
        <div className='price'>
          <h1 className="product-price font-weight-700 p-tb-8 m-r-10">
            {/* {price === 0 ? 'Liên hệ' : helpers.formatProductPrice(priceBefore)} */}
            {price === 0 ? 'Liên hệ' : helpers.formatProductPrice(price * (100 - discount) / 100)}
          </h1>
          {discount > 0 ? <> <span className='Product-View-price--cancel m-r-5'>
            {helpers.formatProductPrice(price)}

          </span><span className="m-l-8 price-discount">-{discount}%</span> </> : ""}
        </div>
        {/* Chọn số lượng */}
        <div className="p-t-12 option d-flex">
          {currentStock === 0 ? (
            <h3 className="m-r-8 m-t-8 font-size-18px" style={{ color: 'red' }}>
              <i>Sản phẩm hiện đang hết hàng !</i>
            </h3>
          ) : (
            <>
              <h3 className="m-r-8 font-size-16px">Số Lượng: </h3>
              <InputNumber
                name="numOfProduct"
                size="middle"
                value={numOfProduct}
                min={1}
                max={currentStock}
                onChange={(value) => setNumberOfProduct(value)}
              />
              <h3 className='m-l-10'>Còn : {instock}</h3>
            </>
          )}
        </div>
        {/* {console.log(searchParams.get("rcm"), searchParams.get("index"), searchParams.get("type"), bookId)} */}
        <div className="btn-group p-tb-16 d-flex justify-content-around">
          <Button
            onClick={() => {
              trackingApi.sendAddToCartToElastic(searchParams.get("rcm"), searchParams.get("index"), searchParams.get("type"), bookId)
              dispatch(orderApi.addtoCart(
                {
                  category,
                  title,
                  price,
                  amount: numOfProduct,
                  img,
                  discount,
                  instock,
                  bookId,
                  author,
                  rcm: searchParams.get("rcm"),
                  index: searchParams.get("index"),
                  rcmtype: searchParams.get("type")
                }, message, user.id
              ))
            }}
            size="large"
            disabled={instock ? false : true}
            className="m-r-16 w-100 btn-group-item"
            style={{ backgroundColor: '#3555c5' }}>
            THÊM VÀO GIỎ
          </Button>

          <Button
            disabled={instock ? false : true}
            size="large"
            className="w-100 btn-group-item"
            style={{ backgroundColor: '#39B3D7' }}
            onClick={() => {
              trackingApi.sendAddToCartToElastic(searchParams.get("rcm"), searchParams.get("index"), searchParams.get("type"), bookId)
              dispatch(orderApi.addtoCart(
                {
                  category,
                  title,
                  price,
                  amount: numOfProduct,
                  img,
                  discount,
                  instock,
                  bookId,
                  author,
                  rcm: searchParams.get("rcm"),
                  index: searchParams.get("index"),
                  rcmtype: searchParams.get("type")
                }, message, user.id
              ))
            }}
          >
            <Link to={constants.ROUTES.PAYMENT}>
              MUA NGAY
            </Link>
          </Button>
        </div>

      </Col>
    </Row >
  );
}

ProductOverview.propTypes = {
  products: PropTypes.object,
};

export default ProductOverview;
