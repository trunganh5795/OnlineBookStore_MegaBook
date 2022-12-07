import { Divider, Segmented, Table } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import statisticApi from '../../../../apis/statisticApi';
const columns = [
    {
        title: 'Thứ hạng',
        dataIndex: 'rank',
        key: 'rank',
        width: 100
    },
    {
        title: 'Danh mục',
        dataIndex: 'category',
        key: 'category'
    },
    {
        title: 'Số đơn',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 200
    }
];
export default function CategoryRanking({ time }) {
    let [data, setData] = useState([]);
    useEffect(() => {
        let isSubscribe = true;
        async function getTopSellByCategory() {
            let rangeTime = time.split(',');
            let result = await statisticApi.getTop5SellCategory(rangeTime[0], rangeTime[1]);
            if (result.data && isSubscribe) {
                let data = result.data.map((item, index) => ({
                    rank: index + 1,
                    category: item.name,
                    quantity: item.quantity
                }));
                setData(data);
            }
        }
        
        getTopSellByCategory();
        return () => {
            isSubscribe = false;
        };
    }, [time]);

    return (
        <>
            <Segmented
                size='large'
                options={['Theo số đơn hàng']}
            />
            <Divider />
            <Table
                columns={columns}
                dataSource={data}
                rowKey="rank"
                pagination={false}
            />
        </>
    );
}
