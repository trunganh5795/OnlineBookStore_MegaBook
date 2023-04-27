//commons css
import 'antd/dist/antd.css';
import '../../commons/utils/index.scss';
import FooterView from '../../components/FooterView';
import HeaderView from '../../components/HeaderView';
import GlobalLoading from '../../components/Loading/Global';
// import NotFound from '../../components/NotFound';
import ScrollTo from '../../components/ScrollTo';
//configuration
import '../../configs/message.config';
import routesConfig from '../../configs/routesConfig';
//React
import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import authActions from '../../reducers/auth';
import userActions from '../../reducers/user';
import notifyActions from '../../reducers/notifications';
import QRcodeDetails from '../QRCodeDetails';
import uniqid from 'uniqid';
import { io } from 'socket.io-client';
import { message } from 'antd';
// import FeedBack from '../../components/FeedBack';
import ChatBox from '../../components/ChatBot';
const NotFound = React.lazy(() => import('../../components/NotFound'));
if (!localStorage.getItem('tkre_id')) {
  localStorage.setItem('tkre_id', `${uniqid()}${new Date().getTime()}`);
}
if (!sessionStorage.getItem('session_id')) {
  sessionStorage.setItem('session_id', `${uniqid()}${new Date().getTime()}`);
}
window.addEventListener('offline', () => {
  message.error('Kết nối internet bị ngắt');
});
function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  const { renderRoutes, routes, adminRoutes } = routesConfig;

  useEffect(() => {
    //authentication
    console.log('herererere');
    dispatch(authActions.getIsAuth());
    return () => {};
  }, []);

  useEffect(() => {
    //get user -> store redux
    //userActions.getUserRequest() ==> get thông tin user về để dispatch store->user
    let socket = null;
    if (isAuth) {
      dispatch(userActions.getUserRequest());
      const env = process.env.NODE_ENV;
      socket = io(
        !env || env === 'development'
          ? process.env.REACT_APP_API_URL_LOCAL
          : process.env.REACT_APP_API_URL,
        {
          withCredentials: true,
        },
      );
      socket.on('connect', () => {
        socket.on('test', (msg) => {
          dispatch(notifyActions.pushNotificationsAction(msg));
        });
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [isAuth]);

  //rendering...
  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoading />}>
        <div className="App" id="app">
          <HeaderView />
          <div
            style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 999 }}>
            <ScrollTo />
            {/* <FeedBack /> */}
            <Suspense fallback={''}>
              {window.innerWidth < 768 ? '' : <ChatBox />}
            </Suspense>
          </div>

          <Switch>
            {/* Admin Page */}
            <Route path={'/admin'}>{renderRoutes(adminRoutes)}</Route>
            {/* Qr code */}
            <Route path={'/qrcode/:id'} exact>
              <QRcodeDetails />
            </Route>
            {/* Client Page */}
            <Route path={'/'}>
              {/* <Suspense fallback={<div>Loading......</div>}> */}
              <Switch>
                {renderRoutes(routes)}
                <Route>
                  <NotFound />
                </Route>
              </Switch>
              {/* </Suspense> */}
              <FooterView />
            </Route>
          </Switch>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
