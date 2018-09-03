import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Popconfirm, Icon, message,Tabs,Modal} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import AddList from './AddList';
import TemporaryAddList from './TemporaryAddList';
import TemporaryUpdateList from './TemporaryUpdateList';
import ProblemAddList from './ProblemAddList';
import ProblemUpdate from './ProblemUpdate';
import UpdateList from './UpdateList';
import Qdetail from './Qdetail';
import QdetailUpdate from './QdetailUpdate';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import { DatePicker } from 'antd';
import moment from 'moment';


// 技术支援值班日志
class SkillHelp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            tableLoading:false,
            Loading:false,
            page:{},
            pageNow:1,
            update:false,
            timeData:'',
            dUpdate:false,
            ReturnRecord:false,
            visible:false,
            visible1:false,
            dataSource1:[],
            page1:{},
            AddData:false,
            dataSource2:[],
            page2:{},
            visible2:false,
            Loading1:false,
            dUpdateQ:false,
            Qvisible:false,
            page4:{},
            dataSource4:[],
            Loading4:false,
            data:[],
            Pvisible:false,
            titleVisible:false,
            wwpData:'',
            Qdetailvisible:false,
            QdetailVisible1:false,
            m:false
        };

        this.columns = [{
            title: '飞机号',
            dataIndex: 'wwpAirplaneRegNo',
        }, {
            title: '维修工作',
            dataIndex: 'wwpWorkInfo',
            width:'8%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.wwpWorkInfo}>{record.wwpWorkInfo}</div>
            }
        },{
            title: '指令号',
            dataIndex: 'wwpCommandNo',
        }, {
            title: '开始执行时间',
            dataIndex: 'wwpExecuteStartTime',
            key: 'wwpExecuteStartTime',
            render:(text,record) => {
                const time = record.wwpExecuteStartTime!=null?this.changetime(record.wwpExecuteStartTime):'';
                return <span>{time}</span>
            }
        }, {
            title: '结束执行时间',
            dataIndex: 'wwpExecuteEndTime',
            key: 'wwpExecuteEndTime',
            render:(text,record) => {
                const time = record.wwpExecuteEndTime!=null?this.changetime(record.wwpExecuteEndTime):'';
                return <span>{time}</span>
            }
        },{
            title: '停场时间',
            dataIndex: 'wwpAirplaneStandDays',
        }, {
            title: '机位',
            dataIndex: 'wwpImportStandInfo',
        }, {
            title: '公司',
            dataIndex: 'wwpCompany',
        },{
            title: '总指挥',
            dataIndex: 'empMNames',
        },{
            title: '跟线员',
            dataIndex: 'empENames',
        },{
            title: '总工时',
            dataIndex: 'wwpTotalWorkingHours',
        },{
            title: '备注',
            dataIndex: 'wwpaRemark',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                    <a  onClick={()=>this.AddQ(record)}>新增问题项</a>
                    <span className="ant-divider" />
                     <a  onClick={()=>this.Qlook(record)}>查看问题</a>
                    {/*<span className="ant-divider" />*/}
                     {/*<a  onClick={()=>this.title(record)}>修改标题</a>*/}
                 </span>
            ),
        }];

        // 工作包问题
        this.columns4 = [{
            title: '项目号',
            dataIndex: 'seqNo',
        }, {
            title: '责任人',
            dataIndex: 'rpName',
        },{
            title: '记录日期',
            dataIndex: 'rpDate',
            render:(text,record) => {
                const time = record.rpDate!=null?this.changetime(record.rpDate):'';
                return <span>{time}</span>
            }
        }, {
            title: '飞机号',
            dataIndex: 'airplaneNo',
        },{
            title: '技术问题描述',
            dataIndex: 'questionInfo',
            width:'12%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.questionInfo}>{record.questionInfo}</div>
            }
        },{
            title: '处理措施',
            dataIndex: 'dealInfo',
            width:'12%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.dealInfo}>{record.dealInfo}</div>
            }
        },{
            title: '工作进度',
            dataIndex: 'workSchedule',
        },{
            title: '完成时间',
            dataIndex: 'completeTime',
            render:(text,record) => {
                const time = record.completeTime!=null?this.changetime(record.completeTime):'';
                return <span>{time}</span>
            }
        },{
            title: '备注',
            dataIndex: 'tsdRemark',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.Update2(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete2(record)} onCancel={this.cancel2} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
            ),
        }];


        // 工卡、手册等技术问题
        this.columns1 = [{
            title: '项目号',
            dataIndex: 'seqNo',
        }, {
            title: '责任人',
            dataIndex: 'rpName',
        },{
            title: '记录日期',
            dataIndex: 'rpDate',
            render:(text,record) => {
                const time = record.rpDate!=null?this.changetime(record.rpDate):'';
                return <span>{time}</span>
            }
        }, {
            title: '飞机号',
            dataIndex: 'airplaneNo',
        },{
            title: '技术问题描述',
            dataIndex: 'questionInfo',
            width:'12%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.questionInfo}>{record.questionInfo}</div>
            }
        },{
            title: '处理措施',
            dataIndex: 'dealInfo',
            width:'12%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.dealInfo}>{record.dealInfo}</div>
            }
        },{
            title: '工作进度',
            dataIndex: 'workSchedule',
        },{
            title: '完成时间',
            dataIndex: 'completeTime',
            render:(text,record) => {
                const time = record.completeTime!=null?this.changetime(record.completeTime):'';
                return <span>{time}</span>
            }
        },{
            title: '备注',
            dataIndex: 'tsdRemark',
            }, {
                title: '操作',
                render: (text, record,index) => (
                    <span>
                        <a  onClick={()=>this.UpdateDate(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
                ),
        }];

        // 临时交办工作
        this.columns2 = [{
            title: '项目号',
            dataIndex: 'seqNo',
        }, {
            title: '责任人',
            dataIndex: 'rpName',
        },{
            title: '记录日期',
            dataIndex: 'rpDate',
            render:(text,record) => {
                const time = record.rpDate!=null?this.changetime(record.rpDate):'';
                return <span>{time}</span>
            }
        },{
            title: '内容',
            dataIndex: 'questionInfo',
            width:'12%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.questionInfo}>{record.questionInfo}</div>
            }
        },{
            title: '处理措施',
            dataIndex: 'dealInfo',
            width:'12%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.dealInfo}>{record.dealInfo}</div>
            }
        },{
            title: '工作进度',
            dataIndex: 'workSchedule',
        },{
            title: '完成时间',
            dataIndex: 'completeTime',
            render:(text,record) => {
                const time = record.completeTime!=null?this.changetime(record.completeTime):'';
                return <span>{time}</span>
            }
        },{
            title: '备注',
            dataIndex: 'tsdRemark',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate1(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete1(record)} onCancel={this.cancel1} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
            ),
        }];
    }
    // 删除
    delete2=(e)=> {
        Api.post('technicalSuppDetail/addOrUpdate',{
            tsdId:e.id,
            tsdType:'Q',
            tsId:e.tsId,
            seqNo:e.seqNo,
            rpId:e.rpId,
            rpDate:this.changetime(e.rpDate),
            airplaneNo:e.airplaneNo,
            questionInfo:e.questionInfo,
            dealInfo:e.dealInfo,
            workSchedule:e.workSchedule,
            completeTime:this.changetime(e.completeTime),
            tsdRemark:e.tsdRemark,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('technicalSuppDetail/findTsdCondition',{
                    pageNow:this.state.pageNow,
                    tsId:this.state.data[0].id,
                    tsdType:'Q',
                    state:'',
                }).then(res=>{
                    this.setState({
                        Loading4:false,
                        dataSource4:res? res.data:[],
                        page4:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel2=(e)=> {};
    Qlook=(record)=>{
        // this.setState({
        //     wwpData:record,
        // });
        this.props.form.validateFields((err, values) => {
            Api.post('technicalSupport/findTsCondition',{
                commandNo:record.wwpCommandNo,
                dailyDate:values.handOverDate.format('YYYY-MM-DD'),
                state:'',
                pageNow:this.state.pageNow
            }).then(res=>{
                if(res.data.length>0){
                    this.setState({
                        data:res.data,
                    });
                    Api.post('technicalSuppDetail/findTsdCondition',{
                        pageNow:this.state.pageNow,
                        tsId:res.data[0].id,
                        tsdType:'Q',
                        state:'',
                    }).then(res=>{
                        this.setState({
                            Loading4:false,
                            dataSource4:res? res.data:[],
                            page4:res.pageInfo,
                        });
                    });
                }else {
                    this.setState({
                        data:[],
                    });
                    message.warning('您还未添加工作包相关问题项！')
                }


            });
        });

    };

    // 修改标题
    title = () => {
            this.setState({
                titleVisible: true,
            });
    };
    ProblemCancel = () => {
        console.log(this.state.data);
        Api.post('technicalSupport/findTsCondition',{
            pageNow:this.state.pageNow,
            state:'',
            commandNo:this.state.data[0].commandNo,
            dailyDate:this.changetime(this.state.data[0].dailyDate)
        }).then(res=>{
            console.log('res',res);
            this.setState({
                data:res? res.data:[],
            });
        });
        this.setState({
            titleVisible: false,
        });
    };

    // 新增问题项
    AddQ = (record) => {
        this.props.form.validateFields((err, values) => {
            Api.post('technicalSupport/findTsCondition',{
                commandNo:record.wwpCommandNo,
                dailyDate:values.handOverDate.format('YYYY-MM-DD'),
                state:'',
                pageNow:this.state.pageNow
            }).then(res=>{
                if(res.data.length>0){
                    message.warning('您已存在相关问题项描述，请点击查看问题！');
                }else {
                    this.props.form.validateFields((err, values) => {
                        let dUpdateQ = false;
                        if(record.id) {
                            dUpdateQ = record;
                        }
                        const dailyDate=values.handOverDate.format('YYYY-MM-DD');
                        this.setState({
                            Qvisible: true,
                            dUpdateQ:dUpdateQ,
                            dailyDate:dailyDate
                        });
                    });
                }


            });
        });



    };
    QhandleCancel = () => {
        Api.post('technicalSupport/findTsCondition',{
            pageNow:this.state.pageNow,
            state:'',
            commandNo:this.state.dUpdateQ.wwpCommandNo,
            dailyDate:this.state.dailyDate
        }).then(res=>{
            console.log('res',res);
            this.setState({
                // Loading4:false,
                data:res? res.data:[],
                // page:res.pageInfo,
            });
        });
        this.setState({
            Qvisible: false,
        });
    };


    // 删除临时工作
    delete1=(e)=> {
        Api.post('technicalSuppDetail/addOrUpdate',{
            tsdId:e.id,
            tsdType:'T',
            seqNo:e.seqNo,
            rpId:e.rpId,
            // rpName:name[1],
            rpDate:this.changetime(e.rpDate),
            airplaneNo:e.airplaneNo,
            questionInfo:e.questionInfo,
            dealInfo:e.dealInfo,
            workSchedule:e.workSchedule,
            completeTime:this.changetime(e.completeTime),
            tsdRemark:e.tsdRemark,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('technicalSuppDetail/findTsdCondition',{
                    pageNow:this.state.pageNow,
                    tsdType:'T',
                    state:'',
                }).then(res=>{
                    this.setState({
                        Loading1:false,
                        dataSource2:res? res.data:[],
                        page2:res.pageInfo,
                    });
                })
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel1=(e)=> {

    };
    // 删除
    delete=(e)=> {
        Api.post('technicalSuppDetail/addOrUpdate',{
            tsdId:e.id,
            tsdType:'C',
            seqNo:e.seqNo,
            rpId:e.rpId,
            // rpName:name[1],
            rpDate:this.changetime(e.rpDate),
            airplaneNo:e.airplaneNo,
            questionInfo:e.questionInfo,
            dealInfo:e.dealInfo,
            workSchedule:e.workSchedule,
            completeTime:this.changetime(e.completeTime),
            tsdRemark:e.tsdRemark,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('technicalSuppDetail/findTsdCondition',{
                    pageNow:this.state.pageNow,
                    tsdType:'C',
                    state:'',
                }).then(res=>{
                    this.setState({
                        Loading:false,
                        dataSource1:res? res.data:[],
                        page1:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel=(e)=> {

    };
    // 处理过程及结果
    handling = (record) => {
        let handlingDate = false;
        if(record.id) {
            handlingDate = record;
        }
        this.setState({
            visible1: true,
            handlingDate:handlingDate
        });

    };
    // handlingCancel = () => {
    //     this.update();
    //     this.setState({
    //         visible1: false,
    //     });
    // };
    // 退单统计表格数据修改
    UpdateDate1 = (record) => {
        let ReturnRecord = false;
        if(record.id) {
            ReturnRecord = record;
        }
        this.setState({
            visible1: true,
            ReturnRecord:ReturnRecord
        });

    };
    handleCancel1 = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'T',
            state:'',
        }).then(res=>{
            this.setState({
                Loading1:false,
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
        this.setState({
            visible1: false,
        });
    };

    // 表格数据修改
    UpdateDate = (record) => {
        let dUpdate = false;
        if(record.id) {
            dUpdate = record;
        }
        this.setState({
            visible: true,
            dUpdate:dUpdate
        });

    };
    handleCancel = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'C',
            state:'',
        }).then(res=>{
            this.setState({
                Loading:false,
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
        this.setState({
            visible: false,
        });
    };
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };

    componentDidMount () {
        this.update();

    }

    // 更新页面数据
    update(){
        this.setState({
            tableLoading:true,
        });
        this.props.form.validateFields((err, values) => {
            Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                pageNow:this.state.pageNow,
                executeStartTime:values.handOverDate.format('YYYY-MM-DD'),
                executeEndTime:values.handOverDate.format('YYYY-MM-DD'),
            }).then(res=>{
                // console.log('res',res);
                this.setState({
                    tableLoading:false,
                    dataSource:res? res.data:[],
                    page:res.pageInfo,
                });
                // Api.post('technicalSupport/findTsCondition',{
                //     commandNo:res.data[0].wwpCommandNo,
                //     dailyDate:values.handOverDate.format('YYYY-MM-DD'),
                //     state:'',
                //     pageNow:this.state.pageNow
                // }).then(res=>{
                //     this.setState({
                //         // dataSource2:res? res.data:[],
                //         // page2:res.pageInfo,
                //     });
                // });
            })
        });
        // 公共问题
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'C',
            state:'',
        }).then(res=>{
            this.setState({
                Loading:false,
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
      // 临时工作
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'T',
            state:'',
        }).then(res=>{
            this.setState({
                Loading1:false,
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        })
    };

    handleReset = () => {
        this.props.form.resetFields();
    };


    callback=(key)=> {
    console.log(key);
};
    // 当日定检飞机退单统计
    Add1 = () => {
            this.setState({
                visible2: true,
            });

    };
    handleCancel2 = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'T',
            state:'',
        }).then(res=>{
            this.setState({
                Loading1:false,
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
        this.setState({
            visible2:false
        });
    };


    handleCancelProblem = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'C',
            state:'',
        }).then(res=>{
            this.setState({
                Loading:false,
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
        this.setState({
            update:false
        });
    };

    // 修改工作包问题项标题
    Updateproblem = (record) => {
        console.log('record',record);
        // this.setState({
        //     update: true,
        // });

    };
    UpdateproblemCancel= () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'C',
            state:'',
        }).then(res=>{
            this.setState({
                Loading:false,
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
        this.setState({
            update:false
        });
    };


    // 新增影响定检工作进度的信息
    Add = () => {
            this.setState({
                update: true,
            });

    };
    handleCancelAdd = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsdType:'C',
            state:'',
        }).then(res=>{
            this.setState({
                Loading:false,
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
        this.setState({
            update:false
        });
    };
    onOk=(value)=>{
        this.setState({
            tableLoading:true,
        });
        const timeData=value.format('YYYY-MM-DD');
        // console.log('timeData',timeData);
        Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
            pageNow:this.state.pageNow,
            executeStartTime:timeData,
            executeEndTime:timeData,
        }).then(res=>{
            this.setState({
                tableLoading:false,
                timeData:timeData,
                dataSource:res? res.data:[],
                page:res.pageInfo,
            });

        })
    };
// 分页查询
    onChange1 = (pageNumber) => {
        this.props.form.validateFields((err, values) => {
            Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                pageNow:pageNumber,
                executeStartTime:values.handOverDate.format('YYYY-MM-DD'),
                executeEndTime:values.handOverDate.format('YYYY-MM-DD'),
            }).then(res=>{
                this.setState({
                    tableLoading:false,
                    dataSource:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });
    };

    onChange2 = (pageNumber) => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:pageNumber,
            tsdType:'C',
            state:'',
        }).then(res=>{
            this.setState({
                Loading:false,
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
            });
        });
    };
    onChange3 = (pageNumber) => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:pageNumber,
            tsdType:'T',
            state:'',
        }).then(res=>{
            this.setState({
                Loading1:false,
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
    };

// 单击工作包
    onRowClick=(record, index, event)=>{
        this.props.form.validateFields((err, values) => {
            const time=values.handOverDate.format('YYYY-MM-DD');
            // console.log('record',record,values.handOverDate.format('YYYY-MM-DD'));
            Api.post('technicalSupport/findTsCondition',{
                commandNo:record.wwpCommandNo,
                dailyDate:time,
                state:'',
                pageNow:this.state.pageNow
            }).then(res=>{
                this.setState({
                    dataSource1:res? res.data:[],
                    page1:res.pageInfo,
                    AddData:AddData
                });
                // Api.post('technicalSupport/findTsCondition',{
                //     commandNo:record.wwpCommandNo,
                //     dailyDate:record.id,
                //     state:'',
                //     pageNow:this.state.pageNow
                // }).then(res=>{
                //     this.setState({
                //         dataSource2:res? res.data:[],
                //         page2:res.pageInfo,
                //     });
                // });
            });

            // 公共问题
            // Api.post('technicalSuppDetail/findTsdCondition',{
            //     pageNow:this.state.pageNow,
            //     tsdType:'C',
            //     state:'',
            // }).then(res=>{
            //     this.setState({
            //         Loading:false,
            //         dataSource1:res? res.data:[],
            //         page1:res.pageInfo,
            //     });
            // });
            // // 临时工作
            // Api.post('technicalSuppDetail/findTsdCondition',{
            //     pageNow:this.state.pageNow,
            //     tsdType:'T',
            //     state:'',
            // }).then(res=>{
            //     this.setState({
            //         Loading1:false,
            //         dataSource2:res? res.data:[],
            //         page2:res.pageInfo,
            //     });
            // })

        });


        let AddData = false;
        if(record.id) {
            AddData = record;
        }

    };
    // 新增明细项问题
    Addproblem = () => {
        this.setState({
            Qdetailvisible: true,
        });

    };
    QdetailhandleCancel = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsId:this.state.data[0].id,
            tsdType:'Q',
            state:'',
        }).then(res=>{
            this.setState({
                Loading4:false,
                dataSource4:res? res.data:[],
                page4:res.pageInfo,
            });
        });
        this.setState({
            Qdetailvisible:false
        });
    };




// 修改明细项问题
    Update2 = (record) => {
        let m = false;
        if(record.id) {
            m = record;
        }
        this.setState({
            QdetailVisible1: true,
            m:m
        });

    };

    QdetailhandleCancel1 = () => {
        Api.post('technicalSuppDetail/findTsdCondition',{
            pageNow:this.state.pageNow,
            tsId:this.state.data[0].id,
            tsdType:'Q',
            state:'',
        }).then(res=>{
            this.setState({
                Loading4:false,
                dataSource4:res? res.data:[],
                page4:res.pageInfo,
            });
        });
        this.setState({
            QdetailVisible1:false
        });
    };

    render(){
        const {  selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const columns1 = this.columns1;
        const columns2 = this.columns2;
        const columns4= this.columns4;
        const {dataSource ,dataSource1,visible,visible1,tableLoading,page,dUpdate,
            handlingDate,Loading,page1,AddData,Loading1,dataSource2,ReturnRecord,visible2,page2,dUpdateQ,dailyDate,page4,dataSource4,Loading4,data,Pvisible,titleVisible,titleQ,
            Qdetailvisible,QdetailVisible1,m} = this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        const d = new Date();
        return(
                <div className="content" >

                    <div style={{margin: '0 auto',width:'20%'}}>
                        {getFieldDecorator(`handOverDate`,{
                            rules: [{ required: true, message: '日期不能为空!' }],
                            initialValue:moment(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), dateFormat),
                        })(
                            <DatePicker onChange={this.onChange} onOk={this.onOk} format="YYYY-MM-DD" showTime/>
                        )}
                    </div>
                    {/*问题项*/}
                    <Modal
                        title="新建"
                        visible={this.state.Qvisible}
                        onCancel={this.QhandleCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}e`}
                    >
                        <ProblemAddList onCancel={this.QhandleCancel} dUpdateQ={dUpdateQ} dailyDate={dailyDate}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={titleVisible}
                        onCancel={this.ProblemCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}f`}
                    >
                        <ProblemUpdate titleQ={data[0]} onCancel={this.ProblemCancel}/>
                    </Modal>

                    {/*问题项明细*/}
                    <Modal
                        title="新建"
                        visible={Qdetailvisible}
                        onCancel={this.QdetailhandleCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}g`}
                    >
                        <Qdetail onCancel={this.QdetailhandleCancel} Qdetail={data[0]}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={QdetailVisible1}
                        onCancel={this.QdetailhandleCancel1}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}h`}
                    >
                        <QdetailUpdate m={m} onCancel={this.QdetailhandleCancel1}/>
                    </Modal>





                    {/*公共问题*/}
                    <Modal
                        title="新建"
                        visible={this.state.update}
                        onCancel={this.handleCancelAdd}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}a`}
                    >
                        <AddList onCancel={this.handleCancelAdd} AddData={AddData}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible}
                        onCancel={this.handleCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}b`}
                    >
                        <UpdateList dUpdate={dUpdate} onCancel={this.handleCancel}/>
                    </Modal>
                    {/*临时工作*/}
                    <Modal
                        title="新建"
                        visible={visible2}
                        onCancel={this.handleCancel2}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}d`}
                    >
                        <TemporaryAddList onCancel={this.handleCancel2} AddData={AddData}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible1}
                        onCancel={this.handleCancel1}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}c`}
                    >
                        <TemporaryUpdateList ReturnRecord={ReturnRecord} onCancel={this.handleCancel1}/>
                    </Modal>
                    <Table bordered dataSource={dataSource} columns={columns} loading={tableLoading} rowKey='id' pagination={false} size="middle" style={{clear:'both'}} className='table'
                           title={() => <div >
                               <span> 定检计划</span>

                           </div>}
                            // onRowClick={this.onRowClick}
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange1}
                    />

                    {/*问题 项*/}
                    <div style={{display:data.length>0?'block':'none'}}>
                        <Table bordered dataSource={dataSource4} columns={columns4}  loading={Loading4} rowKey='id' pagination={false} size="middle" className='table'
                               title={(record) => <div >
                                   <span>{data[0]?data[0].tsTitle:null}</span>
                                   <a onClick={()=>this.title(record)} style={{marginLeft:'15px'}}>点击修改</a>
                                   <Button type="primary" onClick={()=>this.Addproblem()} style={{float:'left'}}>新增明细</Button>
                                   {/*<Button type="primary" onClick={()=>this.title()} style={{float:'left'}}>修改标题</Button>*/}
                               </div>}
                        />
                        <Pagination
                            {...page4}
                            onChange={this.onChange4}
                        />
                    </div>




                    {/*公共问题和临时工作*/}
                    <Table bordered dataSource={dataSource1} columns={columns1}  loading={Loading} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>工卡、手册等技术问题</span>
                               <Button type="primary" onClick={()=>this.Add()} style={{float:'left'}}>新增</Button>
                           </div>}
                    />
                    <Pagination
                        {...page1}
                        onChange={this.onChange2}
                    />
                    <Table bordered dataSource={dataSource2} columns={columns2}  loading={Loading1} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>临时交办工作</span>
                               <Button type="primary" onClick={()=>this.Add1()} style={{float:'left'}}>新增</Button>
                           </div>}
                    />
                    <Pagination
                        {...page2}
                        onChange={this.onChange3}
                    />
                </div>

        )
    }
}
const SkillHelps = Form.create()(SkillHelp);
export default SkillHelps;


