// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Icon,DatePicker,Cascader} from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



const receiveState = [{
    value: 'A',
    label: '待领取',
}, {
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}, {
    value: 'D',
    label: '删除',
}, {
    value: 'C',
    label: '取消',
}, {
    value: '',
    label: '全部',
}];

const executeStatus = [{
    value: 'S',
    label: '执行成功',
}, {
    value: 'F',
    label: '执行失败',
}, {
    value: '',
    label: '全部',
}];
let modalKey = 0;   //  用于重置modal
// 员工工卡领取记录
 class EmpTaskReceiveRecord extends React.Component{
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
            DetailsData:false,

        };
        this.columns = [{
            title: '员工姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: '工卡号',
            dataIndex: 'subTaskNo',
            key: 'subTaskNo',
        }, {
            title: '执行次数',
            dataIndex: 'count',
            key: 'count',
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
         const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
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
        Api.post('subTaskReceive/findSubTaskReceiveByCondition',{'pageNow':this.state.pageNow}).then(res=>{
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
        this.props.form.validateFields(['subTaskNo'],(err, values) => {
            // console.log(values);
            Api.post('subTaskReceive/findSubTaskReceiveByCondition',{
                'subTaskNo':values.subTaskNo,
                // 'empName':values.empName,
                // 'receiveState':values.receiveState.length>0?values.receiveState[0]:'',
                // 'executeStatus':values.executeStatus.length>0?values.executeStatus[0]:'',
                // 'pageNow':this.state.pageNow
            }).then(res=>{
                // console.log(res);
                this.setState({
                    loading:false,
                    data:res? res.data:[],
                    page:res.pageInfo,
                    subTaskNo:values.subTaskNo,
                    // empName:values.empName,
                    // receiveState:values.receiveState.length>0?values.receiveState[0]:'',
                    // executeStatus:values.executeStatus.length>0?values.executeStatus[0]:'',
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

       this.props.form.validateFields(['subTaskNo'],(err, values) => {
           Api.post('subTaskReceive/findSubTaskReceiveByCondition',{
               subTaskNo:this.state.subTaskNo,
               // empName:this.state.empName,
               // receiveState:this.state.receiveState,
               // executeStatus:this.state.executeStatus,
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
                                <FormItem {...formItemLayout} label={`工卡号`}>
                                    {getFieldDecorator(`subTaskNo`,{
                                        initialValue: [],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            {/*<Col span={8} key={2} >*/}
                                {/*<FormItem {...formItemLayout} label={`empName`}>*/}
                                    {/*{getFieldDecorator(`empName`,{*/}
                                        {/*initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Input placeholder="" />*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            {/*<Col span={8} key={3} >*/}
                                {/*<FormItem*/}
                                    {/*{...formItemLayout}*/}
                                    {/*label="receiveState"*/}
                                {/*>*/}
                                    {/*{getFieldDecorator('receiveState',{*/}
                                        {/*initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Cascader options={receiveState} placeholder="" style={{ width: 110 }}/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            {/*<Col span={8} key={4} >*/}
                                {/*<FormItem*/}
                                    {/*{...formItemLayout}*/}
                                    {/*label="executeStatus"*/}
                                {/*>*/}
                                    {/*{getFieldDecorator('executeStatus',{*/}
                                        {/*initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Cascader options={executeStatus} placeholder="" style={{ width: 110 }}/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                        {/*<Row>*/}
                            {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>*/}
                                    {/*重置*/}
                                {/*</Button>*/}
                                {/*<Button type="primary" htmlType="submit">查询</Button>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    </Form>
                </div>
                <div className="content">
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='ROW_ID'  loading={this.state.loading} bordered size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const EmpTaskReceiveRecords = Form.create()(EmpTaskReceiveRecord);
export default EmpTaskReceiveRecords;


