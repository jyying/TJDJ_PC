import React from 'react';
import {Table} from 'antd';


const title = () =>{
    return '定检生产前的生产准备'
};

const data =
    [
        {
            key:'1',
            prepare:'维修工作项目负责人',
            detail:'开工前对对维修工作所需的航材及工装进行食物确认。。。'
        },
        {
            key:'2',
            prepare:'飞机技术支援和控制工程师',
            detail:'在任务下发前提前与维修 计划工程师沟通。。。'
        },
        {
            key:'3',
            prepare:'航线整机放行人员',
            detail:'记录本机组反应的故障。。。'
        },
        {
            key:'4',
            prepare:'航线/定检车间干部',
            detail:'从生产技术部接受任务。。。'
        },
        {
            key:'5',
            prepare:'维修工作项目负责人',
            detail:'开工前对对维修工作所需的航材及工装进行食物确认。。。'
        },
        {
            key:'6',
            prepare:'飞机技术支援和控制工程师',
            detail:'在任务下发前提前与维修 计划工程师沟通。。。'
        },
        {
            key:'7',
            prepare:'航线整机放行人员',
            detail:'记录本机组反应的故障。。。'
        },
        {
            key:'8',
            prepare:'航线/定检车间干部',
            detail:'从生产技术部接受任务。。。'
        },
        {
            key:'9',
            prepare:'维修工作项目负责人',
            detail:'开工前对对维修工作所需的航材及工装进行食物确认。。。'
        },
        {
            key:'10',
            prepare:'飞机技术支援和控制工程师',
            detail:'在任务下发前提前与维修 计划工程师沟通。。。'
        },
        {
            key:'11',
            prepare:'航线整机放行人员',
            detail:'记录本机组反应的故障。。。'
        },
        {
            key:'12',
            prepare:'航线/定检车间干部',
            detail:'从生产技术部接受任务。。。'
        }
    ];
const columns = [{
    title: '准备项',
    dataIndex: 'prepare',
    key: 'prepare'
},
    {
        title: '详细信息',
        dataIndex: 'detail',
        key: 'detail'
    }
];


export default class CheckProductionPrepare extends React.Component{
    render() {
        return (
            <div>
                <div className="content">
                    <Table columns={columns} dataSource={data} bordered size="small" title={title}/>
                </div>
            </div>
        );
    }
}































