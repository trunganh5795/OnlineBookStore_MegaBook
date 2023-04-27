import { Table } from 'antd';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
export default function Discount() {
  const columns = useMemo(
    () => [
      {
        title: 'Tên chương trình',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        dataIndex: 'status',
        // render: (type) => {
        //     if (!type) return "All"
        //     else return helpers.convertCategoryIdToString(2);

        // }
      },
      {
        title: 'Thời gian',
        key: 'time',
        render: (voucher) => {
          return (
            <>
              {moment(voucher.start_time).format('YYYY-MM-DD-hh:mm A')}
              <br />
              {moment(voucher.end_time).format('YYYY-MM-DD-hh:mm A')}
            </>
          );
        },
        filters: [
          {
            text: 'Đang diễn ra',
            value: 1,
          },
          {
            text: 'Sắp diễn ra',
            value: 2,
          },
          {
            text: 'Đã kết thúc',
            value: 3,
          },
        ],
        filterMultiple: false,
      },
      {
        title: 'Hành động',
        width: '150px',
        render: (voucher) => (
          <>
            <Link to="/admin/marketing/event/details">Chi Tiết</Link>
          </>
        ),
      },
    ],
    [],
  );
  return (
    <div className="m-lr-10 m-t-10">
      <Table
        columns={columns}
        // dataSource={voucherList}
        rowKey="id"
        pagination={{
          showLessItems: true,
          position: ['bottomCenter'],
          // total: totalPage,
          onChange: (p) => {
            // setPage(p)
          },
        }}
        onChange={(pagination, filters, sorter, extra) => {
          // let flag = false;
          // filters.time?.forEach(item => {
          //     let index = filterOps[0].value?.findIndex(i => item === i);
          //     if (index === -1) flag = true;
          // })
          // if (
          //     (!filters.time && filterOps[0].value.length != 0) ||
          //     (filters.time?.length !== filterOps[0].value.length)
          // ) flag = true;
          // if (flag) {
          //     filterOps[0].value = filters.time ? filters.time : [];
          //     if (page === 1) {
          //         return setForceRunUseEffect(prev => !prev)
          //     } else {
          //         setPage(1)
          //     }
          // }
        }}
      />
    </div>
  );
}
