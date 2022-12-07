import { Card } from 'antd';
import helpers from '../../helpers';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import './index.scss';
import moment from 'moment';
import { Rate } from 'antd';
// rendering ...
function ProductView(props) {
  const {
    className,
    name,
    price,
    avtUrl,
    discount,
    stock,
    action,
    height,
    start_time,
    end_time,
    enable_discount,
    maxWidth,
    stars,
    total_rate,
  } = props;
  const windowWidth = window.innerWidth;
  // set height cho các avt của sản phẩm
  useEffect(() => {
    document.querySelectorAll('.ant-card-cover').forEach((item) => {
      if (height <= 390) {
        item.style.height = `145px`;
      } else {
        item.style.height = `${(height * 1.9) / 3}px`;
      }
    });
  }, []);

  // rendering ...
  return (
    <Card
      className={`Product-View p-b-18 ${className}`}
      id="card-item"
      style={{ height, maxWidth }}
      loading={false}
      align={'center'}
      cover={
        <img
          loading="lazy"
          className="w-90 max-h-100"
          src={avtUrl}
          alt="product"
        />
      }
      hoverable>
      <div align={'left'}>
        {/* Tên sản phẩm */}
        <div className="m-b-10 Product-View-name">
          {helpers.reduceProductName(
            name,
            windowWidth <= 992 ? (windowWidth < 576 ? 25 : 37) : 56
          )}
        </div>
        {/* Giá sản phẩm */}
        <div className="Product-View-price">
          {/* {!price && <span className="Product-View-price--contact">Liên hệ</span>} */}
          {price > 0 && (
            <>
              <span className="Product-View-price--main font-size-20px font-weight-b p-r-5">
                {helpers.formatProductPrice(
                  (price * (100 - (discount ? discount : 0))) / 100
                )}
              </span>
              {discount > 0 &&
                enable_discount &&
                moment(start_time).isSameOrAfter(
                  moment().format('YYYY-MM-DD')
                ) &&
                moment(end_time).isBefore(moment().format('YYYY-MM-DD')) && (
                  <>
                    <span className="Product-View-price--cancel font-weight-500">
                      {helpers.formatProductPrice(price)}
                    </span>
                    <span className="m-l-8 Product-View-price--discount">
                      {discount}%
                    </span>
                    <div className="sale-badge">
                      <p className="sale-badge-text">{discount}%</p>
                      <div className="sale-badge-decoration"></div>
                    </div>
                  </>
                )}
            </>
          )}
        </div>

        {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 5 */}
        {stock <= 5 && stock > 0 && (
          <div className="Product-View-stock font-size-14px">
            Còn {stock} sản phẩm
          </div>
        )}

        {/* Số lượng hàng còn, chỉ hiển thị khi còn ít hơn 5 */}
        {stock === 0 && (
          <b className="Product-View-stock font-size-16px">Hết hàng</b>
        )}

        <Rate
          disabled
          allowHalf
          defaultValue={total_rate ? stars / total_rate : 0}
        />
        {/* Các nút bấm thêm nếu có */}
        <div className="d-flex m-t-10 justify-content-end">
          {action.length > 0 && action.map((Item) => Item)}
        </div>
      </div>
    </Card>
  );
}

// default props
ProductView.defaultProps = {
  price: 0,
  stock: 1,
  action: [],
  // maxWidth: 280,
  height: 480,
  className: '',
};

// check prop type
ProductView.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  avtUrl: PropTypes.string,
  discount: PropTypes.number,
  stock: PropTypes.number,
  action: PropTypes.any,
  style: PropTypes.object,
  height: PropTypes.number,
  maxWidth: PropTypes.number,
};

export default ProductView;
