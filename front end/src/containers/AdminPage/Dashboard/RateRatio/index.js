import { Button, DatePicker, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import PieChart from '../../../../components/PieChart';
import statisticApi from '../../../../apis/statisticApi';
const { RangePicker } = DatePicker;
const { Option } = Select;
export default function RateRatio() {
  let datePickerRef = useRef(null);
  let [isOpen, setIsOpen] = useState(false);
  let [range, setRange] = useState('now/d,now/d');
  let [customRange, setCustomRange] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    let isSubscuribe = true;
    let getCountRate = async () => {
      let rangeTime = range.split(',');
      let result = await statisticApi.countRate(rangeTime[0], rangeTime[1]);

      let rateData = [0, 0, 0, 0, 0];
      result.data.forEach((item) => (rateData[item.key - 1] = item.doc_count));
      //item.key - 1 vì sao thì từ 1 đến 5 còn index trong rateData là từ 0 đến 4
      if (isSubscuribe) setData(rateData);
    };
    getCountRate();

    return () => {
      isSubscuribe = false;
    };
  }, [range]);

  return (
    <div className="bg-white p-12 bor-rad-8 box-sha-home h-100">
      <div className="pos-relative">
        {/* <h1>Tỷ lệ đánh giá</h1> */}
        <Select
          defaultValue="now/d,now/d"
          style={{
            width: 270,
          }}
          // loading
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
          <Option value={'now/d,now/d'}>
            Hôm nay ({moment().format('DD/MM/YYYY')})
          </Option>
          <Option value={'now-7d/d,now/d'}>
            7 Ngày ({moment().subtract(7, 'd').format('DD/MM/YYYY')} -{' '}
            {moment().format('DD/MM/YYYY')})
          </Option>
          <Option value={'now-30d/d,now/d'}>
            30 Ngày ({moment().subtract(30, 'd').format('DD/MM/YYYY')} -{' '}
            {moment().format('DD/MM/YYYY')})
          </Option>
          <Option value="custom">Tùy chỉnh </Option>
        </Select>
        {showCustomRange ? <p>{customRange}</p> : ''}
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
        {data.length === 0 ? (
          <p>Không có đánh giá nào</p>
        ) : (
          <PieChart
            label={['1 Sao', '2 Sao', '3 Sao', '4 Sao', '5 Sao']}
            data={data}
          />
        )}
      </div>
    </div>
  );
}
