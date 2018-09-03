/*** Created by Administrator on 2017/8/3/003.*/

import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Pagination,Popconfirm,Select,message,Icon } from 'antd';
import {  Row, Col} from 'antd';
import UpdateList from './UpdateList';
import AddStopSites from './AddStopSites';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
const {RangePicker} = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

let modalKey = 0;//  用于重置modal
// 停场机位
class StopSiteManage extends React.Component{
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };
    //删除
    deletes = (index) => {
        const { data } = this.state;
        const aiId = data[index].id;
        Api.post('airPlaneStandInfo/deleteAirPlaneStandInfo',{'airPlaneStandInfoId':aiId}).then(res => {
            if(res.errorCode=='0'){
                Api.post('airPlaneStandInfo/findAirPlaneStandInfoByCondition',{
                    'id':'',
                    'hangarName':'',
                    'hangarAbb':'',
                    'terminalName':'',
                    'terminalNo':'',
                    'standName':'',
                    'standNo':'',
                    'remark':'',
                    'pageNow':this.state.pageNumber,
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
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            confirmDirty: false,
            autoCompleteResult: [],
            vis:'none',
            options:[],
            pageNumber:1,
            userName: '',
        };

        this.columns = [
            {
                title: '机库',
                dataIndex: 'hangarName',
                key: 'hangarName',
            }, {
                title: '机库缩写',
                dataIndex: 'hangarAbb',
                key: 'hangarAbb',
            }, {
                title: '航站名称',
                dataIndex: 'terminalName',
                key: 'terminalName',
            }, {
                title: '航站编号',
                dataIndex: 'terminalNo',
                key: 'terminalNo',
            }, {
                title: '机位名称',
                dataIndex: 'standName',
                key: 'standName',
            }, {
                title: '机位编号',
                dataIndex: 'standNo',
                key: 'standNo',
            },{
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render:(text,record,index) => {
                    const time = this.changetime(record.updateTime);
                    return <span>{time}</span>
                }
            }, {
                title: '机位状态',
                dataIndex: 'standState',
                key: 'standState',
                render:(text,record) => {
                    const state = record.standState;
                    if(state == 'T'){
                        return <span>有效</span>
                    }else if(state == 'F'){
                        return <span>无效</span>
                    }else if(state == 'D'){
                        return <span>删除</span>
                    }
                }
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            }, {
                title: '操作',
                key: 'action',
                render: (text, record,index) => (
                    <span>
                    <a  onClick={()=>this.showModal(index)}>修改</a>
                        <span className="ant-divider" />
                    <Popconfirm title="确定删除?" onConfirm={() => this.deletes(index)}>
                        <a href="#" className="delete" style={{color:'#e60012'}}>删除</a>
                    </Popconfirm>
                 </span>

                ),
            }];
        this.state={
            data:[]
        };
    }

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

// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };
    // 更新页面数据
    update(){
        Api.post('airPlaneStandInfo/findAirPlaneStandInfoByCondition',{
            'hangarName':'',
            'hangarAbb':'',
            'terminalName':'',
            'terminalNo':'',
            'standName':'',
            'standNo':'',
            'updateTimeStart':'',
            'updateTimeEnd':'',
            'pageNow':this.state.pageNumber
        }).then(res=>{
            this.setState({
                data: res.data,
                currentPage:parseInt(res.pageInfo.currentPage),
                totalPageSize:parseInt(res.pageInfo.totalPageSize),
                totalSize:parseInt(res.pageInfo.totalSize)
            })
        })
    }
    componentDidMount(){
        this.update();
    }
    handleCancel = (e) => {
        this.update();
        this.setState({
            visible: false,
        });
    };
    handleCancelAdd = (e) => {
        this.update();
        this.setState({
            update:false
        });
    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            Api.post('airPlaneStandInfo/findAirPlaneStandInfoByCondition',{
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'hangarName':values.hangarName,
                'hangarAbb':values.hangarAbb,
                'terminalName':values.terminalName,
                'terminalNo':values.terminalNo,
                'standName':values.standName,
                'standNo':values.standNo
            }).then(res=>{
                this.setState({
                    data: res.data
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();

    };
    //分页查询
    onChange = (pageNumber) => {
        Api.post('airPlaneStandInfo/findAirPlaneStandInfoByCondition',{'pageNow':pageNumber}).then(res=>{
            this.setState({
                data: res.data,
                currentPage:parseInt(res.pageInfo.currentPage),
                totalPageSize:parseInt(res.pageInfo.totalPageSize),
                totalSize:parseInt(res.pageInfo.totalSize),
                pageNumber:pageNumber
            });
        })

    };
// 根剧stand_No查询
    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({ userName: '' });
    };
    onChangeUserName = (e) => {
        this.setState({ userName: e.target.value });
        const value=e.target.value;
        // console.log(value);
        this.handleSubmitNO = (e) => {
            e.preventDefault();
            if(value){
                Api.post('airPlaneStandInfo/findAirPlaneStandInfoByStandNo',{'standNo':value}).then(res=>{
                    let datas = [res.data];
                    this.setState({
                        data: datas
                    });
                })
            }
        };
    }
    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const { data } = this.state;

        const { userName } = this.state;
        const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1">
                            <Form
                                className="ant-advanced-search-form"
                                onSubmit={this.handleSearch}
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={7} className="update-time-input stop-site-manage">
                                        <FormItem
                                            {...formItemLayout}
                                            label="机位编号："

                                        >
                                            {getFieldDecorator('standNo')(
                                                <Input/>
                                            )}

                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={1} className="update-time-input">
                                        <FormItem
                                            {...formItemLayout}
                                            label="机库："
                                        >
                                            {getFieldDecorator('hangarName')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="机库缩写："
                                            hasFeedback

                                        >
                                            {getFieldDecorator('hangarAbb')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3} >
                                        <FormItem {...formItemLayout} label={`航站名称：`}>
                                            {getFieldDecorator(`terminalName`)(
                                                <Input  />
                                            )}
                                        </FormItem>
                                    </Col>


                                    <Col span={8} key={4} >
                                        <FormItem {...formItemLayout} label={`航站编号：`}>
                                            {getFieldDecorator(`terminalNo`,{
                                                // initialValue: [null],
                                            })(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={5} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="机位名称："
                                            hasFeedback
                                        >
                                            {getFieldDecorator('standName')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={6} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="更新时间："
                                        >
                                            {getFieldDecorator('updateTime')(
                                                <RangePicker  placeholder={['', '']}/>
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
                        </TabPane>
                    </Tabs>

                </div>
                <div className="content">
                    <div style={{width:'100%',height:'40px'}}>
                        <Form
                            className="ant-advanced-search-form stand-no-search stop-site-manage-form stop-site-stand-no"
                            onSubmit={this.handleSubmitNO}
                        >
                            <Row gutter={40}>

                            </Row>
                        </Form>

                        <Button className="editable-add-btn btn_reload" onClick={this.showModalAdd} style={{float:'left'}}><Icon type="plus" />新增</Button>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                            <AddStopSites onCancel={this.handleCancelAdd}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                        >
                            <UpdateList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                    </div>
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} bordered size="middle"/>
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize}
                                onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const StopSiteManages= Form.create()(StopSiteManage);
export default StopSiteManages;


