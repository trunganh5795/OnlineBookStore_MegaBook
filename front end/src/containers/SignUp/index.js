//=== Sign Up Page
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Col, message, Row, Tooltip } from 'antd';
import accountApi from '../../apis/accountApi';
import DatePickerField from '../../components/Custom/Field/DatePickerField';
import InputField from '../../components/Custom/Field/InputField';
import SelectField from '../../components/Custom/Field/SelectField';
import Delay from '../../components/Delay';
import LoginGoogle from '../../components/LoginGoogle';
import constants from '../../constants/index';
import { FastField, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import './index.scss';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
const suffixColor = 'rgba(0, 0, 0, 0.25)';
function SignUp() {
  const windowWidth = window.screen.width;
  const history = useHistory()
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  // const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectLogin, setIsRedirectLogin] = useState(false);
  const [sendCodeState, setSendCodeState] = useState(false)
  // ref kiểm tra đã nhập email hay chưa, hỗ trợ việc gửi mã xác nhận
  const emailRef = useRef('');

  // fn: gửi mã xác nhận
  // const verifyAccount = async () => {
  //   try {
  //     // kiểm tra email
  //     const email = emailRef.current;
  //     const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  //     if (!regex.test(email)) {
  //       message.error('Email không hợp lệ !');
  //       return;
  //     }
  //     // set loading, tránh việc gửi liên tục
  //     setIsSending(true);

  //     // tiến hành gửi mã
  //     const result = await accountApi.postSendVerifyCode({ email });
  //     if (result.status === 200) {
  //       message.success('Gửi thành công, kiểm tra email');
  //       setIsSending(false);
  //     }
  //   } catch (error) {
  //     setIsSending(false);
  //     if (error.response) {
  //       message.error(error.response.data.message);
  //     } else {
  //       message.error('Gửi thất bại, thử lại');
  //     }
  //   }
  // };

  // fn: xử lý đăng ký
  const onSignUp = async (account) => {
    setSendCodeState(true)
    try {
      setIsSubmitting(true);
      const result = await accountApi.postSignUp({ account });
      if (result.status === 200) {
        message.success('Đăng ký thành công.', 1);
        setIsSubmitting(false);
        setIsRedirectLogin(true);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Đăng ký thất bại, thử lại');
      }
    }
  };

  // giá trị khởi tạo cho formik
  const initialValue = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    gender: undefined,
    dateOfBirth:''
  };

  // validate form trước submit với yup
  const validationCode = Yup.object().shape({
    code: Yup.string().required('Vui lòng nhập mã xác thực').max(6, 'Mã xác thực không hợp lệ').min(6, 'Mã xác thực không hợp lệ').matches(
      /^\d+$/,
      'Mã code phải là số',
    )
  })
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .required('* Email bạn là gì ?')
      .email('* Email không hợp lệ !'),
    name: Yup.string()
      .trim()
      .required('* Tên bạn là gì ?')
      .matches(
        /[^~!@#%\^&\*()_\+-=\|\\,\.\/\[\]{}'"`]/,
        '* Không được chứa ký tự đặc biệt',
      )
      .max(70, '* Tối đa 70 ký tự'),
    password: Yup.string()
      .trim()
      .required('* Vui lòng nhập mật khẩu')
      .min(6, '* Mật khẩu phải từ 6-20 ký tự')
      .max(20, '* Mật khẩu phải từ 6-20 ký tự')
      .matches(
        /^(?=.*[A-Z])(?=.*[~!@#%\^&\*()_\+-=\|\\,\.\/\[\]{}'"`])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
        'Mật khẩu phải bao gồm chữ hoa, chữ thường, số, ký tự đặc biệt',

      ),
    confirmPassword: Yup.string().required('Vui lòng nhập lại mật khẩu').oneOf(
      [Yup.ref('password'), null],
      '* Mật khẩu không trùng khớp',
    ),
    dateOfBirth: Yup.date()
      .required('Nhập ngày sinh')
      .min(new Date(1900, 1, 1), '* Năm sinh từ 1900')
      .max(
        new Date(new Date().getFullYear() - parseInt(constants.MIN_AGE), 1, 1),
        `* Tuổi tối thiểu là ${constants.MIN_AGE}`,
      ),
    gender: Yup.string().required("Giới tính của bạn* ").equals(['male',"female"],'Không hợp lệ'),
  });
  // return...
  return (
    <div className="SignUp container">
      {/*// Note: chuyển đến trang login khi đăng ký thành công */}
      {isRedirectLogin && (
        <Delay wait={constants.DELAY_TIME}>
          <Redirect to={constants.ROUTES.LOGIN} />
        </Delay>
      )}
      {isAuth && (<>
        {history.goBack()}
      </>
      )}
      <h1 className="SignUp-title underline-title m-b-20 m-t-20">
        <b>Đăng ký</b>
      </h1>
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={onSignUp}>
          {(formikProps) => {
            emailRef.current = formikProps.values.email;
            return (
              <Form className="bg-form">
                <Row
                  className="input-border m-0 p-tb-20"
                  gutter={[16, 32]}
                  >
                  {/* Form thông tin đăng ký */}
                  <Col className="p-b-0" span={24} md={12}>
                    <Row gutter={[8, 16]} className="justify-content-center">
                      <h2>Thông tin tài khoản</h2>
                      <Col span={24}>
                        {/* email field */}
                        <FastField
                          name="email"
                          component={InputField}
                          className="input-form-common"
                          placeholder="Email *"
                          size="large"
                          suffix={
                            <Tooltip title="Email của bạn">
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
                        {/* password field */}
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
                      <Col span={24}>
                        {/* confirm password field */}
                        <FastField
                          name="confirmPassword"
                          component={InputField}
                          className="input-form-common"
                          type="password"
                          placeholder="Nhập lại mật khẩu *"
                          size="large"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Col>
                    </Row>
                  </Col>

                  {/* Form thông tin chi tiết */}
                  <Col className="p-b-0" span={24} md={12}>
                    <Row gutter={[0, 16]}>
                      <h2>Thông tin cá nhân</h2>
                      <Col span={24}>
                        {/* full name filed */}
                        <FastField
                          name="name"
                          component={InputField}
                          className="input-form-common"
                          placeholder="Họ tên *"
                          size="large"
                          suffix={
                            <Tooltip title="Họ & tên">
                              <InfoCircleOutlined
                                style={{ color: suffixColor }}
                              />
                            </Tooltip>
                          }
                        />
                      </Col>
                      <Col span={24}>
                        {/* dateOfBirth field */}
                        <FastField
                          className="input-form-common"
                          name="dateOfBirth"
                          component={DatePickerField}
                          placeholder="Ngày sinh"
                          size="large"
                        />
                      </Col>
                      <Col span={24}>
                        {/* gender field */}
                        <FastField
                          className="input-form-common gender-field"
                          size="large"
                          name="gender"
                          component={SelectField}
                          placeholder="Giới tính *"
                          options={constants.GENDER_OPTIONS}
                        />
                      </Col>
                    </Row>
                  </Col>
                  {/* Button submit */}
                  <Col className="p-t-8 p-b-0 t-center" span={24}>
                    <Button
                      className="SignUp-submit-btn w-100"
                      size="large"
                      type="primary"
                      htmlType="submit"
                      loading={isSubmitting}>
                      Đăng ký
                    </Button>
                  </Col>
                  <Col span={24} className="p-t-0 t-center">
                    <div className="or-option" style={{ color: '#acacac' }}>
                      Đăng nhập với
                    </div>
                    <LoginGoogle
                      className="login-gg m-0-auto login-gg"
                      title={windowWidth > 375 ? 'Đăng nhập với Gmail' : 'Gmail'}
                    />
                    <div className="m-t-10 font-weight-500">
                      Đã có tài khoản
                      <Link to={constants.ROUTES.LOGIN}>&nbsp;Đăng nhập</Link>
                    </div>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      {/* )} */}

    </div>
  );
}

export default SignUp;
