import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Select,Pagination,Tabs,Row, Col,message,Icon} from 'antd';
const Option = Select.Option;
import Updata from './Updata';
import Details from './Details';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Api from '../../../api/request';
const h=document.body.clientHeight;
let modalKey = 0;   //  用于重置modal

//工卡回收
class TastRetrieve extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            visible: false,
            data: [],
            search:false,
            choose:false,
            title:"",
            current:1,
            subTaskNo:"",
            listState:"",
            executeStartTime:"",
            executeEndTime:""
        };

        this.columns = [
            {
                title: '序号',
                dataIndex: 'seqNo',
                key: 'seqNo'
            },
            {
                title: '项号',
                dataIndex: 'itemNo',
                key: 'itemNo'
            },
            {
                title: '任务号',
                dataIndex: 'taskNo',
                key: 'taskNo'
            },
            {
                title: '工作包号',
                dataIndex: 'commandNo',
                key: 'commandNo'
            },
            {
            title: '工卡号',
            dataIndex: 'subTaskNo',
            key: 'subTaskNo'
        },
            {
            title: '厂家工卡＆修订日期',
            dataIndex: 'mcdRev',
            key: 'mcdRev'
        }, {
            title: '版本号',
            dataIndex: 'revision',
            key: 'revision'
        },
            {title:'维修工作',
             dataIndex:'content',
            key:'content',
            width: 200,
            className:'table_workInfo',
            render:(text,record) => {
                 return <div title={record.content}>{record.content}</div>
             }
        },
        //     {
        //     title: '执行开始时间',
        //     dataIndex: 'executeStartTime',
        //     key: 'executeStartTime',
        //         render:(text,record) => {
        //             const time = this.changetime(record.executeStartTime);
        //             return <span>{time}</span>
        //         }
        // },
            {
            title: '回收时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
                render:(text,record) => {
                    const time =record.updateTime!=null? this.changetime(record.updateTime):'';
                    return <span>{time}</span>
                }
        },
            // {
            //     title: '执行状态',
            //     dataIndex: 'executeStatus',
            //     key: 'executeStatus',
            //     render:(text,record,index) => {
            //         const exstate = record.executeStatus;
            //         if(exstate == 'S'){
            //         return <span>开始</span>
            //     }else if(exstate == 'E'){
            //         return <span>结束</span>
            //     }else if(exstate == 'F'){
            //         return <span>失败</span>
            //     }
            //
            //
            //     }
            // },
            {
            title: '工作区域',
            dataIndex: 'workArea',
            key: 'workArea'
        },{
            title: '工种',
            dataIndex: 'skill',
            key: 'skill'
        },{
                title: '间隔',
                dataIndex: 'threshold',
                key: 'threshold'
            },
            {
                title: '理论工时',
                dataIndex: 'manHours',
                key: 'manHours'
            },
            {
                title: '实际工时（/小时）',
                dataIndex: 'actualHour',
                key: 'actualHour'
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark'
            },
            {
                title: '回收人',
                dataIndex: 'executeBy',
                key: 'executeBy'
            }, {
                title: '回收备注',
                dataIndex: 'executeRemark',
                key: 'executeRemark'

            },
            // {
            // title: '工卡清单状态',
            // key: 'action',
            //     width: 80,
            //     render:(text,record) => {
            //         const state = record.listState;
            //         if(state == 'T'){
            //             if(record.executeStatus=='S'){
            //                 if(record.receiveStatus=='T'){
            //                     return <span>已领取</span>
            //                 }else if(record.receiveStatus=='F'){
            //                     return <span>未领取</span>
            //                 }
            //             }else if(record.executeStatus=='E'){
            //                 return <span>ENDW</span>
            //             }else if(record.executeStatus=='F'){
            //                 return <span>取消</span>
            //             }
            //         }else if(state == 'F'){
            //             return <span>无效</span>
            //         }else if(state == 'D'){
            //             return <span>删除</span>
            //         }
            //     }
            // // }, {
            // //     title: '执行开始时间',
            // //     dataIndex: 'executeStartTime',
            // //     key: 'executeStartTime',
            // //     width:'80px',
            // //     render:(text,record,index) => {
            // //         const time =record.executeStartTime!=null?this.changetime(record.executeStartTime):'';
            // //         return <span>{time}</span>
            // //     }
            // },
            {
                title: '执行结束时间',
                dataIndex: 'executeEndTime',
                key: 'executeEndTime',
                width:'80px',
                render:(text,record,index) => {
                    const time =record.executeEndTime!=null?this.changetime(record.executeEndTime):'';
                    return <span>{time}</span>
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record,index) => {
                    return (
                        <span className="action">
                             <a onClick={() => this.showModal(record)}>分发</a>
                            <span className="ant-divider"/>
                            <a onClick={() => this.showModal(record)}>回收</a>
                        </span>
                    )
                }
        },
            // {
            //     title: '详情',
            //     key: 'details',
            //     render: (text, record,index) => (
            //         <span>
            //         <a onClick={()=>this.showModal(index,false,detail)} style={{marginRight:'10px'}}>详情</a>
            //      </span>
            //     )
            // }
        ];
    }


//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };

    // 更新页面数据
    update(){
        Api.post('workPackageInfo/findSubTaskListByCondition',{
            'subTaskNo':'',
            'listState':'',
            "executeStartTime":null,
            "executeEndTime":null
        }).then(res => {
            console.log('res',res);
            this.setState({
                data: res.data,
                currentPage:parseInt(res.pageInfo.currentPage),
                totalPageSize:parseInt(res.pageInfo.totalPageSize),
                totalSize:parseInt(res.pageInfo.totalSize),
                loading:false,
                current:1,
                subTaskNo:"",
                listState:"",
                executeStartTime:null,
                executeEndTime:null
            });
        });
    }
    componentDidMount(){
        this.update();
    }

    //多条件查询
    handleSearch = (e) => {
        this.setState({
            search:true,
            loading:true,
        });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('values',values);
            //
            // let StartTime = '';
            // let EndTime =  '';
            // if(values.Time == null||values.Time.length==0){
            //     StartTime = null;
            //     EndTime = null;
            // }else{
            //     StartTime = values.Time[0].format('YYYY-MM-DD');
            //     EndTime = values.Time[1].format('YYYY-MM-DD');
            // }
            Api.post('workPackageInfo/findSubTaskListByCondition',{
                'commandNo':values.commandNo,
                'taskNo':values.taskNo,
                'subTaskNo':values.subTaskNo,
                'listState':values.listState?values.listState[0]:'',
                "executeStartTime":values.Time ? values.Time[0].format('YYYY-MM-DD'):'',
                "executeEndTime":values.Time ? values.Time[1].format('YYYY-MM-DD'):''
            }).then(res=>{
                console.log(res);
                this.setState({
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalPageSize:parseInt(res.pageInfo.totalPageSize),
                    totalSize:parseInt(res.pageInfo.totalSize),
                    loading:false,
                    data: res.data,
                    current:1,
                    commandNo:values.commandNo,
                    taskNo:values.taskNo,
                    subTaskNo:values.subTaskNo,
                    listState:values.listState?values.listState[0]:'',
                    executeStartTime:values.Time ? values.Time[0].format('YYYY-MM-DD'):'',
                    executeEndTime:values.Time ? values.Time[1].format('YYYY-MM-DD'):''
                });
            });
            // console.log(values)
        });
    };
    //清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        this.update();
    };

    //弹窗
    // 显示更新用户的Modal
    showModal = (index,choose,title) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);

        // console.log('information',information);
        this.setState({
            title:title,
            choose:choose,
            visible: true,
            information:information,

        });
        // this.update();
    };


    //关闭更新的弹窗
    handleCancel = (e) => {
        this.setState({
            visible: false,

        });
        this.onChange(this.state.current);
    };
//分页查询
    onChange = (pageNumber) => {
        this.setState({
            loading:true,
        });
        this.props.form.validateFields((err, values) => {
            Api.post('workPackageInfo/findSubTaskListByCondition',{
                'commandNo':this.state.commandNo,
                'taskNo':this.state.taskNo,
                'subTaskNo':this.state.subTaskNo,
                'listState':this.state.listState,
                "executeStartTime":this.state.executeStartTime,
                "executeEndTime": this.state.executeEndTime,
                "pageNow":pageNumber
            }).then(res=>{
                console.log(res);
                this.setState({
                    data: res.data,
                    loading:false,
                    current:pageNumber,
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalPageSize:parseInt(res.pageInfo.totalPageSize),
                    totalSize:parseInt(res.pageInfo.totalSize),

                });
            });
            // console.log(values)
        });

    };



    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const columns = this.columns;
        const { data } = this.state;
        modalKey++;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"

                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={1}>
                                <FormItem {...formItemLayout} label={'工作包号'}>
                                    {getFieldDecorator('commandNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2}>
                                <FormItem {...formItemLayout} label={'任务号'}>
                                    {getFieldDecorator('taskNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3}>
                                <FormItem {...formItemLayout} label={'工卡号'}>
                                    {getFieldDecorator('subTaskNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={'工卡清单状态'}>
                                    {getFieldDecorator('listState')(
                                        <Select >
                                            <Option value="T">已领取</Option>
                                            <Option value="F">未领取</Option>
                                            <Option value="E">ENDW</Option>
                                            <Option value="" >全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5}>
                            <FormItem {...formItemLayout}
                                      label={'执行开始/结束时间'}
                                      hasFeedback>
                                {getFieldDecorator('Time')(
                                    <RangePicker placeholder={['', '']}/>
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
                    <div style={{width:'100%'}}>
                        <Modal
                            title={this.state.title}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            width="800px"
                            key={`${modalKey}key`}
                        >
                            <div style={{display:(this.state.choose?'block':'none')}}>
                            <Updata  data={this.state.information} onCancel={this.handleCancel}  />
                            </div>

                            <div style={{display:(this.state.choose?'none':'block')}}>
                                <Details    data={this.state.information} onCancel={this.handleCancel} />
                            </div>
                        </Modal>
                    </div>
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} bordered  loading={this.state.loading} size="middle" className='table' scroll={{ x: 2200,y:h>900?450:350}}/>
                    <Pagination showQuickJumper total={this.state.totalSize}  onChange={this.onChange} current={this.state.current} showTotal={total => `合计 ${total} 条` }/>
                </div>
            </div>
        )
    }
}
const TastRetrieves = Form.create()(TastRetrieve);
export default TastRetrieves;

