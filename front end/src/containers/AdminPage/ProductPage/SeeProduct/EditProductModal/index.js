import {
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Upload,
  Button,
  DatePicker,
  Switch
} from 'antd';
import {
  UploadOutlined,
} from '@ant-design/icons';
import adminApi from '../../../../../apis/adminApi';
import constants from '../../../../../constants/index';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import Compressor from 'compressorjs';
import imgNotFound from '../../../../../assets/icon/img_notfound.png';
import moment from 'moment';
import './index.scss'
const { RangePicker } = DatePicker;
function EditProductModal(props) {
  const { visible, onClose, product } = props;
  
  const { bookId, code, title, brand, discount, price, instock, category, QRcodeImg, publicOfYear, width, height, publisher, author, img, start_time, end_time, enable_discount } = product ? product : {};
  const [form] = Form.useForm()
  const initValues = {
    bookId, code, title, brand, discount, price, instock, category, publicOfYear, width, height, publisher, author, img,
    time: [start_time ? moment(start_time) : null, end_time ? moment(end_time) : null]
  };
  const [isUpdating, setIsUpdating] = useState(false);
  const [discountStatus, setDiscountStatus] = useState(enable_discount)
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);

  // danh sách hình ảnh sp đã nén
  const fileCompressedList = useRef([]);
  // event: Sửa chữa sản phẩm
  const onCompressFile = async (file, type = 0) => {
    new Compressor(file, {
      quality: constants.COMPRESSION_RADIO,
      convertSize: constants.COMPRESSION_RADIO_PNG,
      success(fileCompressed) {
        const reader = new FileReader();
        reader.readAsDataURL(fileCompressed);
        reader.onloadend = async () => {
          if (type === 0) setAvatar(reader.result);
          else if (fileCompressedList.current.length < 10)
            fileCompressedList.current.push({
              data: reader.result,
              uid: file.uid,
            });
        };
      },
      error(err) {
        message.error('Lỗi: ', err);
      },
    });
  };
  const onEdit = async (value) => {
    try {
      value.time = [value.time[0] ? moment(value.time[0]._d).format('YYYY-MM-DD') : null, value.time[1] ? moment(value.time[1]._d).format('YYYY-MM-DD') : null]
      value.enable_discount = discountStatus
      setIsUpdating(true);
      value.img = avatar;
      
      const response = await adminApi.updateProduct(value);
      if (response && response.status === 200) {
        message.success('Cập nhật thành công');
        closeModal(value);
      }
    } catch (error) {
      
      message.error('Cập nhật thất bại');
    }
    setIsUpdating(false);
  };
  const closeModal = (value = null) => {
    setAvatar(null);
    setAvtFileList([])
    onClose(value);
  }
  useEffect(() => {
    setDiscountStatus(enable_discount)
    form.setFieldsValue(initValues)
  }, [form, product])

  return (
    <Modal
      className="edit-product-modal"
      destroyOnClose={false}
      maskClosable={false}
      visible={visible}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={() => closeModal(null)}
      okButtonProps={{ form: 'editForm', htmlType: 'submit' }}
      title="Cập nhật chi tiết sản phẩm"
      confirmLoading={isUpdating}
      width={1000}
      forceRender
      // forceRender dùng để render trước các children của modal những display = none
      // nếu trong modal có form dùng Form.useForm , thì thêm forceRender để tránh warning
      centered>
      <Form
        initialValues={initValues}
        name="editForm"
        onFinish={(value) => onEdit(value)}
        form={form}
        labelCol={{
          span: 5, md: 6, xl: 6
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Id */}
          <Col span={12}>
            <Form.Item
              name="bookId"
              label="ID"
              rules={[{ required: true, message: 'Không bỏ trống !' }]}
            >
              <Input disabled size="large" placeholder="ID" />
            </Form.Item>
          </Col>
          {/* Mã sản phẩm */}
          <Col span={12}>
            <Form.Item
              name="category"
              label="Loại"
              rules={[{ required: true, message: 'Không bỏ trống !' }]}>
              <Select size="large" placeholder="Category *">
                {constants.CATEGORIES.map((item, index) => (
                  <Select.Option value={item.value} key={index}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Tên sản phẩm */}
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tên"
              rules={[
                { required: true, message: 'required', whitespace: true },
              ]}>
              <Input size="large" placeholder="title *" />
            </Form.Item>
          </Col>

          {/* Giá sản phẩm */}
          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber
                min={0}
                max={9000000000}
                step={1}
                className="w-100"
                size="large"
                placeholder="Giá *"
                addonAfter="VND"
              />
            </Form.Item>
          </Col>

          {/* Author */}
          <Col span={12}>
            <Form.Item
              name="author"
              label="Tác giả"
            // rules={[{ required: true, message: 'Required', whitespace: true }]}
            >
              <Input size="large" placeholder="Tác giả *" />
            </Form.Item>
          </Col>

          {/* Thương hiệu */}
          <Col span={12}>
            <Form.Item
              name="instock"
              label="Kho hàng"
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber
                style={{ width: '100%' }}
                step={1}
                size="large"
                min={0}
                max={100000}
                placeholder="in Stock *"
              />
            </Form.Item>
          </Col>

          {/* Tồn kho */}
          <Col span={12}>
            <Form.Item
              name="publisher"
              label="NXB"
              rules={[
                { whitespace: true, message: "Invalid" },
              ]}>
              <Input size="large" placeholder="Publisher *" />
            </Form.Item>
          </Col>
          {/* Mức giảm giá */}
          {/* <Col span={12}>
            <Form.Item
              name="discount"
              label="Discount"
              rules={[{ required: true, message: 'Required' }]}>
              <InputNumber
                style={{ width: '100%' }}
                step={1}
                size="large"
                min={0}
                max={99}
                placeholder="Discount *"
                addonAfter="%"
              />
            </Form.Item>
          </Col> */}
          {/* <Col span={12}></Col> */}
          <Col span={12}>
            <Form.Item
              name="publicOfYear"
              label="Năm XB"
              rules={[{ required: true, message: 'Bắt buộc' }]}>
              <InputNumber
                style={{ width: '100%' }}
                step={1}
                size="large"
                min={1900}
                max={new Date().getFullYear()}
                placeholder="Năm xuất bản *"
              />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            {/* <Row> */}
            <Form.Item label="Kích thước">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="width"
                    label="Dài"
                    rules={[{ required: true, message: 'Bắt buộc' }]}>
                    <InputNumber
                      style={{ width: '100%' }}
                      step={1}
                      size="large"
                      min={1}
                      // max={100}
                      placeholder="width *"
                      addonAfter="cm"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="height"
                    label="Rộng"
                    rules={[{ required: true, message: 'Required' }]}>
                    <InputNumber
                      style={{ width: '100%' }}
                      step={1}
                      size="large"
                      min={1}
                      // max={100}
                      placeholder="height *"
                      addonAfter="cm"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            {/* </Row> */}
          </Col>
          {/* <Col span={12}></Col> */}
          <Col span={12}>
            <Image
              width={300}
              src={avatar || img}
              fallback={imgNotFound}
            />
            <div className="text-center">
              <Upload
                listType="picture"
                fileList={avtFileList}
                accept="image/png, image/jpeg"
                // showUploadList={true}
                onChange={({ fileList, file }) => {
                  
                  if (avtFileList.length < 1) {
                    setAvtFileList(fileList)
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
                }}
              >
                <Button
                  disabled={avatar ? true : false}
                  className="w-100 h-100 m-t-10"
                  icon={<UploadOutlined />}
                >
                  Upload Avatar
                </Button>
              </Upload>
            </div>
          </Col>
          <Col span={12}>
            <h1>QR code</h1>
            <Image
              // width={200}
              // height={200}
              src={QRcodeImg}
              fallback="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/7QESUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAPYcAlAACkJhZEJyb3RoZXIcAngAxTQwNCBFcnJvciBQYWdlIG9yIEZpbGUgbm90IGZvdW5kIGljb24uIEN1dGUgdXBzZXQgUGFnZSB3aXRoIGZsYWcgNDA0IHN5bWJvbC4gT29wcyBvciBDb25uZWN0aW9uIFByb2JsZW0sIFBhZ2UgZG9lcyBub3QgZXhpc3QgY29uY2VwdC4gRmxhdCBtb2Rlcm4gb3V0bGluZSBpY29uIGNvbmNlcHQsIGlzb2xhdGVkIHZlY3RvciBpbGx1c3RyYXRpb24uHAJuABhHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG//4QDnRXhpZgAASUkqAAgAAAABAA4BAgDFAAAAGgAAAAAAAAA0MDQgRXJyb3IgUGFnZSBvciBGaWxlIG5vdCBmb3VuZCBpY29uLiBDdXRlIHVwc2V0IFBhZ2Ugd2l0aCBmbGFnIDQwNCBzeW1ib2wuIE9vcHMgb3IgQ29ubmVjdGlvbiBQcm9ibGVtLCBQYWdlIGRvZXMgbm90IGV4aXN0IGNvbmNlcHQuIEZsYXQgbW9kZXJuIG91dGxpbmUgaWNvbiBjb25jZXB0LCBpc29sYXRlZCB2ZWN0b3IgaWxsdXN0cmF0aW9uLv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAAAAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0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H+ep6DLovOlG6dDqW+rl63Dr++yG7RHtnO4o7rTvQO/M8Fjw5fFy8f/yjPMZ86f0NPTC9VD13vZt9vv3ivgZ+Kj5OPnH+lf65/t3/Af8mP0p/br+S/7c/23////hBeRodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgcGhvdG9zaG9wOkNyZWRpdD0iR2V0dHkgSW1hZ2VzL2lTdG9ja3Bob3RvIiBHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD0iOTI0OTQ5MjAwIiB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZh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"
            />
          </Col>
          <h2 className='w-100 t-center'>Chương trình khuyến mãi <Switch checked={discountStatus} onChange={() => setDiscountStatus(prev => !prev)} /> </h2>
          <Col span={12}>
            <Form.Item
              name="discount"
              label="Khuyến mãi"
              rules={discountStatus ? [{ required: true, message: 'Bắt buộc' }] : []}
            >
              <InputNumber
                style={{ width: '100%' }}
                step={1}
                size="large"
                min={1}
                max={99}
                placeholder="% giảm giá"
                addonAfter="%"
                disabled={!discountStatus}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="time"
              label="Thời gian"
              rules={discountStatus ? [{ type: 'array', required: true, message: 'Bắt buộc', whitespace:true }] : []}
            >
              <RangePicker
                size='large'
                disabled={!discountStatus}
                format={"DD-MM-YYYY"}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

    </Modal>
  );
}

EditProductModal.propTypes = {
  onClose: PropTypes.func,
  product: PropTypes.object,
  visible: PropTypes.bool,
};

export default EditProductModal;
