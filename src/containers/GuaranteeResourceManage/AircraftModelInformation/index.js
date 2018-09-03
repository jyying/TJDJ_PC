/**
 * Created by Administrator on 2017/7/26/026.
 */
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Icon,Pagination,Popconfirm,Select,message  } from 'antd';
import {  Row, Col} from 'antd';
import UpdateList from './UpdateList';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import AddAircraftModels from './AddAircraftModels'
import Api from '../../../api/request';
import Paginations from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

let modalKey = 0;//  用于重置modal
// 机型信息
class AircraftModelInformation extends React.Component{
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
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
            datas: [],
            names:'',
            searchCriteria:{},
            page:{},
            pageNow:1,
            loading:true,
        };

        this.columns = [
            {
            title: '飞机机型',
            dataIndex: 'airPlaneModel',
            key: 'airPlaneModel',

            }, {
                title: '机型全称',
                dataIndex: 'airPlaneModelName',
                key: 'airPlaneModelName',
            }, {
                title: '机型匹配简称',
                dataIndex: 'airPlaneModelMatch',
                key: 'airPlaneModelMatch',
            },  {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render:(text,record,index) => {
                    const time = this.changetime(record.updateTime);
                    return <span>{time}</span>
                }
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <span>
                    <a  onClick={()=>this.showModal(index)}>修改</a>
                    {/*<span className="ant-divider" />*/}
                     {/*<a  onClick={()=>this.PermissionInformation(index)}>相关人员资质信息</a>*/}
                 </span>

            ),
        }];

        this.column = [ {
            title: '人员',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: '机型',
            dataIndex: 'airplaneModelName',
            key: 'airplaneModelName',
        }, {
            title: '员工级别',
            dataIndex: 'empLevelName',
            key: 'empLevelName',
        },{
            title: '飞机区域',
            dataIndex: 'airplaneAreaName',
            key: 'airplaneAreaName',
        },{
            title: '部门',
            dataIndex: 'fullName',
            key: 'fullName',
        },{
            title: '授权类别',
            dataIndex: 'sortName',
            key: 'sortName',
        },{
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName',
        },{
            title: '飞机区域',
            dataIndex: 'areaName',
            key: 'areaName',
        },{
            title: '区域',
            dataIndex: 'areaName1',
            key: 'areaName1',
        }, {
            title: '机型',
            dataIndex: 'actypeName',
            key: 'actypeName',
        }, {
            title: '有效期',
            dataIndex: 'validityName',
            key: 'validityName',
        // }, {
        //     title: '修改时间',
        //     dataIndex: 'updateTime',
        //     key: 'updateTime',
        //     render:(text,record,index) => {
        //         const time =record.updateTime!=null? this.changetime(record.updateTime):'';
        //         return <span>{time}</span>
        //     }
        }, {
            title: '授权状态',
            dataIndex: 'authState',
            key: 'authState',
            render:(text,record) => {
                const state = record.authState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }
            }
        }];

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
        Api.post('air/findAirPlaneModelByCondition',{
            'pageNow':this.state.pageNumber
        }).then(res=>{
            this.setState({
                data: res.data,
                page:res.pageInfo,
                loading:false
            })
        })
    }
    componentDidMount(){
        this.update();
    }
 // 列表提交
    handleSubmit = (e) => {
        // e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Api.post('airPlaneModel/addOrUpdateAirPalneModel',{
                    'airPlaneModel':values.airPlaneModels,
                    'remark':values.remarks
                }).then(res=>{
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else{
                        message.error('添加失败！');
                    }
                })
            }
        });
    };
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

// 人员资质授权管理Modal
    PermissionInformation = (index) => {
        const { data } = this.state;
        const PermissionInformation=[];
        PermissionInformation.push(data[index]);
        Api.post('employeeAuth/findEmployeeAuthByAirModelId',{
            'airplaneModelId':data[index].id}).then(res=>{
                console.log('a',res);
            this.setState({
                PermissionVisible: true,
                datas:res? res.data:[],
                names:data[index],
                PermissionInformation:PermissionInformation,
                currentPageEmpower:parseInt(res.pageInfo.currentPage),
                totalPageSizeEmpower:parseInt(res.pageInfo.totalPageSize),
                totalSizeEmpower:parseInt(res.pageInfo.totalSize),
                loading:false
            });
        });
        //人员资质授权明细页分页查询
        this.onChangePage = (pageNumber) => {
            Api.post('employeeAuth/findEmployeeAuthByAirModelId',{'airplaneModelId':data[index].id,'pageNow':pageNumber}).then(res=>{
                this.setState({
                    datas:res? res.data:[],
                    currentPageEmpower:parseInt(res.pageInfo.currentPage),
                });
            })

        };
    };
// 人员资质授权Cancel
    PermissionCancel = (e) => {
        this.setState({
            PermissionVisible: false,
        });
        this.props.form.resetFields();
    };
//多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            Api.post('air/findAirPlaneModelByCondition',{
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'airPlaneModel':values.airPlaneModel,
                'remark':values.remark,
            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        this.update();
    };
//分页查询
    onChange = (pageNumber) => {
        // let values = this.state.searchCriteria;
        // values.pageNow = pageNumber;
        // this.setState({  //  此处有坑
        //    tableLoading:true
        // });
        Api.post('air/findAirPlaneModelByCondition',{'pageNow':pageNumber}).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    pageNumber:pageNumber,
                    tableLoading:false,
                    pageNow:pageNumber
                });
            }
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
        const column = this.column;
        const { data,page } = this.state;
        const { datas } = this.state;
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
                                    <Col span={8} key={1} className="update-time-input">
                                        <FormItem
                                            {...formItemLayout}
                                            label="飞机机型："
                                        >
                                            {getFieldDecorator('airPlaneModel')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="备注："
                                        >
                                            {getFieldDecorator('remark')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="更新时间："
                                        >
                                            {getFieldDecorator('updateTime')(
                                                <RangePicker   placeholder={['', '']}/>
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
                        <Button className="editable-add-btn btn_reload" onClick={this.showModalAdd}  style={{float:'left'}}><Icon type="plus" />新增</Button>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                            <AddAircraftModels onCancel={this.handleCancelAdd}/>

                        </Modal>
                        <Modal
                            title="修改"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key={`${modalKey}keyb`}
                        >
                            <UpdateList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                        <Modal
                            title="相关人员资质信息"
                            visible={this.state.PermissionVisible}
                            onCancel={this.PermissionCancel}
                            maskClosable={false}
                            footer={null}
                            width='80%'
                            key={this.state.count}
                        >
                            <div>
                                <div className="content">
                                    <Table rowKey='id' columns={column}  dataSource={datas} pagination={false}  loading={this.state.loading}  bordered size="middle"/>
                                    <Pagination showQuickJumper defaultCurrent={this.state.currentPageEmpower} total={this.state.totalSizeEmpower} onChange={this.onChangePage} showTotal={total => `合计 ${total} 条` }/>
                                </div>
                            </div>
                        </Modal>
                    </div>
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
const AircraftModelInformations = Form.create()(AircraftModelInformation);
export default AircraftModelInformations;


