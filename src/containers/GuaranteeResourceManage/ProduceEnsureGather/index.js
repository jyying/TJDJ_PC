import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Modal, Icon, message,Tabs } from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import { DatePicker } from 'antd';
import WorkCardLists from '../../WorkCardManage/WorldCarList';
import DDFCSearch from '../../DdFcNrcManage/DDFCSearch';
import moment from 'moment';
// 大修部-生产保障信息汇总单
class ProduceEnsureGather extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data1: [],
            tableLoading:false,
            tableLoad:true,
            tableLoad1:true,
            datas:[],
            Selected:'',
            value:[],
            empAdjustments:'',
            page:{},
            tableContainer:[],
            visible:false,
            pageNow:1,
            taskVisible:false,
            DDFCVisible:false
        };

        this.columns = [{
            title: '飞机号',
            dataIndex: 'airplaneRegNo',
            key: 'airplaneRegNo',
            width: '9%',
        }, {
            title: '维修工作',
            dataIndex: 'workInfo',
            key: 'workInfo',
            width: '9%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workInfo}>{record.workInfo}</div>
            }
        },{
            title: '指令号',
            dataIndex: 'commandNo',
            key: 'commandNo',
            width: '9%',
        },{
            title: '执行开始日期',
            dataIndex: 'executeStartTime',
            key: 'executeStartTime',
            width: '9%',
            render:(text,record) => {
                const time = this.changetime(record.executeStartTime);
                return <span>{time}</span>
            }
        }, {
            title: '执行结束日期',
            dataIndex: 'executeEndTime',
            key: 'executeEndTime',
            width: '9%',
            render:(text,record) => {
                const time = this.changetime(record.executeEndTime);
                return <span>{time}</span>
            }
        },{
            title: '进场时间',
            dataIndex: 'goInAirportTime',
            key: 'goInAirportTime',
            width: '9%',
        },{
            title: '机位',
            dataIndex: 'importStandInfo',
            key: 'importStandInfo',
            width: '9%',
        }, {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
            width: '9%',
        }, {
            title: '生产线经理',
            dataIndex: 'empMNames',
            key: 'empMNames',
            width: '9%',
        }, {
            title: '跟线员',
            dataIndex: 'empENames',
            key: 'empENames',
            width: '9%',
        // }, {
        //     title: '准备员',
        //     dataIndex: 'zhunbei',
        //     key: 'zhunbei',
        //     width: '8.33333333%',
        },{
            title: '总工时',
            dataIndex: 'totalWorkingHours',
            key: 'totalWorkingHours',
            width: '9%',
        // }, {
        //     title: '机型',
        //     dataIndex: 'airplaneModel',
        //     key: 'airplaneModel',
        // },{
        //     title: '停场时间',
        //     dataIndex: 'airplaneStandDays',
        //     key: 'airplaneStandDays',
        // },{
        //     title: '机械工时',
        //     dataIndex: 'machineHours',
        //     key: 'machineHours',
        // },{
        //     title: '电气工时',
        //     dataIndex: 'electricHours',
        //     key: 'electricHours',
        // },{
        //     title: '电子工时',
        //     dataIndex: 'electronHours',
        //     key: 'electronHours',
        // },{
        //     title: '清洁工时',
        //     dataIndex: 'cleanHours',
        //     key: 'cleanHours',
        // },{
        //
        //     title: '客舱工时',
        //     dataIndex: 'cabinHours',
        //     key: 'cabinHours',
        // },{
        //     title: 'NDT工时',
        //     dataIndex: 'ndtHours',
        //     key: 'ndtHours',
        // },{
        //     title: '金工工时',
        //     dataIndex: 'metalworkingHours',
        //     key: 'metalworkingHours',
        // },{
        //     title: '漆工工时',
        //     dataIndex: 'lacqueringHours',
        //     key: 'lacqueringHours',
        // },{
        //     title: '分线',
        //     dataIndex: 'battleLineName',
        //     key: 'battleLineName',
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
        // this.update();

    }

    // 更新页面数据
    update(){
        this.props.form.validateFields((err, values) => {
            console.log(values);
            const executeTime=values.dailyDate?values.dailyDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                    commandNo:values.commandNo,
                    // dailyDate:executeTime,
                }).then(res=>{
                    console.log('res',res);
                    this.setState({
                        data:res? res.data:[],
                        executeTime:executeTime
                    });
                    if(this.state.data.length>0){
                        Api.post('psiSummary/findPsiSummaryCondition',{
                            wwpId:this.state.data[0].wwpId,
                            pageNow:this.state.pageNow,
                        }).then(res=>{
                            this.setState({
                                data1:res? res.data:[],
                            });
                        });
                    }


                });
            }else {
                this.setState({
                    data:[],
                });
                    message.error('请输入指令号');
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
// 分页查询
    onChange = (pageNumber) => {
    };


    callback=(key)=> {
    console.log(key);
};
 // 表格数据提交
    SaveDate=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            if(!err){
                if(this.state.data.length>0){
                    Api.post('psiSummary/addOrUpdate',{
                        wwpId:this.state.data[0].wwpId,
                        preparer:values.preparer,
                        micOrders:values.micOrders,
                        workArrInfo:values.workArrInfo,
                        hcFlowchart:values.hcFlowchart,
                        hangSignColor:values.hangSignColor,
                        depletionGoods:values.depletionGoods,
                        subtaskReady:values.subtaskReady,
                        equipmentInfo:values.equipmentInfo,
                        airMaterial:values.airMaterial,
                        toolsInfo:values.toolsInfo,
                        metalWorking:values.metalWorking,
                        ndtWorking:values.ndtWorking,
                        cleanWorking:values.cleanWorking,
                        cardStopWorking:values.cardStopWorking,
                        managerWorking:values.managerWorking,
                        remarkInfo:values.remarkInfo,
                        state:'T',
                    }).then(res=>{
                        if(res.errorCode == 0) {
                            message.success('保存成功！');
                        } else if(res.errorCode == 1) {
                            message.error('！！！保存失败');
                        }
                    });
                }else {
                    message.warning('请先查询工作包')
                }

            }
        })
    };

    // 根据工作包查询工卡清单
    taskcheck = () => {
        this.setState({
            taskVisible: true
        });
    };
    taskcCancel = () => {
        this.setState({
            taskVisible:false
        });

    };
// 根据工作包查询工卡清单
   DDFCcheck = () => {
        this.setState({
            DDFCVisible: true
        });
    };
    DDFCCancel = () => {
        this.setState({
            DDFCVisible:false
        });

    };
    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const columns1 = this.columns1;
        const {data ,data1,visible,tableLoading,Selected,page,values,key,tableContainer} = this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        const d = new Date();
        return(
            <div>
                <div className="header work-package">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>

                    <Form onSubmit={this.handleSearch}>
                        <Row gutter={40}>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`指令号`}>
                                    {getFieldDecorator('commandNo',{
                                        rules: [{
                                            required: true, message: '请输入指令号!'}],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            {/*<Col span={8}>*/}
                                {/*<FormItem {...formItemLayout} label={`工作日时间`}>*/}
                                    {/*{getFieldDecorator(`dailyDate`,{*/}
                                        {/*rules: [{ required: true, message: '日期不能为空!' }],*/}
                                        {/*initialValue:moment(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), dateFormat),*/}
                                    {/*})(*/}
                                        {/*<DatePicker onChange={this.onChange}  format="YYYY-MM-DD" />*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            <Col span={6} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8}} className='btn_reload' onClick={this.handleReset}><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content content_table" >
                    <Modal
                         title={data[0]?data[0].wwpCommandNo:null}
                        visible={this.state.taskVisible}
                        onCancel={this.taskcCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}a`}
                         width='90%'
                    >
                        <WorkCardLists onCancel={this.taskcCancel} taskAdd={data[0]?data[0].wwpCommandNo:null}/>
                    </Modal>
                    <Modal
                        title={data[0]?data[0].wwpCommandNo:null}
                        visible={this.state.DDFCVisible}
                        onCancel={this.DDFCCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}b`}
                        width='90%'
                    >
                        <DDFCSearch onCancel={this.DDFCCancel} ddfcAdd={data[0]?data[0].wwpCommandNo:null}/>
                    </Modal>
                    <Form onSubmit={this.SaveDate}>
                        <div style={{float: 'left'}}>
                            <Button  htmlType="submit" className="editable-add-btn btn_reload"><Icon type="save" style={{color: '#108ee9' }} />保存</Button>
                        </div>

                    <table className='table'>
                        <caption >大修部-生产保障信息汇总单</caption>
                        <thead>
                        <tr>
                            <th>飞机号</th>
                            <th className='table'>维修工作</th>
                            <th>指令号</th>
                            <th>执行日期</th>
                            <th>进场时间</th>
                            <th>机位</th>
                            <th>所属公司</th>
                            <th>生产线经理</th>
                            <th>跟线员</th>
                            <th>准备员</th>
                            <th>总工时</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{data[0]?data[0].wwpAirplaneRegNo:null}</td>
                            <td>{data[0]?data[0].wwpWorkInfo:null}</td>
                            <td>{data[0]?data[0].wwpCommandNo:null}</td>
                            <td>{data[0]?this.changetime(data[0].wwpExecuteStartTime):null}/{data[0]?this.changetime(data[0].wwpExecuteEndTime):null}</td>
                            <td>{data[0]?data[0].goInAirPortTime:null}</td>
                            <td>{data[0]?data[0].wwpImportStandInfo:null}</td>
                            <td>{data[0]?data[0].wwpCompany:null}</td>
                            <td>{data[0]?data[0].empMNames:null}</td>
                            <td>{data[0]?data[0].empENames:null}</td>
                            <td>
                                {getFieldDecorator(`preparer`,{
                                    initialValue:data1[0]?data1[0].preparer:null,
                                })(
                                    <Input/>
                                )}
                            </td>
                            <td>{data[0]?data[0].wwpTotalWorkingHours:null}</td>
                        </tr>
                        <tr>
                            <td className="td_color">工作包信息</td>
                            <td className="td_color">工卡清单</td>
                            <td>
                                <a onClick={(e) => this.taskcheck()}>{data[0]?'查看':null}</a>
                            </td>
                            <td className="td_color">维修项目变更单</td>
                            <td>
                                    {getFieldDecorator(`micOrders`,{
                                        initialValue:data1[0]?data1[0].micOrders:null,
                                    })(
                                        <Input/>
                                    )}
                            </td>
                            <td className="td_color">工作安排</td>
                            <td>
                                {getFieldDecorator(`workArrInfo`,{
                                    initialValue:data1[0]?data1[0].workArrInfo:null,
                                })(
                                    <Input/>
                                )}
                            </td>
                            <td className="td_color">DDFC</td>
                            <td>
                                <a onClick={(e) => this.DDFCcheck()}>{data[0]?'查看':null}</a>
                            </td>
                            <td className="td_color">高检流程图</td>
                            <td>
                                {getFieldDecorator(`hcFlowchart`,{
                                    initialValue:data1[0]?data1[0].hcFlowchart:null,
                                })(
                                    <Input />
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={3} className="td_color">保障情况</td>
                            <td className="td_color">挂签颜色</td>
                            <td>
                                {getFieldDecorator(`hangSignColor`,{
                                    initialValue:data1[0]?data1[0].hangSignColor:null,
                                })(
                                    <Input/>
                                )}
                            </td>
                            <td className="td_color">消耗品</td>
                            <td>
                                {getFieldDecorator(`depletionGoods`,{
                                    initialValue:data1[0]?data1[0].depletionGoods:null,
                                })(
                                    <Input />
                                )}
                            </td>
                            <td className="td_color">工卡准备</td>
                            <td>
                                {getFieldDecorator(`subtaskReady`,{
                                    initialValue:data1[0]?data1[0].subtaskReady:null,
                                })(
                                    <Input/>
                                )}
                            </td>
                            <td className="td_color">设备情况</td>
                            <td colSpan={3}>
                                {getFieldDecorator(`equipmentInfo`,{
                                    initialValue:data1[0]?data1[0].equipmentInfo:null,
                                })(
                                    <Input/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">航材</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`airMaterial`,{
                                    initialValue:data1[0]?data1[0].airMaterial:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">工具</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`toolsInfo`,{
                                    initialValue:data1[0]?data1[0].toolsInfo:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={6} className="td_color">工作概况</td>
                            <td className="td_color">金工</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`metalWorking`,{
                                    initialValue:data1[0]?data1[0].metalWorking:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">NDT</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`ndtWorking`,{
                                    initialValue:data1[0]?data1[0].ndtWorking:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">清洁队</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`cleanWorking`,{
                                    initialValue:data1[0]?data1[0].cleanWorking:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">工卡站</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`cardStopWorking`,{
                                    initialValue:data1[0]?data1[0].cardStopWorking:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">生产线经理</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`managerWorking`,{
                                    initialValue:data1[0]?data1[0].managerWorking:null,
                                })(
                                    <Input type="textarea" rows={4} placeholder=""/>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className="td_color">备注</td>
                            <td colSpan={9}>
                                {getFieldDecorator(`remarkInfo`,{
                                    initialValue:data1[0]?data1[0].remarkInfo:null,
                                })(
                                    <Input type="textarea" rows={2}/>
                                )}
                            </td>
                        </tr>

                        </tbody>

                    </table>
                    </Form >

                </div>
            </div>
        )
    }
}
const ProduceEnsureGathers = Form.create()(ProduceEnsureGather);
export default ProduceEnsureGathers;


