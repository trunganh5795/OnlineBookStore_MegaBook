import { Button, Col, Image, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import productApi from '../../../apis/productApi';
import helpers from '../../../helpers';
import moment from 'moment';
import orderApi from '../../../apis/orderApi';
import { useDispatch, useSelector } from 'react-redux';
export default function BestBook() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    let [bestBook, setBestBook] = useState({});
    useEffect(() => {
        let isSubsribe = true;
        async function getBestBook() {
            let data = await productApi.getBestBook();
            if (data.data && isSubsribe) {
                setBestBook(data.data);
            }
        }
        getBestBook();
        return () => {
            isSubsribe = false;
        };
    }, []);

    return (
        <Col span={24}>
            <Row gutter={[10, 10]} className="p-30 m-b-32 bg-white box-sha-home bor-rad-8 best-book" style={{ marginLeft: 0, marginRight: 0 }}>
                <Col span={24} className="p-8">
                    <h2 className="font-weight-700 t-color-white">Sách hay hôm nay</h2>
                    <div className="underline-title"></div>
                </Col>
                <Col span={24} md={8} className='p-8 t-center'>
                    <Image
                        src={bestBook.img}
                        style={{ maxWidth: '300px' }}
                        className="box-sha-home"
                    />
                </Col>
                <Col span={24} md={16}>
                    <h1 className='t-color-white'>{bestBook.title}</h1>
                    <h3 className="border-bottom-line p-b-5 m-b-10 t-color-white">{bestBook.author}</h3>
                    <p className='border-bottom-dashed p-b-10'>
                        {helpers.reduceProductName(bestBook.desc2, 200)}
                    </p>
                    <Row>
                        {/* <Col md={8}> */}
                        <div className='price d-flex align-i-center' style={{ flexGrow: 1 }}>
                            <h1 className="t-color-white font-weight-700 p-tb-8 m-r-10">
                                {helpers.formatProductPrice(bestBook.price * (100 - (bestBook.discount ? bestBook.discount : 0)) / 100)}
                            </h1>
                            {bestBook.discount > 0 &&
                                bestBook.enable_discount &&
                                moment(bestBook.start_time).isSameOrAfter(moment().format('YYYY-MM-DD')) &&
                                moment(bestBook.end_time).isBefore(moment().format('YYYY-MM-DD')) && (
                                    <>
                                        <span className='Product-View-price--cancel m-r-5'>
                                            {helpers.formatProductPrice(bestBook.price)}

                                        </span><span className="m-l-8 discount-badge">-{10}%</span>
                                    </>
                                )}
                        </div>
                        <Button type="primary" className='font-size-20px bor-rad-10' style={{ height: '45px' }}
                        onClick={()=>{
                            dispatch(orderApi.addtoCart(
                                {
                                  category : bestBook.category,
                                  title : bestBook.title,
                                  price : bestBook.price,
                                  amount: 1,
                                  img : bestBook.img,
                                  discount : bestBook.discount,
                                  instock : bestBook.instock,
                                  bookId : bestBook.bookId,
                                  author : bestBook.author
                                }, message, user.id
                              ));
                        }}
                        >Thêm vào giỏ</Button>
                        {/* </Col> */}
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}
