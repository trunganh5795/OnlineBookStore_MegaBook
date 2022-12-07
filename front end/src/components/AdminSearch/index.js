import { Input, Select } from 'antd';
import React, { useState } from 'react';
const { Option } = Select;
export default function AdminSearch({ options, onSearch, selectedOption }) {
  let [option, setOption] = useState(0);
  return (
    <Input.Group className="m-t-10">
      <Select
        defaultValue={selectedOption}
        style={{ width: 180 }}
        size="large"
        onChange={(value) => setOption(value)}>
        {options.map((item, index) => (
          <Option value={item.id} key={index}>
            {item.text}
          </Option>
        ))}
      </Select>
      <Input.Search
        placeholder="Tìm kiếm"
        enterButton="Tìm kiếm"
        size="large"
        loading={false}
        className="admin-search-input"
        onSearch={(value) => onSearch(value, option)} //bấm search hay enter gì cũng ra
      />
    </Input.Group>
  );
}
