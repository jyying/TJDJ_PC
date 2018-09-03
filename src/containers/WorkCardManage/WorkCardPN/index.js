/**
 * Created by Administrator on 2017/8/21/021.
 */
import React from 'react';
import { Form, Input, Button,Table,Icon,DatePicker,Cascader,Popconfirm,Select,message  } from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
import Paginations from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



const dicState =[{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
},{
    value: '',
    label: '空',
}];

let modalKey = 0;//  用于重置modal

// 数据字典
class DtaDictionary extends React.Component{
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            confirmDirty: false,
            vis:'none',
            options:[],
            searchCriteria:{},
            page:{},
            pageNow:1,
            userName: '',
            loading:true,
        };

        this.columns = [
             {
                title: '工卡号',
                dataIndex: 'subTaskNo',
                key: 'subTaskNo',
            }, {
                title: '件号',
                dataIndex: 'pnNo',
                key: 'pnNo',
            }, {
                title: '故障描述',
                dataIndex: 'description',
                key: 'description',
            },{
                title: '设备类型',
                dataIndex: 'equipmentType',
                key: 'equipmentType',
            }, {
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',

            }, {
                title: '视情',
                dataIndex: 'onCondition',
                key: 'onCondition',

            },{
                title: '适用性',
                dataIndex: 'applicability',
                key: 'applicability',
            },{
                title: '互换信息及备注',
                dataIndex: 'conditionNote',
                key: 'conditionNote',
            },{
                title: '同步时间',
                dataIndex: 'synchroTime',
                key: 'synchroTime',
                render:(text,record) => {
                    const time = this.changetime(record.synchroTime);
                    return <span>{time}</span>
                }
            },{
                title: '设备状态',
                dataIndex: 'equipmentState',
                key: 'equipmentState',
                width:80,
                render: (text, record,index) => (
                    <Select
                        defaultValue={record.equipmentState}
                        onSelect={(value,e)=>this.changeequipmentState(e,record,value)}

                    >
                        <Option value="T" >有效</Option>
                        <Option value="F" >无效</Option>
                    </Select>

                )
            }, {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render:(text,record,index) => {
                    const time = this.changetime(record.updateTime);
                    return <span>{time}</span>
                }
            }];
        this.state={
            data:[]
        };
    }
    // 修改状态
    changeequipmentState = (e,record,value) => {
        // console.log('aaa',record);
        if(value){
            // console.log('aa',value);
            Api.post('workPackageInfo/updateSubTaskEquipment',{
                'seId':record.id,
                'equipmentState':value,
            }).then(res=>{
                // console.log(res);
                if(res.errorCode=='0'){
                    message.success('修改成功！');
                }else{
                    message.error('修改失败！');
                }
            })
        }

    };

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
        Api.post('workPackageInfo/findSubTaskEquipmentByCondition',{
            'subTaskId':'',
            'pnNo':'',
            'equipmentType':'',
            'equipmentState':''
            }
        ).then(res=>{
            console.log(res);
            this.setState({
                data: res.data,
                page:res.pageInfo,
                loading:false,
            })
        })
    }
    componentDidMount(){
        this.update();
    }
// 多条件查询
    handleSearch = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            Api.post('workPackageInfo/findSubTaskEquipmentByCondition',{
                'subTaskId':values.subTaskId,
                'pnNo':values.pnNo,
                'equipmentType':values.equipmentType,
                'equipmentState':values.equipmentState,
                'subTaskNo':values.subTaskNo
            }).then(res=>{
                this.setState({
                    data:res? res.data:[],
                    page:res.pageInfo,
                    subTaskId:values.subTaskId,
                    pnNo:values.pnNo,
                    equipmentType:values.equipmentType,
                    equipmentState:values.equipmentState,
                    subTaskNo:values.subTaskNo,
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
        Api.post('workPackageInfo/findSubTaskEquipmentByCondition',{
            'pageNow':pageNumber,
            'subTaskId':this.state.subTaskId,
            'pnNo':this.state.pnNo,
            'equipmentType':this.state.equipmentType,
            'equipmentState':this.state.equipmentState,
            'subTaskNo':this.state.subTaskNo
        }).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    loading:false,
                });
            // }
        })
    };

    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const { data,page } = this.state;
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
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`件号：`}>
                                    {getFieldDecorator('pnNo',{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem {...formItemLayout} label={`设备类型：`}>
                                    {getFieldDecorator(`equipmentType`)(
                                        <Select allowClear={true}>
                                            <Option value="AS">AS</Option>
                                            <Option value="CH">CH</Option>
                                            <Option value="TS" >TS</Option>
                                            <Option value="TO" >TO</Option>
                                            <Option value="GS" >GS</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={`设备状态`} >
                                    {getFieldDecorator(`equipmentState`,{
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
                                <FormItem {...formItemLayout} label={`工卡号：`}>
                                    {getFieldDecorator('subTaskNo',{
                                    })(
                                        <Input />
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
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle"/>
                    <Paginations
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const DtaDictionarys = Form.create()(DtaDictionary);
export default DtaDictionarys;


