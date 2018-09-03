/**
 * Created by dengyou on 2017/7/6.
 */

// import './index.css';
import React from 'react';
import { Table ,Cascader,Button,Row } from 'antd';

const columns = [
    { title: '姓名', width: 100, dataIndex: 'name', key: 'name', filters: [{
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
    { title: '部门', width: 100, dataIndex: 'department', key: 'department', filters: [{
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
    { title: '技术级别', dataIndex: 'address', key: '1', width: 150,render: () => <Cascader options={options} onChange={onChangeCascader} placeholder="Please select" defaultValue={['级别1']}/>,},
];
// 资质选择
const options = [{
    value: '级别1',
    label: '级别1',
}, {
    value: '级别2',
    label: '级别2',
}, {
    value: '级别3',
    label: '级别3',
}, {
    value: '级别4',
    label: '级别4',
}];
// 下拉选择改变
function onChangeCascader (value) {
    console.log(value);
}

const data = [];
data.push({
    key: 1,
    name: `Joe`,
    department: 'SB',

},{
    key: 2,
    name: `Jim`,
    department: 'TS',

});

class StaffSkillLevel extends React.Component {
    render() {
        return (
            <div className="bg">
                <div className="content">
                    <Row style={{marginBottom:'10px'}}><Button type="primary">确定</Button></Row>
                    <Table columns={columns} dataSource={data} size='middle'/>
                </div>
            </div>
        );
    }
}

export default StaffSkillLevel;