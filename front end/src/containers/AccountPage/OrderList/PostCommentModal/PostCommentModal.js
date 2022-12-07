import { Button, Divider, Form, Modal, Rate } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import helpers from '../../../../helpers';

const renderProductList = (orderList) => {
    return (fields, { add, remove }) => {
        // return orderList.order_detail?.map((item, index) => (
        if (fields.length === 0) return;
        return orderList.order_detail?.map((item, index) => (
            <div key={fields[index].key}>
                <Link to={`/product/${item.product.BookId}`}>{helpers.reduceProductName(item.product.title, 100)}</Link>
                <br />
                <Form.Item name={[index, "rate"]}>
                    <Rate />
                </Form.Item>
                <Form.Item name={[index, "comment"]}>
                    <TextArea rows={1} />
                </Form.Item>
                <div style={{ display: 'none' }}>
                    <Form.Item name={[index, "bookId"]} initialValue={item.product.BookId}>
                        <TextArea />
                    </Form.Item>
                </div>
                <Divider dashed />
            </div>
        ));
    };


};

export default function PostCommentModal({ visible, ratingOrder, setRatingOrder, postComment }) {
    const [form] = Form.useForm();
    const [isLoading, setLoading] = useState(false);
    const onClose = () => {
        form.resetFields();
        setRatingOrder({ isOpen: false, products: [] });
        
    };
    return (
        <Modal
            width={1000}
            centered
            visible={visible}
            onCancel={onClose}
            maskClosable={false}
            // footer={<Button type='primary'>Gửi Đánh Giá</Button>}
            footer={null}
            title={
                <p className="font-size-18px m-b-0">
                    Đánh giá đơn hàng
                </p>

            }>
            <Form
                form={form}
                onFinish={(data) => {
                    
                    postComment(ratingOrder.id, data.fields, setLoading, onClose);
                    // commentApi.postComment({ orderId: ratingOrder.id, data: data.fields })
                }}
                initialValues={{ fields: ratingOrder.order_detail?.map((item, index) => index) }}
            >
                <Form.List name="fields">
                    {renderProductList(ratingOrder)}
                </Form.List>
                <Form.Item className='t-right'>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Gửi đánh giá
                    </Button>
                </Form.Item>
            </Form>

        </Modal >
    );
}
