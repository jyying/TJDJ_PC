
import React from 'react';
import {
    Form,
    Modal,
    Table,
    Popconfirm,
    DatePicker,
    Select,
    message,
} from 'antd';

import Api from '../../../api/request';
import { Tabs } from 'antd';
import UpdateToolPlan from './UpdateToolPlan';
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

let modalKey = 0;   //  用于重置modal

// 次日航材工具准备
 class MorrowToolPlanFind extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tableLoading:true,
            page:{},
            pageNow:1,
            UpdateData:false,
            visible:false
        };
        this.columns = [{
            title: '工卡清单',
            dataIndex: 'subTaskListRemark',
            key: 'subTaskListRemark',
        }, {
            title: '维修项目变更单',
            dataIndex: 'repairChangeRemark',
            key: 'repairChangeRemark',
        },{
            title: '工作安排',
            dataIndex: 'workPlanRemark',
            key: 'workPlanRemark',
        },{
            title: 'DDFC',
            dataIndex: 'ddfcRemark',
            key: 'ddfcRemark',
        },{
            title: '高检流程图',
            dataIndex: 'highCheckRemark',
            key: 'highCheckRemark',
        },{
            title: '挂签颜色',
            dataIndex: 'signColorRemark',
            key: 'signColorRemark',
        },{
            title: '消耗品',
            dataIndex: 'consumablesRemark',
            key: 'consumablesRemark',
        },{
            title: '工卡准备',
            dataIndex: 'subTaskRemark',
            key: 'subTaskRemark',
        },{
            title: '设备情况',
            dataIndex: 'euqipmentRemark',
            key: 'euqipmentRemark',
        },{
            title: '航材',
            dataIndex: 'airmaterialRemark',
            key: 'airmaterialRemark',
        },{
            title: '工具',
            dataIndex: 'toolRemark',
            key: 'toolRemark',
        },{
            title: '金工',
            dataIndex: 'metalWorkingRemark',
            key: 'metalWorkingRemark',
        },{
            title: 'NDT',
            dataIndex: 'ndtRemark',
            key: 'ndtRemark',
        },{
            title: '清洁队',
            dataIndex: 'cleaningTeamRemark',
            key: 'cleaningTeamRemark',
        },{
            title: '工卡站',
            dataIndex: 'subTaskStationRemark',
            key: 'subTaskStationRemark',
        },{
            title: '生产线经理',
            dataIndex: 'lineManagerRemark',
            key: 'lineManagerRemark',
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: (text, record) => {
                const time = record.updateTime != null ? this.changetime(record.updateTime) : '';
                return <span>{time}</span>
            }
        }, {

            title: '操作',
            key: 'action',
            render: (text, record,index) => {
                return (
                    <span className="action">
                             <a onClick={()=>this.showModal(record)}>修改</a>
                            <span className="ant-divider" />
                            <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                        </span>
                )
            },
        }
        ]
    }

     // 删除
     delete=(e)=> {
         const value=this.props.materials;
         Api.post('weekWorkPackageRecord/saveWwpaRecord',{
             'wwparId':e.id,
             'recordState':'D',
             'wwpId':value.id,
             'subTaskListRemark':e.subTaskListRemark,
             'repairChangeRemark':e.repairChangeRemark,
             'workPlanRemark':e.workPlanRemark,
             'ddfcRemark':e.ddfcRemark,
             'highCheckRemark':e.highCheckRemark,
             'signColorRemark':e.signColorRemark,
             'consumablesRemark':e.consumablesRemark,
             'subTaskRemark':e.subTaskRemark,
             'euqipmentRemark':e.euqipmentRemark,
             'airmaterialRemark':e.airmaterialRemark,
             'toolRemark':e.toolRemark,
             'metalWorkingRemark':e.metalWorkingRemark,
             'ndtRemark':e.ndtRemark,
             'cleaningTeamRemark':e.cleaningTeamRemark,
             'subTaskStationRemark':e.subTaskStationRemark,
             'lineManagerRemark':e.lineManagerRemark,
         }).then(res => {
             if(res.errorCode == 0) {
                 message.success('删除成功！');
                 this.componentWillMount();
             } else if(res.errorCode == 1) {
                 message.error('！！！删除失败');
             }
         })
     };
     cancel=(e)=> {

     };

// 修改
    showModal = (record) => {
        let UpdateData = false;
        if(record.id) {
            UpdateData = record;
        }
        this.setState({
            visible: true,
            UpdateData:UpdateData
        });

    };
    handleCancel = () => {
        this.componentWillMount();
        this.setState({
            visible: false,
        });
    };

componentWillMount () {
const value=this.props.materials;
    Api.post('weekWorkPackageRecord/findWwpaRecordByWwpId',{
        'wwpId':value.id,
    }).then(res=>{
    // console.log('工具准备',res);
        this.setState({
            data:res? res.data:[],
            tableLoading:false
        });
        })
}
//将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
         return Y+M+D
     };


// 分页查询
   onChange = (pageNumber) => {
        // console.log('Page: ', pageNumber);
       this.props.form.validateFields(['executeTime'],(err, values) => {
           // console.log('Received values of form: ', values.executeTime.format('YYYY-MM-DD'));
           Api.post('weekWorkPackageEmployee/findWwpaByEmpManager',{
               'pageNow':pageNumber,
               'executeEndTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
               'executeStartTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
           }).then(res=>{
               this.setState({
                   data:res? res.data:[],
                   page:res.pageInfo
               });
           })
       });
    };



    render(){
        const columns = this.columns;
        const { data ,tableLoading,visible,UpdateData,EmpArrangementVisible} = this.state;
        modalKey++;
        return(
            <div>
                <div className="content">
                    <Modal
                        title="修改"
                        visible={visible}
                        onCancel={this.handleCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}b`}
                    >
                        <UpdateToolPlan UpdateData={UpdateData} onCancel={this.handleCancel}/>
                    </Modal>
                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false} bordered size="middle"/>
                </div>
            </div>
        )
    }
}
const MorrowToolPlanFinds = Form.create()(MorrowToolPlanFind);
export default MorrowToolPlanFinds;


