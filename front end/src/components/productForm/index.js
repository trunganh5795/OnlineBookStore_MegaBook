import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import React from 'react';
import constants from '../../constants';
const { Option } = Select;
export default function ProductForm(props) {
  const {
    form,
    message,
    setAvatar,
    avatar,
    avtFileList,
    setAvtFileList,
    onValBeforeSubmit,
    onCompressFile,
    onResetForm,
    isSubmitting,
  } = props;
  return (
    <Form
      name="form"
      form={form}
      onFinish={onValBeforeSubmit}
      onFinishFailed={() => message.error('Error. Please check again !')}
      labelCol={{
        span: 5,
        md: 6,
        xl: 3,
      }}
      wrapperCol={{
        span: 19,
        md: 18,
        xl: 21,
      }}>
      <Row>
        <Col span={24} md={8} xl={6} xxl={4}>
          <Row className="flex-direction-column justify-content-end h-100 thumbnail-upload">
            {avatar ? (
              <img src={avatar} alt="product thumbnail" width="100%" />
            ) : (
              ''
            )}
            <Upload
              listType="picture"
              fileList={avtFileList}
              accept="image/png, image/jpeg"
              // showUploadList={true}
              onChange={({ fileList, file }) => {
                if (avtFileList.length < 1) {
                  setAvtFileList(fileList);
                  setAvatar(URL.createObjectURL(file));
                }
              }}
              onRemove={() => {
                setAvatar(null);
                setAvtFileList([]);
              }}
              beforeUpload={(file) => {
                onCompressFile(file, 0);
                return false;
              }}>
              <Button
                disabled={avatar !== null ? true : false}
                className="w-100 h-100"
                icon={<UploadOutlined />}>
                Upload Avatar
              </Button>
            </Upload>
          </Row>
        </Col>
        <Col span={24} md={14} xl={16} xxl={18}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Required', whitespace: true }]}
            label="Title"
            className="m-b-24">
            <Input
              size="large"
              placeholder="Product title *"
              suffix={
                <Tooltip title="Book title">
                  <InfoCircleOutlined style={{ color: 'blue' }} />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            name="category"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please select one of these options!',
              },
            ]}
            label="Category"
            className="m-b-24">
            <Select placeholder="Please choose one" size="large">
              {constants.CATEGORIES.map((item, index) => {
                return (
                  <Option value={item.value} key={index}>
                    {item.title}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            rules={[{ required: true, message: 'Required' }]}
            label="Price"
            className="m-b-24">
            <InputNumber
              style={{ width: '100%' }}
              step={10000}
              size="large"
              placeholder="Price *"
              min={0}
              max={1000000000}
              formatter={(value) => `$ ${value}`}
              addonAfter="USD"
            />
          </Form.Item>
          {/* </Col> */}
          {/* số hang tồn kho */}
          {/* <Col span={20} md={20} xl={20} xxl={20}> */}
          <Form.Item
            name="instock"
            rules={[{ required: true, message: 'Required' }]}
            label="In stock"
            className="m-b-24">
            <InputNumber
              style={{ width: '100%' }}
              step={5}
              size="large"
              min={0}
              max={100000}
              placeholder="In stock *"
            />
          </Form.Item>
          {/* </Col> */}
          {/* thương hiệu */}
          {/* <Col span={20} md={20} xl={20} xxl={20}> */}
          <Form.Item
            name="author"
            rules={[{ required: true, message: 'Required', whitespace: true }]}
            label="Author"
            className="m-b-24">
            <Input
              size="large"
              placeholder="Author *"
              suffix={
                <Tooltip title="Apple">
                  <InfoCircleOutlined style={{ color: 'blue' }} />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            name="publisher"
            rules={[{ required: true, message: 'Required', whitespace: true }]}
            label="Publisher"
            className="m-b-24">
            <Input
              size="large"
              placeholder="Publisher"
              suffix={
                <Tooltip title="Apple">
                  <InfoCircleOutlined style={{ color: 'blue' }} />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            name="publicOfYear"
            rules={[
              { required: true, message: 'Required' },
              { type: 'number', min: 1950, max: new Date().getFullYear() },
            ]}
            label="Public Of Year"
            className="m-b-24">
            <InputNumber
              style={{ width: '100%' }}
              step={5}
              size="large"
              min={1950}
              max={new Date().getFullYear()}
              placeholder="Public Of Year *"
            />
          </Form.Item>
          <Form.Item
            name="discount"
            rules={[
              { required: true, message: 'Required' },
              { type: 'number', min: 0, max: 99 },
            ]}
            label="Discount"
            className="m-b-24"
            initialValue={0}>
            <InputNumber
              style={{ width: '100%' }}
              step={10}
              size="large"
              min={0}
              max={99}
              placeholder="Discount (%) *"
            />
          </Form.Item>
          <Form.Item label="Size">
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item
                  name="width"
                  rules={[{ required: true, message: 'Required' }]}
                  className="m-b-24">
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10}
                    size="large"
                    min={0}
                    placeholder="Width (cm) *"
                    addonAfter="cm"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="height"
                  rules={[{ required: true, message: 'Required' }]}
                  className="m-b-24">
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10}
                    size="large"
                    min={0}
                    placeholder="Height (cm) *"
                    addonAfter="cm"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Button
          className="m-r-20"
          size="large"
          danger
          type="primary"
          onClick={onResetForm}>
          Reset Form
        </Button>
        <Button
          loading={isSubmitting}
          size="large"
          type="primary"
          htmlType="submit">
          Add new product
        </Button>
      </Row>
    </Form>
  );
}
