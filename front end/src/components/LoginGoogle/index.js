import { message } from 'antd';
import loginApi from '../../apis/loginApi';
import ggIcon from '../../assets/icon/gg-icon.png';
import constants from '../../constants/index';
import PropTypes from 'prop-types';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import authReducers from '../../reducers/auth';
import './index.scss';

function LoginGoogle(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  // xử lý khi đăng nhập thành công
  const onLoginSuccess = async (data) => {
    try {
      message.success('Đăng nhập thành công');
      // lưu refresh token vào local storage
      localStorage.setItem(constants.REFRESH_TOKEN, data.refreshToken);
      // Note: Lưu jwt vào localStorage nếu deploy heroku
      // if (process.env.NODE_ENV === 'production')
      //   localStorage.setItem(constants.ACCESS_TOKEN_KEY, data.token);
      dispatch(authReducers.setIsAuth(true));
      setTimeout(() => {
        history.action !== 'POP' ? history.goBack() : history.push('/');
      }, constants.DELAY_TIME);
    } catch (error) {
      message.error('Lỗi đăng nhập.');
    }
  };

  // login with Google
  const onLoginWithGoogle = async (res) => {
    try {
      const { accessToken } = res;
      const response = await loginApi.postLoginWithGoogle({
        access_token: accessToken,
      });
      const { status, data } = response;
      //login success -> redirect home
      if (status === 200) {
        onLoginSuccess(data);
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Xảy ra lỗi vui lòng thử lại');
      }
    }
  };

  return (
    <>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        // buttonText="Log in with Google"
        render={(renderProps) => (
          <div
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className={`login-gg m-0-auto login-with gg login-input`}>
            <img src={ggIcon} className="login-with__icon " alt="google-icon" />
            <span className="login-with__title">{props.title}</span>
          </div>
        )}
        onSuccess={onLoginWithGoogle}
        onFailure={onLoginWithGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </>
  );
}

LoginGoogle.defaultProps = {
  title: 'Google+',
  className: '',
};

LoginGoogle.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default LoginGoogle;
