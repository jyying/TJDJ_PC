import React from 'react';
import { Form, Input, Button,Table,Modal,Select,Icon} from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
import Paginations from '../../../components/Pagination';
import AddNrc from './AddNrc';
import UpdateNrc from './UpdateNrc';
import NRCEQUIPMENTSearch from './NRCEQUIPMENTSearch';
import NrcEmpCheck from './NrcEmpCheck';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;

let modalKey = 0;//  用于重置modal
// NRC查询
class NRCSearch extends React.Component{
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
            autoCompleteResult: [],
            vis:'none',
            options:[],
            datas: [],
            names:'',
            searchCriteria:{},
            page:{},
            pageNow:1,
            loading:true,
            NRCEQUIPMENTSearchData:false,
            PermissionVisible:false,
            add1:false,
            Nrcvisible:false,
            NrcUpdate:false,
            empReceives:false,
            empFind:false
        };

        this.columns = [
            {
                title: '工作包号',
                dataIndex: 'commandNo',
                key: 'commandNo',
            },  {
                title: 'NRC类型',
                dataIndex: 'nrcType',
                key: 'nrcType',
            }, {
                title: '项次号',
                dataIndex: 'itemno',
                key: 'itemno',
            },  {
                title: '序号',
                dataIndex: 'nrcNo',
                key: 'nrcNo',
            },  {
                title: 'NRC号',
                dataIndex: 'defectNo',
                key: 'defectNo',
            }, {
                title: '缺陷描述',
                dataIndex: 'defectDesc',
                key: 'defectDesc',
                width:200,
                className:'table_workInfo',
                render:(text,record) => {
                    return <div title={record.defectDesc}>{record.defectDesc}</div>
                }

            },
            {
                title: '责任工种',
                dataIndex: 'nrcTaskType',
                key: 'nrcTaskType',

            },
            {
                title: '工种说明',
                dataIndex: 'description',
                key: 'description',

            }, {
                title: '理论工时',
                dataIndex: 'total',
                key: 'total',
            }, {
                title: '实际工时',
                dataIndex: 'actualHour',
                key: 'actualHour',
            }, {
                title: '同步时间',
                dataIndex: 'synchroTime',
                key: 'synchroTime',
                render:(text,record,index) => {
                    const time = this.changetime(record.synchroTime);
                    return <span>{time}</span>

                }
            }, {
                title: '创建时间',
                dataIndex: 'createdDate',
                key: 'createdDate',
                render:(text,record,index) => {
                    const time = this.changetime(record.createdDate);
                    return <span>{time}</span>

                }
            },{
                title: '完成时间',
                dataIndex: 'executeEndTime',
                key: 'executeEndTime',
                render:(text,record) => {
                    const time =record.executeEndTime!==null? this.changetime(record.executeEndTime):'';
                    return <span>{time}</span>
                }
            }, {
                title: '编写人',
                dataIndex: 'createdBy',
                key: 'createdBy',
            }, {
                title: 'NRC状态',
                dataIndex: 'executeStatus',
                key: 'executeStatus',
                render:(text,record) => {
                    const state = record.nrcState;
                    if(state == 'T'){
                        if(record.executeStatus=='S'){
                            if(record.receiveStatus=='T'){
                                return <span>已领取</span>
                            }else if(record.receiveStatus=='F'){
                                return <span>未领取</span>
                            }
                        }else if(record.executeStatus=='E'){
                            return <span>closed</span>
                        }else if(record.executeStatus=='F'){
                            return <span>取消</span>
                        }else if(record.executeStatus=='R'){
                            if(record.receiveStatus=='T'){
                                return <span>已领取</span>
                            }else if(record.receiveStatus=='F'){
                                return <span>未领取</span>
                            }
                        }
                    }else if(state == 'F'){
                        return <span>无效</span>
                    }else if(state == 'D'){
                        return <span>删除</span>
                    }
                }
            }, {
                title: '执行人',
                dataIndex: 'empReceiveList',
                key: 'empReceiveList',
                render:(text,record) => {
                    let src='';
                    if(record.empReceiveList!==null){
                        for(let i=0;i<record.empReceiveList.length;i++){
                            src +=record.empReceiveList[i].empName+','
                        }
                        return <span>{src}</span>
                    }
                }
        }, {
                title: '操作',
                key: 'action',
                render: (text, record,index) => (
                    <span>
                     <a  onClick={()=>this.PermissionInformation(record)}>所需设备查询</a>
                         <span className="ant-divider" />
                         <a  onClick={()=>this.UpdateNrc(record)}>修改</a>
                        <span className="ant-divider" />
                         <a  onClick={()=>this.empReceive(record)}>人员安排</a>
                 </span>

                ),
            }];

    }

    // 人员安排
    empReceive = (record) => {
        let  empFind = false;
        if(record.id) {
            empFind = record;
        }

        this.setState({
            empFind:empFind,
            empReceives: true
        });
    };
    empReceiveCancel = () => {
        this.setState({
            empReceives:false
        });
        this.update();
    };



    // 修改Nrc
    UpdateNrc = (record) => {
        let NrcUpdate = false;
        if(record.id) {
            NrcUpdate = record;
        }
        this.setState({
            NrcUpdate:NrcUpdate,
            Nrcvisible: true
        });
    };
    NrcCancel = () => {
        this.setState({
            Nrcvisible:false
        });
        this.update();
    };


// 更新页面数据
    update(){
        const value=this.props.NRCchecks;
        Api.post('deferInfo/findNRCByCondition',{
            'nrcState':'',
            'commandNo':value?value.commandNo:'',
            'defectNo':'',
            'pageNow':this.state.pageNow
        }).then(res=>{
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
//多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        const value=this.props.NRCchecks;
        this.props.form.validateFields((err, values) => {
            Api.post('deferInfo/findNRCByCondition',{
                'nrcState':values.nrcState,
                'commandNo':value?value.commandNo:values.commandNo,
                'defectNo':values.defectNo,
            }).then(res=>{
                this.setState({
                    data:res? res.data:'',
                    page:res.pageInfo,
                    nrcState:values.nrcState,
                    commandNo:value?value.commandNo:values.commandNo,
                    loading:false,
                    defectNo:values.defectNo,
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
//分页查询
    onChange = (pageNumber) => {
        Api.post('deferInfo/findNRCByCondition',{
            'pageNow':pageNumber,
            'nrcState':this.state.nrcState,
            'commandNo':this.state.commandNo,
            'defectNo':this.state.defectNo,
        }).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data:res? res.data:'',
                    loading:false,
                });
            }
        })
    };
// NRCEQUIPMENT
    PermissionInformation = (record) => {
        let NRCEQUIPMENTSearchData = false;
        if(record.id) {
            NRCEQUIPMENTSearchData = record;
        }
        this.setState({
            NRCEQUIPMENTSearchData:NRCEQUIPMENTSearchData,
            PermissionVisible: true
        });
    };
    PermissionCancel = () => {
        this.setState({
            PermissionVisible:false
        });

    };


    // 新增DDFC
    AdddNrc = () => {
        this.setState({
            add1: true
        });
    };
    AddCancel = () => {
        this.setState({
            add1:false
        });
        this.update();
    };
    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
         const { data,page,add1,Nrcvisible,NrcUpdate,empReceives} = this.state;
        const value=this.props.NRCchecks;
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
                                    <Col span={8} key={1} className="update-time-input" style={{display:value?'none':'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="工作包号："
                                        >
                                            {getFieldDecorator('commandNo')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="NRC状态"
                                        >
                                            {getFieldDecorator('nrcState')(
                                                <Select>
                                                    <Option value="T">已领取</Option>
                                                    <Option value="F">未领取</Option>
                                                    <Option value="E">closed</Option>
                                                    <Option value="" >全部</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="NRC号："
                                        >
                                            {getFieldDecorator('defectNo')(
                                                <Input/>
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
                    <Row type="flex" justify="start">
                        <Button className="editable-add-btn btn_reload"  onClick={this.AdddNrc} ><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>
                    </Row>
                    <Modal
                        title="新建"
                        visible={add1}
                        onCancel={this.AddCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}keyb`}
                    >
                        <AddNrc  onCancel={this.AddCancel}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={Nrcvisible}
                        onCancel={this.NrcCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}keyc`}
                    >
                        <UpdateNrc NrcUpdate={NrcUpdate}  onCancel={this.NrcCancel}/>
                    </Modal>
                    <Modal
                        title="NRC设备查询"
                        visible={this.state.PermissionVisible}
                        onCancel={this.PermissionCancel}
                        maskClosable={false}
                        footer={null}
                        width='90%'
                        key={`${modalKey}keya`}
                    >
                        <div>
                            <NRCEQUIPMENTSearch NRCEQUIPMENTSearchData={this.state.NRCEQUIPMENTSearchData} />
                        </div>
                    </Modal>
                    <Modal
                        title="执行人员分配"
                        visible={empReceives}
                        onCancel={this.empReceiveCancel}
                        onOk={this.handleOk}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}key4`}
                        width="50%"
                    >
                        <NrcEmpCheck empFind={this.state.empFind}/>
                    </Modal>


                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle" className='table'/>
                    <Paginations
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const NRCSearchs = Form.create()(NRCSearch);
export default NRCSearchs;


