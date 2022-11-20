import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import statisticApi from '../../../../apis/statisticApi';
import helpers from '../../../../helpers';
import moment from 'moment';
const columns = [
    {
        title: 'ID Đơn hàng',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'ID Khách hàng',
        dataIndex: 'userid',
        key: 'userid',
    },
    {
        title: 'Thanh toán',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
];
// const data = [
//     { id: 1, name: 'trung anh', total: 123, key: 1 },
//     { id: 1, name: 'trung anh', total: 123, key: 2 },
//     { id: 1, name: 'trung anh', total: 123, key: 3 }
// ]
export default function LatestOrder() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    useEffect(() => {
        let getLatestOrder = async () => {
            let result = await statisticApi.getLatestOrder(1, 10);
            setData(result.data.map(item => ({
                key: item._source.id,
                id: item._source.id,
                userid: item._source.userid,
                total: helpers.formatProductPrice(item._source.total),
                createdAt: moment(item._source.createdAt).format('DD-MM-YYYY HH:MM'),
            })))
        }
        getLatestOrder();
        return () => {

        }
    }, [])

    return (
        <div className="h-100%">
            <h1>Đơn hàng mới</h1>
            <Table
                columns={columns}
                dataSource={data}
                // pagination={{
                //     // current:1,
                //     pageSize: 4,
                // }}
                loading={loading}
                pagination={false}
                scroll={{y:300}}
            />
        </div>
    )
}
