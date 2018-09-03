import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

const data =
    [
        {
            key:'1',
            name:'部件一',
            num:'123',
            detail:'飞机尾部',
            children:[
                {
                    key:'11',
                    name:'部件二',
                    num:'123333',
                    detail:'飞机尾部的次部件',
                    children:[
                        {
                            key:'111',
                            name:'部件三',
                            num:'123333',
                            detail:'飞机尾部最底层部件1'
                        },
                        {
                            key:'112',
                            name:'部件四',
                            num:'123333',
                            detail:'飞机尾部最底层部件2'
                        }
                    ]
                },
                {
                    key:'12',
                    name:'部件一二',
                    num:'123wer',
                    detail:'飞机尾部'
                }
            ]
        },
        {
            key:'2',
            name:'部件二',
            num:'1233333',
            detail:'飞机头部',
            children:[
                {
                    key:'21',
                    name:'部件二',
                    num:'123333',
                    detail:'飞机尾部的次部件',
                    children:[
                        {
                            key:'211',
                            name:'部件三',
                            num:'123333',
                            detail:'飞机尾部最底层部件1'
                        },
                        {
                            key:'212',
                            name:'部件四',
                            num:'123333',
                            detail:'飞机尾部最底层部件2'
                        }
                    ]
                },
                {
                    key:'22',
                    name:'部件一二',
                    num:'123wer',
                    detail:'飞机尾部'
                }
            ]
        }
    ];



const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'30%'
    },
    {
        title: '件号',
        dataIndex: 'num',
        key: 'num',
        width:'30%'
    },
    {
        title: '详细信息',
        dataIndex: 'detail',
        key: 'detail'
    }
];

const title = () =>{
    return '航材使用情况统计表'
};

function onChange(date, dateString) {
    console.log(date, dateString);
}

export default class AirMaterialStatistics extends React.Component{
    state = {
        filteredInfo: null,
        sortedInfo: null
    };

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
                    <Table columns={columns} dataSource={data} bordered size="small" title={title}/>
                </div>
            </div>
        );
    }
}
















