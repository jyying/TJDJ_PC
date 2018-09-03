import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

const data =
        [
            {
                key:'1',
                num:'1',
                name:'李四',
                section:'工程部',
                work:'经理',
                time:'32'
            },
            {
                key:'2',
                num:'2',
                name:'张三',
                section:'维修部',
                work:'普工',
                time:'34'
            },
            {
                key:'3',
                num:'3',
                name:'赵武',
                section:'维修部',
                work:'经理',
                time:'31'
            },
            {
                key:'4',
                num:'4',
                name:'李四',
                section:'工程部',
                work:'领班',
                time:'39'
            },
            {
                key:'5',
                num:'5',
                name:'张三',
                section:'人事部',
                work:'普工',
                time:'35'
            }
        ];



function onChange(date, dateString) {
    console.log(date, dateString);
}

export default class WorkHourStatistics extends React.Component{
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
    clearFilters = () => {
        this.setState({ filteredInfo: null });
    }
    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    }
    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    }



    render() {

        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name - b.name,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
        }, {
            title: '工号',
            dataIndex: 'num',
            key: 'num',
            sorter: (a, b) => a.num - b.num,
            sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order,
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
            onFilter: (value, record) => record.section.includes(value),
            sorter: (a, b) => a.section.length - b.section.length,
            sortOrder: sortedInfo.columnKey === 'section' && sortedInfo.order,
        }, {
            title: '职位',
            dataIndex: 'work',
            key: 'work',
            filters: [
                { text: '经理', value: '经理' },
                { text: '普工', value: '普工' },
                { text: '领班', value: '领班' }
            ],
            filteredValue: filteredInfo.work || null,
            onFilter: (value, record) => record.work.includes(value),
            sorter: (a, b) => a.work.length - b.work.length,
            sortOrder: sortedInfo.columnKey === 'work' && sortedInfo.order,
        },
            {
                title: '工时',
                dataIndex: 'time',
                key: 'time',
                sorter: (a, b) => a.time - b.time,
                sortOrder: sortedInfo.columnKey === 'time' && sortedInfo.order,
            }
        ];

        return (
            <div>
                <div className="header">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="用户名"
                        >
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

                        </FormItem>
                        <FormItem
                            label="工号"
                        >
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />

                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                查找
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="content">
                    <Row style={{margin:'10px auto'}}>
                        <Col span={12}>
                            从：<DatePicker onChange={onChange} size="small"/>
                            至：<DatePicker onChange={onChange} size="small"/>
                        </Col>
                        <Col span={12}>
                            <Button type="primary">下载</Button>
                            <Button type="primary">查询</Button>
                        </Col>
                    </Row>
                    <Table columns={columns} dataSource={data} bordered size="small" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
}













