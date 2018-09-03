import './index.css'
import React from 'react';
import {
    Form,
    Input,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    message,
    Upload,
    Icon ,
    Spin,
    notification,
    Popconfirm
} from 'antd';
import {  Row, Col} from 'antd';
import Establish from './Establish';
import UpdateWwpTemplate from './UpdateWwpTemplate';
import AddWwpTemplate from './AddWwpTemplate';
import Api from '../../../api/request';
import TimeConversions from '../../../utils/TimeConversion';
// import {urlDownload} from '../../../utils/UrlDownLoad';
import { Tabs } from 'antd';
import Pagination from '../../../components/Pagination';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

let modalKey = 0;   //  用于重置modal

//  url
const findByCondition = 'weekWorkPackage/findByCondition';
const findBattleLine = 'weekWorkPackage/findBattleLine';
const changeInterfaceState = 'interfaceInfo/changeInterfaceState';
const findInterfaceById = 'interfaceInfo/findInterfaceById';
let urlDownload = UrlDownload;
// 工作包管理
class WorkPackageMould extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            details:false,
            establish:false,
            TaskPlanVisible:false,
            TaskPlan:false,
            DayPlanVFindisible:false,
            TaskDayPlanVFindisible:false,
            WorkCardPNVisible:false,
            WorkPlansCheck:false,
            data: [],
            tableLoading:true,
            tableLoad:true,
            tableLoad1:true,
            Line:[],
            isUpdate:false,
            DayPlans:false,
            TaskDayPlans:false,
            updateState:false,
            searchCriteria:{},
            page:{},
            page1:{},
            pageNow:1,
            datas:[],
            empdata:[],
            empdata1:[],
            Selected:'',
            WorkCardPN:false,
            TaskPlanDay:'',
            isFind:false,
            Find:false,
            selectedRowKeys: [],
            Selected1:'',
            datas1:[],
            taskListdata:false,
            loadings:false,
            fileList: [],
            fileList1: [],
            uploading: false,
            visible:false,
            visible1:false,
            WwpTemplate:false,
        };

        this.columns = [{
            title: '工作包模版名称',
            dataIndex: 'tptName',
            key: 'tptName',
        }, {
            title: '工作包模版级别',
            dataIndex: 'tptLevel',
            key: 'tptLevel',
        },{
            title: '备注',
            dataIndex: 'tptRemark',
            key: 'tptRemark',
        },{
            title: '状态',
            dataIndex: 'tptState',
            key: 'tptState',
            className:this.props.wwpdata?'hidden':'show',
            render: (text, record,index) => (
                <Select
                    defaultValue={record.tptState}
                    style={{ width: 70}}
                    onSelect={(value,e)=>this.changeListState(e,record,value)}

                >
                    <Option value="T" >有效</Option>
                    <Option value="F" >无效</Option>
                </Select>

            )
        }, {
            title: '操作',
            key: 'action',
            className:this.props.wwpdata?'hidden':'show',
            render: (text, record,index) => {
                const upload1= {
                    customRequest:(obj) => {
                        // console.log(obj);
                        Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                            .then(res => {
                                this.setState({
                                    loadings:true
                                });
                                if(res.errorCode == 0) {
                                    Api.post('weekWorkPackageTemplate/executePlanBatchImport',{importFileName:res.data,wwptId:record.id})
                                        .then(res => {
                                            if(res.errorCode == 0) {
                                                notification.open({
                                                    message: '上传成功',
                                                    description: res.data,
                                                });
                                                this.setState({
                                                    uploading: false,
                                                    loadings:false
                                                });
                                                Api.post('weekWorkPackageTemplate/findStlTemplateByCondition',{wwptId:record.id,pageNow:1})
                                                    .then(res => {
                                                        // console.log('工卡清单',res);
                                                        if(res.errorCode == 0) {
                                                            this.setState({
                                                                datas:res? res.data:[],
                                                                tableLoad:false,
                                                                page1:res.pageInfo,
                                                                wwptId:record.id,
                                                                pageNow:this.state.pageNow
                                                            });
                                                        }
                                                    });
                                            } else if(res.errorCode == 1) {
                                                notification.open({
                                                    message: '上传失败',
                                                    description: res.data,
                                                });
                                                this.setState({
                                                    uploading: false,
                                                    loadings:false
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
                        <span className="action">
                            <Upload {...upload1}>
                                <a >
                                    <Icon type="upload" /> 导入工卡执行计划
                                </a>
                            </Upload>
                            <span className="ant-divider" />
                            <a type="primary" onClick={()=>this.UpdateWwpTemplate(record)}>修改</a>
                            <span className="ant-divider" />
                            <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                        </span>
                )
            },
        }];


// 工卡明细
        this.expandedRowRender = () => {
            const columns = [
                { title: '序号', dataIndex: 'seqNo', key: 'seqNo'},
                { title: '工卡号', dataIndex: 'subTaskNo', key: 'subTaskNo' },
                { title: '工卡内容', dataIndex: 'content', key: 'content' },
                { title: '备注', dataIndex: 'remark', key: 'remark' },
            ];
            // const state = this.state;

            const expandedRowRender1=this.expandedRowRender1;
            return (
                <div>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={this.state.datas}
                        pagination={false}
                        loading={this.state.tableLoad}
                        expandedRowRender={expandedRowRender1}
                        onExpand={this.onExpand1}
                        expandedRowKeys={[this.state.Selected1]}
                        bordered
                        size="middle"
                    />
                    <Pagination
                        {...this.state.page1}
                        onChange={this.onChange1}
                    />
                </div>
            );
        };

// 工卡安排
        this.expandedRowRender1 = () => {
            const columns = [
                { title: '大区域', dataIndex: 'largeAreaName', key: 'largeAreaName'},
                { title: '小区域', dataIndex: 'smallArea', key: 'smallArea'},
                { title: '区域备注', dataIndex: 'remarkArea', key: 'remarkArea'},
                { title: '执行日', dataIndex: 'executeDayNum', key: 'executeDayNum' },
                { title: '执行日说明', dataIndex: 'executeDayRemark', key: 'executeDayRemark' },
            ];

            return (
                <div>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={this.state.datas1}
                        pagination={false}
                        loading={this.state.tableLoad1}
                        bordered
                        size="middle"
                    />
                </div>
            );
        };
    }

// 工作包模板删除
    delete=(e)=> {
        Api.post('weekWorkPackageTemplate/addOrUpdateWwpTemplate',{wwptId:e.id,tptName:e.tptName,tptLevel:e.tptLevel,tptRemark:e.tptRemark,tptState:'D'})
            .then(res => {
                if(res.errorCode=='0'){
                    message.success('删除成功！');
                    this.update();
                }else{
                    message.error('删除失败：'+res.errorMsg);
                }

            });
    };
    cancel=(e)=> {

    };
// 修改状态
    changeListState = (e,record,value) => {
        if(value){
            Api.post('weekWorkPackageTemplate/addOrUpdateWwpTemplate',{wwptId:record.id,tptName:record.tptName,tptLevel:record.tptLevel,tptState:value,tptRemark:record.tptRemark
            }).then(res=>{
                if(res.errorCode=='0'){
                    message.success('修改成功！');
                    this.update();
                }else{
                    message.error('修改失败！');
                }
            })
        }

    };

// 修改工作包模板的Modal
    UpdateWwpTemplate = (record) => {
        let WwpTemplate = false;
        if(record.id) {
            WwpTemplate = record;
        }
        this.setState({
            visible: true,
            WwpTemplate:WwpTemplate,
        });
    };
    WwpTemplateCancel = (e) => {
        this.update();
        this.setState({
            visible: false,
        });
    };
// 新增工作包模板的Modal
    AddWwpTemplate = () => {
        this.setState({
            visible1: true,
        });
        this.update();
    };
    AddWwpTemplateCancel = (e) => {
        this.update();
        this.setState({
            visible1: false,
        });
    };

// 导入工作包工卡执行计划
    managerEmpCheck = (record) => {
        let isFind = false;
        if(record.id) {
            isFind = record;
        }

        this.setState({
            isFind:isFind,
            managerEmpCheck: true
        });
    };
    managerCancel = () => {
        this.setState({
            managerEmpCheck:false
        });

    };


// 工卡点击展开项列表
    onExpand1=(expanded,record,index)=>{
        const Selected1 = record.id;
        if(!expanded) {
            this.setState({Selected1:''});
            return;
        }

        this.setState({Selected1});
        let taskListdata = false;
        if(Selected1) {
            taskListdata = record;
        }
        Api.post('weekWorkPackageTemplate/findStlArrTemplateByCondition',{stltId:Selected1})
            .then(res => {
                // console.log('工卡清单明细',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas1:res? res.data:[],
                        tableLoad1:false,
                        taskListdata:taskListdata
                    });
                }

            });

    };


// 监听工作包是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };

// 分页查询
    onChange1 = (pageNumber) => {
        Api.post('weekWorkPackageTemplate/findStlTemplateByCondition',{wwptId:this.state.wwptId, pageNow:pageNumber})
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

//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    componentWillMount () {
            this.setState({
                tableLoading:true
            });
            Api.post('weekWorkPackageTemplate/findWwpTemplateByCondition',{tptState:'T'}).then(res=>{
                if(res.errorCode == 0) {
                    this.setState({
                        data: res.data,
                        tableLoading:false,
                        page:res.pageInfo,
                    });
                }
            });

    }
// 点击展开项列表
    onExpand=(expanded,record,index)=>{
        // console.log('工作包',record);
        const Selected = record.id;
        if(!expanded) {
            this.setState({Selected:''});
            return;
        }

        this.setState({Selected});


        Api.post('weekWorkPackageTemplate/findStlTemplateByCondition',{wwptId:Selected,pageNow:1})
            .then(res => {
                console.log('工卡清单',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        page1:res.pageInfo,
                        wwptId:Selected,
                        pageNow:this.state.pageNow
                    });
                }

            });

    };


 // 创建周计划modal
    establish = (record) => {
        let isUpdate = false;
        if(record.id) {
            isUpdate = record;
        }
        this.setState({
            isUpdate:isUpdate,
            establish: true
        });
    };
    establishCancel = () => {
        this.setState({
            establish:false
        });
        if(sessionStorage.WorkPackage) {
            this.update();
            sessionStorage.clear('WorkPackage');
        }
    };

  // 更新页面数据
    update(){
        this.props.form.validateFields((err, values) => {
            this.setState({
                tableLoading:true
            });
            Api.post('weekWorkPackageTemplate/findWwpTemplateByCondition',values).then(res=>{
                if(res.errorCode == 0) {
                    this.setState({
                        data: res.data,
                        tableLoading:false,
                        page:res.pageInfo,
                        searchCriteria:values
                    });
                }
            })
        });

    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.update();
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };

    change=(expandedRows)=>{
      // console.log(expandedRows);
    };
// 分页查询
    onChange = (pageNumber) => {
        let values = this.state.searchCriteria;
        // values.pageNow = pageNumber;
        Api.post('weekWorkPackageTemplate/findWwpTemplateByCondition',{values,'pageNow':pageNumber}).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    tableLoading:false,
                    // pageNow:pageNumber
                });
            }
        })
    };


// 选择工作包模板后保存
    TaskPlanSave=()=>{
        const value=this.props.wwpdata;
        Api.post('weekWorkPackage/wwpTemplateProcess',{wwpId:value.id,templateWwpId:this.state.selectedRowKeys}).then(res=>{
            if(res.errorCode == 0) {
             message.success('工作包模版方式批量安排成功！');
            }else {
             message.error('!!!工作包模版方式批量安排失败');
            }
        })
    };



    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const expandedRowRender=this.expandedRowRender;
        const {data , tableLoading, establish, isUpdate, page,pageNow, Selected,visible,visible1} = this.state;
        // const { uploading } = this.state;
        // const upload = {
        //     customRequest:(obj) => {
        //         // console.log(obj);
        //         Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
        //             .then(res => {
        //                 // console.log('go',res);
        //                 if(res.errorCode == 0) {
        //                     Api.post('weekWorkPackageTemplate/wwpTemplateBatchImport',{importFileName:res.data})
        //                         .then(res => {
        //                             // console.log('导入后',res);
        //                             if(res.errorCode == 0) {
        //                                 notification.open({
        //                                     message: '上传成功',
        //                                     description: res.data,
        //                                 });
        //                                 this.update();
        //                                 this.setState({
        //                                     uploading: false,
        //                                 });
        //                             } else if(res.errorCode == 1) {
        //                                 notification.open({
        //                                     message: '上传失败',
        //                                     description: res.data,
        //                                 });
        //                                 this.setState({
        //                                     uploading: false,
        //                                 });
        //                             }
        //                         })
        //
        //                 } else {
        //                     message.error('文件上传服务器失败');
        //                 }
        //             });
        //
        //     },
        //     showUploadList:false,
        //     onChange: (fileList) => {
        //         // console.log(fileList);
        //     }
        // };
        modalKey++;
        const value=this.props.wwpdata;
        return(
            <div>
                <Spin spinning={this.state.loadings} delay={500} >
                <div className="header work-package">

                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>

                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={1} >
                                <FormItem {...formItemLayout} label={`工作包模版名称`}>
                                    {getFieldDecorator(`tptName`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`工作包模版级别`}>
                                    {getFieldDecorator(`tptLevel`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3}>
                                <FormItem
                                    {...formItemLayout}
                                    label="状态"
                                >
                                    {getFieldDecorator('tptState',{
                                        initialValue: 'T',
                                    })(
                                        <Select >
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4} style={{display:'none'}}>
                                <FormItem {...formItemLayout} label={`页码`}>
                                    {getFieldDecorator(`pageNow`,{
                                        initialValue:pageNow,
                                    })(
                                        <input />
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
                    <div style={{width:'100%',height:'40px'}}>
                        <div>
                            <div style={{float: 'left',display:value?'none':'block'}}>
                                <Button  onClick={()=>this.AddWwpTemplate()} className="btn_reload"><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>
                                <a href={urlDownload+'uploadTemplate/WWP_STL_TEMPLATE.xlsx'} target="_blank"><Button  className="btn_reload" style={{marginRight:'10px'}}><Icon type="download" style={{color: '#108ee9' }} />工卡执行计划模板下载</Button></a>
                            </div>
                            <div style={{float: 'left',display:value?'block':'none'}}>
                                    <Button  onClick={this.TaskPlanSave} className="btn_reload">保存</Button>
                            </div>
                            <Button type="primary" onClick={this.establish} style={{display:'none'}}>创建</Button>
                        </div>

                        <Modal
                            title="创建周计划"
                            visible={establish}
                            onCancel={this.establishCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key2`}
                        >
                            <Establish isUpdate={isUpdate}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={visible}
                            onCancel={this.WwpTemplateCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key3`}
                        >
                            <UpdateWwpTemplate WwpTemplate={this.state.WwpTemplate}  onCancel={this.WwpTemplateCancel}/>
                        </Modal>
                        <Modal
                            title="新建"
                            visible={visible1}
                            onCancel={this.AddWwpTemplateCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key4`}
                        >
                            <AddWwpTemplate onCancel={this.AddWwpTemplateCancel}/>
                        </Modal>
                    </div>

                    <Table rowKey='id'
                           loading={tableLoading}
                           columns={columns}
                           dataSource={data}
                           pagination={false}
                           expandedRowRender={expandedRowRender}
                           onExpand={this.onExpand}
                           expandedRowKeys={[Selected]}
                           rowSelection={value?rowSelection:undefined}
                           bordered
                           size="middle"
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
const WorkPackageMoulds = Form.create()(WorkPackageMould);
export default WorkPackageMoulds;


