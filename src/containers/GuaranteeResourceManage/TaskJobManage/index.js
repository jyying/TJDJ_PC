// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader} from 'antd';
import {  Row, Col} from 'antd';
import Details from './Details';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}, {
    value: '',
    label: '空',
}];
let modalKey = 0;   //  用于重置modal
// 用户管理
 class TaskJobManage extends React.Component{
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
            DetailsData:false
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
                    <a onClick={()=>this.showModal(index)}>详情</a>

                 </span>
            ),
        }];

        this.state={
           data:[]
        };
    }
     //将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D = date.getDate();
         return Y+M+D
     };
// 更新用户的Modal
    showModal = (record) => {
        let DetailsData = false;
        if(record.id) {
            DetailsData = record;
        }
        this.setState({
            visible: true,
            DetailsData:DetailsData
        });
    };
    handleCancel = (e) => {
        this.update();
        // location.reload();
        this.setState({
            visible: false,
        });
    };

 // 更新页面数据
    update(){
        Api.post('user/findUserByCondition',{'pageNow':this.state.pageNow}).then(res=>{
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



// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['userAccount','userName','updateTime','userState','pageNow'],(err, values) => {
            Api.post('user/findUserByCondition',{
                'userAccount':values.userAccount,
                'userName':values.userName,
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'userState':values.userState[0],
                'pageNow':this.state.pageNow
            }).then(res=>{
                this.setState({
                    loading:false,
                    data:res? res.data:[],
                    page:res.pageInfo,
                    userAccount:values.userAccount,
                    userName:values.userName,
                    updateTimeStart:values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    updateTimeEnd:values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                    userState:values.userState[0],
                    pageNow:this.state.pageNow
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        this.update();
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
                                        initialValue: [],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`用户名`}>
                                    {getFieldDecorator(`userName`,{
                                        initialValue: [],
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
                                        initialValue: [],
                                    })(
                                        <Cascader options={residences} placeholder="" style={{ width: 110 }}/>
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
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content">
                    <div style={{width:'100%',height:'60px'}}>
                        {/*<Modal*/}
                            {/*title="详情"*/}
                            {/*visible={this.state.visible}*/}
                            {/*onCancel={this.handleCancel}*/}
                            {/*maskClosable={false}*/}
                            {/*footer={null}*/}
                            {/*key={`${modalKey}keyb`}*/}
                        {/*>*/}
                            {/*<Details DetailsData={this.state.DetailsData}/>*/}
                        {/*</Modal>*/}

                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'  loading={this.state.loading}/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const TaskJobManages = Form.create()(TaskJobManage);
export default TaskJobManages;


