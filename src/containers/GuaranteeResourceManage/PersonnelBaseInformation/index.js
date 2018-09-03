import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Select,Pagination,message,Icon,Spin,Upload,notification} from 'antd';
import {  Row, Col} from 'antd';
import UpdateUserList from './UpdateEmployee';
import StaffAttendanceManage from '../../GuaranteeResourceManage/StaffAttendanceManage';
import AddUserList from './AddEmployee';
const Option = Select.Option;
import QualifiedEmpowerAdd from './QualifiedEmpowerAdd';
import QualifiedEmpowerUpdate from './QualifiedEmpowerUpdate';
import LoginManage from './LoginManage';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


let modalKey = 0;   //  用于重置modal
let urlDownload = UrlDownload;

// 人员信息管理
class PersonnelBaseInformation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            StaffAttendanceModal:false,
            update:false,
            updateEmpower:false,
            loginModal:false,
            loginCondition:{},
            visibleEmpowerUpdate:false,
            data: [],
            battleLine:[],
            count:0,
            datas: [],
            names:'',
            UpdateData: [],
            loading:true,
            userName: '',
            pageNow:1,
            EmpowerInformation:false,
            loadings:false,
            StaffAttendance:false
        };
        this.columns = [{

            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: 'E账号',
            dataIndex: 'empEaccount',
            key: 'empEaccount',
        }, {
            title: '编号',
            dataIndex: 'empNo',
            key: 'empNo',
        }, {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
        }, {
            title: '专业',
            dataIndex: 'specialty',
            key: 'specialty',
        }, {
            title: '分线',
            dataIndex: 'battleLineName',
            key: 'battleLineName',
        // }, {
        //     title: '授权情况',
        //     dataIndex: 'authInfo',
        //     key: 'authInfo',
        //     render:(text,record) => {
        //         const state = record.authInfo;
        //         // console.log(state);
        //         if(state == 'T'){
        //             return <span>有</span>
        //         }else if(state == 'F'){
        //             return <span>无</span>
        //         }
        //     }
        }, {
            title: '员工状态',
            dataIndex: 'empState',
            key: 'empState',
            render:(text,record) => {
                const state = record.empState;
                // console.log(state);
                if(state == 'T'){
                    return <span>正常</span>
                }else if(state == 'R'){
                    return <span>离职/调走</span>
                }
            }
        }, {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record) => {
                const time = this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        }, {
            title: '修改人',
            dataIndex: 'updateName',
            key: 'updateName',
        }, {
            width:200,
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <div>
                    {
                        // text.authInfo=='T'?(
                            <span>
                                <a onClick={()=>this.showModal(index)}>修改</a>
                                <span className="ant-divider" />
                                <a onClick={()=>this.QualifiedEmpower(record)}>资质授权管理</a>
                                <span className="ant-divider" />
                            <a onClick={(e)=>this.synchro(e,record,record.orderId)}>同步</a>
                            </span>
                        // ):
                        //     <span>
                        //         <a onClick={()=>this.showModal(index)}>修改</a>
                        //         <span className="ant-divider" />
                        //     <a onClick={(e)=>this.synchro(e,record,record.orderId)}>同步</a>
                        //     </span>
                    }
                    <span>
                        <span className="ant-divider" />
                        <a onClick={()=>this.LoginManageShow(record,index)}>登陆信息管理</a>
                         <span className="ant-divider" />
                        <a onClick={()=>this.StaffAttendanceShow(record,index)}>考勤</a>
                    </span>
                </div>
            ),
        }];

        this.column = [{
            title: '授权类别',
            dataIndex: 'sortName',
            key: 'sortName',
            width:'10%'
        }, {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName',
            width:'10%'
        }, {
            title: '专业',
            dataIndex: 'areaName',
            key: 'areaName',
            width:'5%'
        }, {
            title: '区域',
            dataIndex: 'areaName1',
            key: 'areaName1',
            width:'5%'
        }, {
            title: '机型',
            dataIndex: 'actypeName',
            key: 'actypeName',
            width:'10%',
        }, {
            title: '授权日期',
            dataIndex: 'accreditDate',
            key: 'accreditDate',
            width:'10%',
            render:(text,record) => {
                const time =record.accreditDate!=null? this.changetime(record.accreditDate):'';
                return <span>{time}</span>
            }
        }, {
            title: '授权结束日期',
            dataIndex: 'accreditEndDate',
            key: 'accreditEndDate',
            width:'10%',
            render:(text,record) => {
                const time =record.accreditEndDate!=null? this.changetime(record.accreditEndDate):'';
                return <span>{time}</span>
            }
        }, {
            title: '编号',
            dataIndex: 'seal',
            key: 'seal',
            width:'10%',
        }, {
            title: '有效期',
            dataIndex: 'validityName',
            key: 'validityName',
            width:'10%',
        }, {
            title: '外航空公司授权的公司名称',
            dataIndex: 'companyName',
            key: 'companyName',
            width:'10%',
        }, {
            title: '形式',
            dataIndex: 'fomateName',
            key: 'fomateName',
            width:'10%',
        // }, {
        //
        //     title: '操作',
        //     key: 'action',
        //     render: (text, record,index) => (
        //         <span>
        //             <a  onClick={()=>this.UpdateModalEmpower(record)}>修改</a>
        //         </span>
        //     ),
        }];

    }

    //  资质授权同步
    synchro = (e,_,index,record,id) => {
        this.setState({
            loadings:true
        });
        // console.log('record',_);
        const _this = e.target;
        _this.innerHTML = '同步中';
        _this.className = 'disabled';
        // if(_.orderId){
        //     message.success('你已同步过，现在继续同步');
            this.setState({
                // loadings:false,
                loadings:true
            });
            Api.post('employeeAuth/employeeAuthSync',{employeeInfoId:_.id,empEaccount:_.empEaccount})
                .then(res => {
                    // console.log('res',res);
                    this.setState({
                        loadings:false,
                    });
                    _this.innerHTML = '同步';
                    _this.className = '';
                    if(res.errorCode == 0) {
                        message.success('同步成功');
                        // _.orderId = true;
                    } else if (res.errorCode == 1) {
                        message.error('失败:'+res.errorMsg);
                    } else {
                        message.warning('服务器请求超时，请重试');
                    }
                });
        // }else {
        //     Api.post('employeeAuth/employeeAuthSync',{wwpId:_.id,commandNo:_.commandNo})
        //         .then(res => {
        //             _this.innerHTML = '同步';
        //             _this.className = '';
        //             if(res.errorCode == 0) {
        //                 this.setState({
        //                     loadings:false,
        //                 });
        //                 message.success('同步成功');
        //                 // _.orderId = true;
        //             } else if (res.errorCode == 1) {
        //                 this.setState({
        //                     loadings:false
        //                 });
        //                 message.error('失败:'+res.errorMsg);
        //             } else {
        //                 message.warning('服务器请求超时，请重试');
        //             }
        //         });
        // }


        //console.log(_this,_,index)
    };

    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

// 人员登陆信息管理 2017-08-17 by jianyong
    LoginManageShow = (record,index) => {
        this.setState({
            loginModal:true,
            loginCondition:record
        })
    };
    LoginManageClose = _ => {
        this.update();
        this.setState({
            loginModal:false
        })
    };
    // 人员考勤
    StaffAttendanceShow = (record,index) => {
        let StaffAttendance = false;
        if(record.id) {
            StaffAttendance = record;
        }
        this.setState({
            StaffAttendanceModal:true,
            StaffAttendance:StaffAttendance
        });
        // Api.post('attendance/findAttendanceByCondition').then(res=>{
        //     console.log('res.data',res);
        // //
        // });



    };
    StaffAttendanceClose = _ => {
        this.setState({
            StaffAttendanceModal:false
        })
    };

// 人员资质授权管理Modal
    QualifiedEmpower = (record) => {
        // console.log('record',record);
        let EmpowerInformation = false;
        if(record.id) {
            EmpowerInformation = record;
        }
        // const { data } = this.state;
        // // console.log(data[index]);
        // const EmpowerInformation=[];
        // EmpowerInformation.push(data[index]);
        //  console.log('EmpowerInformation',record);
        Api.post('employeeAuth/findEmployeeAuthByEmpId',{'employeeInfoId':record.id}).then(res=>{
                   // console.log('res.data',res);

            this.setState({
                EmpowerVisible: true,
                datas:res? res.data:[],
                loading:false,
                EmpowerInformation:EmpowerInformation
            });
        });
        //人员资质授权明细页分页查询
        // this.onChangePage = (pageNumber) => {
        //     // console.log('Page: ', pageNumber);
        //     Api.post('employeeAuth/findEmployeeAuthByEmpId',{'employeeInfoId':data[index].id,'pageNow':pageNumber}).then(res=>{
        //         // console.log(res);
        //         this.setState({
        //             datas:res? res.data:[],
        //             currentPageEmpower:parseInt(res.pageInfo.currentPage),
        //             totalSizeEmpower:parseInt(res.pageInfo.totalSize),
        //         });
        //     })
        //
        // };
    };


// 权限ID查询
//     handleSubmitID = (e) => {
//         e.preventDefault();
//         this.props.form.validateFields(['employeeAuthId'],(err, values) => {
//             // console.log('employeeAuthId: ', values);
//             if(values.employeeAuthId!=undefined||values.employeeAuthId!=null){
//                 Api.post('employeeAuth/findEmployeeAuthById',{'employeeAuthId':values.employeeAuthId}).then(res=>{
//                     // console.log(res);
//                     let datas =res? [res.data]:[];
//                     this.setState({
//                         datas: datas,
//                     });
//                 })
//             }else{}
//
//         });
//     };

// 修改员工授权的Modal
//     UpdateModalEmpower = (index) => {
//         const { datas } = this.state;
//         const UpdateEmpowerinformation=[];
//         UpdateEmpowerinformation.push(datas[index]);
//         // console.log('UpdateEmpowerinformation',datas[index]);
//         this.setState({
//             visibleEmpowerUpdate: true,
//              UpdateEmpowerinformation:UpdateEmpowerinformation
//         });
//
//     };

// 更新用户的Modal
    showModal = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        // console.log('information',information);
        this.setState({
            visible: true,
            information:information
        });

    };
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };

// 新增员工资质授权
    showModalEmpower = () => {
        this.setState({
            updateEmpower: true,
        });
    };
// 更新页面数据
    update(){
        Api.post('employeeInfo/findEmployeeByCondition',{'pageNow':this.state.pageNow}).then(res=>{
            // console.log('res',res);
                this.setState({
                    data:res? res.data:[],
                    currentPage:parseInt(res.pageInfo.currentPage),
                    // totalPageSize:parseInt(res.pageInfo.totalPageSize),
                    totalSize:parseInt(res.pageInfo.totalSize),
                    loading:false,
                })
        })
    }
// 页面数据加载及分线授权查询方法
    componentDidMount(){
        this.update();
    }
// 人员资质授权Cancel
    EmpowerCancel = (e) => {
            this.setState({
                EmpowerVisible: false,
            });
        this.props.form.resetFields();
    };

    handleCancel = (e) => {
        this.update();
        this.setState({
            visible: false,
        });
    };
    handleCancelAdd = (e) => {
        this.update();
        this.setState({
            update:false
        });
    };
    // 新增或修改后数据更新
//     EmpowerUpdate(){
//         const data=this.state.EmpowerInformation;
//         Api.post('employeeAuth/findEmployeeAuthByEmpId',{'employeeInfoId':data[0].id}).then(res=>{
//             // console.log('res.data',res.data);
//             this.setState({
//                 datas:res? res.data:[],
//             });
//         });
//     }
// // 关闭新增员工资质授权
//     handleEmpower = (e) => {
//         this.EmpowerUpdate();
//         this.setState({
//             updateEmpower:false
//         });
//
//     };
// // 关闭修改员工资质授权
//     handleCancelEmpowerUpdate = (e) => {
//         this.EmpowerUpdate();
//             this.setState({
//                 visibleEmpowerUpdate:false
//             });
//
//     };

// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['empName','empNo','department','specialty','updateTime','authInfo','empState','pageNow'],(err, values) => {
            // console.log('Received values of form: ', values);
            Api.post('employeeInfo/findEmployeeByCondition',{
                'empName':values.empName,
                'empNo':values.empNo,
                'department':values.department,
                'authInfo':values.authInfo,
                'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'specialty':values.specialty,
                'pageNow':this.state.pageNow
            }).then(res=>{
                // console.log('res',res);
                this.setState({
                    empName:values.empName,
                    empNo:values.empNo,
                    department:values.department,
                    authInfo:values.authInfo,
                    updateTimeStart:values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    updateTimeEnd:values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                    specialty:values.specialty,
                    pageNow:this.state.pageNow,
                    data:res? res.data:[],
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalSize:parseInt(res.pageInfo.totalSize),
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
// 清除资质授权Modal内ID查询内容
    handleResetEmpower = () => {
        this.props.form.resetFields();
    };
// 分页查询
    onChange = (pageNumber) => {
        console.log('Page: ', pageNumber);
        this.props.form.validateFields(['empName','empNo','department','specialty','updateTime','authInfo','empState'],(err, values) => {
            // console.log('Received values of form: ', values);
            Api.post('employeeInfo/findEmployeeByCondition',{
                'empName':this.state.empName,
                'empNo':this.state.empNo,
                'department':this.state.department,
                'authInfo':this.state.authInfo,
                'updateTimeStart':this.state.updateTimeStart,
                'updateTimeEnd':this.state.updateTimeEnd,
                'specialty':this.state.specialty,
                'pageNow':pageNumber
            }).then(res=>{
                console.log(res);
                this.setState({
                    data:res? res.data:[],
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalSize:parseInt(res.pageInfo.totalSize),
                });
            })
        });

    };
// 验证员工编号是否重复
    emitEmpty = () => {
        this.props.form.resetFields();
    };

    // checkEmpNo = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFields(['EmpNo'],(err, values) => {
    //         // console.log('EmpNo: ', values.EmpNo);
    //         if(values.EmpNo!==undefined){
    //             Api.post('employeeInfo/checkEmpNo',{'empNo':values.EmpNo}).then(res=>{
    //                 // console.log(res.data);
    //                 if(res.errorCode=='0'){
    //                     message.success('员工编号未重复！');
    //                 }else {
    //                     message.warning('员工编号已存在！');
    //                 }
    //             })
    //         }else {
    //             message.warning('员工编号不能为空！');
    //         }
    //
    //     });
    // };

    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const form=this.props.form.getFieldValue('EmpNo');
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const column = this.column;
        const { data,loginModal,loginCondition,EmpowerInformation,StaffAttendanceModal,StaffAttendance} = this.state;
        const { datas } = this.state;
        const names=this.state.names;
        let a = Object.entries(datas);
        const suffix = form ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        // console.log(loginCondition);
        const upload = {
            customRequest:(obj) => {
                this.setState({
                    loadings:true
                });
                Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                    .then(res => {

                        if(res.errorCode == 0) {
                            Api.post('employeeInfo/importEmployeeInfo',{importFileName:res.data})
                                .then(res => {
                                    if(res.errorCode == 0) {
                                        this.setState({
                                            loadings:false
                                        });
                                        this.update();
                                        notification.open({
                                            message: '导入成功',
                                            description: res.data,
                                        });
                                    } else if(res.errorCode == 1) {
                                        this.setState({
                                            loadings:false
                                        });
                                        notification.open({
                                            message: '导入失败',
                                            description: res.data,
                                        });
                                    }
                                })
                        } else {
                            this.setState({
                                loadings:false
                            });
                            message.error('上传文件失败');
                        }
                    });
            },
            showUploadList:false,
            onChange: (fileList) => {
                console.log(fileList);
            }
        };

        return(
            <div>
                <Spin spinning={this.state.loadings} delay={500} >
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <div className="work-add">
                        <div style={{display: 'inline-block'}}>
                            <Upload {...upload}>
                                <Button className='btn_reload' style={{marginRight:'10px'}}>
                                    <Icon type="upload" /> 导入人员信息
                                </Button>
                            </Upload>
                        </div>
                        <a href={urlDownload+'uploadTemplate/EMPLOYEE_IMPORT_TEMPLATE.xlsx'} target="_blank"><Button className='btn_reload'><Icon type="download" />人员信息模板下载</Button></a>
                    </div>


                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={1} >
                                <FormItem {...formItemLayout} label={`姓名`}>
                                    {getFieldDecorator(`empName`,{
                                        // initialValue: [],
                                    })(
                                        <Input  />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`编号`}>
                                    {getFieldDecorator(`empNo`,{
                                        initialValue: [],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem {...formItemLayout} label={`部门`}>
                                    {getFieldDecorator(`department`,{
                                        initialValue: [],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4} >
                                <FormItem {...formItemLayout} label={`专业`}>
                                    {getFieldDecorator(`specialty`,{
                                        initialValue: [],
                                    })(
                                        <Input  />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5} style={{display:'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="授权情况"
                                >
                                    {getFieldDecorator('authInfo',{
                                        initialValue: [],
                                    })(
                                        <Select>
                                            <Option value="T">有</Option>
                                            <Option value="F">无</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {/*<Col span={6} key={6} >*/}
                                {/*<FormItem*/}
                                    {/*{...formItemLayout}*/}
                                    {/*label="员工状态"*/}
                                {/*>*/}
                                    {/*{getFieldDecorator('empState',{*/}
                                        {/*initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Cascader options={empState} placeholder=""/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            <Col span={8} key={7} >
                                <FormItem
                                    {...formItemLayout}
                                    label="更新时间段"
                                >
                                    {getFieldDecorator(`updateTime`,{
                                    })(
                                        <RangePicker placeholder=""/>
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
                    <Row style={{width:'100%'}} >
                        <Button className="editable-add-btn btn_reload"  onClick={this.showModalAdd} style={{float:'left'}}><Icon type="plus" />新增</Button>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                            <AddUserList onCancel={this.handleCancelAdd}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key={`${modalKey}keyb`}
                        >
                            <UpdateUserList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                        <Modal
                            title="登陆信息管理"
                            visible={loginModal}
                            onCancel={this.LoginManageClose}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key={`login${modalKey}`}
                            width="50%"
                        >
                            <LoginManage data={loginCondition}/>
                        </Modal>
                        <Modal
                            title="考勤"
                            visible={StaffAttendanceModal}
                            onCancel={this.StaffAttendanceClose}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}d`}
                            width="80%"
                        >
                            <StaffAttendanceManage StaffAttendance={StaffAttendance}/>
                        </Modal>
                        <Modal
                            title="人员资质授权管理"
                            visible={this.state.EmpowerVisible}
                            onCancel={this.EmpowerCancel}
                            maskClosable={false}
                            footer={null}
                            width='80%'
                        >
                            <div>
                                <div className="content">
                                    <Row type="flex" justify="start">
                                        <Col span={3} style={{fontSize:'16px',paddingBottom:'15px'}}>员工：{EmpowerInformation.empName}</Col>
                                        <Col span={5} style={{fontSize:'16px',paddingBottom:'15px'}}>员工编号：{EmpowerInformation.empNo}</Col>
                                        <Col span={5} style={{fontSize:'16px',paddingBottom:'15px'}}>E网账号：{EmpowerInformation.empEaccount}</Col>
                                        <Col span={11} style={{fontSize:'16px',paddingBottom:'15px'}}>所在岗位（机构）：{EmpowerInformation.department}</Col>
                                    </Row>
                                    <Row style={{}} type="flex" >
                                        {
                                            a.length>0?
                                            a.map((s,v)=>
                                                <Table key={v} columns={column} dataSource={s[1]} title={() => s[0]} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle" className='tableTitle'/>
                                            )
                                                :<div style={{color:'red'}}>无相关授权信息</div>
                                        }
                                    </Row>

                                    {/*<Table  columns={column} dataSource={datas} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle"/>*/}
                                    {/*<Pagination showQuickJumper defaultCurrent={this.state.currentPageEmpower} total={this.state.totalSizeEmpower} onChange={this.onChangePage}  showTotal={total => `合计 ${total} 条`}/>*/}
                                </div>
                            </div>
                        </Modal>
                    </Row>
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle"/>
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条` } />
                </div>
                </Spin>
            </div>
        )
    }
}
const PersonnelBaseInformations = Form.create()(PersonnelBaseInformation);
export default PersonnelBaseInformations;


