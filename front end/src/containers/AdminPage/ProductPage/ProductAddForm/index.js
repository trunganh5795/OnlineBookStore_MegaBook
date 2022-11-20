import {
  EditOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import adminApi from '../../../../apis/adminApi';
import Compressor from 'compressorjs';
import constants from '../../../../constants/index';
import React, { useRef, useState } from 'react';
import '../index.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const suffixColor = '#aaa';
const { Option } = Select;
function AddProduct({ defaultImg, title, edit, children, initialValues, BookId }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDisabled, setFormDisabled] = useState(edit)
  const [desc, setDesc] = useState('');
  // const productDecs = useRef(null);
  // avt file chưa nén
  const [avtFileList, setAvtFileList] = useState([]);
  // avt đã nén
  const [avatar, setAvatar] = useState(null);
  // danh sách hình ảnh sp chưa nén
  const [fileList, setFileList] = useState([]);
  // danh sách hình ảnh sp đã nén
  const fileCompressedList = useRef([]);

  // fn: xử lý khi chọn loại sản phẩm
  // const onProductTypeChange = (value) => {
  //   if (!isTypeSelected) setIsTypeSelected(true);
  //   setTypeSelected(value);
  // };

  // fn: nén ảnh sản phẩm, type: 0 - avt, type: 1 - picture List
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

  // fn: lấy bài viết mô tả sp
  // const onGetDetailDesc = (data) => {
  //   productDecs.current = data;
  // };

  // fn: Reset form
  const onResetForm = () => {
    form.resetFields();
    fileCompressedList.current = [];
    setAvtFileList([]);
    setAvatar(null);
    setFileList([]);
  };

  // fn: kiểm tra hình ảnh, bài viết trước submit form
  const onValBeforeSubmit = async (data) => {
    try {
      if (!defaultImg && !avatar) {
        message.error('Vui lòng thêm ảnh sản phẩm !', 2);
        return;
      }
      // cảnh báo khi không có bài viết mô tả
      if (!desc)
        Modal.confirm({
          title: 'Bạn có chắc muốn thêm chứ ?',
          content: 'Sản phẩm chưa có mô tả',
          icon: <ExclamationCircleOutlined />,
          okButtonProps: true,
          onCancel() {
            return;
          },
          onOk() {
            onSubmit(data);
          },
        });
      // else if (!edit && fileCompressedList.current.length === 0)
      //   Modal.confirm({
      //     title: 'Bạn có chắc muốn thêm chứ ?',
      //     content: 'Chưa có HÌNH ẢNH MÔ TẢ cho sản phẩm này !',
      //     icon: <ExclamationCircleOutlined />,
      //     okButtonProps: true,
      //     onCancel() {
      //       return;
      //     },
      //     onOk() {
      //       onSubmit(data);
      //     },
      //   });
      else {
        data.desc = desc
        onSubmit(data);
      }
    } catch (error) {
      message.error('Có lỗi. Thử lại !');
    }
  };

  // fn: Xử lý submit form
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const {
        title,
        price,
        sku,
        instock,
        description,
        category,
        width,
        height,
        author,
        publisher,
        publicOfYear,
        desc,
        ...rest
      } = data;
      // các thuộc tính chung của sản phẩm
      const product = {
        category,
        sku,
        title,
        price,
        instock,
        description,
        avatar,
        width,
        height,
        author,
        publisher,
        publicOfYear,
        desc
      };
      // 
      // thuộc tính chi tiết của từng loại sp
      const catalogs = fileCompressedList.current.map((item) => item.data);
      const details = {
        ...rest,
        catalogs,
      };
      // data được gửi đi
      // const dataSend = { product, details, desc: productDecs.current };\
      let response = {};
      if (edit) {
        // phần edit cho qrcode
        response = await adminApi.updateProduct({ ...product, BookId });
      } else {
        response = await adminApi.postAddProduct({ product });
        // Phần thêm sản phẩm
      }

      if (response.status === 200) {
        setIsSubmitting(false);
        message.success('Thêm thành công');
        if (!edit) {
          //Nếu đang ở trang QRcode thì ko reset form , vì đang ở chế độ edit
          onResetForm()
          setDesc("")
        }

      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Fail. Please try again');
      }
    }
  };

  // returning...
  return (
    <div className="Admin-Product-Page">
      <h1 className="t-center p-t-20">
        <b>{title}</b>
      </h1>
      {true && (
        <div className="p-20">
          <Form
            name="form"
            form={form}
            onFinish={onValBeforeSubmit}
            onFinishFailed={() => message.error('Xảy ra lỗi!')}
            labelCol={{
              span: 5, md: 6, xl: 3
            }}
            wrapperCol={{
              span: 19, md: 18, xl: 21
            }}
            initialValues={initialValues}
          >
            {/* { */}
            <Row>
              <Col span={24} md={8} xl={6} xxl={4}>
                <Row className='flex-direction-column h-100 thumbnail-upload'>
                  {defaultImg || avatar ? (
                    <img src={avatar || defaultImg} alt="product thumbnail" width="100%" />
                  ) : ""}
                  <Upload
                    listType="picture"
                    fileList={avtFileList}
                    accept="image/png, image/jpeg"
                    // showUploadList={true}
                    onChange={({ fileList, file }) => {
                      // 
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
                      disabled={avatar || formDisabled ? true : false}
                      className="w-100 h-100"
                      icon={<UploadOutlined />}>
                      Thêm ảnh
                    </Button>
                  </Upload>
                  {children}
                </Row>
              </Col>
              <Col span={24} md={14} xl={16} xxl={18}>
                <Form.Item
                  name="title"
                  rules={[
                    { required: true, message: 'Vui lòng không bỏ trống', whitespace: true },
                  ]}
                  label="Tiêu đề"
                  className='m-b-10'
                >
                  <Input
                    size="large"
                    placeholder="Tên sản phẩm *"
                    suffix={
                      <Tooltip title="Tên sản phẩm">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                    disabled={formDisabled ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  name="category"
                  hasFeedback
                  rules={[
                    { required: true, message: 'Vui lòng chọn thể loại sách' },
                  ]}
                  label="Thể loại"
                  className='m-b-10'
                >
                  <Select
                    placeholder="Chọn một mục"
                    size="large"
                    disabled={formDisabled ? true : false}
                  >
                    {constants.CATEGORIES.map((item, index) => {
                      return (<Option value={item.value} key={index}>{item.title}</Option>)
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                  label="Giá"
                  className='m-b-10'
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10000}
                    size="large"
                    placeholder="Giá *"
                    min={0}
                    max={1000000000}
                    formatter={value => `${value}`}
                    addonAfter="VND"
                    disabled={formDisabled ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  name="instock"
                  rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                  label="Kho"
                  className='m-b-10'
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    step={5}
                    size="large"
                    min={0}
                    max={100000}
                    placeholder="Sản phẩm trong kho *"
                    disabled={formDisabled ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  name="author"
                  rules={[
                    { required: true, message: 'Vui lòng không bỏ trống', whitespace: true },
                  ]}
                  label="Tác giả"
                  className='m-b-10'
                >
                  <Input
                    size="large"
                    placeholder="Tác giả *"
                    suffix={
                      <Tooltip title="Tác giả">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                    disabled={formDisabled ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  name="publisher"
                  // rules={[
                  //   { required: true, message: 'Vui lòng không bỏ trống', whitespace: true },
                  // ]}
                  label="NXB"
                  className='m-b-10'
                  disabled={formDisabled ? true : false}
                >
                  <Input
                    size="large"
                    placeholder="Nhà xuất bản"
                    disabled={formDisabled ? true : false}
                    suffix={
                      <Tooltip title="Nhà xuất bản">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="publicOfYear"
                  rules={[
                    { required: true, message: 'Vui lòng không bỏ trống' },
                    { type: 'number', min: 1950, max: new Date().getFullYear() }
                  ]}
                  label="Năm Xuất Bản"
                  className='m-b-10'
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    step={5}
                    size="large"
                    min={1950}
                    max={new Date().getFullYear()}
                    placeholder="Năm Xuất Bản *"
                    disabled={formDisabled ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  name="sku"
                  rules={[
                    { required: true, message: 'Vui lòng không bỏ trống' },
                    // { type: 'number', min: 0, max: 99 , message:'Test Message' }
                  ]}
                  label="sku"
                  className='m-b-10'
                // initialValue={edit ? null : 0}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    step={10}
                    size="large"
                    min={0}
                    // max={99}
                    placeholder="SKU *"
                    disabled={formDisabled ? true : false}
                  />
                </Form.Item>
                <Form.Item label="Kích thước">
                  <Row gutter={8}>
                    <Col span={6}>
                      <Form.Item
                        name="width"
                        rules={[
                          { required: true, message: 'Vui lòng không bỏ trống' },
                        ]}
                        className='m-b-10'
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          step={10}
                          size="large"
                          min={0}
                          placeholder="Dài (cm) *"
                          addonAfter="cm"
                          disabled={formDisabled ? true : false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="height"
                        rules={[
                          { required: true, message: 'Vui lòng không bỏ trống' },
                        ]}
                        className='m-b-10'
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          step={10}
                          size="large"
                          min={0}
                          placeholder="Rộng (cm) *"
                          addonAfter="cm"
                          disabled={formDisabled ? true : false}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  className='m-b-10'
                >
                  <ReactQuill
                    bounds={'#root'}
                    theme="snow"
                    value={desc}
                    onChange={setDesc} />
                </Form.Item>
              </Col>
            </Row>
            <Row className='justify-content-center'>
              {formDisabled ? <Button className="m-r-20"
                size="large"
                icon={<EditOutlined />}
                type="primary"
                onClick={() => {
                  setFormDisabled(false)
                }}>
                Chỉnh sửa
              </Button> : (
                <>
                  <Button
                    loading={isSubmitting}
                    className="m-r-20"
                    size="large"
                    danger
                    type="primary"
                    onClick={onResetForm}
                    key={12}
                  //Thêm key đại 1 số nào để tránh trùng button phía trên
                  >
                    Nhập lại
                  </Button>
                  <Button
                    loading={isSubmitting}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    className="m-r-20"
                  >
                    {edit ? "Cập nhật" : "Thêm mới"}
                  </Button>
                  {edit ? (
                    <Button
                      // loading={isSubmitting}
                      size="large"
                      type="ghost"
                      htmlType="submit"
                      onClick={() => {
                        setFormDisabled(true)
                      }}
                    >
                      Hủy
                    </Button>
                  ) : ""}
                </>
              )}
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
}

export default AddProduct;
