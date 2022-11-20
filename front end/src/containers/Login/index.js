import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Col, message, Row, Tooltip } from 'antd';
import loginApi from '../../apis/loginApi';
import InputField from '../../components/Custom/Field/InputField';
import LoginGoogle from '../../components/LoginGoogle';
import constants from '../../constants/index';
import { FastField, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import authReducers from '../../reducers/auth';
import * as Yup from 'yup';
import './index.scss';

function Login() {
  const history = useHistory();
  const windowWidth = window.screen.width;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  const dispatch = useDispatch();

  // fn: xử lý khi đăng nhập thành công
  const onLoginSuccess = async (data) => {
    try {
      // setIsSubmitting(false);
      message.success('Đăng nhập thành công');
      // lưu refresh token vào local storage
      localStorage.setItem(constants.REFRESH_TOKEN, data.refreshToken);
      dispatch(authReducers.setIsAuth(true));

    } catch (error) {
      message.error('Đăng nhập thất bại, \n có lỗi');
    }
  };  
  // fn: đăng nhập
  const onLogin = async (account) => {
    try {
      setIsSubmitting(true);
      const result = await loginApi.postLogin({ account });
      if (result.status === 200) {
        onLoginSuccess(result.data);
      }
    } catch (error) {
      setIsSubmitting(false);
      message.error(error.response.data.message);
    }
  };
  // giá trị khởi tạo cho formik
  const initialValue = {
    email: '',
    password: '',
    keepLogin: false,
  };

  // validate form trước submit với yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required('* Vui lòng nhập email')
      .email('* Email không hợp lệ!'),
    password: Yup.string()
      .trim()
      .required('* Nhập mật khẩu'),
  });

  //return...
  return (
    <div className="Login container m-t-50">
      {isAuth ? (history.action !== 'POP' ? history.goBack(): history.push('/')) :
        (
          <Formik
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={onLogin}>
            {(formikProps) => {
              const suffixColor = 'rgba(0, 0, 0, 0.25)';
              return (
                <Form className="bg-form">
                  <Row
                    className="input-border"
                    gutter={[40, 24]}
                    justify="center"
                    style={{ marginRight: 0, marginLeft: 0 }}
                  >
                    {/* Form thông tin đăng nhập */}
                    <Col span={24} className="m-t-20">
                      <FastField
                        name="email"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Email *"
                        size="large"
                        suffix={
                          <Tooltip title="Email">
                            <InfoCircleOutlined
                              style={{
                                color: suffixColor,
                              }}
                            />
                          </Tooltip>
                        }
                      />
                    </Col>
                    <Col span={24}>
                      <FastField
                        name="password"
                        component={InputField}
                        className="input-form-common"
                        type="password"
                        placeholder="Mật khẩu *"
                        size="large"
                        autocomplete="on"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Col>
                    {/* Button submit */}
                    <Col className="p-t-8 p-b-0 t-center" span={24}>
                      <Button
                        className="Login-submit-btn w-100"
                        size="large"
                        type="primary"
                        htmlType="submit"
                        // disabled={isDisableLogin}
                        loading={isSubmitting}>
                        Đăng nhập
                      </Button>
                    </Col>
                    <Col span={24} className="p-t-0 t-center">
                      <div className="or-option" style={{ color: '#acacac' }}>
                        Đăng nhập với
                      </div>
                      <LoginGoogle
                        title={windowWidth > 375 ? 'Đăng nhập bằng Gmail' : 'Gmail'}
                      />
                      <div className="m-t-20 m-b-20 font-weight-500">
                        Chưa có tài khoản?
                        <Link to={constants.ROUTES.SIGNUP}>&nbsp;Tạo tài khoản</Link>
                      </div>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        )}
    </div>
  );
}

export default Login;
