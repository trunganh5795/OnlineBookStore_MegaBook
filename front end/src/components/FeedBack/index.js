import React, { useState } from 'react';
import { Button, Form, message, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import feedbackApi from '../../apis/feedbackApi';
import './index.scss';
export default function FeedBack() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  return (
    <div className="feedback-user">
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}>
        Góp ý <SendOutlined />
      </Button>
      <Modal
        className="modal-pup-up"
        visible={visible}
        title="Gửi góp ý"
        okText="Gửi"
        cancelText="Hủy"
        destroyOnClose={true}
        onCancel={() => {
          form.resetFields();
          setVisible(false);
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              feedbackApi.sendFeedback(values.content, message);
              setTimeout(() => {
                form.resetFields();
                setVisible(false);
              }, 200);
            })
            .catch((info) => {
              // console.log('Xảy ra lỗi', info);
            });
        }}>
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}>
          <Form.Item
            name="content"
            label=""
            rules={[
              {
                required: true,
                message: 'Vui lòng điền nội dung góp ý',
              },
              {
                max: 200,
                message: 'Văn bản phải ít hơn 200 ký tự',
              },
            ]}>
            <TextArea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
