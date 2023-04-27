import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { message, Table, Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import adminApi from '../../../../apis/adminApi';
import productApi from '../../../../apis/productApi';
import helpers from '../../../../helpers';
import React, { useCallback, useEffect, useState } from 'react';
import EditProductModal from './EditProductModal';
import AdminSearch from '../../../../components/AdminSearch';

function generateFilterType() {
  let result = [];
  for (let i = 1; i < 8; ++i) {
    result.push({ value: i, text: helpers.convertProductType(i) });
  }
  return result;
}
let isSubscribe = true;
let selectedOption = 0;
let query = '';
let filterOps = [
  { field: 'category', value: [] },
  { field: undefined, value: undefined },
  { field: 'discount', value: [] },
];
function SeeProduct() {
  const [editModal, setEditModal] = useState({ visible: false, product: null });
  const [modalDel, setModalDel] = useState({ visible: false, _id: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [page, setPage] = useState(1);
  const [forceRunUseEffect, setForceRunUseEffect] = useState(false);
  // event: xoá sản phẩm
  const onDelete = async (_id) => {
    try {
      const response = await adminApi.removeProduct(_id);
      if (response && response.status === 200) {
        message.success('Xoá thành công.');
        const newList = list.filter((item) => item._id !== _id);
        setList(newList);
        // setTotal(total - 1);
        //dòng này xem xét lại
      }
    } catch (error) {
      message.error('Xoá thất bại, thử lại !');
    }
  };

  // event: cập nhật sản phẩm
  const onCloseEditModal = (newProduct) => {
    if (newProduct) {
      // Khi chỉnh có cập nhật
      const newList = list.map((item) =>
        item.bookId !== newProduct.bookId ? item : { ...item, ...newProduct },
      );
      setList(newList);
    }
    setEditModal({ visible: false });
  };

  let getProductsBy = useCallback(
    async (value = '', page, perPage, option, filterOps) => {
      try {
        if (option === 0) {
          const response = await productApi.getAllProducts(
            page,
            perPage,
            filterOps,
          );
          if (response.data && isSubscribe) {
            const { count, rows } = response.data;
            setTotalProduct(count);
            setList(rows);
            setIsLoading(false);
          }
        } else {
          let response = await adminApi.searchByName(
            value,
            page,
            perPage,
            option,
            filterOps,
          );
          if (response.data && isSubscribe) {
            let { count, rows } = response.data;
            let productList = rows.map((item) => item._source);
            setTotalProduct(count);
            setList(productList);
            setIsLoading(false);
          }
        }
      } catch (error) {}
    },
    [],
  );
  let onSearch = useCallback(
    (value = '', option) => {
      selectedOption = option;
      query = value;
      filterOps = [
        { field: 'category', value: [] },
        { field: undefined, value: undefined },
        { field: 'discount', value: [] },
      ];
      if (page === 1) {
        setForceRunUseEffect((prev) => !prev);
      } else {
        setPage(1);
      }
    },
    [page],
  );

  useEffect(() => {
    isSubscribe = true;
    setIsLoading(true);
    getProductsBy(query, page, 10, selectedOption, filterOps);

    return () => {
      isSubscribe = false;
    };
  }, [page, forceRunUseEffect]);
  // Cột của bảng
  const columns = [
    {
      title: 'ID',
      key: 'BookId',
      dataIndex: 'bookId',
      render: (code, data) => {
        return (
          <a target="blank" href={`/product/${data.bookId}`}>
            {code}
          </a>
        );
      },
    },
    {
      title: 'Tên',
      key: 'title',
      dataIndex: 'title',
      render: (name) => (
        <Tooltip title={name}>{helpers.reduceProductName(name, 40)}</Tooltip>
      ),
    },
    {
      title: 'Giá',
      key: 'price',
      dataIndex: 'price',
      // defaultSortOrder: 'descend',
      sorter: (a, b) => 0,
      sortOrder: filterOps[1].field === 'price' ? filterOps[1].value : null,
      render: (price, row) => (
        <>
          <h3
            style={{
              color: `${row.discount ? 'red' : '#4F55C5'}`,
              textDecoration: `${row.discount ? 'line-through' : ''}`,
            }}>
            {price ? helpers.formatProductPrice(price) : 'Liên hệ'}
          </h3>
          <h3 style={{ color: '#4F55C5' }}>
            {row.discount
              ? helpers.formatProductPrice((price * (100 - row.discount)) / 100)
              : ''}
          </h3>
        </>
      ),
    },
    {
      title: 'Danh mục',
      key: 'category',
      dataIndex: 'category',
      filteredValue: filterOps[0].value,
      filters: generateFilterType(),
      // onFilter: (value, record) =>
      render: (type) => helpers.convertProductType(type),
    },
    {
      title: 'Kho hàng',
      key: 'instock',
      dataIndex: 'instock',
      // defaultSortOrder: 'ascend',
      sortOrder: filterOps[1].field === 'instock' ? filterOps[1].value : null,
      sorter: (a, b) => 0,
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      dataIndex: 'discount',
      filteredValue: filterOps[2].value,
      filters: [
        { value: 0, text: 'Đang diễn ra' },
        { value: 1, text: 'Đã kết thúc' },
        { value: 2, text: 'Sắp diễn ra' },
      ],
      render: (discount) => (discount ? `${discount} %` : '--'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (book) => (
        <>
          <Tooltip title="Delete" placement="left">
            <DeleteOutlined
              onClick={() => setModalDel({ visible: true, id: book.BookId })}
              className="m-r-8 action-btn-product"
              style={{ color: 'red' }}
            />
          </Tooltip>
          <Tooltip title="Edit" placement="left">
            <EditOutlined
              onClick={() => {
                setEditModal({ visible: true, product: { ...book } });
              }}
              className="m-r-8 action-btn-product"
              style={{ color: '#444' }}
            />
          </Tooltip>

          <Tooltip title="See product" placement="left">
            <a target="blank" href={`/product/${book.bookId}`}>
              <EyeOutlined
                className="action-btn-product"
                style={{ color: '#444' }}
              />
            </a>
          </Tooltip>
        </>
      ),
    },
  ];

  // rendering ...
  return (
    <div className="pos-relative p-8 edit-modal">
      {
        <div className="m-lr-10 m-t-10">
          {' '}
          {/* modal confirm delete product */}
          <Modal
            title="Xác nhận xoá sản phẩm"
            visible={modalDel.visible}
            onOk={() => {
              onDelete(modalDel._id);
              setModalDel({ visible: false, _id: false });
            }}
            onCancel={() => setModalDel({ visible: false, _id: false })}
            okButtonProps={{ danger: true }}
            okText="Xoá"
            cancelText="Huỷ bỏ">
            <WarningOutlined style={{ fontSize: 28, color: '#F7B217' }} />
            <b> Bạn chắc chắn muốn xóa sản phẩn này chứ ?</b>
          </Modal>
          {/* table show product list */}
          <AdminSearch
            options={[
              { id: 0, text: 'Tất cả' },
              { id: 1, text: 'Tên Sản phẩm' },
            ]}
            onSearch={onSearch}
            selectedOption={selectedOption}
          />
          <Table
            rowKey={'bookId'}
            pagination={{
              current: page,
              pageSize: 10,
              total: totalProduct,
              position: ['bottomCenter'],
              showSizeChanger: false,
              onChange: (p) => setPage(p),
            }}
            loading={isLoading}
            className="admin-see-product"
            columns={columns}
            dataSource={list}
            onChange={(pagination, filters, sorter, extra) => {
              let flag = false;

              if (
                !(
                  filters.category === null && filterOps[0].value.length === 0
                ) &&
                !(filters.discount === null && filterOps[2].value.length === 0)
              ) {
                filters.category?.forEach((item) => {
                  let index = filterOps[0].value?.findIndex((i) => item === i);
                  if (index === -1) flag = true;
                });

                if (
                  (!filters.category && filterOps[0].value.length !== 0) ||
                  filters.category?.length !== filterOps[0].value.length ||
                  sorter.order !== filterOps[1].value ||
                  sorter.column?.key !== filterOps[1].field ||
                  flag
                ) {
                  flag = true;
                  filterOps[0].field = 'category';
                  filterOps[0].value = filters.category ? filters.category : [];

                  if (sorter.order) {
                    filterOps[1].field = sorter.column.key;
                    filterOps[1].value = sorter.order;
                  } else {
                    filterOps[1].field = undefined;
                    filterOps[1].value = undefined;
                  }
                }
                if (page === 1 && flag) {
                  return setForceRunUseEffect((prev) => !prev);
                }
                if (flag) setPage(1);
              }
            }}
          />
          {/* edit product modal */}
          <EditProductModal
            visible={editModal.visible}
            onClose={(value) => onCloseEditModal(value)}
            product={editModal.product}
          />
        </div>
      }
    </div>
  );
}

export default SeeProduct;
