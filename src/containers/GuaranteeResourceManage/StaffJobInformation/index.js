/**
 * Created by dengyou on 2017/7/6.
 */

// import './index.css';
import React from 'react';

import { Table ,Cascader,Row,Button} from 'antd';

const columns = [
    { title: '姓名', width: 100, dataIndex: 'name', key: 'name', fixed: 'left',   filters: [{
        text: 'Joe',
        value: 'Joe',
    }, {
        text: 'Jim',
        value: 'Jim',
    }, {
        text: 'Submenu',
        value: 'Submenu',
    }],
        onFilter: (value, record) => record.name.indexOf(value) === 0, },
    { title: '部门', width: 100, dataIndex: 'department', key: 'department', fixed: 'left',   filters: [{
        text: 'Joe',
        value: 'Joe',
    }, {
        text: 'Jim',
        value: 'Jim',
    }, {
        text: 'Submenu',
        value: 'Submenu',
    }],
        onFilter: (value, record) => record.department.indexOf(value) === 0, },
    { title: '线路1', dataIndex: 'address', key: '1', width: 150,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['无']}/>,},
    { title: '线路 2', dataIndex: 'address', key: '2', width: 150 ,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['无']}/>,},
    { title: '线路 3', dataIndex: 'address', key: '3', width: 150 ,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['无']}/>,},
    { title: '线路 4', dataIndex: 'address', key: '4', width: 150,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['无']}/>, },
    { title: '线路5', dataIndex: 'address', key: '5', width: 150 ,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['无']}/>,},
    { title: '线路6', dataIndex: 'address', key: '6', width: 150 ,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['无']}/>,},
];
// 资质选择
const options = [{
    value: '1',
    label: '1',
}, {
    value: '0',
    label: '0',
}];
// 下拉选择改变
function onChangeCascader (value) {
    console.log(value);
}

const data = [];
data.push({
    key: 1,
    name: `Joe`,
    department: 'TM',

},{
    key: 2,
    name: `Jim`,
    department: 'SB',

});

class StaffJobInformation extends React.Component {
    render() {
        return (
            <div className="bg">
                <div className="content">
                    <Row style={{marginBottom:'10px'}}><Button type="primary">确定</Button></Row>
                    <Table columns={columns} dataSource={data} scroll={{ x: 800, y: 300 }} size='middle'/>
                </div>
            </div>
        );
    }
}

export default StaffJobInformation;