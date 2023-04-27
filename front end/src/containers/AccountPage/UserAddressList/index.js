import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Row } from 'antd';
import addressApi from '../../../apis/addressApi';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddressAddForm from './AddressAddForm';
let isSubscribe = true;
function AddressUserList(props) {
  const { isCheckout, onChecked, showAll } = props;
  //onChecked là hàm để chọn địa chỉ, isCheckout = true => đây là bước thanh toán
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [isVisibelAddressList, setIsVisibelAddressList] = useState(false);
  const [list, setList] = useState([]);
  const [activeItem, setActiveItem] = useState(-1);
  const user = useSelector((state) => state.user);
  const [updateList, setUpdateList] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  // event: xoá 1 địa chỉ giao nhận
  const onDelDeliveryAdd = async (addressId) => {
    try {
      const response = await addressApi.delDeliveryAddress(addressId);
      if (response) {
        message.success('Xoá địa chỉ thành công');
        let index = list.findIndex((item) => item.id === addressId);
        if (index !== -1 && isSubscribe) {
          list.splice(index, 1);
          setList([...list]);
        }
        // setUpdateList(!updateList);
      }
    } catch (error) {
      message.error('Xoá địa chỉ giao hàng thất bại.');
    }
  };

  // event: đặt mặc định
  const onSetDefaultDeliveryAdd = async (addressId) => {
    try {
      const response = await addressApi.putSetDefaultDeliveryAddress(addressId);
      if (response) {
        message.success('Cập nhật thành công');
        let defaultAddIndex = 0;
        list.forEach((item, index) => {
          if (item.id === addressId) {
            item.defaultAddress = true;
            defaultAddIndex = index;
          } else {
            item.defaultAddress = false;
          }
        });
        list.sort(
          (a, b) => -(Number(a.defaultAddress) - Number(b.defaultAddress)),
        );
        if (isSubscribe) setList([...list]);
      }
    } catch (error) {
      message.error('Cập nhật thất bại.');
    }
  };

  // fn: hiển thị danh sách
  function showAddressList(list = [], showAll = false) {
    let newList = [];
    if (showAll) {
      newList = list;
    } else {
      newList.push(list[0]);
    }
    return (
      newList &&
      newList.map((item, index) => (
        <div
          className={`bg-white bor-rad-8 box-sha-home p-tb-8 p-lr-16 m-b-16 ${
            activeItem === index && isCheckout ? 'item-active' : ''
          }`}
          onClick={() => {
            if (isCheckout) {
              setActiveItem(index);
              onChecked({
                deliveryAdd: item.id,
                province: item.ward.district.province.id,
              });
            }
          }}
          key={index}>
          <Row>
            <Col span={18}>
              <p className="m-b-6">
                <b>Người nhận: </b> {item.reciver}
              </p>
              <p className="m-b-6">
                <b>Địa chỉ:</b> {item.ward.district.province.name} ,{' '}
                {item.ward.district.prefix + ' ' + item.ward.district.name} ,{' '}
                {item.ward.prefix + ' ' + item.ward.name}
              </p>
              <p className="m-b-6">
                <b>Số nhà:</b> {item.details}
              </p>
              <p className="m-b-6">
                <b>Số điện thoại:</b> {item.phone}
              </p>
            </Col>
            <Col span={24} sm={6}>
              <Row className="m-b-4" justify="end">
                <h3>
                  <b>{item.name}</b>
                  {item.defaultAddress && (
                    <span
                      className="font-size-12px p-tb-4 p-lr-8 m-l-8 bor-rad-4"
                      style={{ border: 'solid 1px #3a5dd9', color: '#3a5dd9' }}>
                      Mặc định
                    </span>
                  )}
                </h3>
                <div>
                  {!showAll && (
                    <Button
                      type="link"
                      onClick={() => {
                        setIsVisibelAddressList((prev) => !prev);
                      }}>
                      Thay đổi
                    </Button>
                  )}
                </div>
                {!item.defaultAddress && (
                  <div>
                    <Button
                      type="primary"
                      onClick={() => onSetDefaultDeliveryAdd(item.id)}>
                      Đặt mặc định
                    </Button>
                    <br />
                    <Button
                      // style={{width:'100%'}}
                      className="w-100 m-t-5"
                      danger
                      type="primary"
                      onClick={() => onDelDeliveryAdd(item.id)}>
                      Xoá
                    </Button>
                  </div>
                )}
              </Row>
            </Col>
          </Row>
        </div>
      ))
    );
  }

  // event: Lấy danh sách địa chỉ
  useEffect(() => {
    isSubscribe = true;
    async function getDeliveryAddressList() {
      try {
        // setIsLoading(true);
        const response = await addressApi.getDeliveryAddressList();
        if (isSubscribe && response) {
          setList(response.data.list);
        }
      } catch (error) {
        if (isSubscribe) {
          setList([]);
          // setIsLoading(false);
        }
      }
    }
    if (user.id) getDeliveryAddressList();
    return () => (isSubscribe = false);
  }, [user, updateList]);

  // rendering
  return (
    // <>
    //   {isLoading ? (
    //     <div className="t-center m-tb-48">
    //       <Spin tip="Đang tải danh sách địa chỉ giao hàng ..." size="large" />
    //     </div>
    //   ) : (
    <div className="User-Address-List">
      {/* thêm địa chỉ, chỉ cho tối đa 5 địa chỉ */}
      {list.length < 5 && (
        <Button
          type="dashed"
          size="large"
          className="w-100"
          onClick={() => setIsVisibleForm(true)}
          style={{ height: 54 }}>
          <PlusOutlined />
          Thêm địa chỉ
        </Button>
      )}
      {/* hiện danh sách địa chỉ */}
      {list.length > 0 ? (
        <div className="m-t-16">{showAddressList(list, showAll)}</div>
      ) : (
        <h3 className="m-t-16 t-center" style={{ color: '#888' }}>
          Hiện tại bạn chưa có địa chỉ giao, nhận hàng nào
        </h3>
      )}
      {isVisibleForm && (
        <AddressAddForm
          onCloseForm={(addFlag) => {
            // cở hiệu báo thêm mới địa chỉ thành công để cập nhật lại địa chỉ
            if (addFlag) setUpdateList(!updateList);
            setIsVisibleForm(false);
          }}
        />
      )}

      <Modal
        visible={isVisibelAddressList}
        // closable={true}
        // maskClosable={false}
        onCancel={() => {
          setIsVisibelAddressList(false);
          // onCloseForm();
        }}
        cancelText={'Thoát'}
        okText={'Chọn'}
        onOk={() => {
          [list[0], list[activeItem]] = [list[activeItem], list[0]];
          setList([...list]);
          setIsVisibelAddressList(false);
        }}
        centered
        width={768}>
        <div className="m-t-20">{showAddressList(list, true)}</div>
      </Modal>
    </div>
    //     )}
    //   </>
  );
}

AddressUserList.defaultProps = {
  isCheckout: false,
  onChecked: function () {},
};

AddressUserList.propTypes = {
  isCheckout: PropTypes.bool,
  onChecked: PropTypes.func,
};

export default AddressUserList;
