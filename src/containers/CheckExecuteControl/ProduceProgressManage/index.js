import React from 'react';
import {Input, Button,Table, Row, Col,DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;

const columns1 = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'30%'
    },
    {
        title: '锁定情况',
        dataIndex: 'details',
        key: 'details',
        width:'30%'
    },
    {
        title: '满足需求时间',
        dataIndex: 'time',
        key: 'time'
    }
];
const data1 = [
    {
        key:'1',
        name:'工具一',
        details:'缺料',
        time:'下周一'
    },
    {
        key:'2',
        name:'工具二',
        details:'不缺料',
        time:'下周三'
    },
    {
        key:'3',
        name:'航材一',
        details:'不缺料',
        time:'下周一'
    },
    {
        key:'4',
        name:'航材二',
        details:'缺料',
        time:'下周三'
    }
];

const columns2 = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'30%'
    },
    {
        title: '锁定情况',
        dataIndex: 'details',
        key: 'details',
        width:'30%'
    },
    {
        title: '满足需求时间',
        dataIndex: 'time',
        key: 'time'
    }
];
const data2 = [
    {
        key:'1',
        name:'工具一',
        details:'缺料',
        time:'下周一'
    },
    {
        key:'2',
        name:'工具二',
        details:'不缺料',
        time:'下周三'
    },
    {
        key:'3',
        name:'航材一',
        details:'不缺料',
        time:'下周一'
    },
    {
        key:'4',
        name:'航材二',
        details:'缺料',
        time:'下周三'
    }
];

const columns3 = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'30%'
    },
    {
        title: '拆装记录',
        dataIndex: 'details',
        key: 'details',
        width:'30%'
    },
    {
        title: '是否完成',
        dataIndex: 'time',
        key: 'time'
    }
];
const data3 = [
    {
        key:'1',
        name:'串件一',
        details:'从A飞机移到B飞机',
        time:'完成'
    },
    {
        key:'2',
        name:'串件二',
        details:'从A飞机移到B飞机',
        time:'完成'
    },
    {
        key:'3',
        name:'串件三',
        details:'从A飞机移到B飞机',
        time:'未完成'
    },
    {
        key:'4',
        name:'串件四',
        details:'从A飞机移到B飞机',
        time:'完成'
    }
];

const columns4 = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:'30%'
    },
    {
        title: '故障',
        dataIndex: 'details',
        key: 'details',
        width:'30%'
    },
    {
        title: '处理',
        dataIndex: 'time',
        key: 'time'
    }
];
const data4 = [
    {
        key:'1',
        name:'KO432423',
        details:'DD',
        time:'完成'
    },
    {
        key:'2',
        name:'GJ4524',
        details:'FC',
        time:'完成'
    },
    {
        key:'3',
        name:'HJ54645',
        details:'DD',
        time:'未完成'
    },
    {
        key:'4',
        name:'UY46757',
        details:'FC',
        time:'完成'
    }
];


function onChange(date, dateString) {
    console.log(date, dateString);
}
const title1 = () =>{
    return '例行工具航材锁定情况'
};
const title2 = () =>{
    return '非例行工具航材锁定情况'
};
const title3 = () =>{
    return '串件及恢复情况'
};
const title4 = () =>{
    return '飞机故障缺陷监控'
};
export default class ProductionProgressManagement extends React.Component{
    render() {
        return (
            <div>
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
                    <Table columns={columns1} dataSource={data1} bordered size="small" title={title1}/>
                    <Table columns={columns2} dataSource={data2} bordered size="small" title={title2}/>
                    <Table columns={columns3} dataSource={data3} bordered size="small" title={title3}/>
                    <Table columns={columns4} dataSource={data4} bordered size="small" title={title4}/>
                </div>
            </div>
        );
    }
}













