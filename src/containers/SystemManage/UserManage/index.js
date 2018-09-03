import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Select,Popconfirm,Icon,message } from 'antd';
import {  Row, Col} from 'antd';
import UpdateUserList from './UpdateUserList';
import AddUserList from './AddUserList';
import FindUserRole from './FindUserRole';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


let modalKey = 0;   //  用于重置modal
// 用户管理
 class UserManagement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            UserRole:false,
            data: [],
            loading:true,
            userName:'',
            pageNow:1,
            page:{},
        };
        this.columns = [{
            title: '账号',
            dataIndex: 'userAccount',
            key: 'userAccount',
        }, {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        }, {
            title: '邮箱',
            dataIndex: 'userEmail',
            key: 'userEmail',
        }, {
            title: '手机号码',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
        }, {
            title: 'E账号',
            dataIndex: 'userEAccount',
            key: 'userEAccount',
        }, {
            title: '用户状态',
            dataIndex: 'userState',
            key: 'userState',
            render:(text,record) => {
                const state = record.userState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }else if(state == 'D'){
                    return <span>删除</span>
                }
            }
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record) => {
                const time = this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            width:200,
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <span>
                    <a onClick={()=>this.showModal(index)}>修改</a>
                     <span className="ant-divider" />
                     <a  onClick={()=>this.FindUserRole(index)}>查询用户角色</a>
                    <span className="ant-divider" />
                    <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                 </span>
            ),
        }];
       this.columns1 = [{
            title: '角色',
            dataIndex: 'roleName'
        }];
        this.state={
           data:[]
        };
    }

     // 用户删除
     delete=(e)=> {
         Api.post('user/addOrUpdateUser',{'userAccount':e.userAccount,
             'userPwd':e.userPwd,
             'userName':e.userName,
             'userEmail':e.userEmail,
             'mobilePhone':e.mobilePhone,
             'userEAccount':e.userEAccount,
             'userState':'D',
             'remark':e.remark,
             'userType':e.userType,
             'userId':e.id})
             .then(res => {
                 if(res.errorCode=='0'){
                     message.success('删除成功！');
                     this.update();
                 }else{
                     message.error('删除失败：'+res.errorMsg);
                 }

             });
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
    showModal = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        // console.log('information',information);
        this.setState({
            visible: true,
            information:information
        });
    };
// 查询用户角色
    FindUserRole = (index) => {
        const { data } = this.state;
        // console.log(data[index]);
        const userId = data[index].id;
        const userName = data[index].userName;
        this.setState({
            userId:userId,
            userName1:userName,
            UserRole: true
        });
    };
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };
 // 更新页面数据
    update(){
        Api.post('user/findUserByCondition',{
            'pageNow':this.state.pageNow,
        }).then(res=>{
            // console.log(res);
            this.setState({
                data:res? res.data:[],
                page:res.pageInfo,
                loading:false
            })
        })
    }
    componentDidMount(){
       this.update();
    }
    handleCancel = (e) => {
        this.update();
        // location.reload();
        this.setState({
            visible: false,
        });
    };
    handleCancelAdd = (e) => {
        // console.log(e);
        this.update();
        this.setState({
            update:false
        });
    };
    handleCancelUserRole = (e) => {
        this.setState({
            UserRole:false
        });

    };


// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['userAccount','userName','updateTime','userState','pageNow'],(err, values) => {
            Api.post('user/findUserByCondition',{
                'userAccount':values.userAccount?values.userAccount:'',
                'userName':values.userName?values.userName:'',
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'userState':values.userState,
                'pageNow':this.state.pageNow
            }).then(res=>{
                this.setState({
                    loading:false,
                    data:res? res.data:[],
                    page:res.pageInfo,
                    userAccount:values.userAccount?values.userAccount:'',
                    userName:values.userName?values.userName:'',
                    updateTimeStart:values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    updateTimeEnd:values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                    userState:values.userState,
                    pageNow:this.state.pageNow
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
       this.props.form.validateFields(['userAccount','userName','updateTime','userState'],(err, values) => {
           Api.post('user/findUserByCondition',{
               'userAccount':this.state.userAccount,
               'userName':this.state.userName,
               'updateTimeStart':this.state.updateTimeStart,
               'updateTimeEnd':this.state.updateTimeEnd,
               'userState':this.state.userState,
               'pageNow':pageNumber
           }).then(res=>{
               this.setState({
                   loading:false,
                   data:res? res.data:[],
                   page:res.pageInfo,
               });
           })
       });
};

 // 验证用户账号是否可用
 //    emitEmpty = () => {
 //        this.props.form.resetFields();
 //    };
 //    checkUserAccount = (e) => {
 //        e.preventDefault();
 //        this.props.form.validateFields(['userAcc'],(err, values) => {
 //            // console.log('userAcc: ', values.userAcc);
 //            if(values.userAcc!==undefined){
 //                Api.post('user/checkUserAccount',{'userAccount':values.userAcc}).then(res=>{
 //                    if(res.errorCode=='0'){
 //                        message.success('用户账号可用！');
 //                    }else {
 //                        message.warning('用户账号已存在！');
 //                    }
 //                })
 //            }else {
 //                message.warning('用户账号不能为空！');
 //            }
 //        });
 //    };

    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        // const form=this.props.form.getFieldValue('userAcc');
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data,page,pageNow} = this.state;
        // const suffix = form ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
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
                            <Col span={8} key={1} >
                                <FormItem {...formItemLayout} label={`账号`}>
                                    {getFieldDecorator(`userAccount`,{
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`用户名`}>
                                    {getFieldDecorator(`userName`,{
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem
                                    {...formItemLayout}
                                    label="用户状态"
                                >
                                    {getFieldDecorator('userState',{
                                    })(
                                        <Select>
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4} >
                                <FormItem
                                    {...formItemLayout}
                                    label="更新时间段"
                                >
                                    {getFieldDecorator(`updateTime`,{
                                    })(
                                        <RangePicker placeholder=""/>
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
                    <div style={{width:'100%',height:'40px'}}>
                        {/*<Col span={10} >*/}
                            {/*<Form layout="inline" onSubmit={this.checkUserAccount}>*/}

                                {/*<FormItem {...formItemLayout} label={`验证用户:`}>*/}
                                    {/*{getFieldDecorator(`userAcc`,{*/}
                                        {/*rules: [{ required: true, message: '用户账号不能为空!' }],*/}
                                    {/*})(*/}
                                        {/*<Input placeholder="" style={{width:'200px'}} suffix={suffix}/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}

                                {/*<FormItem>*/}
                                    {/*<Button*/}
                                        {/*type="primary"*/}
                                        {/*htmlType="submit"*/}
                                    {/*>*/}
                                        {/*验证*/}
                                    {/*</Button>*/}
                                {/*</FormItem>*/}
                            {/*</Form>*/}
                        {/*</Col>*/}
                        <Button className="editable-add-btn btn_reload"  onClick={this.showModalAdd} style={{float:'left'}}><Icon type="plus" />新增</Button>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                           <AddUserList onCancel={this.handleCancelAdd}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                        >
                            <UpdateUserList data={this.state.information}  onCancel={this.handleCancel}/>
                        </Modal>
                        <Modal
                            title="查询用户角色"
                            visible={this.state.UserRole}
                            onCancel={this.handleCancelUserRole}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key`}
                        >
                           < FindUserRole data={this.state}/>
                        </Modal>
                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'  loading={this.state.loading} bordered size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const UserManagements = Form.create()(UserManagement);
export default UserManagements;


