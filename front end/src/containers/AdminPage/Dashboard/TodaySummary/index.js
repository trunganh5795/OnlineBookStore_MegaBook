import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  PercentageOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Col, Row, Statistic } from 'antd';
import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminApi from '../../../../apis/adminApi';
import statisticApi from '../../../../apis/statisticApi';
import moment from 'moment';
import { useMemo } from 'react';
import './index.scss';
const caculatePercentGrowth = (yesterday, today) => {
  if (today === 0 || today === undefined) return 0;
  else if (yesterday === 0 || yesterday === undefined) return Infinity;
  else {
    return Math.floor((today / yesterday) * 100);
  }
};

export default function TodaySummary() {
  const [orderTotal, setOderTotal] = useState({
    orderToday: 0,
    totalToday: 0,
    orderYesterday: 0,
    totalYesterday: 0,
  });
  const [views, setViews] = useState({});
  let token = useSelector((state) => state.recombeetoken.token);
  useEffect(() => {
    let getTodaySummary = async () => {
      // let result = await statisticApi.countOrderTotal('now/d', 'now/d');
      ////
      try {
        let yesterdayMidNight = moment()
          .subtract(1, 'day')
          .endOf('day')
          .utc()
          .format();
        let yesterday = moment().subtract(1, 'day').utc().format();
        let result = await Promise.all([
          statisticApi.countOrderTotal('now/d', 'now/d'),
          statisticApi.countOrderTotal(yesterdayMidNight, yesterday),
        ]);
        setOderTotal({
          orderToday: result[0].data.buckets[0].doc_count,
          totalToday: result[0].data.buckets[0].total_income.value,
          orderYesterday: result[1].data.buckets[0]?.doc_count,
          totalYesterday: result[1].data.buckets[0]?.total_income.value,
        });
        // }
      } catch (error) {
        // console.log(error);
      }
    };
    getTodaySummary();
    return () => {};
  }, []);
  const growthByViews = useMemo(
    () => caculatePercentGrowth(views.yesterday, views.today),
    [views],
  );
  const growthByOrder = useMemo(
    () =>
      caculatePercentGrowth(orderTotal.orderYesterday, orderTotal.orderToday),
    [orderTotal],
  );
  useEffect(() => {
    let isSubscribe = true;
    let getNumOfViews = async (token) => {
      if (token) {
        let since = moment()
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .format();
        let until = moment().format();
        let sinceTommorow = moment()
          .subtract(1, 'day')
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .format();
        let untilTommorow = moment().subtract(1, 'day').format();
        try {
          let data = await Promise.all([
            adminApi.getViewByTimeRecombee(token, since, until, 'DAYS'),
            adminApi.getViewByTimeRecombee(
              token,
              sinceTommorow,
              untilTommorow,
              'DAYS',
            ),
          ]);
          if (isSubscribe) {
            setViews({
              today:
                data[0].data.data.database.statistics.countsHistogram[0]
                  .values[0].value,
              yesterday:
                data[1].data.data.database.statistics.countsHistogram[0]
                  .values[0].value,
            });
          }
        } catch (error) {}
      }
    };
    getNumOfViews(token);
    return () => {
      isSubscribe = false;
    };
  }, [token]);
  return (
    <Fragment>
      <Col span={24} xl={6}>
        <div className="bg-white info p-lr-12 bor-rad-8 p-tb-30 h-100">
          <h1>
            <EyeOutlined style={{ color: 'blue' }} /> Tổng truy cập hôm nay
          </h1>
          <Row gutter={32}>
            <Col>
              <h2>{views.today !== null ? views.today : '--'}</h2>
            </Col>
            <Col>
              <div className="d-flex">
                {/* <div className="infinity"></div> */}
                <Statistic
                  // title="Active"
                  formatter={(value) =>
                    value === Infinity ? (
                      <div className="infinity d-flex"></div>
                    ) : value > 0 ? (
                      value
                    ) : (
                      -value
                    )
                  }
                  value={growthByViews}
                  precision={2}
                  valueStyle={{
                    color: growthByViews >= 0 ? '#3f8600' : '#f20202ed',
                    fontSize: '21px',
                  }}
                  prefix={
                    growthByViews >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="%"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24} xl={6}>
        <div className="bg-white info p-lr-12 bor-rad-8 p-tb-30 h-100">
          <h1>
            <ShoppingCartOutlined style={{ color: 'yellowgreen' }} /> Tổng đơn
            hàng hôm nay
          </h1>
          <Row gutter={32}>
            <Col>
              <h2>{orderTotal.orderToday}</h2>
            </Col>
            <Col>
              <div className="d-flex">
                <Statistic
                  // title="Active"
                  formatter={(value) =>
                    value === Infinity ? (
                      <div className="infinity d-flex"></div>
                    ) : value > 0 ? (
                      value
                    ) : (
                      -value
                    )
                  }
                  value={growthByOrder}
                  precision={2}
                  valueStyle={{
                    color: growthByOrder >= 0 ? '#3f8600' : '#f20202ed',
                    fontSize: '21px',
                  }}
                  prefix={
                    growthByOrder >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="%"
                />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24} xl={6}>
        <div className="bg-white info p-lr-12 bor-rad-8 p-tb-30 h-100">
          <h1>
            <PercentageOutlined style={{ color: 'orange' }} /> Tỷ lệ chuyển đổi
            đơn hàng
          </h1>
          <h2>
            {views.today
              ? Math.floor((orderTotal.orderToday / views.today) * 10000) /
                  100 +
                ' %'
              : 0}
          </h2>
        </div>
      </Col>
      <Col span={24} xl={6}>
        <div className="bg-white info p-lr-12 bor-rad-8 p-tb-30 h-100">
          <h1>Doanh số hôm nay</h1>
          <h2>{orderTotal.totalToday?.toLocaleString('en-US')} VND</h2>
        </div>
      </Col>
    </Fragment>
  );
}
