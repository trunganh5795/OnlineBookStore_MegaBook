import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Segmented, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import statisticApi from '../../../../apis/statisticApi';
import constants from '../../../../constants';
import helpers from '../../../../helpers';
const rankingTooltipText = {
    total: '5 sản phẩm có tổng doanh số cao nhất (tính trên các đơn hàng đã được xác nhận) trong khoảng thời gian đã chọn.',
    quantity: '5 sản phẩm bán chạy nhất của Shop theo tổng số lượng sản phẩm đã xác nhận trong khoảng thời gian được chọn.',
    views: 'Top 5 khu vực có doanh thu cao nhất',
    ratio: 'Top 5 khu vực có số đơn hàng cao nhất'
};
const segmentedOptions = [
    {
        label: (
            <p>Theo doanh số <Tooltip title={rankingTooltipText.total}><QuestionCircleOutlined className='icon' />
            </Tooltip>
            </p>),
        value: 1
    },
    {
        label: (
            <p>Theo số lượng bán <Tooltip title={rankingTooltipText.quantity}><QuestionCircleOutlined className='icon' />
            </Tooltip>
            </p>),
        value: 2
    },
    {
        label: (
            <p>Doanh thu theo khu vực <Tooltip title={rankingTooltipText.views}><QuestionCircleOutlined className='icon' />
            </Tooltip>
            </p>),
        value: 3
    }, {
        label: (
            <p>Số đơn hàng theo khu vực <Tooltip title={rankingTooltipText.ratio}><QuestionCircleOutlined className='icon' />
            </Tooltip>
            </p>),
        value: 4
    }
];

export default function Ranking({ time }) {
    const [rankingType, setRankingType] = useState(0);
    const [columns, setColumns] = useState([
        {
            title: 'Thứ hạng',
            dataIndex: 'rank',
            key: 'rank',
            width: 100
        },
        {
            title: 'Thông tin',
            dataIndex: 'info',
            key: 'info',
            render: (title, record) => record.id ? <Link to={`/product/${record.id}`} target="_blank">{helpers.reduceProductName(title, 80)}</Link> : helpers.reduceProductName(title, 80)

        },
        {
            title: 'Doanh số',
            dataIndex: 'total',
            key: 'total',
            width: 200
        },
    ]);
    const [data, setData] = useState([]);
    useEffect(() => {
        let isSubscribe = true;
        let getTopSell = async (type) => {
            let [start_time, end_time] = time.split(',');
            
            if (type === 0) {
                let result = await statisticApi.getTop5Revenue(start_time, end_time);
                
                if (result.data && isSubscribe) {
                    console.log(result.data);
                    let data = result.data.map((item, index) => {
                        return ({
                            rank: index + 1,
                            info: item.title,
                            total: helpers.formatProductPrice(item.total),
                            id: item.book_id
                        });
                    });
                    setData(data);
                }
            } else if (type === 1) {
                let result = await statisticApi.getTop5Sell(start_time, end_time);
                if (result.data && isSubscribe) {
                    let data = result.data.map((item, index) => {
                        return ({
                            rank: index + 1,
                            info: item._source.title,
                            total: item.numberOfSell,
                            id: item._source.bookId
                        });
                    });
                    setData(data);
                }
            } else if (type === 2) {
                let result = await statisticApi.getTop5RevenueLocation(start_time, end_time);
                
                if (result.data && isSubscribe) {
                    let data = result.data.map((item, index) => {
                        return ({
                            rank: index + 1,
                            info: constants.PROVINCE[item.key - 1],
                            total: helpers.formatProductPrice(item.total.value),
                            // id: item._source.bookId
                        });
                    });
                    setData(data);
                }
            } else {
                let result = await statisticApi.getTop5SellLocation(start_time, end_time); //top 5 khu vực nhiều đơn nhất
                
                if (result.data && isSubscribe) {
                    let data = result.data.map((item, index) => {
                        return ({
                            rank: index + 1,
                            info: constants.PROVINCE[item.key - 1],
                            total: item.doc_count
                            // id: item._source.bookId
                        });
                    });
                    setData(data);
                }
            }
        };

        getTopSell(rankingType);
        return () => {
            isSubscribe = false;
        };
    }, [rankingType, time]);
    const changeColumnsTitle = (key) => {
        let newColumns = [...columns];
        let type = rankingType;
        if (key === 1) {
            type = 0; // theo doanh số
            newColumns[2] = { ...newColumns[2], title: 'Doanh Số' };
        } else if (key === 2) {
            type = 1; // theo số lượng
            newColumns[2] = { ...newColumns[2], title: 'Số Lượng' };
        } else if (key === 3) {
            type = 2;
            newColumns[2] = { ...newColumns[2], title: 'Doanh thu' };
        } else {
            type = 3;
            newColumns[2] = { ...newColumns[2], title: 'Số Lượng' };
        }
        setRankingType(type);
        setColumns([...newColumns]);
    };
    return (
        <>
            <h1>Thứ hạng sản phẩm và khu vực</h1>
            <Segmented
                size='large'
                options={segmentedOptions}
                onChange={(value) => changeColumnsTitle(value)}
            />
            <Divider />
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="rank"
            />
        </>
    );
}
