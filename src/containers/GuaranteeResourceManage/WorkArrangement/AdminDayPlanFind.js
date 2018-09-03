
import React from 'react';
import {
    Form,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    message,
} from 'antd';
import {  Row, Col} from 'antd';

import Api from '../../../api/request';
import { Tabs } from 'antd';
import Pagination from '../../../components/Pagination';
import TaskListArrangement from '../WorkArrangement/TaskListArrangement';
import EmpArrangement from './EmpArrangement';
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

let modalKey = 0;   //  用于重置modal


// Admin一线员工安排--日计划查询
 class AdminDayPlanFind extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            EmpArrangementVisible:false,
            wwpDayPlanVisible:false,
            data: [],
            tableLoading:false,
            updateState:false,
            page:{},
            pageNow:1,
            loading: false,
            wwpDayPlan:false,
            Emp:false,

        };
        this.columns = [{
            title: 'executeTime',
            dataIndex: 'executeTime',
            key: 'executeTime',
            render:(text,record) => {
                const time = this.changetime(record.executeTime);
                return <span>{time}</span>
            }
        }, {
            title: 'empArrangeState',
            dataIndex: 'empArrangeState',
            key: 'empArrangeState',
        },{
            title: 'checkBy',
            dataIndex: 'checkBy',
            key: 'checkBy',
        },{
            title: 'checkByName',
            dataIndex: 'checkByName',
            key: 'checkByName',
        },{
            title: 'checkTime',
            dataIndex: 'checkTime',
            key: 'checkTime',
            render:(text,record) => {
                const time =record.checkTime!=null? this.changetime(record.checkTime):'';
                return <span>{time}</span>
            }
        },{
            title: 'wwpWorkInfo',
            dataIndex: 'wwpWorkInfo',
            key: 'wwpWorkInfo'
        },{
            title: 'checkState',
            dataIndex: 'checkState',
            key: 'checkState'
        },{
            title: 'wwpCommandNo',
            dataIndex: 'wwpCommandNo',
            key: 'wwpCommandNo'
        },{
            width:120,
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <span className="action">
                         <a onClick={() => this.wwpDayPlanModal(text,record)}>工作包日计划人员安排</a>
                         <span className="ant-divider" />
                         <a onClick={()=>this.EmpArrangement(text,record)}>人员安排查看</a>
                     </span>
                )
            }
        },
        ]
    }

     // 人员安排查看
     EmpArrangement = (record) => {
         // console.log(record.wwpId);
         let Emp = false;
         if(record.id) {
             Emp = record;
         }
         this.setState({
             Emp:Emp,
             EmpArrangementVisible: true
         });
     };
     EmpArrangementCancel = () => {
         this.setState({
             EmpArrangementVisible:false
         });

     };

// 工作包日计划员工安排
     wwpDayPlanModal = (record) => {
         let wwpDayPlan = false;
         if(record.id) {
             wwpDayPlan = record;
         }
         this.setState({
             wwpDayPlan:wwpDayPlan,
             wwpDayPlanVisible: true
         });
     };
    wwpDayPlanCancel = () => {
         this.setState({
             wwpDayPlanVisible:false
         });

     };


     componentWillMount () {
         const value=this.props.AdminDayPlanFind;
         // console.log(value);
             Api.post('weekWorkPackageEmployee/findWwpaByWwpId',{
                 'wwpId':value.wwpId
             }).then(res=>{
                 // console.log('aaa',res);
                 this.setState({
                     data:res? res.data:[],
                     page:res.pageInfo
                 });
             })

     }
//将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D = date.getDate();
         return Y+M+D
     };



// 分页查询
   onChange = (pageNumber) => {

    };



    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data ,tableLoading,wwpDayPlanVisible,page,EmpArrangementVisible} =this.state;
        modalKey++;
        return(
            <div>
                <div className="content">
                    <div style={{width:'100%'}}>
                        <Modal
                            title="查询符合条件的员工（工作包日计划）"
                            visible={wwpDayPlanVisible}
                            onCancel={this.wwpDayPlanCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                            width="80%"
                        >
                            <TaskListArrangement wwpDayPlan={this.state.wwpDayPlan}/>
                        </Modal>
                        <Modal
                            title="人员安排详情"
                            visible={EmpArrangementVisible}
                            onCancel={this.EmpArrangementCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyc`}
                            width="80%"
                        >
                            <EmpArrangement  Emp={this.state.Emp}/>
                        </Modal>

                    </div>

                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false}/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const AdminDayPlanFinds = Form.create()(AdminDayPlanFind);
export default AdminDayPlanFinds;


