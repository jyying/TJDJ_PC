import React from 'react';
import {
    Form,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    message,
    Pagination,
    Input,
    Icon
} from 'antd';
import {  Row, Col} from 'antd';

import Api from '../../../api/request';
import { Tabs } from 'antd';
import TaskListArrangement from '../WorkArrangement/TaskListArrangement';
import EmpArrangement from './EmpArrangement';
import TestpilotMan from './TestpilotMan';
import WorkDayPeopleArrangement from './WorkDayPeopleArrangement';
import WorkDayPeopleLook from './WorkDayPeopleLook';
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';


let modalKey = 0;   //  用于重置modal


// 可编辑进场时间
class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: true,
    };
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
        console.log('handleChange',value);
    };
    check = () => {
        console.log('record',this.props.record);
        const records=this.props.record;
        this.setState({ editable: false });
        // if (this.props.onChange) {
        //     this.props.onChange(this.state.value);
        // }
        console.log('check',this.state.value);
        if(this.state.value!=null){
            Api.post('weekWorkPackageEmployee/saveOrUpdateGoInAirPortTime',{
                'goInAirPortTime':this.state.value,
                'wwpaId':records.id,
            }).then(res=>{
                console.log(res);
                if(res.errorCode=='0'){
                    message.success('保存成功！');
                }else{
                    message.error('保存失败！');
                }
            })
        }

    };
    edit = () => {
        this.setState({ editable: true });
    };
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

// Admin一线员工安排
 class WorkArrangement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            EmpArrangementVisible:false,
            wwpDayPlanVisible:false,
            AdminFirstEmpVisible:false,
            WorkDayPeopleVisible:false,
            data: [],
            tableLoading:false,
            updateState:false,
            page:{},
            pageNow:1,
            loading: false,
            AdminDayPlanFind:false,
            dateTime:'',
            Find:false,
            TestpilotManCheck:false,
            WorkDayPeopleLookVisible:false
        };
        this.columns = [ {
            title: '指令号',
            dataIndex: 'wwpCommandNo',
            key: 'wwpCommandNo'
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
            title: '分线',
            dataIndex: 'battleLineValue',
            key: 'battleLineValue'
        },{
            width:200,
            title: '维修工作',
            dataIndex: 'wwpWorkInfo',
            key: 'wwpWorkInfo',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.wwpWorkInfo}>{record.wwpWorkInfo}</div>
            }
        },{
            title: '试车员',
            dataIndex: 'testpilotManName',
            key: 'testpilotManName'
        },{
            title: '观察员',
            dataIndex: 'observerManName',
            key: 'observerManName'
        },
           {
            title: '进场时间',
            dataIndex: 'goInAirportTime',
            width: '100px',
            render: (text, record) => (
                <EditableCell
                    value={record.goInAirPortTime}
                    onChange={this.onCellChange(record.key, record.goInAirPortTime)}
                    record={record}
                />
            ),
        }, {
            width:180,
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <span className="action">
                         <a onClick={() => this.wwpDayPlanModal(text,record)}>工作包人员安排</a>
                         <span className="ant-divider" />
                         <a onClick={()=>this.EmpArrangement(text,record)}>人员安排查看</a>
                        <span className="ant-divider" />
                         <a type="primary" onClick={()=>this.TestpilotMan(record)}>试车员、观察员分配</a>
                     </span>
                )
            }
        },
        ]
    }

     onCellChange = (key, dataIndex) => {
        // console.log('e',key, dataIndex);
         return (value) => {
             const dataSource = [...this.state.dataSource];
             const target = dataSource.find(item => item.key === key);
             if (target) {
                 target[dataIndex] = value;
                 this.setState({ dataSource });
             }
         };
     };

     // 查询员工列表【用于分配 试车员、观察员】
     TestpilotMan = (record) => {
         let Find = false;
         if(record.id) {
             Find = record;
         }
         this.setState({
             Find:Find,
             TestpilotManCheck: true
         });
     };
     TestpilotManCancel = () => {
         this.setState({
             TestpilotManCheck:false
         });
         this.update();
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
     // 工作日人员安排查看
     WorkDayPeopleLook = () => {
         const dateTime=this.props.form.getFieldValue('executeTime');
         if(dateTime!=undefined){
             this.setState({
                 WorkDayPeopleLookVisible: true,
                 dateTime:dateTime
             });
         }else {
             message.error('!!!请先选择日期')
         }
     };
     WorkDayPeopleLookCancel = () => {
         this.setState({
             WorkDayPeopleLookVisible:false
         });

     };
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

     // 更新页面数据
     update(){
         this.props.form.validateFields(['executeTime'],(err, values) => {
             if(values.executeTime!=null){
                 Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                     'pageNow':this.state.pageNow,
                     'executeStartTime':values.executeTime.format('YYYY-MM-DD'),
                     'executeEndTime':values.executeTime.format('YYYY-MM-DD'),
                 }).then(res=>{
                     console.log('res',res);
                     this.setState({
                         data:res? res.data:[],
                         currentPage:parseInt(res.pageInfo.currentPage),
                         totalSize:parseInt(res.pageInfo.totalSize),
                     });
                 })
             }

         });

     };


     componentDidMount () {
        this.update();
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
        this.props.form.validateFields(['executeTime'],(err, values) => {
            // const executeTime=values.executeTime?values.executeTime.format('YYYY-MM-DD'):'';
                Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                    'pageNow':pageNumber,
                    'executeStartTime':values.executeTime.format('YYYY-MM-DD'),
                    'executeEndTime':values.executeTime.format('YYYY-MM-DD'),
                }).then(res=>{
                    this.setState({
                        data:res? res.data:[],
                        currentPage:parseInt(res.pageInfo.currentPage),
                        totalSize:parseInt(res.pageInfo.totalSize),
                    });
                })


        });
    };


// Admin根据工作日查询可执行的工作包
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['executeTime'],(err, values) => {
            // const executeTime=values.executeTime?values.executeTime.format('YYYY-MM-DD'):'';
            // console.log('executeTime',values.executeTime);
            if(values.executeTime!=undefined){
                Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                    'pageNow':1,
                    'executeStartTime':values.executeTime.format('YYYY-MM-DD'),
                    'executeEndTime':values.executeTime.format('YYYY-MM-DD'),
                }).then(res=>{
                    // console.log('aaa',res);
                    this.setState({
                        data:res? res.data:[],
                        currentPage:parseInt(res.pageInfo.currentPage),
                        totalSize:parseInt(res.pageInfo.totalSize),
                    });
                })
            }else {
                this.setState({
                    tableLoading:false,
                    data:[],
                });
                message.warning('未选择任何时间')
            }

        });
    };
// 查询符合条件的员工【用于工作日人员安排、或安排其他分线人员】
    WorkDayPeople = () => {
        const dateTime=this.props.form.getFieldValue('executeTime');
        // console.log('dateTime',dateTime);
        if(dateTime!=undefined){
            this.setState({
                WorkDayPeopleVisible: true,
                dateTime:dateTime
            });
        }else {
            message.error('!!!请先选择日期')
        }

        };
    WorkDayPeopleCancel = () => {
            this.setState({
                WorkDayPeopleVisible:false
            });
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
        // console.log('result',result);
    };

    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data ,tableLoading,WorkDayPeopleLookVisible,page,pageNow,WorkDayPeopleVisible,wwpDayPlanVisible,EmpArrangementVisible,TestpilotManCheck} =this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        return(
            <div>
                <div className="header work-package">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="可执行工作包查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={3}>
                                <FormItem {...formItemLayout} label={`工作日时间`}>
                                    {getFieldDecorator(`executeTime`,{
                                        // rules: [{ required: true, message: '日期不能为空!' }],
                                        initialValue:moment(this.Dates(), dateFormat),
                                    })(
                                        <DatePicker  placeholder=""/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4} style={{display:'none'}}>
                                <FormItem {...formItemLayout} label={`页码`}>
                                    {getFieldDecorator(`pageNow`,{
                                        initialValue:pageNow,
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 10 }} onClick={this.WorkDayPeopleLook} type="primary" >非工作包人员安排查看</Button>
                                <Button style={{ marginLeft: 10 }} onClick={this.WorkDayPeople} type="primary" >非工作包日计划人员安排</Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content">
                    <div style={{width:'100%'}}>
                        <Modal
                            title="非工作包人员安排"
                            visible={WorkDayPeopleVisible}
                            onCancel={this.WorkDayPeopleCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                            width="80%"
                        >
                            <WorkDayPeopleArrangement dateTime={this.state.dateTime}/>
                        </Modal>
                        <Modal
                            title="工作包人员安排"
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
                            width="50%"
                        >
                            <EmpArrangement  Emp={this.state.Emp}/>
                        </Modal>
                        <Modal
                            title="工作日人员安排详情"
                            visible={WorkDayPeopleLookVisible}
                            onCancel={this.WorkDayPeopleLookCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyd`}
                            width="50%"
                        >
                            <WorkDayPeopleLook  dateTime={this.state.dateTime}/>
                        </Modal>
                        <Modal
                            title="试车员、观察员分配"
                            visible={TestpilotManCheck}
                            onCancel={this.TestpilotManCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key4`}
                            width="80%"
                        >
                            <TestpilotMan Find={this.state.Find}/>
                        </Modal>
                    </div>

                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false} bordered size="middle" className='table'/>
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条`} />
                </div>
            </div>
        )
    }
}
const WorkArrangements = Form.create()(WorkArrangement);
export default WorkArrangements;


