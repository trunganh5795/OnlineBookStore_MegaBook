import React, { useEffect, useMemo, useState } from 'react';
import helpers from '../../../../helpers';
import { Line } from 'react-chartjs-2';
import statisticApi from '../../../../apis/statisticApi';
const lineChartOptions = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: true,
  },
  // stacked: false,
  plugins: {
    legend: {
      position: 'top',
      display: true, //display label
    },
    title: {
      display: true,
      // text: 'Thống kê đơn hàng',
      font: {
        size: '20px',
      },
    },
    datalabels: {
      display: false, //default: true
      anchor: 'end',
      align: 'end',
      formatter: Math.round,
      font: {
        weight: 'bold',
        size: '18px',
      },
    },
    tooltip: {
      callbacks: {
        filter: (ctx) => ctx.datasetIndex == 0,
        label: (tooltipItems) => {
          if (tooltipItems.datasetIndex === 0) {
            return 'Số đơn : ' + tooltipItems.raw;
          } else if (tooltipItems.datasetIndex === 1) {
            return 'Doanh thu :' + helpers.formatProductPrice(tooltipItems.raw);
          } else if (tooltipItems.datasetIndex === 2) {
            return (
              'Doanh thu / đơn :' + helpers.formatProductPrice(tooltipItems.raw)
            );
          } else {
            return 'OK';
          }
          // var text = tooltipItems.datasetIndex === 1 ? 'Doanh thu : ' + helpers.formatProductPrice(tooltipItems.raw * 1000) : 'Số đơn : ' + tooltipItems.raw
          // return text;
        },
      },
    },
  },
  scales: {
    y: {
      display: false,
      title: {
        display: true,
        // text: 'Số đơn hàng',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
      min: 0,
      // max: 200,
      // position: 'right',
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1,
      },
    },
    y1: {
      display: false, //ẩn trục y1
      title: {
        display: true,
        // text: 'Doanh thu ( x1000 VND )',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
      min: 0,
      // max: 300,
      position: 'right',
      grid: {
        display: false,
      },
    },
    y2: {
      display: false, //ẩn trục y1
      title: {
        display: true,
        // text: 'Doanh thu ( x1000 VND )',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
      min: 0,
      // max: 300,
      position: 'right',
      grid: {
        display: false,
      },
    },
    y3: {
      display: false, //ẩn trục y1
      title: {
        display: true,
        // text: 'Doanh thu ( x1000 VND )',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
      min: 0,
      // max: 300,
      position: 'right',
      grid: {
        display: false,
      },
    },
    x: {
      title: {
        display: true,
        // text: 'Month',
        // color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },
      },
      type: 'time',
      time: {
        parser: 'YYYY/MM/DD',
        unit: 'day',
        displayFormats: {
          day: 'DD / MM',
        },
        tooltipFormat: 'DD-MM-YYYY',
      },
      // scaleLabel: {
      //     labelString: 'Timestamp'
      // }
    },
  },
};

export default function Statictis({ time }) {
  let [responeData, setResponeData] = useState({
    order: [],
    total: [],
    totalPerOrder: [],
  });
  let [labels, setLabels] = useState([]);
  let data = useMemo(
    () => ({
      labels,
      datasets: [
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
          pointRadius: 3,
          pointBorderColor: 'rgb(33, 5, 245,0.7)',
          pointBackgroundColor: 'rgb(0, 102, 255)',
          yAxisID: 'y1',
        },
        {
          label: 'Doanh thu / đơn',
          type: 'line',
          data: responeData.totalPerOrder,
          borderColor: 'rgb(252, 3, 236)',
          backgroundColor: 'rgba(252, 3, 236, 0.5)',
          // pointStyle: 'rectRounded', reference : https://www.chartjs.org/docs/latest/api/#pointstyle
          pointRadius: 3,
          pointBorderColor: 'rgb(252, 3, 236,0.7)',
          pointBackgroundColor: 'rgb(252, 3, 236)',
          yAxisID: 'y1',
        },
      ],
    }),
    [responeData, labels],
  );
  useEffect(() => {
    let subscribe = true;
    let getOrderTotal = async () => {
      let rangeTime = time.split(',');
      let result = await statisticApi.countOrderTotal(
        rangeTime[0],
        rangeTime[1],
      );
      let order = [];
      let total = [];
      let labels = [];
      let totalPerOrder = [];
      result.data.buckets.forEach((item) => {
        order.push(item.total_count.value);
        total.push(item.total_income.value);
        totalPerOrder.push(
          item.total_income.value /
            (item.total_count.value === 0 ? 1 : item.total_count.value),
        );
        labels.push(item.key_as_string); // ngày tháng hiện thị ở trục x
      });
      if (subscribe) {
        setLabels(labels);
        setResponeData({ order, total, totalPerOrder });
      }
    };
    getOrderTotal();

    return () => {
      subscribe = false;
    };
  }, [time]);

  return (
    <div className="bg-white p-lr-12 bor-rad-8 p-tb-30">
      <div className="pos-relative">
        <h2>
          Tổng đơn hàng:{' '}
          {responeData.order.reduce((total, ele, index) => (total += ele), 0)}
        </h2>
        <h2>
          Tổng đơn hàng:{' '}
          {helpers.formatProductPrice(
            responeData.total.reduce((total, ele, index) => (total += ele), 0),
          )}
        </h2>
        <Line options={lineChartOptions} data={data} size="large" />
      </div>
    </div>
  );
}
