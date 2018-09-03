
import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker, Upload, message, Popconfirm } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;


const title = () =>{
    return '人员状态信息'
};
const title2 = () =>{
    return '人员排班安排'
};

const data = [
    {
        key:'1',
        name:'张三',
        num:'24534',
        section:'维修部',
        state:'培训'
    },
    {
        key:'2',
        name:'李四',
        num:'363456',
        section:'维修部',
        state:'在职'
    },
    {
        key:'3',
        name:'赵武',
        num:'12533423',
        section:'事业部',
        state:'培训'
    },
    {
        key:'4',
        name:'周日',
        num:'979',
        section:'工程部',
        state:'出差'
    }
];


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

function onChange(date, dateString) {
    console.log(date, dateString);
}

export default class WorkExecuteClose extends React.Component{

    constructor(props) {
        super(props);
        this.columns = [{
            title: '姓名',
            dataIndex: 'name',
            width: '30%',
            render: (text, record, index) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(index, 'name')}
                />
            ),
        }, {
            title: '工号',
            dataIndex: 'num',
        }, {
            title: '部门',
            dataIndex: 'section',
        },  {
            title: '班次',
            dataIndex: 'shift',
        },{
            title: '工作任务',
            dataIndex: 'task',
        },{
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
                name: '张三',
                num: '2323424',
                section: '维修部',
                shift:'白班',
                task:'维修飞机'
            }, {
                    key: '1',
                    name: '李四',
                    num: '32333424',
                    section: '维修部',
                    shift:'夜班',
                    task:'维修飞机'
                },{
                    key: '2',
                    name: '张武',
                    num: '5323424',
                    section: '维修部',
                    shift:'白班',
                    task:'维修飞机'
                },
            ],
            count: 3,
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
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }



    state = {
        filteredInfo: null,
        sortedInfo: null
    };
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }
    render(){
        const { dataSource } = this.state;
        const columns = this.columns;
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns1 = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '工号',
            dataIndex: 'num',
            key: 'num',
            sorter: (a, b) => a.num - b.num,
            sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order
        }, {
            title: '部门',
            dataIndex: 'section',
            key: 'section',
            filters: [
                { text: '维修部', value: '维修部' },
                { text: '工程部', value: '工程部' },
                { text: '事业部', value: '事业部' }
            ],
            filteredValue: filteredInfo.section || null,
            onFilter: (value, record) => record.section.includes(value)
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            filters: [
                { text: '在岗', value: '在岗' },
                { text: '出差', value: '出差' },
                { text: '培训', value: '培训' }
            ],
            filteredValue: filteredInfo.state || null,
            onFilter: (value, record) => record.state.includes(value)
        }
        ];
        return (
            <div>
                <div className="header">
                    <Table columns={columns1} dataSource={data} bordered size="small" title={title} onChange={this.handleChange}/>
                </div>
                <div className="content">
                    <Row style={{margin:'10px auto'}}>
                        <Col span={12}>
                            时间：<DatePicker onChange={onChange} size="small"/>
                        </Col>
                        <Col span={12}>
                            <Button onClick={this.handleAdd}>增加</Button>
                        </Col>
                    </Row>
                    <Table columns={columns} dataSource={dataSource} bordered size="small" title={title2} onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
}





