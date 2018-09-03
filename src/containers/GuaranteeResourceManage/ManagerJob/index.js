import React from 'react';
import {Form, Button, Table, Modal, DatePicker, Select, message, Icon,notification,Spin,Upload} from 'antd';
import {  Row, Col} from 'antd';

import Api from '../../../api/request';
import { Tabs } from 'antd';
import Pagination from '../../../components/Pagination';
import FirstEmpCheck from './FirstEmpCheck';
import EmpLook from './EmpLook';
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
let modalKey = 0;   //  用于重置modal


// 生产线经理根据工作日查询所属工作包日计划
 class DayPlan extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            FirstEmpVisible:false,
            data: [],
            tableLoading:false,
            updateState:false,
            page:{},
            page1:{},
            pageNow:1,
            loading: false,
            Selected:'',
            FirstEmp:false,
            tableLoad:true,
            wwpdata:false,
            airplaneArea:[],
            selectedRowKeys: [],
            Emps:false,
            FirstEmpLookVisible:false,
            loadings:false,
            selectedRows:''
        };
        this.columns = [{
            title: '开始执行时间',
            dataIndex: 'wwpExecuteStartTime',
            key: 'wwpExecuteStartTime',
            render:(text,record) => {
                const time =record.wwpExecuteStartTime? this.changetime(record.wwpExecuteStartTime):'';
                return <span>{time}</span>
            }
            },{
            title: '结束执行时间',
            dataIndex: 'wwpExecuteEndTime',
            key: 'wwpExecuteEndTime',
            render:(text,record) => {
                const time =record.wwpExecuteEndTime? this.changetime(record.wwpExecuteEndTime):'';
                return <span>{time}</span>
            }
        },{
            title: '审核时间',
            dataIndex: 'checkTime',
            key: 'checkTime',
            render:(text,record) => {
                const time =record.checkTime!=null? this.changetime(record.checkTime):'';
                return <span>{time}</span>
            }
        },{
            title: '维修工作',
            dataIndex: 'wwpWorkInfo',
            key: 'wwpWorkInfo',
            width:'250px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.wwpWorkInfo}>{record.wwpWorkInfo}</div>
            }
        },{
            title: '指令号',
            dataIndex: 'wwpCommandNo',
            key: 'wwpCommandNo'
        },{
            title: '试车员',
            dataIndex: 'testpilotManName',
            key: 'testpilotManName'
        },{
            title: '观察员',
            dataIndex: 'observerManName',
            key: 'observerManName'
        },{
            title: '进场时间',
            dataIndex: 'goInAirPortTime',
            key: 'goInAirPortTime'
        },{
            title: '分线',
            dataIndex: 'battleLineValue',
            key: 'battleLineValue'
        }, {
            title: '审批',
            dataIndex: 'auditing',
            key: 'auditing',
            width:80,
            render: (text, record, index) => (
                <Select
                    defaultValue={record.checkState}
                    // style={{width: 70}}
                    onSelect={(value, e) => this.changeAuditing(e, record, value)}

                >
                    <Option value="T">通过</Option>
                    <Option value="F">未通过</Option>
                </Select>
            )
            //    },{
            // title: '下载',
            // key: 'download',
            // render: (text, record,index) => {
            //     return (
            //     <span className="action">
            //     <a href={record.visitPreFix+'/'+record.docUrl}>文档下载</a>
            //     </span>
            //     )
            // },
        }, {
            title: '操作',
            key: 'action',
            render: (text, record,index) => {
                const upload1= {
                    customRequest:(obj) => {
                        // console.log('record',record);
                        Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                            .then(res => {
                                // console.log(res);
                                this.setState({
                                    loadings:true
                                });
                                if(res.errorCode == 0) {
                                    Api.post('weekWorkPackageManagerOperating/saveWwpUploadDocument',{documentUrl:res.data,wwpId:record.wwpId})
                                        .then(res => {
                                            // console.log(res);
                                            this.setState({
                                                uploading: false,
                                                loadings:false
                                            });
                                            if(res.errorCode == 0) {
                                                notification.open({
                                                    message: '上传成功',
                                                    description: res.data,
                                                });

                                            this.update();
                                            } else if(res.errorCode == 1) {
                                                notification.open({
                                                    message: '上传失败',
                                                    description: res.data,
                                                });
                                            }
                                        })

                                } else {
                                    message.error('文件上传服务器失败');
                                }
                            });
                    },
                    showUploadList:false,
                    onChange: (fileList) => {
                        // console.log(fileList);
                    }
                };
                return (
                <div>
                    {
                        record.documentFile!=null?
                            <span className="action">
                                <Upload {...upload1}>
                                    <a >
                                        <Icon type="upload" /> 附件上传
                                    </a>
                                </Upload>
                             <span className="ant-divider" />
                             <a href={record.visitPreFix+'/'+record.documentFile} target="_blank">文档下载</a>
                        </span>
                            :<span className="action">
                                <Upload {...upload1}>
                                    <a >
                                        <Icon type="upload" /> 附件上传
                                    </a>
                                </Upload>
                        </span>
                    }

                </div>

                )
            },
         }
        ];

        // 工卡明细
        this.expandedRowRender = (e,record) => {
            const columns = [
                { title: '序号', dataIndex: 'seqNo', key: 'seqNo',width:'5%' },
                { title: '项号', dataIndex: 'itemNo', key: 'itemNo',width:'5%' },
                { title: '任务号', dataIndex: 'taskNo', key: 'taskNo',width:'5%' },
                { title: '工卡号', dataIndex: 'subTaskNo', key: 'subTaskNo' ,width:'5%'},
                { title: '版本号', dataIndex: 'revision', key: 'revision',width:'5%' },
                // { title: 'mcdRev', dataIndex: 'mcdRev', key: 'mcdRev',width:'5%' },
                { title: '工种', dataIndex: 'skill', key: 'skill',width:'5%' },
                { title: '区域', dataIndex: 'workArea', key: 'workArea',width:'5%' },
                { title: '工作内容', dataIndex: 'content', key: 'content' ,width:'15%'},
                { title: '间隔', dataIndex: 'threshold', key: 'threshold',width:'5%' },
                { title: '工时', dataIndex: 'manHours', key: 'manHours' ,width:'5%'},
                { title: '大区域', dataIndex: 'largeAreaName', key: 'largeAreaName',width:'5%' },
                { title: '小区域', dataIndex: 'smallArea', key: 'smallArea',width:'5%' },
                { title: '备注', dataIndex: 'remark', key: 'remark',width:'5%' },
                // { title: '执行日期', dataIndex: 'executeTime', key: 'executeTime', render:(text,record) => {
                //     const time =record.executeTime==null?'': this.changetime(record.executeTime);
                //     return <span>{time}</span>
                // } },
                // {
                //     title: 'arranged', dataIndex: 'arranged', key: 'arranged', width: '10%', render: (text, record) => {
                //     const state = record.arranged;
                //     if (state == 'T') {
                //         return <span><Badge status="success"/>已安排</span>
                //     } else if (state == 'F') {
                //         return <span><Badge />未安排</span>
                //     }
                // },
                //     filters: [{
                //         text: '未安排',
                //         value: 'F',
                //     }, {
                //         text: '已安排',
                //         value: 'T',
                //     }],
                //     onFilter: (value, record) => record.arranged.indexOf(value) === 0,
                // },
                {
                    width:118,
                    title: '操作',
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                            <span className="action">
                         <a onClick={() => this.FirstEmpLook(text,record)}>查看人员安排</a>
                     </span>
                        )
                    }

                },
            ];
            const {  selectedRowKeys } = this.state;
            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange,
            };
            return (
                <div>
                <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={this.state.datas}
                    pagination={false}
                    loading={this.state.tableLoad}
                    rowSelection={rowSelection}
                    title={() =><div className="title" >
                        <Button type="primary" onClick={()=>this.FirstEmpFindModal(e,record)} >工卡人员安排</Button>
                    </div>
                    }
                />
                    <Pagination
                        {...this.state.page1}
                        onChange={this.onChange1}
                    />
                </div>
            );
        };
    }

     // 人员安排查看
     FirstEmpLook = (record) => {
         let Emps = false;
         if(record.stlId) {
             Emps = record;
         }
         this.setState({
             Emps:Emps,
             FirstEmpLookVisible: true
         });
     };
     FirstEmpLookCancel = () => {
         this.setState({
             FirstEmpLookVisible:false
         });

     };

// 监听工卡清单是否被选中
     onSelectChange = (selectedRowKeys,selectedRows) => {
         // console.log('selectedRowKeys changed: ', selectedRowKeys,selectedRows);
         this.setState({ selectedRowKeys,selectedRows});
     };

     // 分页查询
     onChange1 = (pageNumber) => {
         Api.post('weekWorkPackageManagerOperating/findSubTaskListByWwpaIdForEmpManager',{wwpaId:this.state.wwpaId,pageNow:pageNumber})
             .then(res => {
                 // console.log('res',res);
                 if(res.errorCode == 0) {
                     this.setState({
                         datas:res? res.data:[],
                         tableLoad:false,
                         page1:res.pageInfo,
                     });
                 }

             });
     };

     // 点击展开项列表
     onExpand=(expanded,record,index)=>{
         // console.log(expanded,'日计划',record);
         const Selected = record.id;
         if(!expanded) {
             this.setState({Selected:''});
             return;
         }

         this.setState({Selected});
         let wwpdata = false;
         if(Selected) {
             wwpdata = record;
         }
         this.props.form.validateFields(['largeAreaId'],(err, values) => {
             // console.log('values',values);
             Api.post('weekWorkPackageManagerOperating/findSubTaskListByWwpaIdForEmpManager',{wwpaId:Selected,largeAreaId:values.largeAreaId,pageNow:1})
                 .then(res => {
                     console.log('res',res);
                     if(res.errorCode == 0) {
                         this.setState({
                             datas:res? res.data:[],
                             tableLoad:false,
                             wwpaId:Selected,
                             wwpdata:wwpdata,
                             page1:res.pageInfo,
                         });
                     }

                 });
         });


     };

    handleChange=(value)=>{
        Api.post('weekWorkPackageManagerOperating/findSubTaskListByWwpaIdForEmpManager',{wwpaId:this.state.wwpaId,largeAreaId:value,pageNow:1})
            .then(res => {
                // console.log('res',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        // wwpaId:Selected,
                        // wwpdata:wwpdata,
                        page1:res.pageInfo,
                    });
                }

            });
    };

    onRowDoubleClick=(record, index, event)=>{
        const Selected = record.id;
        this.setState({Selected});
        let wwpdata = false;
        if(Selected) {
            wwpdata = record;
        }
        this.props.form.validateFields(['largeAreaId'],(err, values) => {
            // console.log('values',values);
            Api.post('weekWorkPackageManagerOperating/findSubTaskListByWwpaIdForEmpManager',{wwpaId:Selected,largeAreaId:values.largeAreaId,pageNow:1})
                .then(res => {
                    // console.log('res',res);
                    if(res.errorCode == 0) {
                        this.setState({
                            datas:res? res.data:[],
                            tableLoad:false,
                            wwpaId:Selected,
                            wwpdata:wwpdata,
                            page1:res.pageInfo,
                        });
                    }

                });

        });
    };



     // 经理查询可安排一线员工
     FirstEmpFindModal = (e,record) => {
         if(e.checkState=='F'){
             message.error('！！！请先审批工作包');
         }else {
             this.setState({
                 FirstEmpVisible: true
             });
         }

     };
     FirstEmpCancel = () => {
         this.setState({
             FirstEmpVisible:false
         });
         // console.log('aa',this.state.wwpaId);
         this.props.form.validateFields(['largeAreaId'],(err, values) => {
             // console.log(values);
             Api.post('weekWorkPackageManagerOperating/findSubTaskListByWwpaIdForEmpManager',{wwpaId:this.state.wwpaId,largeAreaId:values.largeAreaId,pageNow:1})
                 .then(res => {
                     // console.log('res',res);
                     if(res.errorCode == 0) {
                         this.setState({
                             datas:res? res.data:[],
                             tableLoad:false,
                             page1:res.pageInfo,
                         });
                     }

                 });

         });
     };

// 生产线经理审批所属他的工作包日计划
    changeAuditing = (e,record,value) => {
         // console.log('aaa',record.id,value);
         if(value){
             // console.log('aaa',record.id,value);
             Api.post('weekWorkPackageManagerOperating/checkWwpaByEmpManager',{
                 'wwpaId':record.id,
                 'checkState':value,
             }).then(res=>{
                 // console.log(res);
                 if(res.errorCode=='0'){
                     message.success('审核成功！');
                     this.update();
                 }else{
                     message.error('审核失败！');
                 }
             })
         }

     };

     componentWillMount () {
         const airplaneArea =[];
         Api.post('dataDict/findDataDictByCode',{'dictCode':'AIR_AREA'}).then(res=>{
             // console.log(res);
             for (let i=0;i<res.data.length;i++){
                 airplaneArea.push({
                     value: res.data[i].id,
                     label: res.data[i].dictName,
                 });
             }
             this.setState({
                 airplaneArea:airplaneArea
             });
         });
     }
//将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
         return Y+M+D
     };

    update(){
        this.setState({
            tableLoading:true
        });
        this.props.form.validateFields(['executeTime','largeAreaId'],(err, values) => {
            if(!err){
                if(values.executeTime!=null){
                    Api.post('weekWorkPackageManagerOperating/findWwpaByEmpManagerWorkDay',{
                        'executeStartTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                        'executeEndTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                    }).then(res=>{
                        // console.log(res);
                        this.setState({
                            data:res? res.data:[],
                            page:res.pageInfo,
                            executeStartTime:values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                            executeEndTime:values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                            tableLoading:false
                        });
                    })
                }else {
                    message.warning('您未输入任何时间');
                    this.setState({
                        data:[],
                        tableLoading:false
                    });
                }

            }else {
                this.setState({
                    data:[],
                    tableLoading:false
                });
            }

        });
    };


// 生产线经理查询所属他的工作包日计划
    handleSearch = (e) => {
        e.preventDefault();
        // this.update();
        this.setState({
            tableLoading:true
        });
        this.props.form.validateFields(['executeTime','largeAreaId'],(err, values) => {
            if(!err){
                if(values.executeTime!=null){
                    Api.post('weekWorkPackageManagerOperating/findWwpaByEmpManagerWorkDay',{
                        'executeStartTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                        'executeEndTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                    }).then(res=>{
                        // console.log(res);
                        this.setState({
                            data:res? res.data:[],
                            page:res.pageInfo,
                            executeStartTime:values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                            executeEndTime:values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
                            tableLoading:false
                        });
                    })
                }else {
                    message.warning('您未输入任何时间');
                    this.setState({
                        data:[],
                        tableLoading:false
                    });
                }

            }else {
                this.setState({
                    data:[],
                    tableLoading:false
                });
            }

        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
    };


// 分页查询
   onChange = (pageNumber) => {
        // console.log('Page: ', pageNumber);
       this.props.form.validateFields(['executeTime'],(err, values) => {
           // console.log('Received values of form: ', values.executeTime.format('YYYY-MM-DD'));
           Api.post('weekWorkPackageManagerOperating/findWwpaByEmpManagerWorkDay',{
               'executeEndTime':this.state.executeEndTime,
               'executeStartTime':this.state.executeStartTime,
               'pageNow':pageNumber
           }).then(res=>{
               this.setState({
                   data:res? res.data:[],
                   page:res.pageInfo
               });
           })
       });
    };
    Dates=()=>{
        let now = new Date().getTime();
        let tomorrow = new Date(Number(now) + 24 * 3600 * 1000);
        let year = tomorrow.getFullYear();
        let month = tomorrow.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = tomorrow.getDate();
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day;
        // console.log('result',result);
    };


    render(){
        const airplaneArea =this.state.airplaneArea;
        const expandedRowRender=this.expandedRowRender;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data ,tableLoading,FirstEmpVisible,page,pageNow,Selected,FirstEmpLookVisible} =this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        return(
            <div>
                <Spin spinning={this.state.loadings} delay={500} >
                <div className="header work-package">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="可执行工作包日计划查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={3}>
                                <FormItem {...formItemLayout} label={`工作日时间`}>
                                    {getFieldDecorator(`executeTime`,{
                                    initialValue:moment(this.Dates(), dateFormat),
                                    })(
                                        <DatePicker placeholder=""/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={`大区域`}>
                                    {getFieldDecorator(`largeAreaId`,{
                                        rules: [{ required: true, message: '大区域不能为空!' }],
                                    })(
                                        <Select onChange={this.handleChange}>
                                            {
                                                airplaneArea.map((s,v)=>
                                                    <Option key={v} value={s.value}>{s.label}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>

                            </Col>
                        </Row>
                        {/*<Row>*/}
                            {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                {/*<Button type="primary" htmlType="submit">查询</Button>*/}

                            {/*</Col>*/}
                        {/*</Row>*/}
                    </Form>
                </div>
                <div className="content">
                    <div style={{width:'100%'}}>
                        <Modal
                            title="工卡人员安排"
                            visible={FirstEmpVisible}
                            onCancel={this.FirstEmpCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                            width="80%"
                        >
                            <FirstEmpCheck  wwpdata={this.state.wwpdata} wwpSelect={this.state.selectedRows}/>
                        </Modal>
                        <Modal
                            title="员工安排查看"
                            visible={FirstEmpLookVisible}
                            onCancel={this.FirstEmpLookCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                            width="50%"
                        >
                            <EmpLook  Emps={this.state.Emps} />
                        </Modal>

                    </div>

                    <Table
                        rowKey='id'
                        loading={tableLoading}
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        expandedRowRender={expandedRowRender}
                        onExpand={this.onExpand}
                        expandedRowKeys={[Selected]}
                        bordered
                        size="middle"
                        className='table'
                        onRowDoubleClick={this.onRowDoubleClick}
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
                </Spin>
            </div>
        )
    }
}
const DayPlans = Form.create()(DayPlan);
export default DayPlans;


