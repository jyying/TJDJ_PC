import React from 'react';
import {
    Table,Popconfirm,message
} from 'antd';

import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class WorkDayPeopleLook extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading:true,
        };
        this.columns = [ {
            title: '序号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (text, record,index) => (
                <div>
                    <span>{index+1}</span>
                </div>
            ),
        },
            {
            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: 'E账号',
            dataIndex: 'empEaccount',
            key: 'empEaccount',
        }, {
            title: '部门',
            dataIndex: 'empDepartment',
            key: 'empDepartment',
        }, {
            title: '分线',
            dataIndex: 'empBattleLineName',
            key: 'empBattleLineName',
        }, {
            title: '专业',
            dataIndex: 'empSpecialty',
            key: 'empSpecialty',
        }, {
                title: '安排类型',
                dataIndex: 'wdArrTypeName',
                key: 'wdArrTypeName',
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
                title: '操作',
                key: 'action',
                render: (text, record,index) => (
                    <span >
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.confirm(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                   </span>
                ),

        }];
    }

    // 员工删除
    confirm=(e)=> {
        const value=this.props.dateTime;
        Api.post('weekWorkPackageEmployee/wwpEmpSchedulingByDay',{
            'wwpWdType':'D',
            'employeeIds':e.id,
            'pdState':'D',
            'arrangeDate':value!=undefined?value.format('YYYY-MM-DD'):this.Dates(),
            'remarks':'',
        }).then(res=>{
            if(res.errorCode=='0'){
             message.success('删除成功！');
             this.componentWillMount();
            }else{
                message.error('删除失败！');
            }
        })
    };

    cancel=(e)=> {

    };

    Dates=()=>{
        let now = new Date().getTime();
        let tomorrow = new Date(Number(now) + 24 * 3600 * 1000);
        let year = tomorrow.getFullYear();
        let month = tomorrow.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = tomorrow.getDate();
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day;
    };

    componentWillMount () {
        const value=this.props.dateTime;
        Api.post('weekWorkPackageEmployee/findEmpByWwpaIdOrWorkday',{
            'wwpWdType':'D',
            'arrangeDate':value!=undefined?value.format('YYYY-MM-DD'):this.Dates(),
        }).then(res=>{
            console.log(res);
            this.setState({
                data:res? res.data:[],
                loading:false,
            });

        });
    }
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };



    render(){
        const columns = this.columns;
        const { data } = this.state;
        return(
            <div>
                <div className="content">
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle"/>
                </div>
            </div>
        )
    }
}

export default WorkDayPeopleLook;


