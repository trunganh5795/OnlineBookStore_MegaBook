import { Col, Row } from 'antd';
import Filter from '../../components/Filter';
import React from 'react';
import AllProduct from './AllProduct';
import './index.scss';
import SaleOff from './SaleOff';
import BestBook from './BestBook';
import RecommendForYou from './RecommendForYou';
import Trending from './Trending';

function HomePage() {
  // kéo về đầu trang
  // document.querySelector('body').scroll({
  //   top: 0,
  //   left: 0,
  //   behavior: 'smooth',
  // });

  return (
    <div className="Home">
      {/* Carousel cho sale off */}
      <div className="pos-relative">
        <SaleOff />
        {/* Carosouel  */}
        <div className="filter-wrapper trans-center container w-100 h-80">
          <Filter />
          {/* Category list */}
        </div>
      </div>
      <Row className="container">
        {/* banner  */}
        <Col span={24} className="adv box-sha-home bor-rad-8 m-b-32 m-t-32">
          <img
            className="adv-img w-100 bor-rad-8"
            alt="banner"
            src="https://res.cloudinary.com/dsa-company/image/upload/v1663583327/18731152_ikabvx.jpg"
          />
        </Col>
        {/* Đề xuất*/}
        <Col span={24} className="m-b-32 hot-products box-sha-home bor-rad-8">
          <RecommendForYou title="Dành cho bạn" />
        </Col>
        {/* <Trending/> */}
        {/* -------------- */}
        {bookCategories &&
          bookCategories.map((item, index) => {
            if (isNaN(item.id)) {
              return item.component;
            } else {
              return (
                <Col
                  span={24}
                  key={index}
                  className="m-b-32 bg-white box-sha-home bor-rad-8">
                  <AllProduct
                    title={item.title}
                    category={item.id}
                    key={item.id}
                  />
                  {/* category 1 : business, 2:cook ,3:crafts, 4:comics, 5 novel, 6 science, 7 heath, 8 education */}
                </Col>
              );
            }
          })}
        {/* -------------- */}
      </Row>
    </div>
  );
}
const bookCategories = [
  {
    title: 'Sách kinh tế',
    id: 1,
  },
  {
    title: 'Xu hướng',
    component: <Trending key={1} />,
  },
  {
    title: 'Sách văn học',
    id: 2,
  },

  {
    title: 'Sách hay hôm nay',
    component: <BestBook key={3} />,
  },
  {
    title: 'Sách Địa Danh - Du Lịch',
    id: 3,
  },
  {
    title: 'Sách Giáo Dục',
    id: 4,
  },
  {
    title: 'Sách Thể Thao - Sức Khỏe',
    id: 5,
  },
  {
    title: 'Truyện',
    id: 6,
  },
  {
    title: 'Sách Tâm Lý - Giới Tính',
    id: 7,
  },
];
export default HomePage;
