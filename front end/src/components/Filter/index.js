import { Col, Row } from 'antd';
import constants from '../../constants/index';
import React, { useState } from 'react';
import './index.scss';
import MenuFilter from './MenuFilter';

function Filter() {
  // eslint-disable-next-line no-unused-vars
  const [filterDetails, setFilterDetails] = useState({
    visible: false,
    list: [],
    root: '',
  });
  // event: hiển thị chi tiết filter menu
  const onShowDetails = (key) => {
    const list = constants.FILTER_OPTION_LIST.find((item) => item.key === key);
    if (list)
      setFilterDetails({ visible: true, list: list.data, root: list.root });
    else setFilterDetails({ visible: false, list: [], root: '' });
  };

  // rendering ...
  return (
    <Row className="Filter">
      <Col span={3} sm={4} md={10} xl={6}>
        <MenuFilter onShow={onShowDetails} />
      </Col>
    </Row>
  );
}

export default Filter;
