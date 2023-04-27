import React, { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import statisticApi from '../../apis/statisticApi';
import moment from 'moment';
import { Button, DatePicker, Select } from 'antd';
import constants from '../../constants';

const { RangePicker } = DatePicker;
const { Option } = Select;
export default function BarChart() {
  let datePickerRef = useRef(null);
  let [isOpen, setIsOpen] = useState(false);
  let [range, setRange] = useState('now/d,now/d');
  let [customRange, setCustomRange] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [dataChart, setDataChart] = useState([]);
  useEffect(() => {
    let isSubscribe = true;
    let getHistogramData = async () => {
      let rangeTime = range.split(',');
      let result = await statisticApi.getHistogramData(
        rangeTime[0],
        rangeTime[1],
      );
      let dataChart = result.data.buckets.map((item) => {
        return {
          x:
            ((item.from
              ? item.from / 1000 === 1000
                ? 2100
                : item.from / 1000
              : 0) +
              (item.to ? item.to / 1000 : 0)) /
            2,
          y: item.doc_count,
        };
      });
      if (isSubscribe) setDataChart(dataChart);
    };
    getHistogramData();
    return () => {
      isSubscribe = false;
    };
  }, [range]);
  const data = useMemo(
    () => ({
      // labels,
      datasets: [
        {
          label: 'Số lượng đơn',
          data: dataChart,
          // borderColor: 'rgb(255, 99, 132)',
          type: 'bar',
          borderColor: 'rgb(255, 100, 0)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          // pointRadius: 6,
          borderWidth: 0.5,
          barPercentage: 1.21,
        },
        // {
        //     label: 'Total',
        //     type: 'line',
        //     data: [100, 147, 90, 123, 87, 200, 185],
        //     borderColor: 'rgb(53, 162, 235)',
        //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //     // pointStyle: 'rectRounded', reference : https://www.chartjs.org/docs/latest/api/#pointstyle
        //     pointRadius: 6,
        //     pointBorderColor: 'rgb(33, 5, 245,0.7)',
        //     pointBackgroundColor: 'rgb(0, 102, 255)',
        //     yAxisID: 'y1',

        // },
      ],
    }),
    [dataChart],
  );
  return (
    <div>
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
        <Bar options={constants.BAR_CHART_OPTION} data={data} size="large" />
      </div>
    </div>
  );
}
