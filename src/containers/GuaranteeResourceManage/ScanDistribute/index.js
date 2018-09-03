// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Icon,Select,message,Popconfirm} from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Details from './Details';

const dataValue=[];
const dataValue1=[];
const dataValue2=[];


const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}, {
    value: '',
    label: '全部',
}];
let modalKey = 0;   //  用于重置modal

// 件号管理
 class ScanDistribute extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            UserRole:false,
            // data: [],
            loading:true,
            userName:'',
            pageNow:1,
            page:{},
            DetailsData:false,
            value:'',
            DistributeDate:'',
            selectedRowKeys: [],
            values:'',
            selectedRows:'',
            STLchoose:false,
            DDFCchoose:false,
            NRCchoose:false,
            data2:'',
            data1:'',
            data:''
        };
        // NRC
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
            // }, {
            //     title: '实际工时',
            //     dataIndex: 'actualHour',
            //     key: 'actualHour',
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
                    const time = this.changetime(record.executeEndTime);
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
                    const state = record.executeStatus;
                    if(state == 'S'){
                        return <span>开始</span>
                    }else if(state == 'E'){
                        return <span>结束</span>
                    }else if(state == 'F'){
                        return <span>失败</span>
                    }else if(state == 'R'){
                        return <span>分发</span>
                    }
                    // if(state == 'T'){
                    //     if(record.executeStatus=='S'){
                    //         if(record.receiveStatus=='T'){
                    //             return <span>已领取</span>
                    //         }else if(record.receiveStatus=='F'){
                    //             return <span>未领取</span>
                    //         }
                    //     }else if(record.executeStatus=='E'){
                    //         return <span>closed</span>
                    //     }else if(record.executeStatus=='F'){
                    //         return <span>取消</span>
                    //     }else if(record.executeStatus=='R'){
                    //         if(record.receiveStatus=='T'){
                    //             return <span>已领取</span>
                    //         }else if(record.receiveStatus=='F'){
                    //             return <span>未领取</span>
                    //         }
                    //     }
                    // }else if(state == 'F'){
                    //     return <span>无效</span>
                    // }else if(state == 'D'){
                    //     return <span>删除</span>
                    // }
                }
            // }, {
            //     title: '操作',
            //     key: 'action',
            //     render: (text, record,index) => {
            //         let status=record.executeStatus;
            //         if(status == 'S'){
            //             return <span><a >分发</a></span>//onClick={()=>this.Distribute(record)
            //
            //         }else if(status == 'R'){
            //             return <span><a >回收</a></span>//onClick={()=>this.DistributeE(record)}
            //
            //         }else if(status == 'E'){
            //             return <span>已回收</span>
            //
            //         }
            //     }
            }];

        // DDFC
        this.columns1 = [
            {
            //     title: '工作包号',
            //     dataIndex: 'commandNo',
            //     key: 'commandNo',
            // }, {
                title: 'DD/FC类型',
                dataIndex: 'deferType',
                key: 'deferType',
            }, {
                title: 'DD/FC编号',
                dataIndex: 'deferId',
                key: 'deferId',
            }, {
                title: 'DD/FC项次号',
                dataIndex: 'itemno',
                key: 'itemno',

                // render:(text,record) => {
                //     const state = record.deferState;
                //     if(state == 'T'){
                //         if(record.executeStatus=='S'){
                //             if(record.receiveStatus=='T'){
                //                 return <span>已领取</span>
                //             }else if(record.receiveStatus=='F'){
                //                 return <span>未领取</span>
                //             }
                //         }else if(record.executeStatus=='E'){
                //             return <span>closed</span>
                //         }else if(record.executeStatus=='F'){
                //             return <span>取消</span>
                //         }else if(record.executeStatus=='R'){
                //             if(record.receiveStatus=='T'){
                //                 return <span>已领取</span>
                //             }else if(record.receiveStatus=='F'){
                //                 return <span>未领取</span>
                //             }
                //         }
                //     }else if(state == 'F'){
                //         return <span>无效</span>
                //     }else if(state == 'D'){
                //         return <span>删除</span>
                //     }
                // }

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
            // }, {
            //     title: '实际工时',
            //     dataIndex: 'actualHour',
            //     key: 'actualHour',
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
            },{
                title: '检查间隔',
                dataIndex: 'interval',
                key: 'interval',
            },{

                title: '检查标准',
                dataIndex: 'standard',
                key: 'standard',
            },{
                title: 'DD/FC状态',
                dataIndex: 'executeStatus',
                key: 'executeStatus',
                render:(text,record) => {
                    const state = record.executeStatus;
                    if (state == 'S') {
                        return <span>开始</span>
                    } else if (state == 'E') {
                        return <span>结束</span>
                    } else if (state == 'F') {
                        return <span>失败</span>
                    } else if (state == 'R') {
                        return <span>分发</span>
                    }
                }
            // },{
            //     title: '操作',
            //     key: 'action',
            //     render: (text, record,index) => {
            //         let status=record.executeStatus;
            //         if(status == 'S'){
            //             return <span><a >分发</a></span>//onClick={()=>this.Distribute(record)}
            //
            //         }else if(status == 'R'){
            //             return <span><a >回收</a></span>//onClick={()=>this.DistributeE(record)}
            //
            //         }else if(status == 'E'){
            //             return <span>已回收</span>
            //
            //         }
            //     }
            }];

        // 工卡清单
        this.columns2 = [
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
            // {
            //     title: '工作包号',
            //     dataIndex: 'commandNo',
            //     key: 'commandNo'
            // },
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
                width:200,
                className:'table_workInfo',
                render:(text,record) => {
                    return <div title={record.content}>{record.content}</div>
                }
            // },
            // {
            //     title: '回收时间',
            //     dataIndex: 'updateTime',
            //     key: 'updateTime',
            //     render:(text,record) => {
            //         const time =record.updateTime!=null? this.changetime(record.updateTime):'';
            //         return <span>{time}</span>
            //     }
            },
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
            // },
            // {
            //     title: '实际工时（/小时）',
            //     dataIndex: 'actualHour',
            //     key: 'actualHour'
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark'
            // },
            // {
            //     title: '回收人',
            //     dataIndex: 'executeBy',
            //     key: 'executeBy'
            }, {
                title: '回收备注',
                dataIndex: 'executeRemark',
                key: 'executeRemark'

            },
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
                title: '状态',
                dataIndex: 'executeStatus',
                key: 'executeStatus',
                render:(text,record) => {
                    const state = record.executeStatus;
                    if (state == 'S') {
                        return <span>开始</span>
                    } else if (state == 'E') {
                        return <span>结束</span>
                    } else if (state == 'F') {
                        return <span>失败</span>
                    } else if (state == 'R') {
                        return <span>分发</span>
                    }
                }
                // render: (text, record,index) => {
                //     const state = record.listState;
                //     if(state == 'T'){
                //         return <span>有效</span>
                //     }else if(state == 'F'){
                //         return <span>无效</span>
                //     }
                // }
            // },
            // {
            //     title: '操作',
            //     key: 'action',
            //     render: (text, record,index) => {
            //         let status=record.executeStatus;
            //         if(status == 'S'){
            //             return <span>分发</span>//onClick={()=>this.Distribute(record)}
            //
            //         }else if(status == 'R'){
            //             return <span>回收</span>//onClick={()=>this.DistributeE(record)}
            //
            //         }else if(status == 'E'){
            //             return <span>已回收</span>
            //
            //         }
            //     }


            }
        ];
        this.state={
           data:[]
        };
    }

     //将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
         return Y+M+D
     };

//      if(values=='STL'){
//      Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoScan',{
//      'receiveType':values,
//      'stlId':record.id,
//      'wwpId':record.wwpId,
//      'executeStatus':'R',
//      'executeRemark':'',
//  }).then(res=>{
//     if(res.errorCode=='0'){
//         message.success('分发成功！');
//         this.update();
//     }else{
//         message.error('分发失败：'+res.errorMsg);
//     }
// })
// }
// if(values=='DDFC'){
//     Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoScan',{
//         'receiveType':values,
//         'deferId':record.id,
//         'executeStatus':'R',
//         'executeRemark':'',
//     }).then(res=>{
//         if(res.errorCode=='0'){
//             message.success('分发成功！');
//             this.update();
//         }else{
//             message.error('分发失败：'+res.errorMsg);
//         }
//     })
// }
// if(values=='NRC'){
//     Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoScan',{
//         'receiveType':values,
//         'nrcId':record.id,
//         'executeStatus':'R',
//         'executeRemark':'',
//         'wwpId':record.wwpId,
//     }).then(res=>{
//         if(res.errorCode=='0'){
//             message.success('分发成功！');
//             this.update();
//         }else{
//             message.error('分发失败：'+res.errorMsg);
//         }
//     })
// }


// 分发
    Distribute = (record) => {
        const values=this.state.value;
        // console.log('values',values);
        const selectedRows=this.state.selectedRows;
        const selectedRowKeys=this.state.selectedRowKeys;
        // console.log('value',selectedRows,selectedRowKeys,values);

        if(selectedRowKeys.length>0){
                if(values=='STL'){
                    for(let i=0;i<selectedRows.length;i++){
                        Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoScan',{
                            'receiveType':values,
                            'stlId':selectedRows[i].id,
                            'wwpId':selectedRows[i].wwpId,
                            'executeStatus':'R',
                            'executeRemark':'',
                        }).then(res=>{
                            if(res.errorCode=='0'){

                                message.success('分发成功！');
                                dataValue2.length=0;
                            }else{
                                message.error('分发失败：'+res.errorMsg);
                                return false;

                            }
                        });
                        // Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                        //     'scanInfo':selectedRows[i].commandNo+'_'+selectedRows[i].itemNo+'_'+selectedRows[i].seqNo,
                        //     'receiveType':'STL'
                        // }).then(res=>{
                        //     dataValue2.push(res.data.workInfoList[0]);
                        //     const result2={};
                        //     for(let i=0;i<dataValue2.length;i++){
                        //         result2[dataValue2[i]['id']]=dataValue2[i];
                        //     }
                        //     const finalResult2=[];
                        //     for(let key in result2){
                        //         finalResult2.push(result2[key]);
                        //     }
                        //     this.setState({
                        //         loading:false,
                        //         // data:res? res.data.workInfoList:[],
                        //         page:res.pageInfo,
                        //         value:res? res.data.receiveType:[],
                        //         data2:finalResult2,
                        //     });
                        // })
                    }

                }
                if(values=='DDFC'){
                    for(let i=0;i<selectedRows.length;i++){
                        Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoScan',{
                            'receiveType':values,
                            'deferId':selectedRows[i].id,
                            'executeStatus':'R',
                            'executeRemark':'',
                        }).then(res=>{
                            if(res.errorCode=='0'){
                                message.success('分发成功！');
                                dataValue1.length=0;
                            }else{
                                message.error('分发失败：'+res.errorMsg);
                                return false;
                            }
                        });
                        // Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                        //     'scanInfo':selectedRows[i].deferType+selectedRows[i].deferId,
                        //     'receiveType':'DDFC'
                        // }).then(res=>{
                        //     dataValue1.push(res.data.workInfoList[0]);
                        //     console.log('dataValue1',res,dataValue1);
                        //     const result1={};
                        //     for(let i=0;i<dataValue1.length;i++){
                        //         result1[dataValue1[i]['id']]=dataValue1[i];
                        //     }
                        //     const finalResult1=[];
                        //     for(let key in result1){
                        //         finalResult1.push(result1[key]);
                        //     }
                        //     this.setState({
                        //         loading:false,
                        //         // data:res? res.data.workInfoList:[],
                        //         page:res.pageInfo,
                        //         value:res? res.data.receiveType:[],
                        //         data1:finalResult1,
                        //     });
                        // })
                    }

                }
                if(values=='NRC'){
                    for(let i=0;i<selectedRows.length;i++){
                        Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoScan',{
                            'receiveType':values,
                            'nrcId':selectedRows[i].id,
                            'executeStatus':'R',
                            'executeRemark':'',
                            'wwpId':selectedRows[i].wwpId,
                        }).then(res=>{
                            if(res.errorCode=='0'){
                                message.success('分发成功！');
                                dataValue.length=0;
                            }else{
                                message.error('分发失败：'+res.errorMsg);
                                return false;
                            }
                        });
                        // console.log(selectedRows[i].id);
                        // Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                        //     'scanInfo':selectedRows[i].commandNo+''+selectedRows[i].itemno+''+selectedRows[i].nrcNo,
                        //     'receiveType':'NRC'
                        // }).then(res=>{
                        //     dataValue.push(res.data.workInfoList[0]);
                        //     // console.log('dataValue',res,dataValue);
                        //
                        //     const result={};
                        //     for(let i=0;i<dataValue.length;i++){
                        //         result[dataValue[i]['id']]=dataValue[i];
                        //     }
                        //     const finalResult=[];
                        //     for(let key in result){
                        //         finalResult.push(result[key]);
                        //     }
                        //     // console.log('dataValue1',finalResult);
                        //     // const dataValues=dataValue;
                        //     this.setState({
                        //         loading:false,
                        //         // data:res? res.data.workInfoList:[],
                        //         page:res.pageInfo,
                        //         value:res? res.data.receiveType:[],
                        //         data:finalResult,
                        //     });
                        // })

                    }

                }

        }else {
            message.warning('您未选择需要操作的项！')
        }



    };
// 回收
    DistributeE = (record) => {
        const selectedRowKeys=this.state.selectedRowKeys;
        const values=this.state.value;
        const selectedRows=this.state.selectedRows;
        if(selectedRowKeys){
            this.setState({
                visible: true,
                values:values,
            });
        }

    };
    handleCancel = (e) => {
        dataValue.length=0;
        dataValue1.length=0;
        dataValue2.length=0;
        this.setState({
            visible: false,
        });
        // console.log('huishou',this.state.value,this.state.selectedRows);
        // if(this.state.value=='STL'){
        //     for(let i=0;i<this.state.selectedRows.length;i++){
        //         Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
        //             'scanInfo':this.state.selectedRows[i].commandNo+'_'+this.state.selectedRows[i].itemNo+'_'+this.state.selectedRows[i].seqNo,
        //             'receiveType':'STL'
        //         }).then(res=>{
        //             dataValue2.push(res.data.workInfoList[0]);
        //             const result2={};
        //             for(let i=0;i<dataValue2.length;i++){
        //                 result2[dataValue2[i]['id']]=dataValue2[i];
        //             }
        //             const finalResult2=[];
        //             for(let key in result2){
        //                 finalResult2.push(result2[key]);
        //             }
        //             this.setState({
        //                 loading:false,
        //                 page:res.pageInfo,
        //                 value:res? res.data.receiveType:[],
        //                 data2:finalResult2,
        //             });
        //         })
        //     }
        //
        // }
        // if(this.state.value=='DDFC'){
        //     for(let i=0;i<this.state.selectedRows.length;i++){
        //         Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
        //             'scanInfo':this.state.selectedRows[i].deferType+this.state.selectedRows[i].deferId,
        //             'receiveType':'DDFC'
        //         }).then(res=>{
        //             dataValue1.push(res.data.workInfoList[0]);
        //             console.log('dataValue1',res,dataValue1);
        //             const result1={};
        //             for(let i=0;i<dataValue1.length;i++){
        //                 result1[dataValue1[i]['id']]=dataValue1[i];
        //             }
        //             const finalResult1=[];
        //             for(let key in result1){
        //                 finalResult1.push(result1[key]);
        //             }
        //             this.setState({
        //                 loading:false,
        //                 page:res.pageInfo,
        //                 value:res? res.data.receiveType:[],
        //                 data1:finalResult1,
        //             });
        //         })
        //     }
        //
        // }
        // if(this.state.value=='NRC'){
        //     for(let i=0;i<this.state.selectedRows.length;i++){
        //         Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
        //             'scanInfo':this.state.selectedRows[i].commandNo+''+this.state.selectedRows[i].itemno+''+this.state.selectedRows[i].nrcNo,
        //             'receiveType':'NRC'
        //         }).then(res=>{
        //             dataValue.push(res.data.workInfoList[0]);
        //             const result={};
        //             for(let i=0;i<dataValue.length;i++){
        //                 result[dataValue[i]['id']]=dataValue[i];
        //             }
        //             const finalResult=[];
        //             for(let key in result){
        //                 finalResult.push(result[key]);
        //             }
        //             this.setState({
        //                 loading:false,
        //                 page:res.pageInfo,
        //                 value:res? res.data.receiveType:[],
        //                 data:finalResult,
        //             });
        //         })
        //
        //     }
        //
        // }
    };

 // 更新页面数据
    update(){
        // this.props.form.validateFields(['scanInfo'],(err, values) => {
        //     if(!err){
        //         Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
        //             'scanInfo':values.scanInfo,
        //         }).then(res=>{
        //             this.setState({
        //                 loading:false,
        //                 data:res? res.data.workInfoList:[],
        //                 page:res.pageInfo,
        //                 value:res? res.data.receiveType:[],
        //             });
        //
        //         })
        //     }
        //
        //
        // });
    }
    componentDidMount(){
        dataValue.length=0;
        dataValue1.length=0;
        dataValue2.length=0;
    }



// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        // const dataValue=[];
        this.props.form.validateFields((err, values) => {
            // console.log('values',values);
            const reg=new RegExp("([A-Za-z0-9]_)+");
            const reg1=new RegExp("\\s");
            const reg2=new RegExp("/\s|[_]/");
            // console.log('reg.test(values.scanInfo)',reg.test(values.scanInfo));
            // console.log('reg.test(values.scanInfo)',reg1.test(values.scanInfo));
            // console.log('reg.test(values.scanInfo)',!(/\s|[_]/.test(values.scanInfo)));
            // && reg.test(values.scanInfo)
            if(!err){
                if(values.state=='STL' && reg.test(values.scanInfo)){
                    this.setState({
                        STLchoose:true,
                        DDFCchoose:false,
                        NRCchoose:false,
                    });
                    Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                        'scanInfo':values.scanInfo,
                        'receiveType':'STL'
                    }).then(res=>{
                        dataValue2.push(res.data.workInfoList[0]);
                        const result2={};
                        for(let i=0;i<dataValue2.length;i++){
                            result2[dataValue2[i]['id']]=dataValue2[i];
                        }
                        const finalResult2=[];
                        for(let key in result2){
                            finalResult2.push(result2[key]);
                        }
                        this.setState({
                            loading:false,
                            page:res.pageInfo,
                            value:res? res.data.receiveType:[],
                            data2:finalResult2,
                        });
                    })
                }
               else if(values.state=='NRC' && reg1.test(values.scanInfo)){
                    this.setState({
                        NRCchoose:true,
                        DDFCchoose:false,
                        STLchoose:false,
                    });
                    Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                        'scanInfo':values.scanInfo,
                        'receiveType':'NRC'
                    }).then(res=>{
                        dataValue.push(res.data.workInfoList[0]);
                        // console.log('dataValue',res,dataValue);

                        const result={};
                       for(let i=0;i<dataValue.length;i++){
                           result[dataValue[i]['id']]=dataValue[i];
                       }
                       const finalResult=[];
                        for(let key in result){
                            finalResult.push(result[key]);
                        }
                        // console.log('dataValue1',finalResult);
                        // const dataValues=dataValue;
                        this.setState({
                            loading:false,
                            page:res.pageInfo,
                            value:res? res.data.receiveType:[],
                            data:finalResult,
                        });
                    })
                }
               else if(values.state=='DDFC' && !(/\s|[_]/.test(values.scanInfo))){
                    this.setState({
                        DDFCchoose:true,
                        STLchoose:false,
                        NRCchoose:false,
                    });
                    Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                        'scanInfo':values.scanInfo,
                        'receiveType':'DDFC'
                    }).then(res=>{
                        dataValue1.push(res.data.workInfoList[0]);
                        const result1={};
                        for(let i=0;i<dataValue1.length;i++){
                            result1[dataValue1[i]['id']]=dataValue1[i];
                        }
                        const finalResult1=[];
                        for(let key in result1){
                            finalResult1.push(result1[key]);
                        }
                        this.setState({
                            loading:false,
                            page:res.pageInfo,
                            value:res? res.data.receiveType:[],
                            data1:finalResult1,
                        });
                    })
                }else {
                   message.warning('扫描文件与选择不一致！')
                }

                // Api.post('weekWorkPackageManagerOperating/empReleaseWorInfoListScan',{
                //     'scanInfo':values.scanInfo,
                // }).then(res=>{
                //     console.log('res',res);
                //     dataValue.push(res.data.workInfoList[0]);
                //     this.setState({
                //         loading:false,
                //         data:res? res.data.workInfoList:[],
                //         page:res.pageInfo,
                //         value:res? res.data.receiveType:[],
                //         dataValue:dataValue
                //     });
                // })
            }
            setTimeout(this.handleReset,1500);

        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields(['scanInfo']);
         const input =document.getElementById('scanInfo');
        input.focus();
    };
// 分页查询
//    onChange = (pageNumber) => {
//
//        this.props.form.validateFields(['scanInfo'],(err, values) => {
//            Api.post('workPackageInfo/findEquipmentByCondition',{
//                'pnNo':this.state.pnNo,
//                'equipmentType':this.state.equipmentType,
//                'equipmentState':'T',
//                'pageNow':pageNumber
//            }).then(res=>{
//                this.setState({
//                    loading:false,
//                    data:res? res.data:[],
//                    page:res.pageInfo,
//                });
//            })
//        });
// };

handleChange=(value)=> {
    // console.log(`selected ${value}`);
};
    cancel=(e)=> {};

    // 监听工卡清单是否被选中
    onSelectChange = (selectedRowKeys,selectedRows) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys,selectedRows);
        this.setState({ selectedRowKeys,selectedRows});
    };
    render(){
        const {  selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.executeStatus === 'E', // Column configuration not to be checked
            }),
        };
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const columns1 = this.columns1;
        const columns2 = this.columns2;

        const { data,page,value,dataValue,dataValue2,dataValue1,values,NRCchoose,DDFCchoose,STLchoose,data2,data1} = this.state;
        // console.log(NRCchoose,DDFCchoose,STLchoose);
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
                            <Col span={8}  >
                                <FormItem {...formItemLayout} label={`扫描类型`}>
                                    {getFieldDecorator(`state`,{
                                        // initialValue:'STL',
                                        rules:[{required:true,message:'请选择扫描类型',}]
                                    })(
                                        <Select  onChange={this.handleChange}>
                                            <Option value="STL">工卡清单</Option>
                                            <Option value="DDFC">DDFC</Option>
                                            <Option value="NRC">NRC</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}  >
                                <FormItem {...formItemLayout} label={`条码`} help="同类型数据一起操作" validateStatus='warning'>
                                    {getFieldDecorator(`scanInfo`,{
                                        // initialValue: '',
                                    })(
                                        <Input placeholder="" autoFocus/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content">
                    <div style={{width:'100%',height:'40px'}}>
                        <Popconfirm title="确认要分发吗?" onConfirm={this.Distribute} onCancel={this.cancel} okText="确认" cancelText="取消">
                        <Button className="editable-add-btn btn_reload"  style={{float:'left',marginRight:'10px'}}>分发</Button>
                        </Popconfirm>
                        <Button className="editable-add-btn btn_reload" onClick={this.DistributeE} style={{float:'left'}}>回收</Button>
                        <Modal
                            title="回收"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                        >
                            <Details DistributeDate={this.state.DistributeDate} value={value} selectedRow={this.state.selectedRows}  onCancel={this.handleCancel}/>
                        </Modal>

                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'  loading={this.state.loading} bordered  size="middle" style={{display:NRCchoose?'block':'none'}} rowSelection={rowSelection} className='table'/>
                    <Table columns={columns1} dataSource={data1} pagination={false} rowKey='id'  loading={this.state.loading} bordered  size="middle" style={{display:DDFCchoose?'block':'none'}} rowSelection={rowSelection} className='table'/>
                    <Table columns={columns2} dataSource={data2} pagination={false} rowKey='id'  loading={this.state.loading} bordered  size="middle" style={{display:STLchoose?'block':'none'}} rowSelection={rowSelection} className='table'/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const ScanDistributes = Form.create()(ScanDistribute);
export default ScanDistributes;


