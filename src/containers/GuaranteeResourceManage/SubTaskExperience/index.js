// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,message,Select,Popconfirm,Icon} from 'antd';
import {  Row, Col} from 'antd';
import Pagination from '../../../components/Pagination';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



let modalKey = 0;   //  用于重置modal

// 工卡风险管理
class TaskRiskManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            loading:true,
            pageNow:1,
            page:{},
            taskUpdate:false,
            subTask:[]
        };
        this.columns = [{
            title: '领取类型',
            dataIndex: 'receiveType',
            key: 'receiveType',
            render:(text,record) => {
                const state = record.receiveType;
                if(state == 'STL'){
                    return <span>工卡</span>
                }else if(state == 'DDFC'){
                    return <span>DDFC</span>
                }else if(state == 'NRC'){
                    return <span>NRC</span>
                }
            }
        }, {
            title: '工卡号/DDFC/NRC',
            dataIndex: 'subTaskNo',
            key: 'subTaskNo',
            width:'150px',
        }, {
            title: '经验发表人',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: '经验描述',
            dataIndex: 'experienceRemark',
            key: 'experienceRemark',
            width:'300px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.experienceRemark}>{record.experienceRemark}</div>
            }
        }, {
            title: '状态',
            dataIndex: 'experienceState',
            key: 'experienceState',
            render:(text,record) => {
                const state = record.experienceState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }
            }
        }, {
            title: '更新人',
            dataIndex: 'updateName',
            key: 'updateName',
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record) => {
                const time = this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        // }, {
        //     width:85,
        //     title: '操作',
        //     key: 'action',
        //     render: (text, record,index) => (
        //         <span>
        //             <a  onClick={()=>this.showModal(record)}>修改</a>
        //             <span className="ant-divider" />
        //             <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
        //          </span>
        //     ),
        }];
    }

    // 删除
    delete=(e)=> {
        console.log('e',e);
        Api.post('subTaskRisk/addOrUpdateSubTaskRisk',{
            riskId:e.id,
            subTaskId:e.subTaskId,
            riskRemark:e.riskRemark,
            riskState:'D',
        }).then(res => {
            console.log('res',res);
            if(res.errorCode == 0) {
                message.success('删除成功！');
                this.update();
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel=(e)=> {

    };

    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };
// 更新用户的Modal
//     showModal = (record) => {
//         let taskUpdate = false;
//         if(record.id) {
//             taskUpdate = record;
//         }
//         this.setState({
//             visible: true,
//             taskUpdate:taskUpdate
//         });
//
//     };
//     handleCancel = () => {
//         this.update();
//         this.setState({
//             visible: false,
//         });
//     };
// // 新增用户的Modal
//     showModalAdd = () => {
//         this.setState({
//             update: true,
//         });
//     };
    // 更新页面数据
    update(){
        Api.post('subTaskExperience/findSubTaskExperienceByCondition',{'pageNow':this.state.pageNow}).then(res=>{
            console.log(res);
            this.setState({
                data:res? res.data:[],
                page:res.pageInfo,
                loading:false
            })
        })
    }
// 页面数据加载、排班类型选择
    componentDidMount(){
        this.update();
    }


    // handleCancelAdd = (e) => {
    //     // console.log(e);
    //     this.update();
    //     this.setState({
    //         update:false
    //     });
    // };

// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            Api.post('subTaskExperience/findSubTaskExperienceByCondition',{
                'subTaskNo':values.subTaskNo,
                'empName':values.empName,
                'pageNow':this.state.pageNow
            }).then(res=>{
                console.log(res);
                this.setState({
                    subTaskNo:values.subTaskNo,
                    empName:values.empName,
                    data:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
// 分页查询
    onChange = (pageNumber) => {
        this.props.form.validateFields((err, values) => {
            Api.post('subTaskExperience/findSubTaskExperienceByCondition',{
                'subTaskNo':this.state.subTaskNo,
                'empName':this.state.empName,
                'pageNow':pageNumber
            }).then(res=>{
                this.setState({
                    data:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });
    };

    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data,page,taskUpdate } = this.state;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>

                            <Col span={9} key={1} >
                                <FormItem {...formItemLayout} label={`工卡号/DDFC/NRC`}>
                                    {getFieldDecorator(`subTaskNo`,{
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem
                                    {...formItemLayout}
                                    label="经验发表人"
                                    >
                                    {getFieldDecorator(`empName`,{
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content">
                    {/*<Row type="flex" justify="start">*/}
                        {/*<Button className="editable-add-btn btn_reload"  onClick={this.showModalAdd} ><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>*/}
                    {/*</Row>*/}
                    {/*<Row  type="flex" justify="space-between">*/}
                        {/*/!*<Modal*!/*/}
                            {/*/!*title="新建"*!/*/}
                            {/*/!*visible={this.state.update}*!/*/}
                            {/*/!*onCancel={this.handleCancelAdd}*!/*/}
                            {/*/!*maskClosable={false}*!/*/}
                            {/*/!*footer={null}*!/*/}
                            {/*/!*key={`${modalKey}a`}*!/*/}
                        {/*/!*>*!/*/}
                            {/*/!*<AddTaskRisk onCancel={this.handleCancelAdd}/>*!/*/}
                        {/*/!*</Modal>*!/*/}
                        {/*/!*<Modal*!/*/}
                            {/*/!*title="修改"*!/*/}
                            {/*/!*visible={this.state.visible}*!/*/}
                            {/*/!*onCancel={this.handleCancel}*!/*/}
                            {/*/!*maskClosable={false}*!/*/}
                            {/*/!*footer={null}*!/*/}
                            {/*/!*key={`${modalKey}b`}*!/*/}
                        {/*/!*>*!/*/}
                            {/*/!*<UpdateTaskRisk taskUpdate={taskUpdate} onCancel={this.handleCancel}/>*!/*/}
                        {/*/!*</Modal>*!/*/}
                    {/*</Row>*/}
                    <Table   columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle" className='table'/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const TaskRiskManages = Form.create()(TaskRiskManage);
export default TaskRiskManages;


