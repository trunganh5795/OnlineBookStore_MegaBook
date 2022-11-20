import {
  CompassOutlined,
  NotificationOutlined,
  ReconciliationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Col, Result, Row } from 'antd';
import userLogo from '../../assets/icon/user_32px.png';
import constants from '../../constants/index';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';
import OrderList from './OrderList';
import UpdateAccountForm from './UpdateForm';
import AddressUserList from './UserAddressList';
import NotificationsComponent from './NotificationsComponent';
import helpers from '../../helpers';

function AccountPage() {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  const [activeKey, setActiveKey] = useState(() =>
    pathname.replace(`${constants.ROUTES.ACCOUNT}/`, ''), //lấy mục cuối vị dụ order hay addressess ,...
  );
  // menu list
  const menu = [
    {
      Icon: <UserOutlined className="icon m-r-12 font-size-24px" />,
      title: 'Cá nhân',
      key: '',
    },
    {
      Icon: <ReconciliationOutlined className="icon m-r-12 font-size-24px" />,
      title: 'Đơn hàng',
      key: 'orders',
    },
    {
      Icon: <CompassOutlined className="icon m-r-12 font-size-24px" />,
      title: 'Địa chỉ',
      key: 'addresses',
    },
    {
      Icon: <NotificationOutlined className="icon m-r-12 font-size-24px" />,
      title: 'Thông báo',
      key: 'notifications',
    },
  ];

  // render component with key
  function renderComponent(key = '') {
    switch (key) {
      case '':
        return (
          <>
            <h2 className="m-b-16">Thông tin cá nhân</h2>
            <UpdateAccountForm />
          </>
        );
      case 'orders':
        return (
          <>
            <h2 className="m-b-16">Đơn hàng</h2>
            <OrderList />
          </>
        );
      case 'addresses':
        return (
          <>
            <h2 className="m-b-16">Địa chỉ giao hàng</h2>
            <AddressUserList showAll />
          </>
        );
      case 'notifications':
        return (
          <>
            <h2 className="m-b-16">Thông báo</h2>
            {/* <Result
              icon={<NotificationOutlined />}
              title="You don't have any notifications"
            /> */}
            <NotificationsComponent />
          </>
        );
      default:
        return (
          <>
            <h2 className="m-b-16">Thông tin cá nhân</h2>
            <UpdateAccountForm />
          </>
        )
    }
  }

  // event: lấy lại key khi bấm vào đơn hàng menu
  useEffect(() => {
    if (pathname === `${constants.ROUTES.ACCOUNT}/orders`)
      setActiveKey('orders');
  }, [pathname]);

  // rendering ...
  return (
    <>
      {/* {!isAuth ? ( */}
      {isAuth === false ? (
        <div style={{ minHeight: '82vh' }}>
          <Result
            title="Vui lòng đăng nhập"
            extra={[
              <Button type="primary" key="signup" className="btn-secondary">
                <Link to={constants.ROUTES.SIGNUP}>Đăng ký</Link>
              </Button>,
              <Button type="primary" key="login">
                <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>,
            ]}
          />
        </div>
      ) : (
        <Row className="account-page container m-tb-32">
          <Col className="p-r-16" span={24} md={6}>
            {/* giới thiệu */}
            <div className="d-flex p-b-4 m-b-12 intro">
              <img src={userLogo} width={32} height={32} className="m-r-12" />
              <div>
                <span className="m-b-0 font-size-16px">Tài khoản</span>
                <h3>
                  {/* <b className="name">{user.fullName}</b> */}
                  <b className="name">{user.name}</b>
                  <br />
                  {/* {console.log(user.balance)} */}
                  <b>Số dư :  {helpers.formatProductPrice(user.balance)}</b>
                </h3>
              </div>
            </div>

            {/* menubar */}
            <ul className="account-page-menu m-t-12">
              {menu.map((item, index) => (
                <Link
                  key={index}
                  to={constants.ROUTES.ACCOUNT + '/' + item.key}>
                  <li
                    className={`account-page-menu-item p-b-20 ${item.key === activeKey ? 'active' : ''
                      }`}
                    onClick={() => setActiveKey(item.key)}>
                    {item.Icon}
                    <span className="font-size-16px">{item.title}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </Col>
          <Col className="p-lr-8" span={24} md={18}>
            {renderComponent(activeKey)}
          </Col>
        </Row>
      )}
    </>
  );
}

export default AccountPage;
