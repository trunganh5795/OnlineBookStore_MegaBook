import { DollarCircleFilled, PercentageOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Row, Select } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import constants from '../../../../constants'
import moment from 'moment'
import './index.scss'
const { RangePicker } = DatePicker;
export default function VoucherModal(props) {
    const { visible, onClose, title, handleData, data, type } = props
    const [discountType, setDiscountType] = useState(null)
    const [form] = Form.useForm()
    const onSubmit = useCallback(
        async (dataUpdate) => {

            if (type === 'edit') {
                //hàm edit thì cần truyền thêm id của voucher              
                await handleData({ id: data.id, quantity: dataUpdate.quantity, time: dataUpdate.time, minSpend: dataUpdate.minSpend });
            } else {
                await handleData(dataUpdate);
            }
        },
        [title, handleData],
    )
    useEffect(() => {
        let value = null;
        if (!data.apply) data.apply = null;
        let type = 1;
        if (data.amount.length) {
            value = data.amount[0].amount
            type = 2;
        } else if (data.percentage.length) {
            value = data.percentage[0].percent;
        }
        setDiscountType(type)
        // thiết lập dữ liệu ban đầu cho form
        form.setFieldsValue({ ...data, type, value, time: [moment(data.start_time), moment(data.end_time)] })
    }, [data])

    return (
        <Modal
            width={700}
            visible={visible}
            onCancel={onClose}
            okButtonProps={{ form: 'editForm', htmlType: 'submit' }}
            title={title}
            okText="Lưu"
            cancelText="Hủy"
            forceRender
        >
            <Form
                name="editForm"
                onFinish={onSubmit}
                form={form}
                labelCol={{
                    span: 5, md: 6, xl: 6
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={23}>
                        <Form.Item
                            name="type"
                            label="Loại"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Radio.Group buttonStyle="solid"
                                onChange={(e) => setDiscountType(e.target.value)}
                            >
                                <Radio.Button value={1}>
                                    <PercentageOutlined /> Theo phần trăm
                                </Radio.Button>
                                <Radio.Button value={2} className='m-l-10'>
                                    <DollarCircleFilled /> Theo số tiền
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={23}>
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[
                                { required: true, message: 'Không bỏ trống' },
                                { max: 5 }

                            ]}
                        >
                            <Input size="large" placeholder="Code" disabled={type === 'edit' ? true : false} />
                        </Form.Item>
                    </Col>
                    <Col span={23}>
                        <Form.Item
                            name="apply"
                            label="Áp dụng"
                        >
                            <Select size="large" placeholder="Áp dụng cho *" disabled={type === 'edit' ? true : false}>
                                {[{ value: null, title: "Tất cả" }, ...constants.CATEGORIES].map((item, index) => (
                                    <Select.Option value={item.value} key={index}>
                                        {item.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={23}>
                        <Form.Item
                            name="value"
                            label="Giá trị"
                            rules={[
                                { required: true, message: 'Không bỏ trống' },
                                // { max: 5 }

                            ]}

                        >
                            <InputNumber size="large" placeholder="Value" addonAfter={discountType === 1 ? "%" : "$"} disabled={type === 'edit' ? true : false} />
                        </Form.Item>
                    </Col>
                    <Col span={23}>
                        <Form.Item
                            name="minSpend"
                            label="Giá trị đơn tối thiểu"
                            rules={[
                                { required: true, message: 'Không bỏ trống' },
                            ]}
                        >
                            <InputNumber size="large" placeholder="Giá trị đơn hàng tố thiểu" addonBefore="$" />
                        </Form.Item>
                    </Col>
                    <Col span={23}>
                        <Form.Item
                            name="quantity"
                            label="Số lượng"
                            rules={[
                                { required: true, message: 'Không bỏ trống' },
                            ]}
                        >
                            <InputNumber min={1} size="large" placeholder="Giá trị đơn hàng tố thiểu" />
                        </Form.Item>
                    </Col>
                    <Col span={23}>
                        <Form.Item
                            name="time"
                            label="Thời gian"
                            rules={[
                                { required: true, message: 'Không bỏ trống' },
                            ]}

                        >
                            <RangePicker
                                disabled={type === 'add' ? [false, false] : [moment(data.start_time) < moment(), moment(data.end_time) < moment()]}
                                ranges={{
                                    'This weeek': [moment().startOf('week'), moment().endOf('week')],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                }}
                                showTime={{ format: "HH:mm" }}
                                format="DD-MM-YYYY HH:mm"
                                size='large'
                                disabledDate={current => current && current <= moment().endOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
