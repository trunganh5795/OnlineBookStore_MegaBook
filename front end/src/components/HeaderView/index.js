import {
  BellOutlined,
  MenuOutlined,
  PoweroffOutlined,
  ReconciliationOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import 'ant-design-pro/dist/ant-design-pro.css';
import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import {
  AutoComplete,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
} from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import loginApi from '../../apis/loginApi';
// import defaultAvt from '../../assets/imgs/default-avt.png';
import logoUrl from '../../assets/imgs/logo.png';
import constants from '../../constants/index';
import helpers from '../../helpers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import CartView from './CartView';
import notifyActions from '../../reducers/notifications';
import { useDispatch } from 'react-redux';
import './index.scss';

function totalItemCarts(carts) {
  if (carts) {
    return carts.reduce((total, item) => total + item.amount, 0);
  }
}

function HeaderView() {
  const { isAuth } = useSelector((state) => state.authenticate);
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const carts = useSelector((state) => state.carts);
  const notifications = useSelector((state) => state.notifications);
  const options = helpers.autoSearchOptions();
  const locations = useLocation().pathname;
  const initLink = '/search?keyword=';
  const [linkSearch, setLinkSearch] = useState('');
  const [isMdDevice, setIsMdDevice] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isSmDevice, setIsSmDevice] = useState(false);

  // event: log out
  const onLogout = async () => {
    try {
      const response = await loginApi.postLogout();
      if (response) {
        // if (true) {
        message.success('Đã đăng xuất', 2);

        localStorage.removeItem(constants.REFRESH_TOKEN_KEY);
        localStorage.removeItem('admin');

        window.location.reload();
        // cái lệnh này xem xét lại
      }
    } catch (error) {
      message.error('Xảy ra lỗi', 2);
    }
  };
  const itemNotAuth = [
    {
      label: (<Button size="large" className="w-100" type="primary">
        <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
      </Button>),
      key: 1
    },
    {
      label: (<Link to={constants.ROUTES.SIGNUP}>
        <Button size="large" className="w-100 btn-secondary" type="default">
          Đăng ký
        </Button>
      </Link>),
      key: 2
    }
  ]
  const itemIsAuth = [
    {
      label: (<Button size="large" className="w-100 btn-secondary" type="default">
        <Link to={constants.ROUTES.ACCOUNT + '/'}>
          <UserOutlined className='icon m-r-12' />
          Tài khoản</Link>
      </Button>),
      key: 1
    },
    {
      label: (<Button
        size="large"
        className="w-100 btn-tertiary"
        type="default"
        danger={isAuth}>
        <Link to={constants.ROUTES.ACCOUNT + '/orders'}>
          <ReconciliationOutlined className="icon m-r-12" />
          Đơn hàng</Link>
      </Button>),
      key: 2
    },
    {
      label: (<Button
        onClick={onLogout}
        size="large"
        className="w-100"
        type="primary"
        danger={isAuth}>
        <PoweroffOutlined className="icon m-r-12" />
        Thoát
      </Button>),
      key: 3
    }
  ]
  // event: get event change window width
  useEffect(() => {
    const w = window.innerWidth;
    if (w <= 992) setIsMdDevice(true);
    if (w <= 480) setIsSmDevice(true);
    window.addEventListener('resize', function () {
      const width = window.innerWidth;
      if (width <= 992) {
        setIsMdDevice(true);
      } else {
        setIsMdDevice(false);
      }
      if (width <= 480) setIsSmDevice(true);
      else setIsSmDevice(false);
    });

    return () => {
      // window.removeEventListener('resize');
    };
  }, []);

  // event: close drawer to redirect
  useEffect(() => {
    setDrawerVisible(false);
  }, [locations]);

  // Menu for user action
  const userActionMenu = (
    <Menu className="m-t-24" style={{ width: 244 }} items={isAuth ? itemIsAuth : itemNotAuth}>
    </Menu>
  );

  // rendering...
  return (
    <div
      className="wrap-header container-fluid bg-white w-100vw"
      style={{ height: isSmDevice ? 76 : 104 }}>
      <div className="header container h-100 d-flex justify-content-between align-i-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={logoUrl}
            width={isSmDevice ? 78 : 112}
            height={isSmDevice ? 36 : 48}
          />
        </Link>
        {/* thanh tìm kiếm */}
        <div className="t-right search-bar-wrapper w-100">
          <div className="search-bar pos-relative">
            <AutoComplete
              className="trans-center w-100"
              options={options}
              onChange={(value) =>
                setLinkSearch(helpers.formatQueryString(value))
              }
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              maxLength={200}
            >
              <Input
                disabled
                size={isSmDevice ? 'middle' : 'large'}
                placeholder={!isSmDevice ? 'Bạn muốn tìm gì' : 'Tìm kiếm'}
                onKeyDown={key => {
                  if (key.code === 'Enter') {
                    history.push(linkSearch === '' ? locations : initLink + linkSearch)
                  }
                }}
              />
            </AutoComplete>
            <Button type="primary" size={isSmDevice ? 'middle' : 'large'}>
              <Link to={linkSearch === '' ? locations : initLink + linkSearch}>
                {/* Nếu ô tìm kiếm rỗng mà bấm enter thì reload lại 
                 locations chính là link hiện tại
                 */}
                <SearchOutlined /> {!isSmDevice ? 'Tìm' : ''}
              </Link>
            </Button>
          </div>
        </div>

        {/* Điều hướng giỏ hàng, account , notify */}
        {isMdDevice ? (
          <>
            <Drawer
              title="Menu"
              placement="right"
              closable={true}
              onClose={() => setDrawerVisible(false)}
              maskClosable={true}
              visible={drawerVisible}>
              <ul className="m-0">
                <li className="m-b-18">
                  <Dropdown overlay={userActionMenu} placement="bottomLeft">
                    <Link
                      to={
                        isAuth
                          ? `${constants.ROUTES.ACCOUNT}/`
                          : constants.ROUTES.LOGIN
                      }>
                      {!isAuth ? (
                        <div className="d-flex navbar-tool-item p-l-0">
                          <UserOutlined className="icon m-r-12" />
                          <span className="title">Đăng nhập</span>
                        </div>
                      ) : (
                        <div className="d-flex navbar-tool-item p-l-0">
                          <Avatar src={user.img ? user.img : constants.DEFAULT_USER_AVT} className="m-r-12 w-28px h-28px" />
                          <span className="title">
                            {helpers.reduceProductName(user.name, 12)}
                          </span>
                        </div>
                      )}
                    </Link>
                  </Dropdown>
                </li>
                <li className="m-b-18">
                  <Link
                    className="d-flex navbar-tool-item p-l-0"
                    to={constants.ROUTES.ACCOUNT + '/orders'}>
                    <ReconciliationOutlined className="icon m-r-12" />
                    <span className="title">Đơn hàng</span>
                  </Link>
                </li>

                <li className="m-b-18">
                  <Dropdown
                    overlay={<CartView list={carts} />}
                    placement="bottomLeft"
                    arrow>
                    <Link
                      className="d-flex navbar-tool-item p-l-0"
                      to={constants.ROUTES.CART}>
                      <ShoppingCartOutlined className="icon m-r-12" />
                      <Badge
                        className="pos-absolute"
                        size="default"
                        style={{ color: '#fff' }}
                        count={totalItemCarts(carts)}
                        overflowCount={9}
                        offset={[18, -10]}
                      />
                      <span className="title">Giỏ hàng</span>
                    </Link>
                  </Dropdown>
                </li>
                {isAuth ? "" : (
                  <li className="m-b-18">
                    <Link
                      className="d-flex navbar-tool-item p-l-0"
                      to={constants.ROUTES.SIGNUP}>
                      <ReconciliationOutlined className="icon m-r-12" />
                      <span className="title">Đăng ký</span>
                    </Link>
                  </li>
                )}

              </ul>
            </Drawer>
            <MenuOutlined
              className="menu-icon"
              onClick={() => setDrawerVisible(true)}
            />
          </>
        ) : (
          <ul className="d-flex m-0">
            <li>
              {/* <Link
                className="d-flex flex-direction-column navbar-tool-item p-l-0"
                to={constants.ROUTES.ACCOUNT + '/notifications'}> */}

              <div className="d-flex flex-direction-column navbar-tool-item">
                <NoticeIcon
                  count={notifications.length}
                  // loading
                  bell={<BellOutlined className='icon m-auto' />}
                  locale={{
                    emptyText: 'No notifications',
                    clear: 'Xóa tất cả',
                    viewMore: 'Xem thêm'
                  }}
                  onClear={(e) => dispatch(notifyActions.clearAllNotifications())}
                >
                  <NoticeIcon.Tab
                    list={notifications}
                    // title="notification"
                    emptyText="Bạn không có thông báo mới"
                    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                  />
                </NoticeIcon>
                <span className="title">Thông báo</span>
              </div>
              {/* </Link> */}
            </li>
            <li>
              <Dropdown overlay={userActionMenu} placement="bottomRight">
                <Link
                  to={
                    isAuth
                      ? `${constants.ROUTES.ACCOUNT}/`
                      : constants.ROUTES.LOGIN
                  }>
                  {!isAuth ? (
                    <div className="d-flex flex-direction-column navbar-tool-item">
                      <UserOutlined className="icon" />
                      <span className="title">Đăng nhập</span>
                    </div>
                  ) : (
                    <div className="d-flex flex-direction-column navbar-tool-item">
                      <Avatar src={user.img ? user.img : constants.DEFAULT_USER_AVT} className="m-auto  w-28px h-28px" />
                      <span className="title">
                        {helpers.reduceProductName(user.name, 12)}
                      </span>
                    </div>
                  )}
                </Link>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                overlay={<CartView list={carts} />}
                placement="bottomRight"
                arrow>
                <Link
                  className="d-flex flex-direction-column navbar-tool-item"
                  to={constants.ROUTES.CART}>
                  <ShoppingCartOutlined className="icon" />
                  <Badge
                    className="pos-absolute"
                    size="default"
                    style={{ color: '#fff' }}
                    count={totalItemCarts(carts)}
                    overflowCount={9}
                    offset={[36, -5]}
                  />
                  <span className="title">Giỏ</span>
                </Link>
              </Dropdown>
              {/* <CartView list={carts} /> */}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default HeaderView;
