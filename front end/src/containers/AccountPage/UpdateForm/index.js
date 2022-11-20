import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, message, Row, Tooltip, Upload } from 'antd';
import userApi from '../../../apis/userApi';
import DatePickerField from '../../../components/Custom/Field/DatePickerField';
import InputField from '../../../components/Custom/Field/InputField';
import SelectField from '../../../components/Custom/Field/SelectField';
import constants from '../../../constants/index';
import { FastField, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userReducers from '../../../reducers/user';
import Compressor from 'compressorjs';
import * as Yup from 'yup';
import moment from 'moment';
function UpdateAccountForm() {
  const user = useSelector((state) => state.user);
  const { id, name, email, dateOfBirth, gender, img } = user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState(null)
  const dispatch = useDispatch();

  const onCompressFile = async (file) => {
    new Compressor(file, {
      quality: constants.COMPRESSION_RADIO,
      convertSize: constants.COMPRESSION_RADIO_PNG,
      success(fileCompressed) {
        const reader = new FileReader();
        reader.readAsDataURL(fileCompressed);
        reader.onloadend = async () => {
          setAvatar(reader.result);
        };
      },
      error(err) {
        message.error('Lỗi: ', err);
      },
    });
  };
  // giá trọ khởi tạo cho formik
  const initialValue = {
    email,
    name,
    gender,
    dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
  };

  // validate form trước submit với yup
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
    dateOfBirth: Yup.date()
      .notRequired()
      .min(new Date(1900, 1, 1), '* Năm sinh từ 1900')
      .max(
        new Date(new Date().getFullYear() - parseInt(constants.MIN_AGE), 1, 1),
        `* Tuổi tối thiểu là ${constants.MIN_AGE}`,
      ),
    gender: Yup.string().required('* Giới tính của bạn'),
  });
  //Upload config
  const propsUpload = {
    name: 'file',
    beforeUpload: (file) => {
      onCompressFile(file);
      return false; //để nó không tải lên bằng phương thức mặc định của antd
    },
    maxCount: 1,
    showUploadList: false,
    accept: "image/png, image/jpg, image/jpeg"

  };

  // fn: update account
  const handleUpdate = async (value) => {
    try {

      setIsSubmitting(true);
      if (avatar) value.avatar = avatar;
      if (JSON.stringify(initialValue) === JSON.stringify(value)) {
        setIsSubmitting(false);
        return;
      }
      const response = await userApi.putUpdateUser(id, value);
      if (response) {
        message.success('Cập nhật thành công');
        setIsSubmitting(false)
        dispatch(userReducers.getUserRequest());
      }
    } catch (error) {
      message.error('Cập nhật thất bại, vui lòng thử lại', 2);
      setIsSubmitting(false);
    }
  };

  //rendering...
  return (
    <>
      {/* {email && ( */}
      {email && (
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(value) => handleUpdate(value)}>
          {(formikProps) => {
            const suffixColor = 'rgba(0, 0, 0, 0.25)';
            return (
              <div className='box-sha-home bg-white bor-rad-8 p-t-10'>
                <div className="t-center">
                  <Avatar size={200} src={avatar ? avatar : (img ? img : constants.DEFAULT_USER_AVT)} />
                  <div className='m-t-10'>
                    <Upload {...propsUpload}>
                      <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                    </Upload>
                  </div>
                </div>
                <Form className="p-t-20">
                  <Row className=" p-16" gutter={[32, 32]} >
                    <Col className="p-b-0" span={24} md={12}>
                      {/* email field */}
                      <FastField
                        name="email"
                        component={InputField}
                        disabled={true}
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
                    <Col className="p-b-0" span={24} md={12}>
                      {/* full name filed */}
                      <FastField
                        name="name"
                        component={InputField}
                        className="input-form-common"
                        placeholder="Your name *"
                        size="large"
                        suffix={
                          <Tooltip title="Your name">
                            <InfoCircleOutlined style={{ color: suffixColor }} />
                          </Tooltip>
                        }
                      />
                    </Col>
                    <Col className="p-b-0" span={24} md={12}>
                      {/* dateOfBirth field */}
                      <FastField
                        className="input-form-common"
                        name="dateOfBirth"
                        component={DatePickerField}
                        placeholder={moment(dateOfBirth).format("YYYY-MM-DD")}
                        size="large"
                      />
                    </Col>
                    <Col className="p-b-0" span={24} md={12}>
                      {/* gender field */}
                      <FastField
                        className="input-form-common gender-field"
                        size="large"
                        name="gender"
                        component={SelectField}
                        placeholder="Gender *"
                        options={constants.GENDER_OPTIONS}
                      />
                    </Col>
                    {/* Button submit */}
                    <Col className="p-tb-16 t-left" span={24}>
                      <Button
                        // className="w-30"
                        size="large"
                        type="primary"
                        loading={isSubmitting}
                        htmlType="submit">
                        {isSubmitting ? 'Vui lòng đợi ...' : 'Cập nhật'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            );
          }}
        </Formik>
      )}
    </>
  );
}

export default UpdateAccountForm;
