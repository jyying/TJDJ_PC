/**
 * Created by dengyou on 2017/6/30.
 */

import './index.css';
import React from 'react';
import SearchInput from '../../../components/SearchInput/index';
import {Row,Table, Badge, Menu, Dropdown, Icon } from 'antd';


const menu = (
    <Menu>
        <Menu.Item>
            Action 1
        </Menu.Item>
        <Menu.Item>
            Action 2
        </Menu.Item>
    </Menu>
);
const expandedRowRender = () => {
    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
        { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: () => (
                <span className={'table-operation'}>
            <a href="#">Pause</a>
            <a href="#">Stop</a>
            <Dropdown overlay={menu}>
              <a href="#">
                More <Icon type="down" />
              </a>
            </Dropdown>
          </span>
            ),
        },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
        data.push({
            key: i,
            date: '2014-12-24 23:12:00',
            name: 'This is production name',
            upgradeNum: 'Upgraded: 56',
        });
    }
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );
};

const columns = [
    { title: 'Type', dataIndex: 'name', key: 'name' },
    { title: 'DD', dataIndex: 'platform', key: 'platform' },
    { title: 'FC', dataIndex: 'version', key: 'version' },
    { title: 'NRC', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Action', key: 'operation', render: () => <a href="#">Publish</a> },
];

const data = [];
for (let i = 0; i < 3; ++i) {
    data.push({
        key: i,
        name: 'A302',
        platform: 'DD信息',
        version: 'FC信息',
        upgradeNum: 'NRC信息',
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
    });
}
class DDInformation extends React.Component{

    constructor(){
        super();
        this.state={

        };
    }

    componentDidMount() {

    };

    render() {
        return (
            <div className="bg">
                <SearchInput />
                <Row className='content'>
                    <Table
                        className="components-table-demo-nested"
                        columns={columns}
                        expandedRowRender={expandedRowRender}
                        dataSource={data}
                        size="middle"
                    />
                </Row>
            </div>
        )
    };

}
export default DDInformation;