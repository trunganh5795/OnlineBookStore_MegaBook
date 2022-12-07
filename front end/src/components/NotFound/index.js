import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Result
      style={{ minHeight: '85vh' }}
      status="404"
      title="404 - Không tìm thấy"
      subTitle="Không tìm thấy"
      extra={
        <>
          <Link to="/">
            <Button type="primary" size="large">
              <HomeOutlined /> Quay lại trang chủ
            </Button>
          </Link>
        </>
      }
    />
  );
}

export default NotFound;
