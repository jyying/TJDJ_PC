import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Popconfirm,Select,message,Icon } from 'antd';
import {  Row, Col} from 'antd';

import UpdateList from './UpdateList';
import AddDataDictionary from './AddDataDictionary';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import TimeConversion from '../../../utils/TimeConversion';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;


let modalKey = 0;//  用于重置modal

// 数据字典
class DtaDictionary extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            confirmDirty: false,
            vis:false,
            options:[],
            searchCriteria:{},
            page:{},
            current:1,
            userName: '',
            loading:true,
            dictType:'',
            dictName:'',
            dictCode:'',
            parentId:'',
            updateTimeStart:'',
            updateTimeEnd:'',
            dictState:'',
            dictValue:'',
        };

        this.columns = [
            {
                title: '字典类型',
                dataIndex: 'dictType',
                key: 'dictType',
                render:(text,record) => {
                    const type = record.dictType;
                    if(type == 'C'){
                        return <span>子型</span>
                    }else if(type == 'P'){
                        return <span>父型</span>
                    }
                }
            }, {
                title: '字典名称',
                dataIndex: 'dictName',
                key: 'dictName',
            }, {
                title: '字典代码',
                dataIndex: 'dictCode',
                key: 'dictCode',
            }, {
                title: '字典值',
                dataIndex: 'dictValue',
                key: 'dictValue',
                width: '20%'
            },{
                title: '父名',
                dataIndex: 'parentName',
                key: 'parentName',
            }, {
                title: '字典状态',
                dataIndex: 'dictState',
                key: 'dictState',
                render:(text,record) => {
                    const state = record.dictState;
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
                width:'80px',
                render:(text,record,index) => {
                    const time =this.changetime(record.updateTime);
                    return <span>{time}</span>
                }
            },{
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            }, {
                title: '操作',
                key: 'action',
                width:'100px',
                render: (text, record,index) => (
                    <span>
                    <a  onClick={()=>this.showModal(index)}>修改</a>
                        <span className="ant-divider" />
                    <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(index)}>
                        <a href="#" className="delete" style={{color:'#e60012'}}>删除</a>
                    </Popconfirm>
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
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    //删除
    onDelete = (index) => {
        const { data } = this.state;
        const aiId = data[index].id;
        Api.post('dataDict/deleteDataDict',{'dataDictId':aiId}).then(res => {
            if(res.errorCode=='0'){
                Api.post('dataDict/findDataDictByCondition',{
                    'id':'',
                    'dictType':'',
                    'dictName':'',
                    'dictValue':'',
                    'dictCode':'',
                    'parentName':'',
                    'parentId':'',
                    'dictState':'',
                    'remark':'',
                    'createName':'',
                    'updateName':'',
                    'updateTime':'',
                    'pageNow':this.state.current,
                }).then(res=>{
                    this.setState({
                        data: res.data
                    });
                    if(res.errorCode=='0'){
                        message.success('删除成功！');
                    }else{
                        message.error('删除失败！');
                    }
                });
            }
        });
    };

// 更新用户的Modal
    showModal = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        this.setState({
            visible: true,
            information:information
        });

    };
//选择显示
    handleSelect = (value,options)=> {
        if(value=='C'){
            this.setState({
                vis:true
            });
            Api.post('dataDict/findDataDictByType').then(res=>{
                const options=[];
                for(let i=0;i<res.data.length;i++){
                    options.push({
                        value:res.data[i].id ,
                        label:res.data[i].dictName ,
                    })
                }
                this.setState({
                    options: options
                });
            })
        }else{
            this.setState({
                vis:false
            })
        }
    };
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };
    // 更新页面数据
    update(){
        Api.post('dataDict/findDataDictByCondition',{
            'pageNow':this.state.current,
                'dictType':"",
                'dictName':"",
                'dictCode':"",
                'parentId':"",
                'updateTimeStart':"",
                'updateTimeEnd':"",
                'dictState':"",
                'dictValue':""
        }
            ).then(res=>{
                // console.log('res',res);
            this.setState({
                data: res.data,
                page:res.pageInfo,
                current:1,
                dictType:'',
                dictName:'',
                dictCode:'',
                parentId:'',
                updateTimeStart:'',
                updateTimeEnd:'',
                dictState:'',
                dictValue:'',
                loading:false,
            })
        })
    }
    componentDidMount(){
        this.update();
    }
    handleCancel = (e) => {
        this.onChange(this.state.current);
        this.setState({
            visible: false,
        });
    };
    handleCancelAdd = (e) => {
        this.onChange(this.state.current);
        this.setState({
            update:false
        });
    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            Api.post('dataDict/findDataDictByCondition',{
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'dictCode':values.dictCode,
                'dictName':values.dictName,
                'dictType':values.dictType,
                'dictState':values.dictState,
                'parentId':values.parentId ?values.parentId[0]:'',
                'parentName':values.dictName
            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo,
                    current:1,
                    updateTimeStart:values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    updateTimeEnd:values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                    dictCode:values.dictCode,
                    dictName:values.dictName,
                    dictType:values.dictType,
                    dictState:values.dictState,
                    parentId:values.parentId ?values.parentId[0]:'',
                    parentName:values.dictName,
                    loading:false,
                });
            });
        });

    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
 //分页查询
    onChange = (pageNumber) => {
        Api.post('dataDict/findDataDictByCondition',{
            'updateTimeStart':this.state.updateTimeStart,
            'updateTimeEnd':this.state.updateTimeEnd,
            'dictCode':this.state.dictCode,
            'dictName':this.state.dictName,
            'dictType':this.state.dictType,
            'dictState':this.state.dictState,
            'parentId':this.state.parentId,
            'parentName':this.state.parentName,
            'pageNow':pageNumber,
        }).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    page:res.pageInfo,
                    loading:false,
                    current:pageNumber
                });
            // }
        })
    };

    render(){
        modalKey++;
        const options=this.state.options;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const { data,page,vis } = this.state;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form select-height"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={1} >
                                <FormItem
                                    {...formItemLayout}
                                    label="字典类型"
                                >
                                    {getFieldDecorator('dictType')(
                                        <Select
                                            onSelect={this.handleSelect}
                                        >
                                            <Option value="P">父型</Option>
                                            <Option value="C">子型</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`字典代码`}>
                                    {getFieldDecorator('dictCode',{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem {...formItemLayout} label={`字典名称`}>
                                    {getFieldDecorator(`dictName`)(
                                        <Input  />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={`字典状态`} >
                                    {getFieldDecorator(`dictState`,{
                                        // initialValue: [null],
                                    })(
                                        <Select>
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5} >
                                <FormItem
                                    {...formItemLayout}
                                    label="更新起止时间："
                                >
                                    {getFieldDecorator('updateTime')(
                                        <RangePicker
                                            placeholder={['', '']}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            {
                                vis?<Col span={8} key={6} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="父型名称"
                                        >
                                            {getFieldDecorator('parentId')(
                                                <Cascader options={options}  placeholder="" style={{width:165}}/>

                                            )}
                                        </FormItem>
                                    </Col>:null
                            }
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
                        <Button className="editable-add-btn btn_reload"  onClick={this.showModalAdd} style={{float:'left'}}><Icon type="plus" />增加</Button>
                        <Modal
                            title="新增"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                            <AddDataDictionary onCancel={this.handleCancelAdd}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key={`${modalKey}keys`}
                        >
                            <UpdateList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                    </div>
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                        current={this.state.current}
                    />
                </div>
            </div>
        )
    }
}
const DtaDictionarys = Form.create()(DtaDictionary);
export default DtaDictionarys;


