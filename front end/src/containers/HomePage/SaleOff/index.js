import { Carousel } from 'antd';
import React from 'react';
import './index.scss';

// Do cả chương trình chỉ có 1 list carousel
// Nên lưu thẳng vào đây để đỡ tốn chi phí query
const list = [
  'https://cdn0.fahasa.com/media/magentothem/banner7/Bitex07840x320.jpg',
  'https://cdn0.fahasa.com/media/magentothem/banner7/MCBooks07_840x320.jpg',
  'https://res.cloudinary.com/dsa-company/image/upload/v1663581364/8111158d6b957b60c77209a16c71decf_u1hurr.png',
];

function SaleOff() {
  return (
    <Carousel className="Sale-Off" autoplay>
      {list.map((item, index) => (
        <img className="Sale-Off-img" src={item} key={index} />
      ))}
    </Carousel>
  );
}

export default SaleOff;
