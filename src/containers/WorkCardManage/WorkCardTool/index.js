import './index.css';
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Row, Col,Carousel,Icon,Select} from 'antd';
import { Tabs } from 'antd';

import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import Pagination from '../../../components/Pagination/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;


const dicState =[{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
},{
    value: '',
    label: '全部',
}];

let modalKey = 0;//  用于重置modal


class WorkCardTool extends React.Component{
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
            pictureModal:false
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
                    title: '设备类型',
                    dataIndex: 'equipmentType',
                    key: 'equipmentType',
                },{
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
                }, {
                    title: '数量',
                    dataIndex: 'quantity',
                    key: 'quantity',

                }, {
                    title: '视情',
                    dataIndex: 'onCondition',
                    key: 'onCondition',
                },{
                    title: '设备状态',
                    dataIndex: 'equipmentState',
                    key: 'equipmentState',
                    render:(text,record) => {
                        const state = record.equipmentState;
                        if(state == 'T'){
                            return <span>有效</span>
                        }else if(state == 'F'){
                            return <span>无效</span>
                        }else if(state == 'D'){
                            return <span>删除</span>
                        }
                    }
                },{
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                    render:(text,record,index) => {
                        const time = record.updateTime?this.changetime(record.updateTime):'';
                        return <span>{time}</span>
                    }
                // },{
                //     title: '操作',
                //     key: 'img',
                //     render:(text,record) => <a onClick={_=>this.showPicture()}>查看图片</a>
                }
            ];
        this.state={
            data:[]
        };
    }

//  查看图片
    showPicture = _ => {
        const pictureModal = true;
        this.setState({pictureModal})
    };
    hidePicture = _ => {
        const pictureModal = false;
        this.setState({pictureModal})
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
    // 更新页面数据
    update(){
        Api.post('workPackageInfo/findBasicEquipmentByCondition',{
                'pageNow':this.state.pageNumber,
                'subTaskNo':'',
                'pnNo':'',
                'equipmentType':'',
                'description':'',
                'updateTimeStart':'',
                'updateTimeEnd':'',
                'quantity':'',
                'onCondition':'',
                'equipmentState':'',
            }
        ).then(res=>{
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

    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };
// 多条件查询
    handleSearch = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            Api.post('workPackageInfo/findBasicEquipmentByCondition',{
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD HH:mm:ss'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD HH:mm:ss'):'',
                'subTaskNo':values.subTaskNo,
                'pnNo':values.pnNo,
                'equipmentType':values.equipmentType,
                'equipmentState':values.equipmentState,
            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo,
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
        Api.post('workPackageInfo/findBasicEquipmentByCondition',{'pageNow':pageNumber}).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    pageNumber:pageNumber,
                    loading:false,
                    pageNow:pageNumber
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
        const { data,page,pictureModal} = this.state;
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
                                <FormItem {...formItemLayout} label={`件号`}>
                                    {getFieldDecorator('pnNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem {...formItemLayout} label={`设备类型`}>
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
                                <FormItem {...formItemLayout} label={`设备`} >
                                    {getFieldDecorator(`equipmentState`,{
                                        // initialValue: [null],
                                    })(
                                        <Cascader  options={dicState} placeholder=""/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={6} >
                                <FormItem {...formItemLayout} label={`工卡号`}>
                                    {getFieldDecorator('subTaskNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5} >
                                <FormItem
                                    {...formItemLayout}
                                    label="更新起止时间："
                                >
                                    {getFieldDecorator('updateTime')(
                                        <RangePicker  showTime={{ format: 'HH:mm:ss' }}  format="YYYY-MM-DD HH:mm:ss"  placeholder={['', '']}/>
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
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
                <Modal
                    visible={pictureModal}
                    title="所属件号图片"
                    onCancel={_=>this.hidePicture()}
                    footer={null}
                    key={`modal${modalKey}`}
                >
                    <Carousel>
                        <div><h3>1</h3></div>
                        <div><h3>2</h3></div>
                        <div><h3>3</h3></div>
                        <div><h3>4</h3></div>
                    </Carousel>
                </Modal>
            </div>
        )
    }
}
WorkCardTool = Form.create()(WorkCardTool);
export default WorkCardTool;


