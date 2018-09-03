/**
 * Created by Administrator on 2017/7/7/007.
 */
import './index.css';
import React from 'react';
import SearchInput from '../../../components/SearchInput';
import { Table,Upload, Button, Icon } from 'antd';



const columns = [{
    title: 'Name',
    dataIndex: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Age',
    dataIndex: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
},{
    title:'photos',
    dataIndex:'photos',
    render:()=>{
        return(
            <Upload {...props}>
                <Button>
                    <Icon type="upload" /> upload
                </Button>
            </Upload>
        )
    }
}];
const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
}, {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
}];

const props = {
    action: '//jsonplaceholder.typicode.com/posts/',
    listType: 'picture',
    className: 'upload-list-inline',
};

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
};



class PackageNumberManagement extends React.Component{
    render(){
        return(
            <div>
               <SearchInput/>
                <div className="content">
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                </div>
            </div>
        )
    }
}
export default PackageNumberManagement;