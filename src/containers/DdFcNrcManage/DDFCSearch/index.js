/**
 * Created by Administrator on 2017/7/26/026.
 */
import React from 'react';
import { Form, Input, Button,Table,Modal,Icon,Select,message  } from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
import Paginations from '../../../components/Pagination';
import Ddfcequipment from './DDFCEQUIPMENT';
import DdfcEmpCheck from './DdfcEmpCheck';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;

let modalKey = 0;//  用于重置modal
// DDFC查询
class DDFCSearch extends React.Component{
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
            DdfcequipmentVisible:false,
            ddfcData:false,
            empReceives1:false,
            empFind1:false
        };

        this.columns = [
            {
                title: '工作包号',
                dataIndex: 'commandNo',
                key: 'commandNo',
            }, {
                title: 'DD/FC类型',
                dataIndex: 'deferType',
                key: 'deferType',
            }, {
                title: 'DD/FC编号',
                dataIndex: 'deferId',
                key: 'deferId',
                width:80
            }, {
                title: 'DD/FC项次号',
                dataIndex: 'itemno',
                key: 'itemno',
                width:80
            },{
                title: 'DD/FC状态',
                dataIndex: 'executeStatus',
                key: 'executeStatus',
                render:(text,record) => {
                    const state = record.deferState;
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

            },  {
                title: '飞机号',
                dataIndex: 'msn',
                key: 'msn',
            }, {
                title: '章节',
                dataIndex: 'ata',
                key: 'ata',
            }, {
                title: '航站',
                dataIndex: 'station',
                key: 'station',
            },{
                title: '创建时间',
                dataIndex: 'creationDate',
                key: 'creationDate',
                render:(text,record) => {
                    const time = this.changetime(record.creationDate);
                    return <span>{time}</span>
                }
            },{
                title: '完成时间',
                dataIndex: 'executeEndTime',
                key: 'executeEndTime',
                render:(text,record) => {
                    const time = this.changetime(record.executeEndTime);
                    return <span>{time}</span>
                }
            },{
                title: '同步时间',
                dataIndex: 'synchroTime',
                key: 'synchroTime',
                render:(text,record) => {
                    const time = this.changetime(record.synchroTime);
                    return <span>{time}</span>
                }
            }, {
                title: '转录自',
                dataIndex: 'baseNo',
                key: 'baseNo',
            }, {
                title: '保留依据',
                dataIndex: 'document',
                key: 'document',

            }, {
                title: '保留原因',
                dataIndex: 'deferReason',
                key: 'deferReason',

            }, {
                title: '人工数',
                dataIndex: 'mhPerson',
                key: 'mhPerson',

            }, {
                title: '理论工时',
                dataIndex: 'mhTime',
                key: 'mhTime',
            }, {
                title: '实际工时',
                dataIndex: 'actualHour',
                key: 'actualHour',
            },{
                title: '是否公务舱区域',
                dataIndex: 'businessClassArea',
                key: 'businessClassArea',
            }, {
                title: '是否观察项目',
                dataIndex: 'oiItem',
                key: 'oiItem',
            }, {
                title: '故障描述',
                dataIndex: 'description',
                key: 'description',
                width:200,
                className:'table_workInfo',
                render:(text,record) => {
                    return <div title={record.description}>{record.description}</div>
                }
            }, {
                title: '预计修复时机',
                dataIndex: 'expectedRepair',
                key: 'expectedRepair',
            }, {
                title: '修复期限',
                dataIndex: 'deadline',
                key: 'deadline',
                // render:(text,record) => {
                //     const time = record.deadline!=null?this.changetime(record.deadline):'';
                //     return <span>{time}</span>
                // }
            }, {
                title: '是否挂牌警告',
                dataIndex: 'warningTag',
                key: 'warningTag',
            },{
                title: '机组操作措施',
                dataIndex: 'crewOperation',
                key: 'crewOperation',
            },{
                title: '是否运行限制',
                dataIndex: 'fllimited',
                key: 'fllimited',
            },{
                title: '维修措施',
                dataIndex: 'mainaction',
                key: 'mainaction',
                width:'200px'
            },{
                title: '检查间隔',
                dataIndex: 'interval',
                key: 'interval',
            },{

                title: '检查标准',
                dataIndex: 'standard',
                key: 'standard',
            // },{
            //     title: '关闭条件',
            //     dataIndex: 'closereq',
            //     key: 'closereq',
            // },{
            //     title: '关闭日期',
            //     dataIndex: 'accomplDate',
            //     key: 'accomplDate',
            //     render:(text,record) => {
            //         const time = record.accomplDate!=null?this.changetime(record.accomplDate):'';
            //         return <span>{time}</span>
            //     }
            // },{
            //     title: '纠正措施',
            //     dataIndex: 'correctiveaction',
            //     key: 'correctiveaction',
            // },{
            //     title: '关闭人员',
            //     dataIndex: 'tech2',
            //     key: 'tech2',
            // },{
            //     title: '批准人员',
            //     dataIndex: 'approvedBy2',
            //     key: 'approvedBy2',
            // },{
            //     title: '飞机上撤除页',
            //     dataIndex: 'removedBy',
            //     key: 'removedBy',
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
            },{
                title: '操作',
                key: 'action',
                width: '100px',
                render: (text, record,index) => {
                    //console.log(text.battleLine);
                    return (
                        <span className="action">
                            <a onClick={()=>this.Ddfcequipment(record)}>所需设备查询</a>
                             <span className="ant-divider" />
                         <a  onClick={()=>this.empReceive1(record)}>人员安排</a>
                        </span>

                    )
                },
            }];
        this.state={
            data:[]
        };
    }


    // 人员安排
    empReceive1 = (record) => {
        let  empFind1 = false;
        if(record.id) {
            empFind1 = record;
        }

        this.setState({
            empFind1:empFind1,
            empReceives1: true
        });
    };
    empReceiveCancel1 = () => {
        this.setState({
            empReceives1:false
        });
        this.update();
    };



// 根据条件查询DDFCEQUIPMENT
    Ddfcequipment = (record) => {
        let ddfcData = false;
        if(record.id) {
            ddfcData = record;
        }
        this.setState({
            ddfcData:ddfcData,
            DdfcequipmentVisible: true
        });
    };
    DdfcequipmentCancel = () => {
        this.setState({
            DdfcequipmentVisible:false
        });

    };
// 更新页面数据
    update(){
        const value=this.props.DDFCchecks;
        const value1=this.props.ddfcAdd;
        if(value){
            Api.post('deferInfo/findDDFCByCondition',{
                'commandNo':value?value.commandNo:'',
                'deferState':'',
                'deferId':'',
                'deferType':'',
                'pageNow':this.state.pageNumber
            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo
                })
            })
        }else if(value1){
            Api.post('deferInfo/findDDFCByCondition',{
                'commandNo':value1,
                'deferState':'',
                'deferId':'',
                'deferType':'',
                'pageNow':this.state.pageNumber
            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo
                })
            })
        }else{
            Api.post('deferInfo/findDDFCByCondition',{
                'commandNo':'',
                'deferState':'',
                'deferId':'',
                'deferType':'',
                'pageNow':this.state.pageNumber
            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo
                })
            })
        }

    }
    componentDidMount(){
        this.update();
    }
//多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        const value=this.props.DDFCchecks;
        this.props.form.validateFields((err, values) => {
            Api.post('deferInfo/findDDFCByCondition',{
                'commandNo':value?value.commandNo:values.commandNo,
                'deferState':values.deferState,
                'deferId':values.deferId,
                'deferType':values.deferType,
                'pageNow':this.state.pageNow,

            }).then(res=>{
                this.setState({
                    data: res.data,
                    page:res.pageInfo,
                    commandNo:value?value.commandNo:values.commandNo,
                    deferState:values.deferState,
                    deferId:values.deferId,
                    deferType:values.deferType,
                    pageNow:this.state.pageNow,
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
        Api.post('deferInfo/findDDFCByCondition',{'pageNow':pageNumber,'commandNo':this.state.commandNo,
            'deferState':this.state.deferState,
            'deferId':this.state.deferId,
            'deferType':this.state.deferType,}).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    pageNumber:pageNumber,
                    tableLoading:false,
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
        const { data,page,DdfcequipmentVisible, ddfcData,empReceives1} = this.state;
        const value=this.props.DDFCchecks;
        const value1=this.props.ddfcAdd;
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
                                    <Col span={8} key={1} className="update-time-input" style={{display:value||value1?'none':'block'}}>
                                        <FormItem
                                            {...formItemLayout}
                                            label="工作包号"
                                        >
                                            {getFieldDecorator('commandNo')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="DD/FC类型"
                                        >
                                            {getFieldDecorator('deferType')(
                                                <Select>
                                                    <Option value="DD">DD</Option>
                                                    <Option value="FC">FC</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="DD/FC编号"
                                        >
                                            {getFieldDecorator('deferId')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={4} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="DD/FC状态"
                                        >
                                            {getFieldDecorator('deferState')(
                                                <Select>
                                                    <Option value="T">已领取</Option>
                                                    <Option value="F">未领取</Option>
                                                    <Option value="E">closed</Option>
                                                    <Option value="" >全部</Option>
                                                    {/*<Option value="F">无效</Option>*/}
                                                    {/*<Option value="F">取消</Option>*/}
                                                </Select>
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
                    <Modal
                        title={ddfcData?ddfcData.deferType+'编号:'+ddfcData.deferId:''}
                        visible={DdfcequipmentVisible}
                        onCancel={this.DdfcequipmentCancel}
                        onOk={this.handleOk}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}keya`}
                        width='80%'
          >
                        <Ddfcequipment  DdfcequipmentData={this.state.ddfcData} />
                    </Modal>
                    <Modal
                        title="执行人员分配"
                        visible={empReceives1}
                        onCancel={this.empReceiveCancel1}
                        onOk={this.handleOk}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}key4`}
                        width="50%"
                    >
                        <DdfcEmpCheck empFind1={this.state.empFind1}/>
                    </Modal>


                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={this.state.loading}  bordered scroll={{ x: 2000}} size="middle"  className='table'/>
                    <Paginations
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const DDFCSearchs = Form.create()(DDFCSearch);
export default DDFCSearchs;


