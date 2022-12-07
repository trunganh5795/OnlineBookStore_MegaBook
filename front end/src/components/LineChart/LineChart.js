import { Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import statisticApi from '../../apis/statisticApi';
import './index.scss';
// const labels = ['09/09/2021', '01/01/2022', '02/01/2022', '01/03/2022', '20/04/2022', '01/05/2022', '01/06/2022', '01/07/2022'];
// const data = {
//     labels,
//     datasets: [
//         {
//             label: 'Số lượng',
//             data: [130, 121, 164, 123, 123, 123, 117, 80, 153, 187, 120, 165],
//             // borderColor: 'rgb(255, 99, 132)',
//             type: 'line',
//             borderColor: 'rgb(255, 100, 0)',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             pointRadius: 6,
//         },
//         {
//             label: 'Doanh thu',
//             type: 'line',
//             data: [100, 147, 90, 123, 87, 200, 185],
//             borderColor: 'rgb(53, 162, 235)',
//             backgroundColor: 'rgba(53, 162, 235, 0.5)',
//             // pointStyle: 'rectRounded', reference : https://www.chartjs.org/docs/latest/api/#pointstyle
//             pointRadius: 6,
//             pointBorderColor: 'rgb(33, 5, 245,0.7)',
//             pointBackgroundColor: 'rgb(0, 102, 255)',
//             yAxisID: 'y1',

//         },
//     ],
// };

const { RangePicker } = DatePicker;
const { Option } = Select;
export default function LineChart({ bookId, options }) {
  let datePickerRef = useRef(null);
  let [isOpen, setIsOpen] = useState(false);
  let [range, setRange] = useState('now/d,now/d');
  let [responeData, setResponeData] = useState({ order: [], total: [] });
  let [labels, setLabels] = useState([]);
  let [customRange, setCustomRange] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  useEffect(() => {
    let subscribe = true;

    let getOrderTotal = async () => {
      let rangeTime = range.split(',');
      if (!bookId) {
        let result = await statisticApi.countOrderTotal(
          rangeTime[0],
          rangeTime[1]
        );
        let order = [];
        let total = [];
        let labels = [];
        result.data.buckets.forEach((item) => {
          order.push(item.total_count.value);
          total.push(item.total_income.value);
          labels.push(item.key_as_string);
        });
        if (result.data && subscribe) {
          setLabels(labels);
          setResponeData({ order, total });
        }
      } else {
        let result = await statisticApi.getTotalbyid(
          rangeTime[0],
          rangeTime[1],
          bookId
        );

        // let order = [];
        let total = [];
        let labels = [];
        result.data.forEach((item) => {
          // order.push(item.total_count.value)
          total.push(item.quantity.value);
          labels.push(item.key_as_string);
        });
        if (result.data && subscribe) {
          setLabels(labels);
          setResponeData({ order: null, total });
        }
      }
    };

    getOrderTotal();
    return () => {
      subscribe = false;
    };
  }, [range]);
  let data = useMemo(
    () => ({
      labels,
      datasets: !bookId
        ? [
            {
              label: 'Số đơn',
              data: responeData.order,
              // borderColor: 'rgb(255, 99, 132)',
              type: 'line',
              borderColor: 'rgb(255, 100, 0)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              pointRadius: 3,
            },
            {
              label: 'Doanh thu',
              type: 'line',
              data: responeData.total,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              // pointStyle: 'rectRounded', reference : https://www.chartjs.org/docs/latest/api/#pointstyle
              pointRadius: 3,
              pointBorderColor: 'rgb(33, 5, 245,0.7)',
              pointBackgroundColor: 'rgb(0, 102, 255)',
              yAxisID: 'y1',
            },
          ]
        : [
            {
              label: 'Số lượng',
              data: responeData.total,
              // borderColor: 'rgb(255, 99, 132)',
              type: 'line',
              borderColor: 'rgb(255, 100, 0)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              pointRadius: 3,
            },
          ],
    }),
    [responeData, labels]
  );
  return (
    <div className="bar_chart_option">
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
              `${moment(e[0]._d).format('YYYY-MM-DD')},${moment(e[1]._d).format(
                'YYYY-MM-DD'
              )}`
            );
            setCustomRange(
              `(${moment(e[0]._d).format('DD-MM-YYYY')} - ${moment(
                e[1]._d
              ).format('DD-MM-YYYY')})`
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

      <Line options={options} data={data} size="large" />
    </div>
  );
}
