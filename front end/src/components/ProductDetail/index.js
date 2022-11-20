import {HomeOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import Evaluation from '../../containers/ProductDetailPage/Evaluation';
import RelatedProduct from '../../containers/ProductDetailPage/RelatedProduct';
import helpers from '../../helpers';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import Description from './Description';
import './index.scss';
import ProductOverview from './Overview';

function ProductDetail(props) {
  const { products} = props;
  const {description, title, brand, type, bookId, rate } = products;
  // rendering...

  return (
    <div className="Product-Detail-View container m-t-20">
      <Row gutter={[16, 32]}>
        {/* Hiển thị đường dẫn trang */}
        <Col span={24} className="d-flex page-position">
          <Link to="/">
            <HomeOutlined className="p-12 icon-home font-size-16px bg-white" />
          </Link>
          <span className="r-arrow p-lr-8 font-weight-500">{`>`}</span>
          <span className="pro-name p-8 font-weight-500 bg-white">{helpers.reduceProductName(title, window.innerWidth <= 576 ? 30 : 50)}</span>
        </Col>

        {/* Thông tin cơ bản của sản phẩm */}
        <Col span={24} md={24}>
          <ProductOverview products={products} />
          {/* <HeartFilled style={{color:'black',position:'absolute',top:20, left:'30px',fontSize:20}} /> */}
        </Col>

        {/* Mô tả chi tiết sản phẩm */}
        <Col span={24}>
          <Description
            // specification={{ brand, otherInfo, ...restDetail }}
            specification={{}}
            desc={description}
          />
        </Col>

        {/* Nhận xét của khách hàng */}
        <Col span={24} id="evaluation">
          <Evaluation rates={rate} productId={bookId} />
        </Col>

        {/* danh sách sản phẩm tương tự */}
        <Col span={24}>
          <RelatedProduct
            title="Sản phẩm tương tự"
            type={type}
            brand={brand}
            id={bookId}
            suggestionType={0} //1 là mua cùng 0 là similar
          />
        </Col>
        {/* người khác cũng mua*/}
        <Col span={24}>
          <RelatedProduct
            title="Người khác cũng mua"
            type={type}
            brand={brand}
            id={bookId}
            suggestionType={1} //1 là mua cùng 0 là similar
          />
        </Col>
      </Row>
    </div>
  );
}

ProductDetail.propTypes = {
  products: PropTypes.object,
};

export default ProductDetail;
