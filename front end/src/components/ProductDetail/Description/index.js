import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import './index.scss';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import Posts from './Posts';
// import Specification from './Specification';

function Description(props) {
  const { specification, desc } = props;
  const [isHideDesc, setIsHideDesc] = useState(false);
  const [isShowSeeMore, setIsShowSeeMore] = useState(false);

  // ev: hiển thị xem thêm bài viết chi tiết
  const onSeeMore = () => {
    setIsHideDesc(!isHideDesc);
  };

  // ev: lấy kích thước bài viết mô tả sau khi render
  useEffect(() => {
    const height = document.getElementById('descId').clientHeight;
    const width = window.innerWidth
    // Nếu chiều cao bài viết > 200px thì ẩn bớt
    if (height >= 400) {
      setIsShowSeeMore(true);
    }
  }, []);

  return (
    <Row className="Product-Desc bg-white p-8" id="descId">
      {/* Bài viết chi tiết */}
      <Col
        span={24}
        md={24}
        className={`p-8 ${!isHideDesc ? 'hide-desc' : ''}`}>
        <h2 className="font-weight-700 desc">Mô tả</h2>
        <div className="underline-title"></div>
        <Posts content={desc} />
      </Col>
      {isShowSeeMore && (
        <h3
          className="trans-margin p-tb-16 see-more ease-trans"
          style={{ cursor: 'pointer' }}
          onClick={onSeeMore}>
          {isHideDesc ? 'Ẩn bớt' : 'Xem thêm'}
           &nbsp;
          {isHideDesc ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </h3>
      )}
    </Row>
  );
}

Description.propTypes = {
  specification: PropTypes.object,
  desc: PropTypes.string,
};

export default Description;
