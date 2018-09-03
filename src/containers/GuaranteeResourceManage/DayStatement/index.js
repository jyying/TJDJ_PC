import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Popconfirm, Icon, message,Tabs,Modal} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import AddList from './AddList';
import UpdateList from './UpdateList';
import ReturnRecordList from './ReturnRecordList';
import AddReturnRecord from './AddReturnRecord';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import { DatePicker } from 'antd';
import moment from 'moment';


// 大修部日报
class DayStatement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            tableLoading:false,
            Loading:false,
            page:{},
            pageNow:1,
            update:false,
            timeData:'',
            dUpdate:false,
            ReturnRecord:false,
            visible:false,
            visible1:false,
            dataSource1:[],
            page1:{},
            AddData:false,
            dataSource2:[],
            page2:{},
            visible2:false,
            Loading1:false
        };

        this.columns = [{
            title: '飞机号',
            dataIndex: 'wwpAirplaneRegNo',
        }, {
            title: '维修工作',
            dataIndex: 'wwpWorkInfo',
            width: '10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.wwpWorkInfo}>{record.wwpWorkInfo}</div>
            }
        },{
            title: '指令号',
            dataIndex: 'wwpCommandNo',
        }, {
            title: '开始执行时间',
            dataIndex: 'wwpExecuteStartTime',
            key: 'wwpExecuteStartTime',
            render:(text,record) => {
                const time = record.wwpExecuteStartTime!=null?this.changetime(record.wwpExecuteStartTime):'';
                return <span>{time}</span>
            }
        }, {
            title: '结束执行时间',
            dataIndex: 'wwpExecuteEndTime',
            key: 'wwpExecuteEndTime',
            render:(text,record) => {
                const time = record.wwpExecuteEndTime!=null?this.changetime(record.wwpExecuteEndTime):'';
                return <span>{time}</span>
            }
        },{
            title: '停场时间',
            dataIndex: 'wwpAirplaneStandDays',
        }, {
            title: '机位',
            dataIndex: 'wwpImportStandInfo',
        },{
            title: '生产线经理',
            dataIndex: 'empMNames',
        },{
            title: '定检状态',
            dataIndex: 'wwpPackageStatusRemark',
        // }, {
        //     title: '操作',
        //     render: (text, record,index) => (
        //         <span>
        //             <a  onClick={()=>this.handling(record)}>处理</a>
        //             <span className="ant-divider" />
        //             <a  onClick={()=>this.UpdateDate(record)}>修改</a>
        //             <span className="ant-divider" />
        //             <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
        //          </span>
        //     ),
        }];

        // 影响定检工作进度的信息汇总
        this.columns1 = [{
            title: '飞机号',
            dataIndex: 'airplaneNo',
        }, {
            title: '当日进度',
            dataIndex: 'dailySchedule',
        },{
            title: '航材、工具保障',
            dataIndex: 'hcToolInfo',
        }, {
            title: '影响工作进度的描述',
            dataIndex: 'bugInfo',
            width: '25%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.bugInfo}>{record.bugInfo}</div>
            }
        },{
            title: '是否更新',
            dataIndex: 'updateState',
            }, {
                title: '操作',
                render: (text, record,index) => (
                    <span>
                        <a  onClick={()=>this.UpdateDate(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
                ),
        }];

        // 当日定检飞机退单统计
        this.columns2 = [{
            title: '飞机号',
            dataIndex: 'airplaneNo',
        }, {
            title: 'SN',
            dataIndex: 'snNo',
        },{
            title: 'ITEM',
            dataIndex: 'itemNo',
        }, {
            title: '工卡号',
            dataIndex: 'subtaskNo',
        },{
            title: '工作内容',
            dataIndex: 'workInfo',
            width: '20%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workInfo}>{record.workInfo}</div>
            }
        },{
            title: '退单原因',
            dataIndex: 'returnReason',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate1(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete1(record)} onCancel={this.cancel1} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
            ),
        }];
    }

    // 删除退单统计
    delete1=(e)=> {
        Api.post('subtaskReturnRecord/addOrUpdate',{
            srrId:e.id,
            wwpId:e.wwpId,
            wwpaId:e.wwpaId,
            airplaneNo:e.airplaneNo,
            snNo:e.snNo,
            itemNo:e.itemNo,
            subtaskNo:e.subtaskNo,
            workInfo:e.workInfo,
            returnReason:e.returnReason,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                const m=this.state.AddData;
                Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
                    wwpId:m?m.wwpId:null,
                    wwpaId:m?m.id:null,
                    state:'',
                    pageNow:this.state.pageNow
                }).then(res=>{
                    this.setState({
                        dataSource2:res? res.data:[],
                        page2:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel1=(e)=> {

    };

    // 删除
    delete=(e)=> {
        Api.post('wwpBugSummary/addOrUpdate',{
            bsId:e.id,
            wwpId:e.wwpId,
            wwpaId:e.wwpaId,
            airplaneNo:e.airplaneNo,
            dailySchedule:e.dailySchedule,
            hcToolInfo:e.hcToolInfo,
            bugInfo:e.bugInfo,
            updateState:e.updateState,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                const m=this.state.AddData;
                Api.post('wwpBugSummary/findWwpBugSummaryCondition',{
                    wwpId:m?m.wwpId:null,
                    wwpaId:m?m.id:null,
                    state:'',
                    pageNow:this.state.pageNow
                }).then(res=>{
                    this.setState({
                        dataSource1:res? res.data:[],
                        page1:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel=(e)=> {

    };
    // 处理过程及结果
    handling = (record) => {
        let handlingDate = false;
        if(record.id) {
            handlingDate = record;
        }
        this.setState({
            visible1: true,
            handlingDate:handlingDate
        });

    };
    // handlingCancel = () => {
    //     this.update();
    //     this.setState({
    //         visible1: false,
    //     });
    // };
    // 退单统计表格数据修改
    UpdateDate1 = (record) => {
        let ReturnRecord = false;
        if(record.id) {
            ReturnRecord = record;
        }
        this.setState({
            visible1: true,
            ReturnRecord:ReturnRecord
        });

    };
    handleCancel1 = () => {
        const m=this.state.AddData;
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
        this.setState({
            visible1: false,
        });
    };

    // 表格数据修改
    UpdateDate = (record) => {
        let dUpdate = false;
        if(record.id) {
            dUpdate = record;
        }
        this.setState({
            visible: true,
            dUpdate:dUpdate
        });

    };
    handleCancel = () => {
        const m=this.state.AddData;
        Api.post('wwpBugSummary/findWwpBugSummaryCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
        this.setState({
            visible: false,
        });
    };
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    componentDidMount () {
        this.update();

    }

    // 更新页面数据
    update(){
        this.setState({
            tableLoading:true,
        });
        this.props.form.validateFields((err, values) => {
            Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                // 'handOverDate':values.handOverDate.format('YYYY-MM-DD'),
                pageNow:this.state.pageNow,
                executeStartTime:values.handOverDate.format('YYYY-MM-DD'),
                executeEndTime:values.handOverDate.format('YYYY-MM-DD'),
            }).then(res=>{
                this.setState({
                    tableLoading:false,
                    dataSource:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });


    };

    handleReset = () => {
        this.props.form.resetFields();
    };


    callback=(key)=> {
    console.log(key);
};
    // 当日定检飞机退单统计
    Add1 = () => {
        if(this.state.AddData){
            this.setState({
                visible2: true,
            });
        }else {
            message.warning('您未选择任何工作包，请先单击需要添加项的工作包！');
        }

    };
    handleCancel2 = () => {
        const m=this.state.AddData;
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
        this.setState({
            visible2:false
        });
    };

    // 新增影响定检工作进度的信息
    Add = () => {
        if(this.state.AddData){
            this.setState({
                update: true,
            });
        }else {
            message.warning('您未选择任何工作包，请先单击需要添加项的工作包！');
        }

    };
    handleCancelAdd = () => {
        const m=this.state.AddData;
        Api.post('wwpBugSummary/findWwpBugSummaryCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
        this.setState({
            update:false
        });
    };
    onOk=(value)=>{
        this.setState({
            tableLoading:true,
        });
        const timeData=value.format('YYYY-MM-DD');
        Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
            pageNow:this.state.pageNow,
            executeStartTime:timeData,
            executeEndTime:timeData,
        }).then(res=>{
            this.setState({
                tableLoading:false,
                timeData:timeData,
                dataSource:res? res.data:[],
                page:res.pageInfo,
            });

        })
    };
// 分页查询
    onChange1 = (pageNumber) => {
        // console.log('Page: ', pageNumber);
        this.props.form.validateFields((err, values) => {
            Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                executeStartTime:values.handOverDate.format('YYYY-MM-DD'),
                executeEndTime:values.handOverDate.format('YYYY-MM-DD'),
                pageNow:pageNumber
            }).then(res=>{
                this.setState({
                    dataSource:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });
    };

    onChange2 = (pageNumber) => {
        const m=this.state.AddData;
        Api.post('wwpBugSummary/findWwpBugSummaryCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:pageNumber
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
    };
    onChange3 = (pageNumber) => {
        const m=this.state.AddData;
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:pageNumber
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
    };

    // 单击工作包
    onRowClick=(record, index, event)=>{
        let AddData = false;
        if(record.id) {
            AddData = record;
        }
        Api.post('wwpBugSummary/findWwpBugSummaryCondition',{
            wwpId:record.wwpId,
            wwpaId:record.id,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
                AddData:AddData
            });
        });
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:record.wwpId,
            wwpaId:record.id,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
    };


    render(){
        const {  selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const columns1 = this.columns1;
        const columns2 = this.columns2;
        const {dataSource ,dataSource1,visible,visible1,tableLoading,page,dUpdate,handlingDate,Loading,page1,AddData,Loading1,dataSource2,ReturnRecord,visible2,page2} = this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        const d = new Date();
        return(
                <div className="content" >

                    {/*<div style={{float: 'left'}}>*/}
                        {/*<Button className="editable-add-btn btn_reload" onClick={this.handleAdd} style={{marginRight:'10px' }}><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>*/}

                    {/*</div>*/}
                    <Modal
                        title="新建"
                        visible={this.state.update}
                        onCancel={this.handleCancelAdd}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}a`}
                    >
                        <AddList onCancel={this.handleCancelAdd} AddData={AddData}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible}
                        onCancel={this.handleCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}b`}
                    >
                        <UpdateList dUpdate={dUpdate} onCancel={this.handleCancel}/>
                    </Modal>
                    <Modal
                        title="新建"
                        visible={visible2}
                        onCancel={this.handleCancel2}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}d`}
                    >
                        <AddReturnRecord onCancel={this.handleCancel2} AddData={AddData}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible1}
                        onCancel={this.handleCancel1}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}c`}
                    >
                        <ReturnRecordList ReturnRecord={ReturnRecord} onCancel={this.handleCancel1}/>
                    </Modal>
                    <Table bordered dataSource={dataSource} columns={columns} loading={tableLoading} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div className="dataPicker">
                               {getFieldDecorator(`handOverDate`,{
                                   rules: [{ required: true, message: '日期不能为空!' }],
                                   initialValue:moment(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), dateFormat),
                               })(
                                   <DatePicker onChange={this.onChange} onOk={this.onOk} format="YYYY-MM-DD" showTime/>
                               )}
                           </div>}
                           onRowClick={this.onRowClick}
                            rowClassName={(record, index)=>AddData.id==record.id?'row_Color':null}
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange1}
                    />
                    <Table bordered dataSource={dataSource1} columns={columns1}  loading={Loading} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>影响定检工作进度的信息汇总</span>
                               <Button type="primary" onClick={()=>this.Add()} style={{float:'left'}}>新增</Button>
                           </div>}
                    />
                    <Pagination
                        {...page1}
                        onChange={this.onChange2}
                    />
                    <Table bordered dataSource={dataSource2} columns={columns2}  loading={Loading1} rowKey='id' pagination={false} size="middle"  className='table'
                           title={() => <div >
                               <span>当日定检飞机退单统计</span>
                               <Button type="primary" onClick={()=>this.Add1()} style={{float:'left'}}>新增</Button>
                           </div>}
                    />
                    <Pagination
                        {...page2}
                        onChange={this.onChange3}
                    />
                </div>

        )
    }
}
const DayStatements = Form.create()(DayStatement);
export default DayStatements;


