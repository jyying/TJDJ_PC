import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

const data =
    [
        {
            key:'1',
            name:'KO1234',
            part1:'DD',
            part2:'FC',
            part3:'NRC',
            part4:'NRC'
        },
        {
            key:'2',
            name:'FF1234',
            part1:'DD',
            part2:'DD',
            part3:'NRC',
            part4:'NRC'
        },
        {
            key:'3',
            name:'NO1234',
            part1:'FC',
            part2:'FC',
            part3:'NRC',
            part4:'DD'
        },
        {
            key:'4',
            name:'TO1234',
            part1:'NRC',
            part2:'FC',
            part3:'NRC',
            part4:'DD'
        },
        {
            key:'5',
            name:'JJ1234',
            part1:'DD',
            part2:'FC',
            part3:'FC',
            part4:'NRC'
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
            title: '零件1',
            dataIndex: 'part1',
            key: 'part1',
            filters: [
                { text: 'DD', value: 'DD' },
                { text: 'FC', value: 'FC' },
                { text: 'NRC', value: 'NRC' }
            ],
            filteredValue: filteredInfo.part1 || null,
            onFilter: (value, record) => record.part1.includes(value)
        }, {
            title: '零件2',
            dataIndex: 'part2',
            key: 'part2',
            filters: [
                { text: 'DD', value: 'DD' },
                { text: 'FC', value: 'FC' },
                { text: 'NRC', value: 'NRC' }
            ],
            filteredValue: filteredInfo.part2 || null,
            onFilter: (value, record) => record.part2.includes(value)
        },{
            title: '零件3',
            dataIndex: 'part3',
            key: 'part3',
            filters: [
                { text: 'DD', value: 'DD' },
                { text: 'FC', value: 'FC' },
                { text: 'NRC', value: 'NRC' }
            ],
            filteredValue: filteredInfo.part3 || null,
            onFilter: (value, record) => record.part3.includes(value)
        },{
            title: '零件4',
            dataIndex: 'part4',
            key: 'part4',
            filters: [
                { text: 'DD', value: 'DD' },
                { text: 'FC', value: 'FC' },
                { text: 'NRC', value: 'NRC' }
            ],
            filteredValue: filteredInfo.part4 || null,
            onFilter: (value, record) => record.part4.includes(value)
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
























