import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import statisticApi from '../../../../apis/statisticApi';
import PieChart from '../../../../components/PieChart';

export default function OrderStatusStatistic({ time }) {
  const [dataPieChart, setDataPieChart] = useState([0, 0, 0, 0, 0, 0]);
  useEffect(() => {
    let isSubscribe = true;
    const getOrderClasify = async () => {
      let rangeTime = time.split(',');
      let dataPieChart = [0, 0, 0, 0, 0, 0];
      let data = await statisticApi.classifyOrder(rangeTime[0], rangeTime[1]);
      data.data.forEach((item, index) => {
        dataPieChart[+item.status - 1] = item.total;
      });
      if (isSubscribe) setDataPieChart(dataPieChart);
    };
    getOrderClasify();
    return () => {
      isSubscribe = false;
    };
  }, [time]);

  return (
    <div>
      <PieChart
        label={[
          'Chưa thanh toán',
          'Chờ xác nhận',
          'Chờ Vận Chuyển',
          'Đang Vận Chuyển',
          'Đã Hoàn Thành',
          'Đã Hủy',
        ]}
        title="Tỷ lệ đơn hàng"
        data={dataPieChart}
      />
    </div>
  );
}
