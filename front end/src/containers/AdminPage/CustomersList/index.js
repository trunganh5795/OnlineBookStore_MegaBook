import { Button, message, Popconfirm, Table } from 'antd';
import adminApi from '../../../apis/adminApi';
import React, { useCallback, useEffect, useState } from 'react';
import AdminSearch from '../../../components/AdminSearch';
import moment from 'moment';
let query = '';
let isSubscribe = true;
let selectedOption = 0;
let filterOps = [
  { field: 'role', value: [] },
  { field: 'active', value: [] },
];
function CustomerList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  // const [searchOption, setSearchOption] = useState(null)
  const [forceRunUseEffect, setForceRunUseEffect] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  // event: xoá tài khoản
  const onDelCustomer = async (id) => {
    try {
      const response = await adminApi.delCustomer(id);
      if (response && response.status === 200) {
        message.success('Xoá tài khoản thành công');
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      message.error('Xoá tài khoản thất bại');
    }
  };

  const onReleaseCustomer = async (id) => {
    try {
      const response = await adminApi.releaseCustomer(id);
      if (response && response.status === 200) {
        message.success('Mở khóa thành công');
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      message.error('Mở khóa thất bại');
    }
  };
  const getCustomerBy = async (value, page, perPage, option, filterOps) => {
    try {
      let result = await adminApi.getCustomerListBy(
        page,
        option,
        value,
        filterOps[1].value,
        filterOps[0].value,
      );
      if (result.data && isSubscribe) {
        let newList = result.data.rows.map((item, index) => {
          return {
            key: index,
            id: item.id,
            email: item.email,
            birthday: item.dateOfBirth,
            fullName: item.name,
            address: item.address,
            gender: item.gender,
            role: item.role,
            active: item.active,
          };
        });
        setTotalPage(result.data.count);
        setData(newList);
        setIsLoading(false);
      }
    } catch (error) {
      message.error(error.response?.data.message);
    }
  };
  const onSearch = useCallback(
    (value = '', option) => {
      selectedOption = option;
      query = value;
      filterOps = [
        { field: 'role', value: [] },
        { field: 'active', value: [] },
      ];
      if (page === 1) {
        setForceRunUseEffect((prev) => !prev);
      } else {
        setPage(1);
      }
    },
    [page],
  );
  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      render: (v) => <a>{v}</a>,
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
    },
    {
      title: 'Họ Tên',
      key: 'fullName',
      dataIndex: 'fullName',
    },
    {
      title: 'Quyền',
      key: 'role',
      dataIndex: 'role',
      filteredValue: filterOps[0].value,
      filters: [
        { text: 'Client', value: 'client' },
        { text: 'Admin', value: 'admin' },
      ],
    },
    {
      title: 'Trạng thái',
      key: 'active',
      dataIndex: 'active',
      filteredValue: filterOps[1].value,
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Đã khóa', value: 'block' },
      ],
    },
    {
      title: 'Ngày sinh',
      key: 'birthday',
      dataIndex: 'birthday',
      render: (dateOfBirth) => moment(dateOfBirth).format('DD-MM-YYYY'),
    },
    {
      title: 'Giới tính',
      key: 'gender',
      dataIndex: 'gender',
      render: (gender) => (gender ? 'Nam' : 'Nữ'),
    },
    {
      title: 'Hành động',
      render: (_v, records) => (
        <Popconfirm
          title={
            records.active === 'active'
              ? 'Bạn có chắc muốn khoá ?'
              : 'Bạn có chắc muốn mở khoá ?'
          }
          placement="left"
          cancelText="Huỷ bỏ"
          okText="Xoá"
          onConfirm={() =>
            records.active === 'active'
              ? onDelCustomer(records.id)
              : onReleaseCustomer(records.id)
          }>
          {records.active === 'active' ? (
            <Button danger>Khóa</Button>
          ) : (
            <Button type="primary">Mở Khóa</Button>
          )}
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    isSubscribe = true;
    setIsLoading(true);
    getCustomerBy(query, page, 10, selectedOption, filterOps);
    return () => {
      isSubscribe = false;
    };
  }, [page, forceRunUseEffect]);
  return (
    <div className="m-lr-10 m-t-10">
      <AdminSearch
        options={[
          { id: 0, text: 'Tất Cả' },
          { id: 1, text: 'Tên' },
          { id: 2, text: ' Số điện thoại' },
          { id: 3, text: 'Mã KH' },
          { id: 4, text: 'Email' },
        ]}
        onSearch={onSearch}
        setPage={setPage}
        selectedOption={selectedOption}
      />
      <Table
        columns={columns}
        dataSource={data}
        // rowKey="id"
        pagination={{
          showLessItems: true,
          position: ['bottomCenter'],
          current: page,
          pageSize: 10,
          total: totalPage,
          onChange: (p) => setPage(p),
        }}
        loading={isLoading}
        onChange={(pagination, filters, sorter, extra) => {
          let flag = false;
          filters.role?.forEach((item) => {
            let index = filterOps[0].value?.findIndex((i) => item === i);
            if (index === -1) flag = true;
          });
          filters.active?.forEach((item) => {
            let index = filterOps[1].value?.findIndex((i) => item === i);
            if (index === -1) flag = true;
          });
          if (
            (!filters.role && filterOps[0].value.length != 0) ||
            (!filters.active && filterOps[1].value.length != 0) ||
            filters.role?.length !== filterOps[0].value.length ||
            filters.active?.length !== filterOps[1].value.length
          )
            flag = true;

          if (flag) {
            filterOps[0].value = filters.role ? filters.role : [];
            filterOps[1].value = filters.active ? filters.active : [];
            if (page === 1) {
              return setForceRunUseEffect((prev) => !prev);
            } else {
              setPage(1);
            }
          }
        }}
      />
      {/* pagination={{
            current: page,
            pageSize: 10,
            total: totalProduct,
            position: ['bottomCenter'],
            showSizeChanger: false,
            onChange: (p) => setPage(p)
          }} */}
    </div>
  );
}

export default CustomerList;
