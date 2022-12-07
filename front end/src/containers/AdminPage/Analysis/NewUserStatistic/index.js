import React, { useState } from 'react';
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import statisticApi from '../../../../apis/statisticApi';
// import helpers from '../../../../helpers';
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
      // anchor: 'end',
      // align: 'end',
      // formatter: Math.round,
      // font: {
      //     weight: 'bold',
      //     size: '18px'
      // }
    },
  },
  scales: {
    y: {
      // display: false,
      title: {
        display: true,
        text: 'Số người đăng ký mới',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 16,
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
        stepSize: 10,
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
    },
  },
};

const initData = {
  labels: [],
  datasets: [
    {
      label: 'Số người',
      data: [],
      type: 'line',
      borderColor: 'rgb(255, 100, 0)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      pointRadius: 6,
    },
  ],
};
export default function NewUserStatictis({ time }) {
  const [data, setData] = useState(initData);
  useEffect(() => {
    let isSubscirbe = true;
    let rangeTime = time.split(',');
    let getNumOfNewUser = async (start_time, end_time) => {
      let data = await statisticApi.numOfNewUser(start_time, end_time);
      let labels = data.data.buckets?.map((item) => item.key_as_string);
      let dataChart = data.data.buckets?.map((item) => item.doc_count);
      if (isSubscirbe) {
        setData((prev) => {
          prev.labels = labels;
          prev.datasets[0].data = dataChart;
          let newData = structuredClone(prev);
          return newData;
        });
      }
    };
    getNumOfNewUser(rangeTime[0], rangeTime[1]);
    return () => {
      isSubscirbe = false;
    };
  }, [time]);

  return (
    <div className="">
      <Line options={lineChartOptions} data={data} size="large" />
    </div>
  );
}
