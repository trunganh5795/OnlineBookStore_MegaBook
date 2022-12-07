import React from 'react';
import { Pie } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     BarElement,
//     ArcElement
// } from 'chart.js';
// import './index.scss'
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     ArcElement,
//     ChartDataLabels,
//     Title,
//     Tooltip,
//     Legend,
//     PointElement,
//     LineElement,
// );

export default function PieChart({ label, data, title }) {
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          font: {
            size: 14,
          },
        },
        // display:false,
      },
      title: {
        display: true,
        text: title ? title : ' Tỷ lệ đánh giá',
      },
      datalabels: {
        color: '#ffffff',
        formatter: (value, ctx) => {
          // let sum = ctx.dataset.data.reduce((a, b) => a + b, 0)
          // let percentage = (value * 100 / sum).toFixed(2) + "%";
          // return percentage;
          return '';
        },
        font: {
          // weight: 'bold',
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            let { dataset, parsed, label } = tooltipItem;
            let total = dataset.data.reduce(
              (total, item) => (total += item),
              0
            );
            return `${label}: ${((parsed / total) * 100)
              .toLocaleString('en', {
                useGrouping: false,
                minimumFractionDigits: 1,
              })
              .slice(0, 4)}%, Số lượng: ${parsed}`;
          },
        },
      },
    },
    layout: {
      padding: 10,
    },
  };
  const dataPieChart = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: '# of Votes',
        data: [100, 200],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        // borderColor: [
        //     'rgba(255, 255, 255, 1)',
        //     'rgba(255, 255, 255, 1)',
        //     'rgba(255, 206, 86, 1)',
        //     'rgba(75, 192, 192, 1)',
        //     'rgba(153, 102, 255, 1)',
        //     'rgba(255, 159, 64, 1)',
        // ],
        borderWidth: 0,
        hoverOffset: 5, // phần chart được hover sẽ lồi ra
      },
    ],
  };
  dataPieChart.labels = [...label];

  dataPieChart.datasets[0].data = [...data];
  return (
    <>
      <Pie data={dataPieChart} options={pieChartOptions} />
    </>
  );
}
