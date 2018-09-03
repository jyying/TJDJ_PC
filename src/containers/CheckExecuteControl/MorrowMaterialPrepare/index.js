import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker} from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const title = () =>{
    return '次日航材工具准备'
};

const data =
    [
        {
            key:'1',
            material:'航材一',
            detail:'库存30，紧张，需加料。。。'
        },
        {
            key:'2',
            material:'航材二',
            detail:'库存100。。。'
        }
    ];
const columns = [{
    title: '航材',
    dataIndex: 'material',
    key: 'material'
},
    {
        title: '详细信息',
        dataIndex: 'detail',
        key: 'detail'
    }
];

function onChange(date, dateString) {
    console.log(date, dateString);
}
export default class MorrowMaterialPrepare extends React.Component{
    render() {
        return (
            <div>
                <div className="header">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="材料名称"
                        >
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

                        </FormItem>
                        <FormItem
                            label="件号"
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
                            <Button type="primary">查询</Button>
                        </Col>
                    </Row>
                    <Table columns={columns} dataSource={data} bordered size="small" title={title}/>
                </div>
            </div>
        );
    }
}
































