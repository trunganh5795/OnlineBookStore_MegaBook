import { Button, Col, Image, message, Row, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import orderApi from '../../../apis/orderApi';
import productApi from '../../../apis/productApi';

import helpers from '../../../helpers';
import './index.scss';
const { TabPane } = Tabs;
export default function Trending() {
    const carts = useSelector(state => state.carts);
    const isAuth = useSelector((state) => state.authenticate.isAuth);
    const userId = useSelector((state) => state.user.id);
    const [trendingList, setTrendingList] = useState({});
    const dispatch = useDispatch();
    useEffect(() => {
        let flag = true;
        async function getTrendingProduct() {
            const result = await productApi.getTrendingProduct();
            if (flag) {
                setTrendingList(result);
            }
        }
        if (isAuth != null) {
            if (isAuth) {
                if (userId) {
                    getTrendingProduct(userId);
                }
            } else {
                getTrendingProduct();
            }

        }
        return () => {
            flag = false;
        };
    }, [dispatch, isAuth, userId]);

    return (
        <>
            {isAuth != null &&
                <Col span={24} className="m-b-32 bg-white box-sha-home bor-rad-8 trending-books">
                    <Row className="p-16" >
                        <Col span={24} className="m-b-15">
                            <h2 className="font-weight-700 t-color-black">Xu hướng</h2>
                            <div className="underline-title"></div>
                        </Col>
                        <Col span={24}>
                            <Tabs tabPosition="left"
                            >
                                {trendingList.recomms && trendingList.recomms.map(item => {
                                    let Itemindex = carts.findIndex(element => element.bookId === item.id);
                                    if (Itemindex !== -1) {
                                        item.values.instock -= carts[Itemindex].amount;
                                    }

                                    return (
                                        <TabPane
                                            tab={
                                                <div className='img-tab-pane'>
                                                    <Image
                                                        src={item.values.img}
                                                        width={'100px'}
                                                        preview={false}
                                                    />
                                                    <p className='t-color-black'>
                                                        {helpers.reduceProductName(item.values.title, 20)}
                                                    </p>
                                                </div>
                                            }
                                            key={item.id}>
                                            <Link to={`product/${item.id}`}>
                                                <h1 className='t-color-black title-hover'>{helpers.reduceProductName(item.values.title, 80)}</h1>
                                            </Link>
                                            <h3 className="border-bottom-line p-b-5 m-b-10 t-color-black">{item.values.author}</h3>
                                            {
                                                item.values.description ? (
                                                    <p className='border-bottom-dashed p-b-10 t-color-black'>{item.values.description} </p>
                                                )
                                                    :
                                                    <p className='border-bottom-dashed p-b-10 t-color-black'>Đang cập nhật ...</p>
                                            }
                                            <Row>
                                                <Col span={24}>
                                                    <div className=' d-flex align-i-center' style={{ flexGrow: 1 }}>
                                                        <h1 className="price t-color-black font-weight-700 p-tb-8 m-r-10">
                                                            {/* {price === 0 ? 'Liên hệ' : helpers.formatProductPrice(priceBefore)} */}
                                                            {1 === 0 ? 'Liên hệ' : helpers.formatProductPrice(item.values.price * (100 - item.values.discount) / 100)}
                                                        </h1>
                                                        {item.values.discount ? <> <span className='Product-View-price--cancel m-r-5'>
                                                            {helpers.formatProductPrice(item.values.price)}

                                                        </span><span className="m-l-8 discount-badge">-{10}%</span> </> : ""}
                                                    </div>
                                                </Col>
                                                <Col span={24}>
                                                    <Button
                                                        type="primary"
                                                        className='font-size-20px bor-rad-10'
                                                        style={{ height: '45px' }}
                                                        onClick={() => {
                                                            dispatch(orderApi.addtoCart(
                                                                {
                                                                    title: item.values.title,
                                                                    price: item.values.price,
                                                                    amount: 1,
                                                                    img: item.values.img,
                                                                    discount: item.values.discount ? item.values.discount : 0,
                                                                    instock: item.values.instock,
                                                                    bookId: item.id,
                                                                    author: item.values.author
                                                                }, message
                                                            ));
                                                            item.values.instock--;
                                                        }}
                                                        disabled={item.values.instock <= 0 ? true : false}
                                                    >Thêm vào giỏ</Button>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    );
                                })}
                            </Tabs>
                        </Col>
                    </Row>
                </Col>
            }
        </>

    );
}
