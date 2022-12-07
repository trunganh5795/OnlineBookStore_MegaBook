import { Button, Col, Dropdown, Image, Input, Menu, message, Row } from 'antd';
import constants from '../../../constants/index';
import helpers from '../../../helpers';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import voucherIcon from '../../../assets/icon/voucher.png';
import voucherApi from '../../../apis/voucherClient';

function CartPayment(props) {
  const {
    carts,
    isCheckout,
    transportFee,
    onCheckout,
    isLoading,
    selectedVoucher,
  } = props;
  const [voucher, setVoucher] = useState('');
  const [voucherList, setVoucherList] = useState(null);
  //Giảm giá voucher:
  const voucherDiscountValue = useMemo(() => {
    if (voucherList !== null && voucher.length === 5) {
      return helpers.getDiscountVoucher(
        carts,
        message,
        selectedVoucher,
        voucher,
        voucherList
      );
    } else {
      return 0;
    }
  }, [carts, selectedVoucher, voucher, voucherList]);
  // giá tạm tính
  const tempPrice = carts.reduce(
    (a, b) => a + (b.price + (b.price * b.discount) / 100) * b.amount,
    0
  );
  // tổng khuyến mãi
  const totalDiscount = carts.reduce(
    (totalDiscount, product) =>
      totalDiscount +
      ((product.price * product.discount) / 100) * product.amount,
    0
  );
  useEffect(() => {
    let isSubscribe = true;
    const getVoucher = async () => {
      if (voucherList === null) {
        let result = await voucherApi.getVoucher(carts);
        if (result.data && isSubscribe) setVoucherList(result.data.rows);
      }
    };
    if (isCheckout) getVoucher();
    return () => {
      isSubscribe = false;
    };
  }, [carts, voucherList, isCheckout]);
  const menu = useMemo(() => {
    let items = voucherList?.map((item) => ({
      //  <Menu.Item key={item.code}>
      key: item.code,
      label: (
        <Row gutter={8} style={{ width: '150px' }}>
          <Col span={12}>
            <Image preview={false} src={voucherIcon} width={'50px'} />
          </Col>
          <Col span={12}>
            <b>{item.code}</b>
            <div>
              <b style={{ color: 'red' }}>
                -{' '}
                {item.percentage[0]?.percent ||
                  helpers.formatProductPrice(item.amount[0]?.amount)}{' '}
                {item.percentage[0] ? ' %' : ''}
              </b>
            </div>
          </Col>
          <i className="voucher-desc">
            Áp dụng cho {helpers.convertCategoryIdToString(item.apply)}
          </i>
        </Row>
      ),
    }));

    return (
      <Menu
        onClick={(e) => {
          setVoucher(e.key);
        }}
        items={items}
        className="voucher-menu"></Menu>
    );
  }, [voucherList]);

  // rendering ...
  return (
    <div className="Payment bg-white p-16">
      <h2 className="m-b-8">Tổng tiền</h2>
      <div className="d-flex justify-content-between m-b-6">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Sản phẩm
        </span>
        <b>{helpers.formatProductPrice(tempPrice)}</b>
      </div>
      <div className="d-flex justify-content-between m-b-6">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Giảm giá
        </span>
        <b>{helpers.formatProductPrice(totalDiscount)}</b>
      </div>
      {isCheckout ? (
        <>
          <div className="d-flex justify-content-between m-b-6">
            <span className="font-size-16px" style={{ color: '#aaa' }}>
              Voucher
            </span>
            <div className="flex-grow-1">
              <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomLeft"
                selectable
                arrow>
                <Input
                  value={voucher}
                  placeholder=""
                  size="default"
                  className="w-100px m-l-10"
                  onChange={(e) => {
                    //Chỉ khi bấm nút "x" or nhập tay event này mới đc kích hoạt
                    setVoucher(e.target.value);
                  }}
                  allowClear
                />
              </Dropdown>
            </div>
            <b style={{ color: 'red' }}>
              {voucherDiscountValue !== 0 &&
                `- ${helpers.formatProductPrice(voucherDiscountValue)}`}{' '}
            </b>
          </div>
          <div className="d-flex justify-content-between">
            <span className="font-size-16px" style={{ color: '#aaa' }}>
              Vận chuyển
            </span>
            <b style={{ color: 'red', fontSize: 20 }}>
              {transportFee === null
                ? '--'
                : helpers.formatProductPrice(transportFee)}
            </b>
          </div>
        </>
      ) : (
        ''
      )}

      <div className="d-flex justify-content-between">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Tổng
        </span>
        <b style={{ color: 'red', fontSize: 20 }}>
          {helpers.formatProductPrice(
            tempPrice - totalDiscount - voucherDiscountValue + transportFee
          )}
        </b>
      </div>
      {isCheckout ? (
        <Button
          onClick={onCheckout}
          className="m-t-16 d-block m-lr-auto w-100"
          type="primary"
          size="large"
          loading={isLoading}
          style={{ backgroundColor: '#3555c5', color: '#fff' }}>
          Thanh toán ngay
        </Button>
      ) : (
        <Link to={constants.ROUTES.PAYMENT}>
          <Button
            className="m-t-16 d-block m-lr-auto w-100"
            type="primary"
            size="large"
            style={{ backgroundColor: '#3555c5', color: '#fff' }}>
            Đến trang thanh toán
          </Button>
        </Link>
      )}
    </div>
  );
}

CartPayment.defaultProps = {
  carts: [],
  isCheckout: false, // cờ kiểm tra có phải ở trang checkout để lập đơn hàng hay k
  transportFee: 0,
  isLoading: false,
};

CartPayment.propTypes = {
  carts: PropTypes.array,
  isCheckout: PropTypes.bool,
  transportFee: PropTypes.number,
  onCheckout: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CartPayment;
