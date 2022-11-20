import { Col, Row } from 'antd';
import React from 'react';
import './index.scss'
import RateRatio from './RateRatio';
import LineChart from '../../../components/LineChart/LineChart';
import BarChart from '../../../components/BarChart/BarChart';
import LatestOrder from './LatestOrder/LatestOrder';
import TodaySummary from './TodaySummary';
import constants from '../../../constants';

//fake option
function Dashboard() {
  return (
    <Row className="p-32 dashboard" gutter={[8, 16]}>
      <TodaySummary />
      {/* doanh thu theo tháng */}
      <Col span={24} xl={6}>
        <RateRatio />
      </Col>
      <Col span={24} xl={18}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <LineChart options={constants.LINE_CHART_OPTION}/>
        </div>
      </Col>
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          {/* Số đơn, doanh thu theo khung thời gian */}
          <BarChart/>
        </div>
      </Col>
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home h-100">
          {/* Top đơn hàng mới nhất */}
          <LatestOrder />
        </div>
      </Col>
    </Row>
  );
}

export default Dashboard;
