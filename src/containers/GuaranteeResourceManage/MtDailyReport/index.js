import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Popconfirm, Icon, message,Tabs,Modal} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import AddList from './AddList';
import UpdateList from './UpdateList';
import ProduceAddList from './ProduceAddList';
import CorrodeAddList from './CorrodeAddList';
import ProduceUpdateList from './ProduceUpdateList';
import CorrodeUpdateList from './CorrodeUpdateList';
import DailyReport from './DailyReport';
import UpdateDailyReport from './UpdateDailyReport';
import MaterialAddList from './MaterialAddList';
import MaterialUpdateList from './MaterialUpdateList';
import ToolAddList from './ToolAddList';
import ToolUpdateList from './ToolUpdateList';
import PicUplod from './PicUplod';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import { DatePicker } from 'antd';
import moment from 'moment';


// 大修部定检跟线日报
class MtDailyReport extends React.Component{
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
            visibleAdd2:false,
            executeTime:'',
            visibleUpdate2:false,
            dataSource3:[],
            Loading2:false,
            dataSource4:[],
            Loading4:false,
            page4:{},
            update4:false,
            visible4:false,
            dUpdate4:false,
            page5:{},
            Loading5:false,
            dataSource5:[],
            update5:false,
            dUpdate5:false,
            visible5:false,
            dataSource6:[],
            dataSource7:[],
            Loading6:false,
            Loading7:false,
            page6:{},
            page7:{},
            update6:false,
            update7:false,
            dUpdate6:false,
            dUpdate7:false,
            visible6:false,
            visible7:false,
            PicData:false,
            visible8:false
        };

        this.columns = [{
            title: '飞机号',
            dataIndex: 'wwpAirplaneRegNo',
        }, {
            title: '维修工作',
            dataIndex: 'wwpWorkInfo',
            width:250,
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
            render:(text,record) => {
                const time = record.wwpExecuteStartTime!=null?this.changetime(record.wwpExecuteStartTime):'';
                return <span>{time}</span>
            }
        }, {
            title: '结束执行时间',
            dataIndex: 'wwpExecuteEndTime',
            render:(text,record) => {
                const time = record.wwpExecuteEndTime!=null?this.changetime(record.wwpExecuteEndTime):'';
                return <span>{time}</span>
            }
        },{
            title: '停场时间',
            dataIndex: 'wwpAirplaneStandDays',
        },{
            title: '生产线经理',
            dataIndex: 'empMNames',
        },{
            title: '跟线员',
            dataIndex: 'empENames',
        }, {
            title: '机位',
            dataIndex: 'wwpImportStandInfo',
        },{
            title: '总工时',
            dataIndex: 'wwpTotalWorkingHours',
        }];

        this.columns3 = [{
            title: '串件数量',
            dataIndex: 'stringQuality',
        }, {
            title: '客户',
            dataIndex: 'cusName',
        },{
            title: '监修代表',
            dataIndex: 'srInfo',
        }, {
            title: '出厂日期变更',
            dataIndex: 'newDateOutput',
            render:(text,record) => {
                const time = record.newDateOutput!=null?this.changetime(record.newDateOutput):'';
                return <span>{time}</span>
            }
        },{
            title: '总工卡数',
            dataIndex: 'stlTotal',
        },{
            title: '完工工卡数',
            dataIndex: 'stlCompletedNum',
        },{
            title: '增加工卡数量',
            dataIndex: 'stlAddNum',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate2(record)}>修改</a>
                        {/*<span className="ant-divider" />*/}
                        {/*<Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete1(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>*/}
                     </span>
            ),
        }];

        // 串件信息汇总
        this.columns1 = [{
            title: '序号',
            dataIndex: 'snSeq',
        }, {
            title: '恢复情况',
            dataIndex: 'rsInfo',
        },{
            title: '件号',
            dataIndex: 'pnNo',
        }, {
            title: '名称',
            dataIndex: 'nameInfo',
        },{
            title: '数量',
            dataIndex: 'quantity',
        },{
            title: '串件原因',
            dataIndex: 'stringReason',
        },{
            title: '串件日期',
            dataIndex: 'stringDate',
            render:(text,record) => {
                const time = record.stringDate!=null?this.changetime(record.stringDate):'';
                return <span>{time}</span>
            }
        },{
            title: '需求时间',
            dataIndex: 'deadlineDate',
            render:(text,record) => {
                const time = record.deadlineDate!=null?this.changetime(record.deadlineDate):'';
                return <span>{time}</span>
            }
        },{
            title: '保障状态',
            dataIndex: 'safeguard',
        },{
            title: '工时',
            dataIndex: 'hanhour',
        },{
            title: '需求类型',
            dataIndex: 'typeInfo',
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

        // 例行航材汇总
        this.columns4 = [{
            title: '序号',
            dataIndex: 'snSeq',
        }, {
            title: '反馈者',
            dataIndex: 'personInfo',
        },{
            title: '件号',
            dataIndex: 'pnNo',
        }, {
            title: '名称',
            dataIndex: 'nameInfo',
        },{
            title: '数量',
            dataIndex: 'quantity',
        },{
            title: '涉及工作项目',
            dataIndex: 'workRp',
            width:'10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workRp}>{record.workRp}</div>
            }
        },{
            title: '责任单位',
            dataIndex: 'rpInfo',
        },{
            title: '需求时间',
            dataIndex: 'deadlineDate',
            render:(text,record) => {
                const time = record.deadlineDate!=null?this.changetime(record.deadlineDate):'';
                return <span>{time}</span>
            }
        },{
            title: '处理方案与进度',
            dataIndex: 'processInfo',
            width:'10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.processInfo}>{record.processInfo}</div>
            }
        },{
            title: '状态分类',
            dataIndex: 'statusInfo',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate4(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete4(record)} onCancel={this.cancel4} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
            ),
        }];

        // 工具问题
        this.columns5 = [{
            title: '序号',
            dataIndex: 'snSeq',
        }, {
            title: '反馈者',
            dataIndex: 'personInfo',
        },{
            title: '件号',
            dataIndex: 'pnNo',
        }, {
            title: '名称',
            dataIndex: 'nameInfo',
        },{
            title: '数量',
            dataIndex: 'quantity',
        },{
            title: '涉及工作项目',
            dataIndex: 'workRp',
            width:'10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workRp}>{record.workRp}</div>
            }
        },{
            title: '责任单位',
            dataIndex: 'rpInfo',
        },{
            title: '需求时间',
            dataIndex: 'deadlineDate',
            render:(text,record) => {
                const time = record.deadlineDate!=null?this.changetime(record.deadlineDate):'';
                return <span>{time}</span>
            }
        },{
            title: '处理方案与进度',
            dataIndex: 'processInfo',
            width:'10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.processInfo}>{record.processInfo}</div>
            }
        },{
            title: '状态分类',
            dataIndex: 'statusInfo',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate5(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete5(record)} onCancel={this.cancel5} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
            ),
        }];

        // 生产问题
        this.columns6 = [{
            title: '序号',
            dataIndex: 'snSeq',
        }, {
            title: '反馈者',
            dataIndex: 'personInfo',
        },{
            title: '问题报告',
            dataIndex: 'problemReport',
            width:'10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.problemReport}>{record.problemReport}</div>
            }
        }, {
            title: '提交时间',
            dataIndex: 'submissionTime',
            render:(text,record) => {
                const time = record.submissionTime!=null?this.changetime(record.submissionTime):'';
                return <span>{time}</span>
            }
        },{
            title: '责任单位',
            dataIndex: 'rpInfo',
        },{
            title: '影响',
            dataIndex: 'impactInfo',
        },{
            title: '处理方案与进度',
            dataIndex: 'processInfo',
            width:'10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.processInfo}>{record.processInfo}</div>
            }
        },{
            title: '状态分类',
            dataIndex: 'statusInfo',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate6(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete6(record)} onCancel={this.cancel6} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                     </span>
            ),
        }];

        // 腐蚀问题
        this.columns7= [{
            title: '序号',
            dataIndex: 'snSeq',
        }, {
            title: '腐蚀位置',
            dataIndex: 'conrrosionLocation',
        },{
            title: '腐蚀照片',
            dataIndex: 'conrrosionPicUrl',
            width:200,
            render:(text,record) => {
                let strs='';
                let str =record.conrrosionPicUrl ;
                if(str!==null){
                    const arr = str.split(';');
                    for(let i=0;i<arr.length;i++){
                        if(arr[i]!==''){
                            strs +=(record.visitPreFix+'/'+arr[i])+';'
                        }

                        // console.log('i',record.visitPreFix+'/'+arr[i])
                    }
                    return <span>{strs}</span>
                }else {
                    return <span>{str}</span>
                }

            }
        }, {
            title: '照片说明',
            dataIndex: 'conrrosionPicRemark',
        },{
            title: '手册截图',
            dataIndex: 'ammPicUrl',
            width:200,
            render:(text,record) => {
                let strs='';
                let str =record.ammPicUrl ;
                if(str!==null){
                    const arr = str.split(';');
                    for(let i=0;i<arr.length;i++){
                        if(arr[i]!==''){
                            strs +=(record.visitPreFix+'/'+arr[i])+';'
                        }

                    }
                    return <span>{strs}</span>
                }else {
                    return <span>{str}</span>
                }

            }
        },{
            title: '手册截图说明',
            dataIndex: 'ammPicRemark',
        },{
            title: '修理方案',
            dataIndex: 'repairProject',
            width:'8%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.repairProject}>{record.repairProject}</div>
            }
        },{
            title: '航材需求',
            dataIndex: 'materialNeed',
        },{
            title: '结构时间节点',
            dataIndex: 'structureTimeNode',
        },{
            title: '机械时间节点',
            dataIndex: 'machineTimeNode',
        },{
            title: '综述',
            dataIndex: 'overview',
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                        <a  onClick={()=>this.UpdateDate7(record)}>修改</a>
                        <span className="ant-divider" />
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete7(record)} onCancel={this.cancel7} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                        <span className="ant-divider" />
                        <a onClick={()=>this.PicUpload(record)}>图片上传</a>
                     </span>
            ),
        }];
    }

    //图片上传
    PicUpload = (record) => {
        let PicData = false;
        if(record.id) {
            PicData = record;
        }
        this.setState({
            visible8: true,
            PicData:PicData
        });
    };
    PicUploadCancel = () => {
        this.setState({
            visible8: false,
        });
        Api.post('mtDailyReport/cc/findCcCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource7:res? res.data:[],
                Loading7:false,
                page7:res.pageInfo,
            });
        });
    };


    UpdateDate2 = (record) => {
        console.log('record',record);
        let ReturnRecord = false;
        if(record.id) {
            ReturnRecord = record;
        }
        this.setState({
            visibleUpdate2: true,
            ReturnRecord:ReturnRecord
        });

    };
    Cancel2 = () => {
        this.props.form.validateFields((err, values) => {
            const executeTime=values.dailyDate?values.dailyDate.format('YYYY-MM-DD'):'';
            console.log('executeTime',executeTime,values);
            if(!err){
                Api.post('mtDailyReport/findMtDailyReportByCondition',{
                    commandNo:values.commandNo,
                    dailyDate:executeTime,
                    pageNow:this.state.pageNow
                }).then(res=>{
                    this.setState({
                        dataSource3:res? res.data:[],
                        Loading2:false,
                        page:res.pageInfo,
                    });
                })
            }

        });
        this.setState({
            visibleUpdate2: false,
        });
    };

    // 删除退单统计
    // delete1=(e)=> {
    //     Api.post('mtDailyReport/addOrUpdate',{
    //         mdrId:e.id,
    //         wwpId:e.wwpId,
    //         wwpaId:e.wwpaId,
    //         commandNo:e.commandNo,
    //         dailyDate:this.changetime(e.dailyDate),
    //         stringQuality:e.stringQuality,
    //         cusName:e.cusName,
    //         srInfo:e.srInfo,
    //         newDateOutput:this.changetime(e.newDateOutput),
    //         stlTotal:e.stlTotal,
    //         stlCompletedNum:e.stlCompletedNum,
    //         stlAddNum:e.stlAddNum,
    //         state:'D',
    //     }).then(res => {
    //         if(res.errorCode == 0) {
    //             message.success('删除成功！');
    //             const m=this.state.AddData;
    //             this.props.form.validateFields((err, values) => {
    //                 const executeTime=values.dailyDate?values.dailyDate.format('YYYY-MM-DD'):'';
    //                 if(!err){
    //                     Api.post('mtDailyReport/findMtDailyReportByCondition',{
    //                         commandNo:values.commandNo,
    //                         dailyDate:executeTime,
    //                         pageNow:this.state.pageNow
    //                     }).then(res=>{
    //                         this.setState({
    //                             dataSource3:res? res.data:[],
    //                             Loading2:false,
    //                             page:res.pageInfo,
    //                         });
    //                     })
    //                 }
    //
    //             });
    //         } else if(res.errorCode == 1) {
    //             message.error('！！！删除失败');
    //         }
    //     })
    // };
    // cancel=(e)=> {
    //
    // };
    // 例行航材
    delete4=(e)=> {
        Api.post('mtDailyReport/pfm/addOrUpdate',{
            mdpId:e.id,
            mtDrId:e.mtDrId,
            snSeq:e.snSeq,
            personInfo:e.personInfo,
            pnNo:e.pnNo,
            nameInfo:e.nameInfo,
            quantity:e.quantity,
            workRp:e.workRp,
            rpInfo:e.rpInfo,
            deadlineDate:this.changetime(e.deadlineDate),
            processInfo:e.processInfo,
            statusInfo:e.statusInfo,
            rowColor:e.rowColor,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('mtDailyReport/pfm/findPfmCondition',{
                    mtDrId:this.state.dataSource3[0].id,
                    state:'',
                    pageNow:this.state.pageNow,
                }).then(res=>{
                    this.setState({
                        dataSource4:res? res.data:[],
                        Loading4:false,
                        page4:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel4=(e)=> {};
    // 工具问题
    delete5=(e)=> {
        Api.post('mtDailyReport/pft/addOrUpdate',{
            mdpId:e.id,
            mtDrId:e.mtDrId,
            snSeq:e.snSeq,
            personInfo:e.personInfo,
            pnNo:e.pnNo,
            nameInfo:e.nameInfo,
            quantity:e.quantity,
            workRp:e.workRp,
            rpInfo:e.rpInfo,
            deadlineDate:this.changetime(e.deadlineDate),
            processInfo:e.processInfo,
            statusInfo:e.statusInfo,
            rowColor:e.rowColor,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('mtDailyReport/cc/findCcCondition',{
                    mtDrId:this.state.dataSource3[0].id,
                    state:'',
                    pageNow:this.state.pageNow,
                }).then(res=>{
                    this.setState({
                        dataSource7:res? res.data:[],
                        Loading7:false,
                        page7:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel5=(e)=> {};
    // 生产问题
    delete6=(e)=> {
        Api.post('mtDailyReport/pfp/addOrUpdate',{
            mdpId:e.id,
            mtDrId:e.mtDrId,
            snSeq:e.snSeq,
            personInfo:e.personInfo,
            problemReport:e.problemReport,
            submissionTime:this.changetime(e.submissionTime),
            rpInfo:e.rpInfo,
            impactInfo:e.impactInfo,
            processInfo:e.processInfo,
            statusInfo:e.statusInfo,
            rowColor:e.rowColor,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('mtDailyReport/pfp/findPfpCondition',{
                    mtDrId:this.state.dataSource3[0].id,
                    state:'',
                    pageNow:this.state.pageNow,
                }).then(res=>{
                    this.setState({
                        dataSource6:res? res.data:[],
                        Loading6:false,
                        page5:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel6=(e)=> {};
    // 腐蚀问题
    delete7=(e)=> {
        Api.post('mtDailyReport/cc/addOrUpdate',{
            mdcId:e.id,
            mtDrId:e.mtDrId,
            snSeq:e.snSeq,
            conrrosionLocation:e.conrrosionLocation,
            conrrosionPicRemark:e.conrrosionPicRemark,
            ammPicRemark:e.ammPicRemark,
            repairProject:e.repairProject,
            materialNeed:e.materialNeed,
            structureTimeNode:e.structureTimeNode,
            machineTimeNode:e.machineTimeNode,
            overview:e.overview,
            rowColor:e.rowColor,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('mtDailyReport/cc/findCcCondition',{
                    mtDrId:this.state.dataSource3[0].id,
                    state:'',
                    pageNow:this.state.pageNow,
                }).then(res=>{
                    this.setState({
                        dataSource7:res? res.data:[],
                        Loading7:false,
                        page7:res.pageInfo,
                    });
                });
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel7=(e)=> {};

    // 串件删除
    delete=(e)=> {
        Api.post('mtDailyReport/si/addOrUpdate',{
            mdpId:e.id,
            mtDrId:e.mtDrId,
            snSeq:e.snSeq,
            rsInfo:e.rsInfo,
            pnNo:e.pnNo,
            nameInfo:e.nameInfo,
            quantity:e.quantity,
            stringReason:e.stringReason,
            stringDate:this.changetime(e.stringDate),
            deadlineDate:this.changetime(e.deadlineDate),
            safeguard:e.safeguard,
            hanhour:e.hanhour,
            typeInfo:e.typeInfo,
            rowColor:e.rowColor,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                Api.post('mtDailyReport/si/findSiCondition',{
                    mtDrId:this.state.dataSource3[0].id,
                    state:'',
                    pageNow:this.state.pageNow,
                }).then(res=>{
                    this.setState({
                        dataSource1:res? res.data:[],
                        Loading:false,
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
    // // 处理过程及结果
    // handling = (record) => {
    //     let handlingDate = false;
    //     if(record.id) {
    //         handlingDate = record;
    //     }
    //     this.setState({
    //         visible1: true,
    //         handlingDate:handlingDate
    //     });
    //
    // };
    // // handlingCancel = () => {
    // //     this.update();
    // //     this.setState({
    // //         visible1: false,
    // //     });
    // // };
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
        const m=this.state.AddData;
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
        this.setState({
            visible1: false,
        });
    };

    // 串件数据修改
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
        Api.post('mtDailyReport/si/findSiCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                Loading:false,
                page1:res.pageInfo,
            });
        });
        this.setState({
            visible: false,
        });
    };
    // 例行航材数据修改
    UpdateDate4 = (record) => {
        let dUpdate4 = false;
        if(record.id) {
            dUpdate4 = record;
        }
        this.setState({
            visible4: true,
            dUpdate4:dUpdate4
        });

    };
    MaterialCancel = () => {
        Api.post('mtDailyReport/pfm/findPfmCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource4:res? res.data:[],
                Loading4:false,
                page4:res.pageInfo,
            });
        });
        this.setState({
            visible4: false,
        });
    };

    // 工具问题数据修改
    UpdateDate5 = (record) => {
        let dUpdate5 = false;
        if(record.id) {
            dUpdate5 = record;
        }
        this.setState({
            visible5: true,
            dUpdate5:dUpdate5
        });

    };
    ToolCancel = () => {
        Api.post('mtDailyReport/pft/findPftCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource5:res? res.data:[],
                Loading5:false,
                page5:res.pageInfo,
            });
        });
        this.setState({
            visible5: false,
        });
    };
    // 生产问题数据修改
    UpdateDate6 = (record) => {
        let dUpdate6 = false;
        if(record.id) {
            dUpdate6 = record;
        }
        this.setState({
            visible6: true,
            dUpdate6:dUpdate6
        });

    };
    ProduceCancel = () => {
        Api.post('mtDailyReport/pfp/findPfpCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource6:res? res.data:[],
                Loading6:false,
                page6:res.pageInfo,
            });
        });
        this.setState({
            visible6: false,
        });
    };
    // 腐蚀问题数据修改
    UpdateDate7 = (record) => {
        let dUpdate7 = false;
        if(record.id) {
            dUpdate7 = record;
        }
        this.setState({
            visible7: true,
            dUpdate7:dUpdate7
        });

    };
    CorrodeCancel = () => {
        Api.post('mtDailyReport/cc/findCcCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource7:res? res.data:[],
                Loading7:false,
                page7:res.pageInfo,
            });
        });
        this.setState({
            visible7: false,
        });
    };
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
    // update(){
    //     this.setState({
    //         tableLoading:true,
    //     });
    //     this.props.form.validateFields((err, values) => {
    //         Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
    //             // 'handOverDate':values.handOverDate.format('YYYY-MM-DD'),
    //             pageNow:this.state.pageNow,
    //             executeStartTime:values.handOverDate.format('YYYY-MM-DD'),
    //             executeEndTime:values.handOverDate.format('YYYY-MM-DD'),
    //         }).then(res=>{
    //             this.setState({
    //                 tableLoading:false,
    //                 dataSource:res? res.data:[],
    //                 page:res.pageInfo,
    //             });
    //         })
    //     });
    //
    //
    // };

    handleReset = () => {
        this.props.form.resetFields();
    };


    callback=(key)=> {
    console.log(key);
};
    // // 当日定检飞机退单统计
    // Add1 = () => {
    //     if(this.state.AddData){
    //         this.setState({
    //             visible2: true,
    //         });
    //     }else {
    //         message.warning('您未选择任何工作包，请先单击需要添加项的工作包！');
    //     }
    //
    // };
    // handleCancel2 = () => {
    //     const m=this.state.AddData;
    //     Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
    //         wwpId:m?m.wwpId:null,
    //         wwpaId:m?m.id:null,
    //         state:'',
    //         pageNow:this.state.pageNow
    //     }).then(res=>{
    //         this.setState({
    //             dataSource2:res? res.data:[],
    //             page2:res.pageInfo,
    //         });
    //     });
    //     this.setState({
    //         visible2:false
    //     });
    // };

    // 新增串件航材信息
    Add = () => {
        if(this.state.dataSource3.length>0){
            this.setState({
                update: true,
            });
        }else {
            message.warning('请先查询工作包！');
        }

    };
    handleCancelAdd = () => {
        Api.post('mtDailyReport/si/findSiCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                Loading:false,
                page1:res.pageInfo,
            });
        });
        this.setState({
            update:false
        });
    };
    // 例行航材信息
    Add4 = () => {
        if(this.state.dataSource3.length>0){
            this.setState({
                update4: true,
            });
        }else {
            message.warning('请先查询工作包！');
        }

    };
    handleCancelAdd4 = () => {
        Api.post('mtDailyReport/pfm/findPfmCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource4:res? res.data:[],
                Loading4:false,
                page4:res.pageInfo,
            });
        });
        this.setState({
            update4:false
        });
    };
    // 工具信息
    Add5 = () => {
        if(this.state.dataSource3.length>0){
            this.setState({
                update5: true,
            });
        }else {
            message.warning('请先查询工作包！');
        }

    };
    handleCancelAdd5 = () => {
        Api.post('mtDailyReport/pft/findPftCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource5:res? res.data:[],
                Loading5:false,
                page5:res.pageInfo,
            });
        });
        this.setState({
            update5:false
        });
    };
    // 生产问题
    Add6 = () => {
        if(this.state.dataSource3.length>0){
            this.setState({
                update6: true,
            });
        }else {
            message.warning('请先查询工作包！');
        }

    };
    handleCancelAdd6 = () => {
        Api.post('mtDailyReport/pfp/findPfpCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource6:res? res.data:[],
                Loading6:false,
                page6:res.pageInfo,
            });
        });
        this.setState({
            update6:false
        });
    };
    // 腐蚀问题
    Add7 = () => {
        if(this.state.dataSource3.length>0){
            this.setState({
                update7: true,
            });
        }else {
            message.warning('请先查询工作包！');
        }

    };
    handleCancelAdd7 = () => {
        Api.post('mtDailyReport/cc/findCcCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:this.state.pageNow,
        }).then(res=>{
            this.setState({
                dataSource7:res? res.data:[],
                Loading7:false,
                page7:res.pageInfo,
            });
        });
        this.setState({
            update7:false
        });
    };
    // 新增2
    Add2 = () => {
        if(this.state.dataSource.length>0){
            this.setState({
                visibleAdd2: true,
            });
        }else {
            message.warning('请先查询符合条件工作包')
        }

    };
    handleCancelAdd2 = () => {
        this.setState({
            Loading2:true
        });
        this.props.form.validateFields((err, values) => {
            const executeTime=values.dailyDate?values.dailyDate.format('YYYY-MM-DD'):'';
            console.log('executeTime',executeTime,values);
            if(!err){
                Api.post('mtDailyReport/findMtDailyReportByCondition',{
                    commandNo:values.commandNo,
                    dailyDate:executeTime,
                    pageNow:this.state.pageNow
                }).then(res=>{
                    console.log('aaa',res);
                    this.setState({
                        dataSource3:res? res.data:[],
                        Loading2:false,
                        page:res.pageInfo,
                    });
                })
            }

        });
        this.setState({
            visibleAdd2:false
        });
    };

    onOk=(value)=>{
        this.setState({
            tableLoading:true,
        });
        const timeData=value.format('YYYY-MM-DD');
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
        // console.log('Page: ', pageNumber);
        this.props.form.validateFields((err, values) => {
            const executeTime=values.dailyDate?values.dailyDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/findMtDailyReportByCondition',{
                    commandNo:values.commandNo,
                    dailyDate:executeTime,
                    pageNow:pageNumber
                }).then(res=>{
                    this.setState({
                        dataSource3:res? res.data:[],
                        Loading2:false,
                        page:res.pageInfo,
                    });
                })
            }

        });
    };
//串件航材
    onChange2 = (pageNumber) => {
        Api.post('mtDailyReport/si/findSiCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:pageNumber,
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                Loading:false,
                page1:res.pageInfo,
            });
        });
    };
    //例行航材
    onChange4 = (pageNumber) => {
        Api.post('mtDailyReport/pfm/findPfmCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:pageNumber,
        }).then(res=>{
            this.setState({
                dataSource4:res? res.data:[],
                Loading4:false,
                page4:res.pageInfo,
            });
        });
    };
    //工具航材
    onChange5 = (pageNumber) => {
        Api.post('mtDailyReport/pft/findPftCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:pageNumber,
        }).then(res=>{
            this.setState({
                dataSource5:res? res.data:[],
                Loading5:false,
                page5:res.pageInfo,
            });
        });
    };
    //生产问题
    onChange6 = (pageNumber) => {
        Api.post('mtDailyReport/pft/findPftCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:pageNumber,
        }).then(res=>{
            this.setState({
                dataSource6:res? res.data:[],
                Loading6:false,
                page6:res.pageInfo,
            });
        });
    };
    //腐蚀
    onChange7 = (pageNumber) => {
        Api.post('mtDailyReport/pft/findPftCondition',{
            mtDrId:this.state.dataSource3[0].id,
            state:'',
            pageNow:pageNumber,
        }).then(res=>{
            this.setState({
                dataSource7:res? res.data:[],
                Loading7:false,
                page7:res.pageInfo,
            });
        });
    };
    onChange3 = (pageNumber) => {
        const m=this.state.AddData;
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:m?m.wwpId:null,
            wwpaId:m?m.id:null,
            state:'',
            pageNow:pageNumber
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
    };

    // 单击工作包
    onRowClick=(record, index, event)=>{
        let AddData = false;
        if(record.id) {
            AddData = record;
        }
        Api.post('wwpBugSummary/findWwpBugSummaryCondition',{
            wwpId:record.wwpId,
            wwpaId:record.id,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource1:res? res.data:[],
                page1:res.pageInfo,
                AddData:AddData
            });
        });
        Api.post('subtaskReturnRecord/findSubtaskReturnRecordCondition',{
            wwpId:record.wwpId,
            wwpaId:record.id,
            state:'',
            pageNow:this.state.pageNow
        }).then(res=>{
            this.setState({
                dataSource2:res? res.data:[],
                page2:res.pageInfo,
            });
        });
    };
// 根据工作日查询可执行的工作包
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({
            tableLoading:true,
            Loading:true,
            Loading4:true,
            Loading5:true,
            Loading6:true,
            Loading7:true
        });
        this.props.form.validateFields((err, values) => {
            const executeTime=values.dailyDate?values.dailyDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                    commandNo:values.commandNo,
                    dailyDate:executeTime,
                }).then(res=>{
                    this.setState({
                        dataSource:res? res.data:[],
                        // page:res.pageInfo,
                        tableLoading:false,
                        // valueData:res.data
                        executeTime:executeTime
                    });
                });
                Api.post('mtDailyReport/findMtDailyReportByCondition',{
                    commandNo:values.commandNo,
                    dailyDate:executeTime,
                    pageNow:this.state.pageNow
                }).then(res=>{
                    this.setState({
                        dataSource3:res? res.data:[],
                        Loading2:false,
                        page:res.pageInfo,
                    });
                    if(this.state.dataSource3.length>0){
                        // 串件
                        Api.post('mtDailyReport/si/findSiCondition',{
                            mtDrId:this.state.dataSource3[0].id,
                            state:'',
                            pageNow:this.state.pageNow,
                        }).then(res=>{
                            this.setState({
                                dataSource1:res? res.data:[],
                                Loading:false,
                                page1:res.pageInfo,
                            });
                        });
                        // 例行航材
                        Api.post('mtDailyReport/pfm/findPfmCondition',{
                            mtDrId:this.state.dataSource3[0].id,
                            state:'',
                            pageNow:this.state.pageNow,
                        }).then(res=>{
                            this.setState({
                                dataSource4:res? res.data:[],
                                Loading4:false,
                                page4:res.pageInfo,
                            });
                        });
                        // 工具问题
                        Api.post('mtDailyReport/pft/findPftCondition',{
                            mtDrId:this.state.dataSource3[0].id,
                            state:'',
                            pageNow:this.state.pageNow,
                        }).then(res=>{
                            this.setState({
                                dataSource5:res? res.data:[],
                                Loading5:false,
                                page5:res.pageInfo,
                            });
                        });
                        // 生产问题
                        Api.post('mtDailyReport/pfp/findPfpCondition',{
                            mtDrId:this.state.dataSource3[0].id,
                            state:'',
                            pageNow:this.state.pageNow,
                        }).then(res=>{
                            this.setState({
                                dataSource6:res? res.data:[],
                                Loading6:false,
                                page6:res.pageInfo,
                            });
                        });
                        // 腐蚀问题
                        Api.post('mtDailyReport/cc/findCcCondition',{
                            mtDrId:this.state.dataSource3[0].id,
                            state:'',
                            pageNow:this.state.pageNow,
                        }).then(res=>{
                            this.setState({
                                dataSource7:res? res.data:[],
                                Loading7:false,
                                page7:res.pageInfo,
                            });
                        });
                    }else {
                        this.setState({
                            dataSource1:[],
                            dataSource4:[],
                            dataSource5:[],
                            dataSource6:[],
                            dataSource7:[],
                            Loading:false,
                            Loading4:false,
                            Loading5:false,
                            Loading6:false,
                            Loading7:false,
                            tableLoading:false,
                        });
                    }

                })
            }else {
                this.setState({
                    dataSource1:[],
                    dataSource4:[],
                    dataSource5:[],
                    dataSource6:[],
                    dataSource7:[],
                    Loading:false,
                    Loading4:false,
                    Loading5:false,
                    Loading6:false,
                    Loading7:false,
                    tableLoading:false,
                });
            }

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
        const columns3 = this.columns3;
        const columns4 = this.columns4;
        const columns5 = this.columns5;
        const columns6 = this.columns6;
        const columns7 = this.columns7;
        const {dataSource ,dataSource1,visible,visible1,tableLoading,page,dUpdate,handlingDate,Loading,page1,AddData,Loading1,dataSource2,ReturnRecord,visible2,page2,
            visibleAdd2,visibleUpdate2,dataSource3,Loading2,dataSource4,Loading4,page4,visible4,dUpdate4,page5,dataSource5,Loading5,visible5,dUpdate5,dataSource7,dataSource6,
            page6,page7,Loading6,Loading7,visible6,dUpdate6,dUpdate7,visible7,visible8,PicData
        } = this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        const d = new Date();
        return(
                <div className="content" >

                    <div>
                        <Form
                            className="ant-advanced-search-form"
                            onSubmit={this.handleSearch}
                        >
                            <Row gutter={40}>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={`工作包`}>
                                        {getFieldDecorator(`commandNo`,{
                                            rules: [{ required: true, message: '工作包不能为空!' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label={`工作日时间`}>
                                        {getFieldDecorator(`dailyDate`,{
                                            rules: [{ required: true, message: '日期不能为空!' }],
                                            initialValue:moment(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), dateFormat),
                                        })(
                                            <DatePicker onChange={this.onChange}  format="YYYY-MM-DD" />
                                        )}
                                    </FormItem>
                                </Col>

                                <Col span={8} >
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                        重置
                                    </Button>
                                    <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                                </Col>
                            </Row>
                        </Form>
                        {/*<Button className="editable-add-btn btn_reload" onClick={this.handleAdd} style={{marginRight:'10px' }}><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>*/}

                    </div>
                    <Modal
                        title="新建"
                        visible={visibleAdd2}
                        onCancel={this.handleCancelAdd2}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}f`}
                    >
                        <DailyReport onCancel={this.handleCancelAdd2} valueData={dataSource} valueTime={this.state.executeTime}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visibleUpdate2}
                        onCancel={this.Cancel2}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}e`}
                    >
                        <UpdateDailyReport onCancel={this.Cancel2} ReturnRecord={ReturnRecord}  valueTime={this.state.executeTime}/>
                    </Modal>
                    {/*串件信息*/}
                    <Modal
                        title="新建"
                        visible={this.state.update}
                        onCancel={this.handleCancelAdd}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}a`}
                    >
                        <AddList onCancel={this.handleCancelAdd} DailyReport={dataSource3}/>
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
                    {/*例行航材信息*/}
                    <Modal
                        title="新建"
                        visible={this.state.update4}
                        onCancel={this.handleCancelAdd4}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}g`}
                    >
                        <MaterialAddList onCancel={this.handleCancelAdd4} MaterialAdd={dataSource3}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible4}
                        onCancel={this.MaterialCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}j`}
                    >
                        <MaterialUpdateList dUpdate4={dUpdate4} onCancel={this.MaterialCancel} />
                    </Modal>
                    {/*工具问题*/}
                    <Modal
                        title="新建"
                        visible={this.state.update5}
                        onCancel={this.handleCancelAdd5}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}k`}
                    >
                        <ToolAddList onCancel={this.handleCancelAdd5} ToolAdd={dataSource3}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible5}
                        onCancel={this.ToolCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}h`}
                    >
                        <ToolUpdateList dUpdate5={dUpdate5} onCancel={this.ToolCancel} />
                    </Modal>
                    {/*生产问题*/}
                    <Modal
                        title="新建"
                        visible={this.state.update6}
                        onCancel={this.handleCancelAdd6}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}l`}
                    >
                        <ProduceAddList onCancel={this.handleCancelAdd6} ProduceAdd={dataSource3}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible6}
                        onCancel={this.ProduceCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}m`}
                    >
                        <ProduceUpdateList dUpdate6={dUpdate6} onCancel={this.ProduceCancel} />
                    </Modal>
                    {/*腐蚀问题*/}
                    <Modal
                        title="新建"
                        visible={this.state.update7}
                        onCancel={this.handleCancelAdd7}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}n`}
                    >
                        <CorrodeAddList onCancel={this.handleCancelAdd7} CorrodeAdd={dataSource3}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible7}
                        onCancel={this.CorrodeCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}o`}
                    >
                        <CorrodeUpdateList dUpdate7={dUpdate7} onCancel={this.CorrodeCancel} />
                    </Modal>

                    {/*图片上传*/}
                    <Modal
                        title="图片上传"
                        visible={visible8}
                        onCancel={this.PicUploadCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}w`}
                    >
                    <PicUplod onCancel={this.PicUploadCancel} PicData={PicData} PicAdd={dataSource3}/>
                    </Modal>

                    {/*<Modal*/}
                        {/*title="新建"*/}
                        {/*visible={visible2}*/}
                        {/*onCancel={this.handleCancel2}*/}
                        {/*maskClosable={false}*/}
                        {/*footer={null}*/}
                        {/*key={`${modalKey}d`}*/}
                    {/*>*/}
                        {/*<AddReturnRecord onCancel={this.handleCancel2} AddData={AddData}/>*/}
                    {/*</Modal>*/}
                    {/*<Modal*/}
                        {/*title="修改"*/}
                        {/*visible={visible1}*/}
                        {/*onCancel={this.handleCancel1}*/}
                        {/*maskClosable={false}*/}
                        {/*footer={null}*/}
                        {/*key={`${modalKey}c`}*/}
                    {/*>*/}
                        {/*<ReturnRecordList ReturnRecord={ReturnRecord} onCancel={this.handleCancel1}/>*/}
                    {/*</Modal>*/}
                    <Table bordered dataSource={dataSource} columns={columns} loading={tableLoading} rowKey='id' pagination={false} size="middle" style={{clear:'both'}} className='table'
                           title={() => <div >
                               <span style={{fontSize:'18px'}}>大修部定检跟线日报</span>
                               <Button type="primary" onClick={()=>this.Add2()} style={{float:'left'}}>新增</Button>
                           </div>}
                    />
                    <Table bordered dataSource={dataSource3} columns={columns3}  loading={Loading2} rowKey='id' pagination={false} size="middle"/>
                    {/*<Pagination*/}
                        {/*{...page}*/}
                        {/*onChange={this.onChange1}*/}
                    {/*/>*/}
                    <Table bordered dataSource={dataSource1} columns={columns1}  loading={Loading} rowKey='id' pagination={false} size="middle"
                           title={() => <div >
                               {/*<div>航材问题</div>*/}
                               {/*<div>*/}
                                   <span>串件航材信息</span>
                                   <Button type="primary" onClick={()=>this.Add()} style={{float:'left'}}>新增</Button>
                               {/*</div>*/}

                           </div>}
                           rowClassName={(record, index)=>record.rowColor}
                    />
                    <Pagination
                        {...page1}
                        onChange={this.onChange2}
                    />
                    <Table bordered dataSource={dataSource4} columns={columns4}  loading={Loading4} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>例行航材问题</span>
                               <Button type="primary" onClick={()=>this.Add4()} style={{float:'left'}}>新增</Button>
                           </div>}
                           rowClassName={(record, index)=>record.rowColor}
                    />
                    <Pagination
                        {...page4}
                        onChange={this.onChange4}
                    />
                    <Table bordered dataSource={dataSource5} columns={columns5}  loading={Loading5} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>工具问题</span>
                               <Button type="primary" onClick={()=>this.Add5()} style={{float:'left'}}>新增</Button>
                           </div>}
                           rowClassName={(record, index)=>record.rowColor}
                    />
                    <Pagination
                        {...page5}
                        onChange={this.onChange5}
                    />
                    <Table bordered dataSource={dataSource6} columns={columns6}  loading={Loading6} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>生产问题</span>
                               <Button type="primary" onClick={()=>this.Add6()} style={{float:'left'}}>新增</Button>
                           </div>}
                           rowClassName={(record, index)=>record.rowColor}
                    />
                    <Pagination
                        {...page6}
                        onChange={this.onChange6}
                    />
                    <Table bordered dataSource={dataSource7} columns={columns7}  loading={Loading7} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div >
                               <span>腐蚀情况汇总</span>
                               <Button type="primary" onClick={()=>this.Add7()} style={{float:'left'}}>新增</Button>
                           </div>}
                           rowClassName={(record, index)=>record.rowColor}
                    />
                    <Pagination
                        {...page7}
                        onChange={this.onChange7}
                    />
                </div>

        )
    }
}
const MtDailyReports = Form.create()(MtDailyReport);
export default MtDailyReports;


