import React from 'react';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';



class CardManagement extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '名称',
            dataIndex: 'name',
            width: '30%'
        }, {
            title: '级别',
            dataIndex: 'level',
        }, {
            title: '序号',
            dataIndex: 'address',
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
                                <a href="#">Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource: [
                {
                key: '0',
                name: 'Edward King 0',
                level: '多',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                level: '多',
                address: 'London, Park Lane no. 1',
            },
                {
                    key: '2',
                    name: 'Edward King 1',
                    level: '少',
                    address: 'London, Park Lane no. 1',
                },
                {
                    key: '3',
                    name: 'Edward King 1',
                    level: '多',
                    address: 'London, Park Lane no. 1',
                }
            ],
            count: 4
        };
    }

    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }

    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <div className="header">
                <Table bordered dataSource={dataSource} columns={columns} size="small"/>
            </div>
        );
    }
}

export default CardManagement;