import bussinessIcon from '../../../assets/icon/products/bussiness.png';
import comicIcon from '../../../assets/icon/products/comic.png';
import novelIcon from '../../../assets/icon/products/novel.png';
import literary from '../../../assets/icon/products/literary.png';
import heathIcon from '../../../assets/icon/products/heath.png';
import educationIcon from '../../../assets/icon/products/education.png';
import sexIcon from '../../../assets/icon/products/sex.png';

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const menu = [
  {
    key: 1,
    to: '/filter/1',
    icon: bussinessIcon,
    title: 'Sách kinh tế',
  },
  {
    key: 2,
    to: '/filter/2',
    icon: literary,
    title: 'Sách văn học',
  },
  {
    key: 3,
    to: '/filter/3',
    icon: heathIcon,
    title: 'Địa Danh - Du Lịch',
  },
  {
    key: 4,
    to: '/filter/4',
    icon: educationIcon,
    title: 'Sách Giáo Dục',
  },
  {
    key: 5,
    to: '/filter/5',
    icon: novelIcon,
    title: 'Sách Thể Thao - Sức Khỏe',
  },
  {
    key: 6,
    to: '/filter/6',
    icon: comicIcon,
    title: 'Truyện',
  },
  {
    key: 7,
    to: '/filter/7',
    icon: sexIcon,
    title: 'Sách Tâm Lý - Giới Tính',
  },
];

function MenuFilter(props) {
  const { onShow } = props;

  function renderFilterMenu(list) {
    return (
      list &&
      list.map((item, index) => {
        return (
          <div
            onMouseEnter={() => onShow(item.key)}
            key={index}
            className="w-100 p-lr-8 p-tb-4  Filter-menu-item">
            <Link to={item.to} className="d-flex align-i-center">
              <img src={item.icon} className="icon m-lr-8" alt="icon" />
              <span className="title">{item.title}</span>
            </Link>
          </div>
        );
      })
    );
  }

  return (
    <div className="bor-rad-8 Filter-menu p-tb-4">{renderFilterMenu(menu)}</div>
  );
}

MenuFilter.propTypes = {
  onShow: PropTypes.func,
};

export default MenuFilter;
