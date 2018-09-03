import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Select,Icon} from 'antd';
import {  Row, Col} from 'antd';
import UpdateAttendance from './UpdateAttendance';
import AddAttendance from './AddAttendance';
import Pagination from '../../../components/Pagination';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



let modalKey = 0;   //  用于重置modal
// 排班状态
const amState = [{
    value: '',
    label: '空',
}, {
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}];

// 人员考勤管理
class StaffAttendanceManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            battleLine:[],
            loading:true,
            amTypes:[],
            pageNow:1,
            page:{}
        };
        this.columns = [{
            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: '排班',
            dataIndex: 'amTypeName',
            key: 'amTypeName',
        }, {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render:(text,record) => {
                const time = this.changetime(record.startTime);
                return <span>{time}</span>
            }
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            render:(text,record) => {
                const time = this.changetime(record.endTime);
                return <span>{time}</span>
            }
        }, {
            title: '状态',
            dataIndex: 'amState',
            key: 'amState',
            render:(text,record) => {
                const state = record.amState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }
            }
        }, {
            title: '工作地点',
            dataIndex: 'workLocation',
            key: 'workLocation',
        }, {
            title: '修改人',
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
        }, {
            width:85,
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <span>
                    <a  onClick={()=>this.showModal(index)}>修改</a>
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
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };
    // 更新页面数据
    update(){
        const value=this.props.StaffAttendance;
        // console.log('value',value);
        Api.post('attendance/findAttendanceByCondition',{'pageNow':this.state.pageNow,'empId':value.id}).then(res=>{
            // console.log('res',res);
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
            // 排班类型选择
            Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_HOLIDAY_TYPE'}).then(res=>{
                this.setState({
                    amTypes:res?res.data:[]
                });
            });
    }

    handleCancel = (e) => {
        this.update();
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

// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['amType','amState','workLocation','updateTime','pageNow'],(err, values) => {
            // console.log('Received values of form: ', values);
            // console.log('Received values of form: ', values.updateTime.format('YYYY-MM-DD'));
            Api.post('attendance/findAttendanceByCondition',{
                'amType':values.amType,
                'amState':values.amState,
                'workLocation':values.workLocation,
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'pageNow':this.state.pageNow
            }).then(res=>{
                // console.log(res);
                this.setState({
                    amType:values.amType,
                    amState:values.amState,
                    workLocation:values.workLocation,
                    updateTimeStart:values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    updateTimeEnd:values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                    pageNow:this.state.pageNow,
                    data:res? res.data:[],
                    page:res.pageInfo,
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
        // console.log('Page: ', pageNumber);
        this.props.form.validateFields(['amType','amState','workLocation','updateTime'],(err, values) => {
            // console.log('Received values of form: ', values);
            // console.log('Received values of form: ', values.updateTime.format('YYYY-MM-DD'));
            Api.post('attendance/findAttendanceByCondition',{
                'amType':this.state.amType,
                'amState':this.state.amState,
                'workLocation':this.state.workLocation,
                'updateTimeStart':this.state.updateTimeStart ,
                'updateTimeEnd':this.state.updateTimeEnd ,
                'pageNow':pageNumber
            }).then(res=>{
                // console.log(res);
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
        const { data,page,amTypes} = this.state;
        const value=this.props.StaffAttendance;
        // console.log('a',value);
        return(
            <div>
                <div className="header" style={{display:'none'}}>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            {/*<Col span={6} key={1} >*/}
                                {/*<FormItem {...formItemLayout} label={`主键ID`}>*/}
                                    {/*{getFieldDecorator(`empId`,{*/}
                                        {/*// initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Input placeholder="主键ID" />*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`排班类型`}>
                                    {getFieldDecorator('amType',{
                                        initialValue: [],
                                    })(
                                        <Select>
                                        {
                                            amTypes?amTypes.map((s,v)=>
                                                <Option key={v} value={s.id}>{s.dictName}</Option>
                                            ):null
                                        }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem {...formItemLayout} label={`状态`}>
                                    {getFieldDecorator(`amState`,{
                                        initialValue: [],
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
                                <FormItem {...formItemLayout} label={`工作地点`}>
                                    {getFieldDecorator(`workLocation`,{
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={7} >
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
                        <Button className="editable-add-btn btn_reload"  onClick={this.showModalAdd} style={{float:'left'}}><Icon type="plus" />新增</Button>
                    </div>
                    <Row  type="flex" justify="space-between">
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}a`}
                        >
                            <AddAttendance onCancel={this.handleCancelAdd} value={value}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key={`${modalKey}b`}
                        >
                            <UpdateAttendance data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                    </Row>
                    <Table   columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const StaffAttendanceManages = Form.create()(StaffAttendanceManage);
export default StaffAttendanceManages;


