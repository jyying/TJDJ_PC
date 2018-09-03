import './index.css'
import React from 'react';
import {
    Form,
    Input,
    Button,
    Table,
    DatePicker,
    Icon,
} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import { Tabs } from 'antd';
import moment from 'moment';
let modalKey = 1;
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


// 飞机放行
class AirplanePass extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tableLoading:false,
            total:'',
            total1:''
        };

        this.columns = [{
            title: '周数',
            dataIndex: 'weekNo',
            key: 'weekNo',
        }, {
            title: '机型',
            dataIndex: 'airplaneModel',
            key: 'airplaneModel',
        }, {
            title: '机号',
            dataIndex: 'airplaneRegNo',
            key: 'airplaneRegNo',
        }, {
            title: '维修工作',
            dataIndex: 'workInfo',
            key: 'workInfo',
            width:'200px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workInfo}>{record.workInfo}</div>
            }
        }, {
            title: '指令号',
            dataIndex: 'commandNo',
            key: 'commandNo',
            width:94
        },{
            title: '执行开始日期',
            dataIndex: 'executeStartTime',
            key: 'executeStartTime',
            render:(text,record) => {
                const time = this.changetime(record.executeStartTime);
                return <span>{time}</span>
            }
        }, {
            title: '执行结束日期',
            dataIndex: 'executeEndTime',
            key: 'executeEndTime',
            render:(text,record) => {
                const time = this.changetime(record.executeEndTime);
                return <span>{time}</span>
            }
        }, {
            title: '停场时间',
            dataIndex: 'airplaneStandDays',
            key: 'airplaneStandDays',
        }, {
            title: '机位',
            dataIndex: 'standName',
            key: 'standName',
        }, {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
        }, {
            title: '分线',
            dataIndex: 'battleLineName',
            key: 'battleLineName',
        }, {
            title: '执行状态',
            dataIndex: 'packageStatus',
            key: 'packageStatus',
            render:(text,record) => {
                const state = record.packageStatus;
                if(state == 'S'){
                    return <span>开始</span>
                }else if(state == 'E'){
                    return <span>结束</span>
                }else if(state == 'F'){
                    return <span>失败</span>
                }
            }
        // },{
        //     title: '试车员',
        //     dataIndex: 'testpilotManName',
        //     key: 'testpilotManName',
        // }, {
        //     title: '观察员',
        //     dataIndex: 'observerManName',
        //     key: 'observerManName',
        },{
            title: '生产线经理',
            dataIndex: 'empMNames',
            key: 'empMNames',
        }, {
            title: '跟线员',
            dataIndex: 'empENames',
            key: 'empENames',
        // }, {
        //     title: '进场时间',
        //     dataIndex: 'goInAirportTime',
        //     key: 'goInAirportTime',
        },{
            title: '总工时',
            dataIndex: 'totalWorkingHours',
            key: 'totalWorkingHours',
        },{
            title: '机械工时',
            dataIndex: 'machineHours',
            key: 'machineHours',
        },{
            title: '电气工时',
            dataIndex: 'electricHours',
            key: 'electricHours',
        },{
            title: '电子工时',
            dataIndex: 'electronHours',
            key: 'electronHours',
        },{
            title: '清洁工时',
            dataIndex: 'cleanHours',
            key: 'cleanHours',
        },{

            title: '客舱工时',
            dataIndex: 'cabinHours',
            key: 'cabinHours',
        },{
            title: 'NDT工时',
            dataIndex: 'ndtHours',
            key: 'ndtHours',
        },{
            title: '金工工时',
            dataIndex: 'metalworkingHours',
            key: 'metalworkingHours',
        },{
            title: '漆工工时',
            dataIndex: 'lacqueringHours',
            key: 'lacqueringHours',
        }];

        this.columns1 = [{
            title: '工作包号',
            dataIndex: 'commandNo',
            key: 'commandNo',
            width:'71px',
        }, {
                title: 'DD/FC类型',
                dataIndex: 'deferType',
                key: 'deferType',
            width:84,
            },  {
                title: '飞机号',
                dataIndex: 'msn',
                key: 'msn',
            width:58,
            }, {
                title: '章节',
                dataIndex: 'ata',
                key: 'ata',
            width:47,
            }, {
                title: '航站',
                dataIndex: 'station',
                key: 'station',
            width:45,
        },{
            title: '创建日期',
            dataIndex: 'creationDate',
            key: 'creationDate',
            width:86,
            render:(text,record) => {
                const time = this.changetime(record.creationDate);
                return <span>{time}</span>
            }
        }, {
            title: '转录自',
            dataIndex: 'baseNo',
            key: 'baseNo',
            width:104,
        }, {
            title: '故障描述',
            dataIndex: 'description',
            key: 'description',
            width:'200px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.description}>{record.description}</div>
            }
        }, {
            title: '修复期限',
            dataIndex: 'deadline',
            key: 'deadline',
            width:71,
            // render:(text,record) => {
            //     const time = record.deadline!=null?this.changetime(record.deadline):'';
            //     return <span>{time}</span>
            // }
        }, {
            title: '保留依据',
            dataIndex: 'document',
            key: 'document',
            width:158,
        }, {
            title: '保留原因',
            dataIndex: 'deferReason',
            key: 'deferReason',
            width:71,
        }, {
            title: '工作包执行状态',
            dataIndex: 'packageStatus',
            key: 'packageStatus',
            width:111,
            render:(text,record) => {
                const state = record.packageStatus;
                if(state == 'E'){
                    return <span>ENDW</span>
                }else {
                    return <span>open</span>
                }
            }
        },{
            title: '人工数',
            dataIndex: 'mhPerson',
            key: 'mhPerson',
            width:58,
        }, {
            title: '工时',
            dataIndex: 'mhTime',
            key: 'mhTime',
            width:45,
        },{
            title: '是否公务舱区域',
            dataIndex: 'businessClassArea',
            key: 'businessClassArea',
            width:111,
        },{
            title: '状态',
            dataIndex: 'receiveStatus',
            key: 'receiveStatus',
            width:45,
            render:(text,record) => {
                const state = record.receiveStatus;
                if(state == 'T'){
                    return <span>已领取</span>
                }else if(state == 'F'){
                    return <span>未领取</span>
                }
            }
        }, {
            title: '预计修复时机',
            dataIndex: 'expectedRepair',
            key: 'expectedRepair',
            width:98,
        }, {
            title: '是否挂牌警告',
            dataIndex: 'warningTag',
            key: 'warningTag',
            width:98,
        },{
            title: '机组操作措施',
            dataIndex: 'crewOperation',
            key: 'crewOperation',
            width:98,
        },{
            title: '是否运行限制',
            dataIndex: 'fllimited',
            key: 'fllimited',
            width:98,
        },{
            title: '是否观察项目',
            dataIndex: 'oiItem',
            key: 'oiItem',
            width:98,
        },{
            title: '维修措施',
            dataIndex: 'mainaction',
            key: 'mainaction',
            width:'200px'
        },{
            title: '检查间隔',
            dataIndex: 'interval',
            key: 'interval',
            width:72,
        },{

            title: '检查标准',
            dataIndex: 'standard',
            key: 'standard',
            width:72,
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
        }];
        this.columns2 = [{
            title: '工作包号',
            dataIndex: 'commandNo',
            key: 'commandNo',
            width:'71px',
        }, {
            title: 'DD/FC类型',
            dataIndex: 'deferType',
            key: 'deferType',
            width:84,
        },  {
            title: '飞机号',
            dataIndex: 'msn',
            key: 'msn',
            width:58,
        }, {
            title: '章节',
            dataIndex: 'ata',
            key: 'ata',
            width:47,
        }, {
            title: '航站',
            dataIndex: 'station',
            key: 'station',
            width:45,
        },{
            title: '创建日期',
            dataIndex: 'creationDate',
            key: 'creationDate',
            width:86,
            render:(text,record) => {
                const time = this.changetime(record.creationDate);
                return <span>{time}</span>
            }
        }, {
            title: '转录自',
            dataIndex: 'baseNo',
            key: 'baseNo',
            width:104,
        }, {
            title: '故障描述',
            dataIndex: 'description',
            key: 'description',
            width:'200px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.description}>{record.description}</div>
            }
        }, {
            title: '修复期限',
            dataIndex: 'deadline',
            key: 'deadline',
            width:71,
            // render:(text,record) => {
            //     const time = record.deadline!=null?this.changetime(record.deadline):'';
            //     return <span>{time}</span>
            // }
        }, {
            title: '保留依据',
            dataIndex: 'document',
            key: 'document',
            width:158,
        }, {
            title: '保留原因',
            dataIndex: 'deferReason',
            key: 'deferReason',
            width:71,
        }, {
            title: '工作包执行状态',
            dataIndex: 'packageStatus',
            key: 'packageStatus',
            width:111,
            render:(text,record) => {
                const state = record.packageStatus;
                if(state == 'E'){
                    return <span>ENDW</span>
                }else {
                    return <span>open</span>
                }
            }
        },{
            title: '人工数',
            dataIndex: 'mhPerson',
            key: 'mhPerson',
            width:58,
        }, {
            title: '工时',
            dataIndex: 'mhTime',
            key: 'mhTime',
            width:45,
        },{
            title: '是否公务舱区域',
            dataIndex: 'businessClassArea',
            key: 'businessClassArea',
            width:111,
        // },{
        //     title: '状态',
        //     dataIndex: 'executeStatus',
        //     key: 'executeStatus',
        //     width:45,
        //     render:(text,record) => {
        //         const state = record.deferState;
        //         if(state == 'T'){
        //             if(record.executeStatus=='S'){
        //                 if(record.receiveStatus=='T'){
        //                     return <span>已领取</span>
        //                 }else if(record.receiveStatus=='F'){
        //                     return <span>未领取</span>
        //                 }
        //             }else if(record.executeStatus=='E'){
        //                 return <span>closed</span>
        //             }else if(record.executeStatus=='F'){
        //                 return <span>取消</span>
        //             }
        //         }else if(state == 'F'){
        //             return <span>无效</span>
        //         }else if(state == 'D'){
        //             return <span>删除</span>
        //         }
        //     }
        }, {
            title: '预计修复时机',
            dataIndex: 'expectedRepair',
            key: 'expectedRepair',
            width:98,
        }, {
            title: '是否挂牌警告',
            dataIndex: 'warningTag',
            key: 'warningTag',
            width:98,
        },{
            title: '机组操作措施',
            dataIndex: 'crewOperation',
            key: 'crewOperation',
            width:98,
        },{
            title: '是否运行限制',
            dataIndex: 'fllimited',
            key: 'fllimited',
            width:98,
        },{
            title: '是否观察项目',
            dataIndex: 'oiItem',
            key: 'oiItem',
            width:98,
        },{
            title: '维修措施',
            dataIndex: 'mainaction',
            key: 'mainaction',
            width:'200px'
        },{
            title: '检查间隔',
            dataIndex: 'interval',
            key: 'interval',
            width:72,
        },{

            title: '检查标准',
            dataIndex: 'standard',
            key: 'standard',
            width:72,
        }];


    }


//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    componentDidMount () {

    }

  // 更新页面数据
    update(){
        this.setState({
            tableLoading:true
        });
        this.props.form.validateFields(['airplaneAcReg','executeTime'],(err, values) => {
            // console.log(values);
            if(values.airplaneAcReg!=undefined && values.executeTime!=undefined){
                const executeStartTime= values.executeTime ? values.executeTime[0].format('YYYY-MM-DD'):'';
                const executeEndTime= values.executeTime ? values.executeTime[1].format('YYYY-MM-DD'):'';
                Api.post('airplaneGreenlight/findairplaneGreenlightByAirRegno',{
                    'executeStartTime':executeStartTime,
                    'executeEndTime':executeEndTime,
                    'airplaneAcReg':values.airplaneAcReg,
                }).then(res=>{
                    console.log('res',res);
                    this.setState({
                        tableLoading:false,
                        data:res?res.data:[],
                        total:res.data.DDFC_S_ListReturn.length,
                        total1:res.data.DDFC_E_ListReturn.length
                    });
                })
            }else {
                this.setState({
                    tableLoading:false,
                    data:[],
                });
            }


        });

    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
      this.update();
    };


    handleReset = () => {
        this.props.form.resetFields();
    };

    showTotal = (total) => {
        return <span>合计 {total} 条</span>
    };
    showTotal1 = (total) => {
        return <span>合计 {total} 条</span>
    };
    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const formItemLayout1 = {
            labelCol: { span: 3},
            wrapperCol: { span: 21 },
        };
        const columns = this.columns;
        const columns1 = this.columns1;
        const columns2 = this.columns2;
        const {data ,tableLoading} = this.state;
        modalKey++;
        const pagination = {
            total:this.state.total,
            showTotal:this.showTotal,//showTotal={total => `合计 ${total} 条`}
            pageSize:10,
            defaultCurrent:1
        };
        const pagination1 = {
            total:this.state.total1,
            showTotal:this.showTotal1,//showTotal={total => `合计 ${total} 条`}
            pageSize:10,
            defaultCurrent:1
        };
        return(
            <div style={{width:'2000px'}}>
                <div className="header work-package tabs">
                    <Tabs defaultActiveKey="1" className='tabs'>
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>

                    <Form
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={5} key={1} >
                                <FormItem {...formItemLayout} label={`飞机注册号`}>
                                    {getFieldDecorator(`airplaneAcReg`,{
                                        rules: [{ required: true, message: '请填写飞机注册号!' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={5} key={2}>
                                <FormItem {...formItemLayout} label={`时间`}>
                                    {getFieldDecorator(`executeTime`,{
                                        rules: [{ required: true, message: '请先择日期!' }],
                                    })(
                                        <RangePicker
                                            placeholder=""
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={3} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                        {/*<Row>*/}
                            {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />*/}
                                    {/*重置*/}
                                {/*</Button>*/}
                                {/*<Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    </Form>
                </div>
                <div className="content" >

                    <Table rowKey='id' loading={tableLoading} title={() => <p style={{textAlign:'left'}}>工作包</p>} columns={columns} dataSource={data.tjRcWeekWorkPackageListReturn} bordered size="middle"  className='table'/>
                    <Table rowKey='id' loading={tableLoading} title={() => <p style={{textAlign:'left'}}>未完成DDFC</p>} columns={columns1} dataSource={data.DDFC_S_ListReturn}  bordered size="middle" className='table' pagination={pagination} />
                    <Table rowKey='id' loading={tableLoading} title={() => <p style={{textAlign:'left'}}>已完成DDFC</p>} columns={columns2} dataSource={data.DDFC_E_ListReturn}  bordered size="middle" className='table' pagination={pagination1} />
                </div>
            </div>
        )
    }
}
const AirplanePassForm = Form.create()(AirplanePass);
export default AirplanePassForm;


