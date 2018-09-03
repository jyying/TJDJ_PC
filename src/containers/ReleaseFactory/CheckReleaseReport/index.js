import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

const data =
    [
        {
            key:'1',
            name:'KO1234',
            level:'A',
            detail:'没有什么大问题'
        },
        {
            key:'2',
            name:'TO1234',
            level:'B',
            detail:'没有什么大问题'
        },
        {
            key:'3',
            name:'HO1234',
            level:'C',
            detail:'没有什么大问题'
        },
        {
            key:'4',
            name:'GO1234',
            level:'A',
            detail:'没有什么大问题'
        },
        {
            key:'5',
            name:'AO1234',
            level:'B',
            detail:'没有什么大问题'
        },
        {
            key:'6',
            name:'BO1234',
            level:'D',
            detail:'没有什么大问题'
        },
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
    };
    clearFilters = () => {
        this.setState({ filteredInfo: null });
    };
    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    };
    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            }
        });
    };






    render() {

        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        const columns = [{
            title: '飞机型号',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name - b.name,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
        }, {
            title: '定检级别',
            dataIndex: 'level',
            key: 'level',
            filters: [
                { text: 'A', value: 'A' },
                { text: 'B', value: 'B' },
                { text: 'C', value: 'C' },
                { text: 'D', value: 'D' }
            ],
            filteredValue: filteredInfo.level || null,
            onFilter: (value, record) => record.level.includes(value)
        }, {
            title: '定检详情',
            dataIndex: 'detail',
            key: 'detail'
        }
        ];

        return (
            <div>
                <div className="header">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="飞机型号"
                        >
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

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
                            时间：<DatePicker onChange={onChange} size="small"/>
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
























