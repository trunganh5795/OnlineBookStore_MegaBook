import { CopyOutlined, DeleteOutlined, EditOutlined, WarningOutlined } from '@ant-design/icons';
import { Button,  message, Modal,  Table,  Tooltip } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import adminApi from '../../../apis/adminApi';
import helpers from '../../../helpers';
import VoucherModal from './VoucherModal/VoucherModal';
import moment from 'moment';
import AdminSearch from '../../../components/AdminSearch';

let initForm = {
    type: 1,
    code: null,
    apply: "",
    value: null,
    minSpend: null,
    total: null,
    start_time: new Date(),
    end_time: new Date(),
    amount: [],
    percentage: []
}
let isSubscribe = true;
let selectedOption = 0;
let query = '';
let filterOps = [
    { field: 'time', value: [] },
];
export default function Voucher() {
    const [voucherDetails, setVoucherDetail] = useState({ visible: false, data: initForm });
    const [delModal, setDelModal] = useState({ visible: false, code: null })
    const [title, setTitle] = useState({ title: "Thêm mã giảm giá", type: 'add' });
    const [voucherList, setVoucherList] = useState([])
    const [page, setPage] = useState(1)
    const [forceRunUseEffect, setForceRunUseEffect] = useState(false)
    // const [searchOption, setSearchOption] = useState(null)
    // const [searchValue, setSearchValue] = useState('')
    const [totalPage, setTotalPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true);

    const columns = useMemo(() => [
        {
            title: 'Mã',
            key: 'code',
            dataIndex: 'code',
        },
        {
            title: 'Thể loại',
            key: 'type',
            dataIndex: 'apply',
            render: (type) => {
                if (!type) return "Tất cả"
                else return helpers.convertCategoryIdToString(type);

            }
        },
        {
            title: 'Giảm giá',
            key: 'discount',
            render: (voucher) => {
                if (voucher.amount.length) return (<span style={{ color: 'red' }}>- {helpers.formatProductPrice(voucher.amount[0].amount)}</span>)
                else if (voucher.percentage.length) return "- " + voucher.percentage[0].percent + "%"
            }
        },
        {
            title: 'Số lượng',
            key: 'total',
            dataIndex: 'quantity',
        },
        {
            title: 'Đã dùng',
            key: 'used',
            dataIndex: 'used',
            render: (used) => used ? 0 : used
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (voucher) => {
                return <>
                    {moment(voucher.start_time).format("DD-MM-YYY hh:mm A")}
                    <br />
                    {moment(voucher.end_time).format("DD-MM-YYY hh:mm A")}
                </>
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
                    <Tooltip title="Sửa" placement="left">
                        <EditOutlined
                            className="m-r-8 action-btn-product"
                            style={{ color: '#444' }}
                            onClick={() => {
                                setTitle({ title: "Chi tiết mã giảm giá", type: 'edit' })
                                setVoucherDetail({ data: voucher, visible: true })
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa" placement="left">
                        <DeleteOutlined
                            onClick={() => setDelModal({ visible: true, code: voucher.code })}
                            className="m-r-8 action-btn-product"
                            style={{ color: 'red' }}
                        />
                    </Tooltip>
                    <Tooltip title="Sao chép mã" placement="left">
                        <CopyOutlined
                            onClick={() => {
                                navigator.clipboard.writeText(voucher.code);
                                message.success("Mã đã được sao chép !")
                            }}
                            className="m-r-8 action-btn-product"
                            style={{ color: 'blue' }}
                        />
                    </Tooltip>
                </>
            ),
        },
    ], [])
    const onCloaseVoucherModal = useCallback(
        () => {
            setVoucherDetail(prev => ({ ...prev, visible: false }))
        },
        [])
    const onDel = useCallback(async (code, voucherList) => {
        try {
            
            await adminApi.deleteVoucher(code);
            setDelModal({ visible: false, code: null })
            let data = voucherList;
            let index = data.findIndex(item => item.code === code)
            if (index !== -1) {
                data.splice(index, 1);
            }
            setTotalPage(prev=> prev-1)
            setVoucherList([...data])
            message.success("Xóa Thành Công !")
        } catch (error) {
            message.error(error.response.text)
        }
    }, [])
    const addNewVoucher = async (data) => {
        try {
            await adminApi.addNewVoucher(data);
            if (data.type === 1) {
                data.percentage = [{ percent: data.value }]
                data.amount = []
            } else if (data.type === 2) {
                data.amount = [{ amount: data.value }]
                data.percentage = []
            }
            data.used = 0;
            setTotalPage(prev => prev + 1)
            setVoucherList(prev => [data, ...prev])
            message.success("Thêm thành công")
            setVoucherDetail({ visible: false, data: initForm })
        } catch (error) {
            message.error(error.response ? error.response.data : "Xảy ra lỗi !")
        }
    }
    const updateCurrentVoucher = async (data) => {
        try {
            
            await adminApi.updateVoucher(data)
            let voucherUpdate = voucherList.find(item => item.id === data.id);
            Object.assign(voucherUpdate, data, { start_time: data.time[0], end_time: data.time[1] })
            // // Clone từng voucher con trong mảng voucherList vì table antd nó 
            // // sẽ ko render nếu object cũ
            let newVoucherList = voucherList.map((item, index) => ({ ...item }))

            setVoucherList(newVoucherList)
            message.success("Cập nhật thành công")
            setVoucherDetail({ visible: false, data: initForm })
        } catch (error) {
            // console.log(error);
            message.error("Xảy ra lỗi")
        }

    }
    const onSearch = useCallback((value = '', option) => {
        selectedOption = option;
        query = value;
        filterOps = [
            { field: 'time', value: [] }
        ]
        if (page === 1) {
            setForceRunUseEffect(prev => !prev)
        } else {
            setPage(1)
        }
    }, [page])

    const getAllVoucher = async (value = '', page, perPage, option, filterOps) => {
        if (option === 0) {
            const response = await adminApi.getAllVoucher(page, perPage, filterOps[0].value);
            if (response.data && isSubscribe) {
                const { count, rows } = response.data;
                setTotalPage(count)
                setVoucherList(rows);
                setIsLoading(false);
            }
        } else {
            const response = await adminApi.getVoucherListBy(value, option, page, perPage, filterOps[0].value);
            if (response.data && isSubscribe) {
                const { count, rows } = response.data;
                setTotalPage(count)
                setVoucherList(rows);
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        isSubscribe = true;
        getAllVoucher(query, page, 10, selectedOption, filterOps)
        return () => {
            isSubscribe = false
        }
    }, [page, forceRunUseEffect])

    return (
        <div className='m-lr-10 m-t-10'>
            <div className='d-flex justify-content-between'>
                <h1>Danh Sách mã giảm giá</h1>
                <Button
                    type='primary'
                    size='large'
                    onClick={() => {
                        setTitle({ title: 'Thêm mã giảm giá', type: 'add' })
                        setVoucherDetail(prev => ({
                            data: {...initForm},
                            visible: true
                        }))

                    }}
                >+ Thêm</Button>
            </div>
            <AdminSearch
                options={[{ text: "Tất Cả", id: 0 }, { text: "Code", id: 1 }]}
                onSearch={onSearch}
            />
            <Table
                columns={columns}
                dataSource={voucherList}
                rowKey="code"
                pagination={{
                    showLessItems: true,
                    position: ['bottomCenter'],
                    position: ['bottomCenter'],
                    total: totalPage,
                    onChange: (p) => {
                        setPage(p)
                    }
                }}
                onChange={(pagination, filters, sorter, extra) => {
                    let flag = false;
                    filters.time?.forEach(item => {
                        let index = filterOps[0].value?.findIndex(i => item === i);
                        if (index === -1) flag = true;
                    })
                    if (
                        (!filters.time && filterOps[0].value.length != 0) ||
                        (filters.time?.length !== filterOps[0].value.length)
                    ) flag = true;
                    if (flag) {
                        filterOps[0].value = filters.time ? filters.time : [];
                        if (page === 1) {
                            return setForceRunUseEffect(prev => !prev)
                        } else {
                            setPage(1)
                        }
                    }
                }}
            />
            {/* Delete modal */}
            <Modal
                title="Xóa mã giảm giá"
                visible={delModal.visible}
                onOk={() => {
                    onDel(delModal.code, voucherList)
                }}
                onCancel={() => setDelModal({ visible: false, code: null })}
                okButtonProps={{ danger: true }}
                okText="Xóa"
                cancelText="Hủy">
                <WarningOutlined style={{ fontSize: 28, color: '#F7B217' }} />
                <b> Bạn chắc chắn muốn xóa mã giảm giá này ?</b>
            </Modal>
            {/* Edit or Add new Voucher */}
            <VoucherModal
                visible={voucherDetails.visible}
                onClose={() => onCloaseVoucherModal()}
                title={title.title}
                handleData={title.type === 'edit' ? updateCurrentVoucher : addNewVoucher}
                data={voucherDetails.data}
                type={title.type}
            />
        </div>
    )
}
