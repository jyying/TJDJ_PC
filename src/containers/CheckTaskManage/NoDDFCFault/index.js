/**
 * Created by dengyou on 2017/6/30.
 */

import './index.css';
import React from 'react';
import { Table, Input, Icon, Button, Popconfirm,Row } from 'antd';


class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    }
    check = () => {
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

class NoDDFCFault extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: 'Type',
            dataIndex: 'type',
            width: '10%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'name')}
                />
            ),
        }, {
            title: '故障',
            dataIndex: 'age',
        }, {
            title: '所需航材',
            dataIndex: 'address',
        }, {
            title: '提报人',
            dataIndex: 'name',
        }, {
            title: '提报时间',
            dataIndex: 'time',
        },
            {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (
                    this.state.dataSource.length > 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)} className="Pop">
                                <a href="#">Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource: [{
                key: '0',
                type: 'A320',
                age: '32',
                address: 'London, Park Lane no. 0',
                name: '张三',
                time: '2017/7/3',
            }, {
                key: '1',
                type: 'A320',
                age: '32',
                address: 'London, Park Lane no. 1',
                name: '李四',
                time: '2017/7/4',
            }],
            count: 2,
        };
    }
    onCellChange = (index, key) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            dataSource[index][key] = value;
            this.setState({ dataSource });
        };
    }
    onDelete = (index) => {
        const dataSource = [...this.state.dataSource];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    handleAdd = () => {
        // const { count, dataSource } = this.state;
        // const newData = {
        //     key: count,
        //     name: `Edward King ${count}`,
        //     age: 32,
        //     address: `London, Park Lane no. ${count}`,
        // };
        // this.setState({
        //     dataSource: [...dataSource, newData],
        //     count: count + 1,
        // });
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <div className="content">
                <Row><Button className="editable-add-btn" onClick={this.handleAdd} type="primary">提报</Button></Row>
                <Table bordered dataSource={dataSource} columns={columns} size="middle"/>
            </div>
        );
    }
}

export default NoDDFCFault;