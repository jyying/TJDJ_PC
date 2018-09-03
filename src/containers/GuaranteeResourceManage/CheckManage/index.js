import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

const columns = [
    {
        title: '工卡名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '区域',
        dataIndex: 'area',
        key: 'area'
    },
    {
        title: '工具',
        dataIndex: 'tool',
        key: 'tool'
    },
    {
        title: '航材',
        dataIndex: 'material',
        key: 'material'
    },
    {
        title: '版本信息',
        dataIndex: 'version',
        key: 'version'
    },
    {
        title: '维护',
        dataIndex: 'upkeep',
        key: 'upkeep'
    },
    {
        title: '手册',
        dataIndex: 'book',
        key: 'book'
    },
    {
        title: '风险',
        dataIndex: 'risk',
        key: 'risk'
    }
];
const data = [
    {
        key:'1',
        name:'工卡一',
        area:'机翼',
        tool:'工具一',
        material:'航材一',
        version:'版本信息一',
        upkeep:'机位要求设备要求人员要求',
        book:'手册一，手册二',
        risk:'没有任何风险'
    },
    {
        key:'2',
        name:'工卡一',
        area:'机翼',
        tool:'工具一',
        material:'航材一',
        version:'版本信息一',
        upkeep:'机位要求设备要求人员要求',
        book:'手册一，手册二',
        risk:'没有任何风险'
    }
];



function onChange(date, dateString) {
    console.log(date, dateString);
}

export default class WorkHourStatistics extends React.Component{
    render() {
        return (
            <div>
                <div className="header">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="工卡名"
                        >
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

                        </FormItem>
                        <FormItem
                            label="姓名"
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