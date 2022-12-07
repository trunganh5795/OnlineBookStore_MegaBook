import {
  DashboardOutlined,
  EyeOutlined,
  HomeOutlined,
  NotificationOutlined,
  PlusCircleOutlined,
  ReconciliationOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Menu, message } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import defaultAvt from '../../assets/imgs/default-avt.png';
import logoUrl from '../../assets/imgs/logo.png';
import React, { Suspense, useEffect, useState } from 'react';
// import Dashboard from './Dashboard';
import './index.scss';
import Login from './Login';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import GlobalLoading from '../../components/Loading/Global';
import QRcodeDetails from '../QRCodeDetails';
import { useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import Voucher from './Voucher/Voucher';
// import Analysis from './Analysis/Analysis';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
// import DiscountDetails from './DiscountDetails';
import logo from '../../assets/imgs/logo.png';
import { useDispatch } from 'react-redux';
import recombeetoken from '../../reducers/recombeetoken';
import adminApi from '../../apis/adminApi';

const AddProduct = React.lazy(() => import('./ProductPage/ProductAddForm'));
const SeeProduct = React.lazy(() => import('./ProductPage/SeeProduct'));
const CustomerList = React.lazy(() => import('./CustomersList'));
const OrderManagement = React.lazy(() => import('./OrderManagement'));
const DashBoard = React.lazy(() => import('./Dashboard'));
const Discount = React.lazy(() => import('./Discount'));
const Voucher = React.lazy(() => import('./Voucher/Voucher'));
const Analysis = React.lazy(() => import('./Analysis/Analysis'));
const mainColor = '#141428';
const menuList = [
  {
    key: 'd',
    title: 'Tổng quan',
    icon: <DashboardOutlined />,
    link: 'dashboard',
    items: [],
  },
  {
    key: 'p',
    title: 'Sản phẩm',
    icon: <ShoppingCartOutlined />,
    // link:'product',
    items: [
      { key: 'p0', title: 'Xem', icon: <EyeOutlined />, link: 'product/see' },
      {
        key: 'p1',
        title: 'Thêm mới',
        icon: <PlusCircleOutlined />,
        link: 'product/add',
      },
    ],
  },
  {
    key: 'c',
    title: 'Người dùng',
    icon: <UserOutlined />,
    link: 'customers',
    items: [],
  },
  {
    key: 'o',
    title: 'Đơn hàng',
    icon: <ReconciliationOutlined />,
    link: 'orders',
    items: [],
  },
  {
    key: 'm',
    title: 'Khuyến mãi',
    icon: <NotificationOutlined />,
    link: 'marketing/voucher',
    items: [],
    // items: [
    //   { key: 'i0', title: 'Voucher', icon: <PercentageOutlined />, link: 'marketing/voucher' },
    //   { key: 'i1', title: 'Khuyến mãi', icon: <FireOutlined />, link: 'marketing/event' },
    // ],
  },
  {
    key: 'p',
    title: 'Phân tích bàn hàng',
    icon: <RiseOutlined />,
    link: 'productanalytics',
    items: [],
  },
];

function AdminPage() {
  let { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [keyMenu, setKeyMenu] = useState(() => pathname.replace(path, '')[1]);
  const [isLogin, setIsLogin] = useState(() => {
    const isLogin = localStorage.getItem('admin');
    return isLogin ? true : false;
  });
  const [adminName, setAdminName] = useState(() => {
    const admin = localStorage.getItem('admin');
    return admin ? admin : null;
  });
  // fn: Xử lý khi chọn item
  const handleSelected = (e) => {
    const { key } = e;
    setKeyMenu(key);
  };

  // fn: Show Title Selected
  const showTitleSelected = (key) => {
    let result = (
      <div className="path-badge">
        <DashboardOutlined />
        Dashboard
      </div>
    );
    menuList.forEach((item) => {
      if (item.key === key)
        result = (
          <div className="path-badge">
            {item.icon} {item.title}
          </div>
        );
      item.items.forEach((child) => {
        if (child.key === key)
          result = (
            <>
              <div className="path-badge">
                {item.icon} {item.title}
              </div>
              <span> &gt; </span>
              <div className="path-badge">
                {child.icon} {child.title}
              </div>
            </>
          );
      });
    });
    return result;
  };

  // fn: render menu
  const renderMenuItem = () => {
    return menuList.map((item, index) => {
      const { key, title, icon, items, link } = item;
      if (items.length === 0)
        return {
          label: (
            <Link to={`/admin/${link}`} className="menu-item-title">
              {title}
            </Link>
          ),
          key,
          icon,
        };
        // <Menu.Item className="menu-item" key={key} icon={icon}>
      // else render SubMenu
      return {
        label: title,
        key: index,
        icon,
        children: items.map((child, index) => ({
          label: (
            <Link to={`/admin/${child.link}`} className="menu-item-title">
              {' '}
              {child.title}
            </Link>
          ),
          key: child.key,
          icon: child.icon,
        })),
      };
    });
  };
  // event: Login với quyền admin (props > Login)
  const onLogin = (isLogin, name) => {
    if (isLogin) {
      setIsLogin(true);
      setAdminName(name);
      localStorage.setItem('admin', name);
    }
  };

  // event: logout
  const onLogout = () => {
    setIsLogin(false);
    localStorage.removeItem('admin');
  };
  useEffect(() => {
    let getRecombeeToken = async () => {
      try {
        let data = await adminApi.getRecombeeToken();
        if (data.data) {
          dispatch(recombeetoken.saveTokenToStore(data.data.token));
        }
      } catch (error) {
        // console.log(error.response.data);
        message.error(error.response.data.message);
      }
    };
    if (adminName) getRecombeeToken();
    return () => {};
  }, [dispatch, adminName]);

  return (
    <div className="Admin-Page" style={{ backgroundColor: '#e5e5e5' }}>
      {!isLogin ? (
        // Nếu chưa Login => isLogin = false
        <div
          className="trans-center bg-white p-32 bor-rad-8 box-sha-home"
          style={{ top: '38%' }}>
          {/* <div className='d-flex justify-content-center'> */}
          <div className="t-center">
            <img src={logo} alt="" width="100" />
          </div>
          <h2 className="m-b-16 t-center">Mega Book's Dashboard</h2>
          {/* </div> */}
          <p className="m-b-16 t-center">Đăng nhập với quyền Admin / Staff</p>
          <Login onLogin={onLogin} />
        </div>
      ) : (
        <>
          {/* header */}
          <div
            className="d-flex align-i-center"
            style={{ height: '72px', backgroundColor: mainColor }}>
            <div className="logo t-center" style={{ flexBasis: '200px' }}>
              <img width={100} height={48} src={logoUrl} alt="logo" />
            </div>
            <div className="flex-grow-1 d-flex align-i-center">
              <h2 className="t-color-primary flex-grow-1 p-l-44 main-title">
                <span className="option-title">
                  {showTitleSelected(keyMenu)}
                </span>
              </h2>
              <a
                href="/"
                className="open-web p-r-24 t-color-primary font-weight-500 p-b-10">
                <HomeOutlined
                  className="icon font-size-28px t-color-primary m-r-10"
                  style={{ transform: 'translateY(3px)' }}
                />
                <span className="open-web-title">Đi tới trang web</span>
              </a>
              <div className="user-admin p-r-24 t-color-primary font-weight-500">
                <Avatar size={36} className="m-r-10" src={defaultAvt} />
                <span className="user-admin-title">{adminName}</span>
              </div>
              <Button onClick={onLogout} className="m-r-44" type="dashed">
                Thoát
              </Button>
            </div>
          </div>
          {/* main content */}
          <div className="d-flex">
            {/* menu dashboard */}
            <Menu
              theme="dark"
              onClick={handleSelected}
              style={{
                minHeight: '100vh',
                flexBasis: `${window.innerWidth < 400 ? 'unset' : '200px'}`,
              }}
              defaultSelectedKeys={keyMenu}
              inlineCollapsed={window.innerWidth < 400 ? true : false}
              mode="inline"
              items={renderMenuItem()}></Menu>
            {/* main contents */}
            <div className="flex-grow-1">
              <Suspense fallback={<GlobalLoading />}>
                <Switch>
                  <Route path={`${path}/qrcodedetails/:id`} exact>
                    <QRcodeDetails />
                  </Route>
                  <Route path={`${path}/product`}>
                    <Switch>
                      <Route path={`${path}/product/see`} exact>
                        <SeeProduct />
                      </Route>
                      <Route path={`${path}/product/add`} exact>
                        <AddProduct />
                      </Route>
                    </Switch>
                  </Route>
                  <Route path={`${path}/customers`}>
                    <CustomerList />
                  </Route>
                  {/* <Route path={`${path}/users`}>
                    <AdminUser />
                  </Route> */}
                  <Route path={`${path}/orders`}>
                    {/* <OrderList /> */}
                    <OrderManagement />
                  </Route>
                  <Route path={`${path}/marketing`}>
                    <Switch>
                      <Route path={`${path}/marketing/voucher`} exact>
                        <Voucher />
                      </Route>
                      <Route path={`${path}/marketing/event`}>
                        <Switch>
                          {/* <Route path={`${path}/marketing/event/details`}>
                            <DiscountDetails />
                          </Route> */}
                          <Route path={`${path}/marketing/event`} exact>
                            <Discount />
                          </Route>
                        </Switch>
                      </Route>
                    </Switch>
                  </Route>
                  <Route path={`${path}/productanalytics`}>
                    <Analysis />
                  </Route>
                  <Route path={`${path}/`}>
                    <DashBoard />
                  </Route>
                </Switch>
              </Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPage;
