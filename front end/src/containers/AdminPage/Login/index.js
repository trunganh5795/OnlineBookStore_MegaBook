import PropTypes from 'prop-types';
import React from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import adminApi from '../../../apis/adminApi';

function Login(props) {
  const { onLogin } = props;

  const onFinish = async (account) => {
    try {
      const response = await adminApi.postLogin(account);
      if (response.data) {
        message.success('Đăng nhập thành công', 2);
        onLogin(true, response.data.name);
      }
    } catch (error) {
      message.error(error.response.data, 2);
      onLogin(false);
    }
  };

  return (
    <Form name="form" onFinish={onFinish}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Username"
            name="userName"
            rules={[{ required: true, message: 'Nhập tài khoản' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Button
              size="large"
              className="w-100 m-t-8"
              htmlType="submit"
              type="primary">
              Log in
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;
