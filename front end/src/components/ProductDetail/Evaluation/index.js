import { Col, Pagination, Progress, Rate, Row } from 'antd';
import constants from '../../../constants/index';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './index.scss';
import UserComment from './UserComment';
function EvaluationView(props) {
  const { rates, cmtList } = props;
  const [cmtListState, setCmtListState] = useState(cmtList);
  const starAvg = cmtList
    ? cmtList.reduce((a, b) => a + b.value, 0) / cmtList.length
    : 0;

  // paging
  const [page, setPage] = useState(1);
  const pageTotal = Math.ceil(cmtListState.length / constants.COMMENT_PER_PAGE);
  let start = (page - 1) * constants.COMMENT_PER_PAGE;
  const cmtListSliced = cmtListState.slice(
    start,
    start + constants.COMMENT_PER_PAGE
  );

  useEffect(() => {
    setCmtListState(cmtList);
    return () => {};
  }, [cmtList]);
  // rendering ...
  return (
    <Row className="Evaluation bg-white p-16" style={{ borderRadius: 8 }}>
      {/* tiều đề */}
      <Col span={24}>
        <h2 className="font-weight-700 rate">Đánh giá</h2>
        <div className="underline-title"></div>
      </Col>
      {/* đánh giá tổng quan */}
      <Col span={24} className="p-16">
        {/* <span className="font-size-28px">Rate</span> */}
        <div className="overview d-flex p-tb-16">
          {/* tổng kết */}
          <div className="d-flex flex-direction-column align-i-center overview--total">
            <h2 className="font-size-32px">
              {starAvg
                ? starAvg
                    .toLocaleString('en', {
                      useGrouping: false,
                      minimumFractionDigits: 1,
                    })
                    .slice(0, 3)
                : 0}
            </h2>
            <Rate disabled value={starAvg} allowHalf style={{ fontSize: 12 }} />
            <p className="t-color-gray font-weight-500">
              {cmtList.length} comments
            </p>
          </div>
          {/* chi tiết rating */}
          <div className="overview--detail d-flex flex-grow-1 flex-direction-column p-lr-16">
            {rates.map((item, index) => (
              <div key={index} className="d-flex justify-content-between">
                <Rate
                  disabled
                  defaultValue={index + 1}
                  style={{ fontSize: 14, flexBasis: 100 }}
                />
                <Progress
                  percent={
                    (helpers.countRate(index + 1, cmtList) / cmtList.length) *
                    100
                  }
                  type="line"
                  showInfo={false}
                  style={{ width: 172 }}
                />
                <span className="p-l-8 t-color-gray">
                  {helpers.countRate(index + 1, cmtList)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Col>

      {/* Xem bình luận, nhận xét */}
      <Col span={24}>
        {cmtListSliced.map((item, index) => (
          <UserComment key={index} commentDetail={item} />
        ))}
        {pageTotal > 1 && (
          <Pagination
            className="t-right m-b-16"
            defaultCurrent={1}
            total={pageTotal}
            pageSize={1}
            onChange={(p) => setPage(p)}
          />
        )}
      </Col>
    </Row>
  );
}

EvaluationView.defaultProps = {
  rates: [0, 0, 0, 0, 0],
};

EvaluationView.propTypes = {
  cmtList: PropTypes.array || PropTypes.object,
  rates: PropTypes.array || PropTypes.object,
  productId: PropTypes.number,
};

export default EvaluationView;
