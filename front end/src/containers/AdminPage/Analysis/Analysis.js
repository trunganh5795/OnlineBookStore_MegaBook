import React, { useState, useRef } from 'react';
import { Col, Row, Button, DatePicker, Select } from 'antd';
import './index.scss';
import Ranking from './Ranking/Ranking';
import CategoryRanking from './CategoryRanking/CategoryRanking';
import Statictis from './Statictis';
import moment from 'moment';
import OrderStatusStatistic from './OrderStatusStatistic';
import NewUserStatictis from './NewUserStatistic';
// const toolTipText = {
//   total: 'Tổng giá trị của các đơn hàng đã xác nhận (bao gồm không thanh toán khi nhận hàng và xác nhận thanh toán khi nhận hàng) trong khoảng thời gian đã chọn, bao gồm cả các đơn hàng đã hủy và trả hàng / hoàn tiền.',
//   orders: 'Tổng số đơn đặt hàng đã xác nhận trong khoảng thời gian đã chọn, bao gồm cả đơn đặt hàng đã hủy và trả lại / hoàn tiền.',
//   views: 'Tổng số truy cập xem sản phẩm',
//   totalOrder: 'Giá trị trung bình của mỗi đơn hàng trong khoảng thời gian đã chọn, được tính bằng tổng doanh số chia tổng đơn hàng.'
// }

const { RangePicker } = DatePicker;
const { Option } = Select;
let today = `${moment().format('DD/MM/YYYY')}`;
let last7days = `${moment()
  .subtract(7, 'd')
  .format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`;
let last30days = `${moment()
  .subtract(30, 'd')
  .format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}`;
export default function Analysis() {
  let [range, setRange] = useState('now/d,now/d');
  let [customRange, setCustomRange] = useState('');
  let [isOpen, setIsOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  let datePickerRef = useRef(null);

  return (
    <Row className="p-32 analysis" gutter={[8, 16]}>
      <Col span={24}>
        <div className="bg-white p-lr-12 bor-rad-8 p-tb-10">
          <h2>Khung thời gian</h2>
          <div className="pos-relative d-flex">
            <Select
              defaultValue="now/d,now/d"
              style={{
                width: 270,
              }}
              onChange={(e) => {
                if (e !== 'custom') {
                  setRange(e);
                  setShowCustomRange(false);
                }
              }}
              onSelect={(e) => {
                if (e === 'custom') {
                  setIsOpen(true);
                  datePickerRef.current.style.display = 'inline';
                }
              }}>
              <Option value={'now/d,now/d'}>Hôm nay {today}</Option>
              <Option value={'now-7d/d,now/d'}>7 Ngày {last7days}</Option>
              <Option value={'now-30d/d,now/d'}>30 Ngày {last30days}</Option>
              <Option value="custom">Tùy chỉnh </Option>
            </Select>
            {showCustomRange ? (
              <p className="m-l-10" style={{ lineHeight: '32px' }}>
                {customRange}
              </p>
            ) : (
              ''
            )}
            <div className="datepicker" ref={datePickerRef}>
              <RangePicker
                open={isOpen}
                onChange={(e) => {
                  setRange(
                    `${moment(e[0]._d).format('YYYY-MM-DD')},${moment(
                      e[1]._d,
                    ).format('YYYY-MM-DD')}`,
                  );
                  setCustomRange(
                    `(${moment(e[0]._d).format('DD-MM-YYYY')} - ${moment(
                      e[1]._d,
                    ).format('DD-MM-YYYY')})`,
                  );
                  setShowCustomRange(true);
                }}
                renderExtraFooter={(e) => (
                  <div>
                    <Button
                      className="text-right m-r-5"
                      type="danger"
                      onClick={() => {
                        datePickerRef.current.style.display = 'none';
                        setIsOpen(false);
                      }}>
                      Thoát
                    </Button>
                    <Button
                      className="text-right"
                      type="primary"
                      onClick={() => {
                        datePickerRef.current.style.display = 'none';
                        setIsOpen(false);
                      }}>
                      Chọn
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </Col>
      <Col span={24}>
        <Statictis time={range} />
      </Col>
      <Col span={24} xl={15}>
        <div className="bg-white p-lr-12 bor-rad-8 p-tb-30 h-100">
          <Ranking time={range} />
        </div>
      </Col>
      <Col span={24} xl={9}>
        <div className="bg-white p-lr-12 bor-rad-8 p-tb-30 h-100">
          <h1>Thứ hạng theo thể loại</h1>
          <CategoryRanking time={range} />
        </div>
      </Col>
      {/* ////////////////////////// */}
      <Col span={24} xl={9}>
        <div className="bg-white p-lr-12 bor-rad-8 p-tb-30 h-100">
          <OrderStatusStatistic time={range} />
        </div>
      </Col>
      <Col span={24} xl={15}>
        <div className="bg-white p-lr-12 bor-rad-8 p-tb-30 h-100">
          <h1>Khách hàng mới</h1>
          <NewUserStatictis time={range} />
        </div>
      </Col>
    </Row>
  );
}
