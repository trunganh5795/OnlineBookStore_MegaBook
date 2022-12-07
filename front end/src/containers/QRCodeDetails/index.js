import { HomeOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Col, Rate, Row, Tooltip as TooltipAntd } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
// import helpers from '../../helpers'
import 'chartjs-adapter-moment';
// import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  TimeScale,
} from 'chart.js';
import './index.scss';
import AddProduct from '../AdminPage/ProductPage/ProductAddForm';
import constants from '../../constants';
// import PieChart from '../../components/PieChart'
// import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom';
import productApi from '../../apis/productApi';
import GlobalLoading from '../../components/Loading/Global';
import LineChart from '../../components/LineChart/LineChart';
import { useMemo } from 'react';
// import RateRatio from '../AdminPage/Dashboard/RateRatio'
// const { Option } = Select;
ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);
const desc = ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'];

export default function QRcodeDetails() {
  const { id } = useParams();
  const [bookDetail, setBookDetail] = useState(false);
  const [numOfSell, setNumOfSell] = useState(null);
  const [isNotFoundProduct, setIsNotFoundProduct] = useState(false);
  const avgRate = useMemo(
    () =>
      bookDetail.total_rate ? bookDetail.stars / bookDetail.total_rate : 0,
    [bookDetail]
  );
  useEffect(() => {
    let isSubscribe = true;
    const getProduct = async (id) => {
      try {
        const result = await productApi.getProduct(id);
        if (result && isSubscribe) {
          const { data } = result;
          setBookDetail(data);
        }
      } catch (error) {
        if (isSubscribe) setIsNotFoundProduct(false);
      }
    };
    getProduct(id);
    if (isSubscribe) setBookDetail(false);

    return () => (isSubscribe = false);
  }, []);

  useEffect(() => {
    let isSubscribe = true;
    const getNumOfSell = async (id) => {
      let data = await productApi.getNumOfSell(id);
      if (isSubscribe) {
        setNumOfSell(data.data.value);
      }
    };
    getNumOfSell(id);
    return () => {
      isSubscribe = false;
    };
  }, []);
  return (
    <>
      {!localStorage.getItem('admin') ? <Redirect to={`/product/${id}`} /> : ''}
      {isNotFoundProduct && <Redirect to="/not-found" />}
      <Row className="qrcode container m-tb-15">
        <Button
          icon={<HomeOutlined />}
          href="/admin"
          type="primary"
          size="large"
          className="m-lr-20">
          Bảng quản trị
        </Button>
        {bookDetail ? (
          <>
            <Col span={24}>
              <AddProduct
                defaultImg={bookDetail.img}
                title=""
                edit
                initialValues={bookDetail}
                BookId={id}>
                <ul>
                  <li>
                    {/* <span className='qrcode-title'>Average Rating:</span>  */}
                    <Rate
                      disabled
                      defaultValue={avgRate}
                      tooltips={desc}
                      emptyIcon={<StarOutlined style={{ color: 'red' }} />}
                      className="m-r-10"
                    />
                    <span>
                      {avgRate
                        .toLocaleString('en', {
                          useGrouping: false,
                          minimumFractionDigits: 1,
                        })
                        .slice(0, 3)}
                    </span>
                  </li>
                  <li>
                    <b className="qrcode-title">Đã bán:</b> {numOfSell}
                  </li>
                </ul>
              </AddProduct>
            </Col>
            {/* <Col span={24}>
                            <Row>
                                <Col span={12}>
                                    <h1>Số lượng đã bán</h1>
                                </Col>
                                <Col span={12} className="d-flex justify-content-end">
                                    <Form>
                                        <Form.Item
                                            name="time"
                                            label="Time"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                            initialValue="7days"
                                        >
                                            <Select
                                                style={{ width: 120 }}
                                            // onChange={handleChange}
                                            >
                                                <Option value="7days">7 Ngày qua</Option>
                                                <Option value="30days">30 Ngày qua</Option>
                                                <Option value="90days">90 Ngày qua</Option>
                                            </Select>

                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        </Col> */}
            <Col span={24}>
              {/* <Bar options={options} data={data} /> */}
              <LineChart
                bookId={id}
                options={constants.LINE_CHART_OPTION_QRCODE_PAGE}
              />
            </Col>
            {/* <Col span={24} className="m-t-24">
                            <Row>
                                <Col span={12}>
                                    <h1>Thống kê đánh giá</h1>
                                    <RateRatio />
                                </Col>

                            </Row>
                        </Col> */}
            {/* {pieChartList.map((item, index) => {
                            return renderPieChart(item, index)
                        })} */}
          </>
        ) : (
          <GlobalLoading content="Đang tải ..." />
          // Show Loading Icon
        )}
      </Row>
    </>
  );
}

// const optionsSelect = [{ value: 'rating' }, { value: 'gender' }];
// const dataPieChart = {
//     labels: ['Male', 'Female'],
//     datasets: [
//         {
//             label: '# of Votes',
//             data: [100, 200],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)',
//             ],
//             borderColor: [
//                 'rgba(255, 255, 255, 1)',
//                 'rgba(255, 255, 255, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)',
//             ],
//             borderWidth: 1,
//         },
//     ],
// };
// const pieChartOptions = {
//     responsive: true,
//     plugins: {
//         legend: {
//             position: "top",
//             align: "start",
//             labels: {
//                 font: {
//                     size: 14
//                 }
//             }
//         },
//         title: {
//             display: true,
//             text: 'Chart.js Pie Chart'
//         },
//         datalabels: {
//             color: '#ffffff',
//             formatter: (value, ctx) => {
//                 let sum = ctx.dataset.data.reduce((a, b) => a + b, 0)
//                 // let sum = ctx.dataset._meta[0].total;
//                 let percentage = (value * 100 / sum).toFixed(2) + "%";
//                 return percentage;
//             },
//             font: {
//                 // weight: 'bold',
//                 size: 16,
//             }
//         }
//     }
// }
// function tagRender(props) {
//   const { label, value, closable, onClose } = props;
//   const onPreventMouseDown = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//   };
//   return (
//     <Tag
//       color={'#3d88e3'}
//       onMouseDown={onPreventMouseDown}
//       closable={closable}
//       onClose={onClose}
//       style={{ marginRight: 3 }}>
//       {label}
//     </Tag>
//   );
// }
