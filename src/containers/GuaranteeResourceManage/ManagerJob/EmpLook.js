import './index.css'
import React from 'react';
import Api from '../../../api/request';
import {
    Table,Popconfirm,message
} from 'antd';

class EmpLook extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            // empdata2:[]
            data: [],
            loading:true,
        };
        this.columns = [{
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
        const value=this.props.Emps;
        // console.log('value',value,e);
        Api.post('weekWorkPackageManagerOperating/wwpaSubTaskListDeleteSchedulingByEmpManager',{
            'empId':e.id,
            'stlId':value.stlId,
            'wwpId':e.wwpId,
            'wwpaId':e.wwpaId,
            'receiveState':'D'
        }).then(res=>{
            // console.log(res);
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

    componentWillMount () {
        const value=this.props.Emps;
        // console.log('value',value);
        Api.post('weekWorkPackageManagerOperating/findWwpaStlEmpArrListByEmpManager',{
            'subTaskListId':value.stlId,
            'wwpaId':value.wwpaId
        }).then(res=>{
            // console.log(res);
            // const empdata2=[];
            // // console.log('res',res.data);
            // for(let i=0;i<res.data.length;i++){
            //     empdata2.push(res.data[i].empName);
            // }
            this.setState({
                // empdata2:empdata2
                data:res? res.data:[],
                loading:false,
            });

        });
    }



    render(){
         // const empdata2=this.state.empdata2;
        const columns = this.columns;
        const { data } = this.state;
        return(
            <div>
                <div className="content">
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} bordered size="small"/>
                   {/*<div>*/}
                       {/*<span>工作清单人员安排：</span><span>{empdata2.map((s,v)=><span key={v} className="emplook">{s}</span>)}</span>*/}
                   {/*</div>*/}
                </div>
            </div>
        )
    }
}

export default EmpLook;


