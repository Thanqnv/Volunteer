import React from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
const { Search } = Input;
const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1677ff',
        }}
    />
);
const SearchBar = ({
    className,
    placeholder = "Tìm kiếm sự kiện...",
    value,
    onChange,
    onSearch,
    allowClear = true,
    size = "middle",
}) => (
    <Space direction="horizontal" className={className}>
        <Search
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onSearch={onSearch}
            allowClear={allowClear}
            enterButton
            size={size}
        />
    </Space>
);
export default SearchBar;