import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Popconfirm,Tabs,Row,Spin,Col,message,Select,Upload, Icon ,notification } from 'antd';
import UpdateUserList from './UpdateUserList';
import AddAirPlanInformation from './AddAirPlanInformation';
import AircraftModelInformation from '../../GuaranteeResourceManage/AircraftModelInformation';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Paginations from '../../../components/Pagination';

let modalKey = 0;   //  用于重置modal
function handleChange(value) {
    //console.log(`selected ${value}`);
}
function onChange(date, dateString) {
    console.log(date, dateString);
}


let urlDownload = UrlDownload;


class UserRoleManages extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            loadings:false,
            visible: false,
            visible1: false,
            update:false,
            data: [],
            search:false,
            updateState:false,
            searchCriteria:{},
            page:{},
            pageNow:1,
            children:[],
            selectedRowKeys: [],
        };
        this.columns = [{
            title: '机型',
            dataIndex: 'airplaneModel',
            key: 'airplaneModel'
        }, {
            title: '注册号',
            dataIndex: 'airplaneAcReg',
            key: 'airplaneAcReg'
        }, {
            title: '所有者',
            dataIndex: 'airplaneOwner',
            key: 'airplaneOwner'
        }, {
            title: 'IPC有效号',
            dataIndex: 'airplaneIpcCode',
            key: 'airplaneIpcCode'
        }, {
            title: 'MSN序号',
            dataIndex: 'airplaneSnSeq',
            key: 'airplaneSnSeq'
        }, {
            title: '初始出口适航证日期',
            dataIndex: 'airplaneCtaDate',
            key: 'airplaneCtaDate',
            render:(text,record,index) => {
                const time = this.changetime(record.airplaneCtaDate);
                return <span>{time}</span>
            }
        }, {
            title: '交付日期',
            dataIndex: 'airplaneDeliveryDate',
            key: 'airplaneDeliveryDate',
            render:(text,record,index) => {
                const time = this.changetime(record.airplaneDeliveryDate);
                return <span>{time}</span>
            }
        }, {
            title: '发动机型号',
            dataIndex: 'engineModel',
            key: 'engineModel'
        },{
            title: '责任人',
            dataIndex: 'airplaneOtoOperators',
            key: 'airplaneOtoOperators'
        },{
            title: '备注',
            dataIndex: 'remark',
            key: 'remark'
        },{
            title: '状态',
            dataIndex: 'airplaneState',
            key: 'airplaneState',
            render:(text,record,index) => {
                const state = record.airplaneState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }else if(state == 'D'){
                    return <span>删除</span>
                }
            }
        },{
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record,index) => {
                const time = this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        },{
            title: '操作',
            key: 'action',
            width:80,
            render: (text, record,index) => (
                <span>
                    <a onClick={()=>this.showModal(index)} >修改</a>
                      {/*<span className="ant-divider" />*/}
                    {/*<Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.deletes(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>*/}
                    {/*<a onClick={()=>this.deletes(index)} style={{color:'#e60012'}}>删除</a>*/}
                 </span>
            ),
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

    // state = {
    //     confirmDirty: false,
    //     autoCompleteResult: [],
    // };


    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    // 分页查询
    onChange = (pageNumber) => {
        //console.log('Page: ', pageNumber);
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        // this.setState({  //  此处有坑
        //    tableLoading:true
        // });
        Api.post('air/findAirByCondition',values).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    loading:false,
                    pageNow:pageNumber
                });
            // }
        })
    };


//删除
//     deletes = (e) => {
//         const { data } = this.state;
//         const aiId = e.id;
//         Api.post('air/deleteAirPlaneInfo',{'aiId':aiId}).then(res => {
//             if(res.errorCode=='0'){
//                 Api.post('air/findAirByCondition',{
//                     'airplaneModel':'',
//                     'airplaneSnSeq':'',
//                     'engineModel':'',
//                     'apuModel':'',
//                     'airplaneOwner':'',
//                     'remark':'',
//                     'updateTimeStart':'',
//                     'updateTimeEnd':''
//                 }).then(res=>{
//                     //console.log(values.airplaneModelId);
//                     this.setState({
//                         data: res.data
//                     });
//                     if(res.errorCode=='0'){
//                         message.success('删除成功！');
//                     }else{
//                         message.error('删除失败！');
//                     }
//                 });
//             }
//         });
//
//          //console.log('information',data[index]);
//     };
//     cancel=(e)=> {
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
        this.update();
    };
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true
        });
    };
    // 飞机机型管理的Modal
    AircraftModel = () => {
        this.setState({
            visible1: true
        });
    };
    handleCancel1 = (e) => {
        this.setState({
            visible1: false,
        });
    };
    // 更新页面数据
    update(){
        Api.post('air/findAirByCondition',{
            'airplaneModel':'',
            'airplaneSnSeq':'',
            'engineModel':'',
            'apuModel':'',
            'airplaneOwner':'',
            'remark':'',
            'updateTimeStart':'',
            'updateTimeEnd':'',
            'airplaneAcReg':''
        }).then(res => {
            this.setState({
                data: res.data,
                loading:false,
                page:res.pageInfo
            });
        });
        Api.post('air/findAllAirPlaneModel').then(res => {
            this.setState({
                children: res.data,
            });
        })
    }
    componentDidMount(){
        this.update();
    }
    handleCancel = (e) => {
        this.update();
        this.setState({
            visible: false,
        });
    };
    handleCancelAdd = (e) => {
         //console.log(e);
        this.setState({
            update:false
        });
        this.update();
    };
    // 飞机信息列表批量删除
    deletes = () => {
        Api.post('air/deleteAirPlaneInfoBatch',{ 'aiIds':this.state.selectedRowKeys}).then(res => {
            if(res.errorCode=='0'){
                // console.log('删除',res);
                if(res.errorCode=='0'){
                    message.success('删除成功！');
                    Api.post('air/findAirByCondition',{
                        'airplaneModel':'',
                        'airplaneSnSeq':'',
                        'engineModel':'',
                        'apuModel':'',
                        'airplaneOwner':'',
                        'remark':'',
                        'updateTimeStart':'',
                        'updateTimeEnd':''
                    }).then(res=>{
                        //console.log(values.airplaneModelId);
                        this.setState({
                            data: res.data
                        });

                    });
                }else{
                    message.error('删除失败！');
                }
            }
        });

        //console.log('information',data[index]);
    };
    cancel=(e)=> {

    };

// 多条件查询
    handleSearch = (e) => {
        this.setState({
            search:true
        });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log(values);
            let updateTimeStart = '';
            let updateTimeEnd =  '';
            if(values.updateTime == null){
                updateTimeStart = null;
                updateTimeEnd = null;
            }else{
                updateTimeStart = values.updateTime[0].format('YYYY-MM-DD');
                updateTimeEnd = values.updateTime[1].format('YYYY-MM-DD');
            }
            Api.post('air/findAirByCondition',{
                'airplaneModel':values.airplaneModel,
                'airplaneSnSeq':values.airplaneSnSeq,
                'engineModel':values.engineModel,
                'apuModel':values.apuModel,
                'airplaneOwner':values.airplaneOwner,
                'remark':values.remark,
                'updateTimeStart':updateTimeStart,
                'updateTimeEnd':updateTimeEnd,
                'airplaneState':values.airplaneState,
                'airplaneAcReg':values.airplaneAcReg
            }).then(res=>{
                // console.log('res',res);
                 this.setState({
                    data: res.data,
                     page:res.pageInfo,
                     loading:false,
                });
            });
           // console.log(values)
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
// 监听被选中飞机列表
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const { autoCompleteResult } = this.state;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data,page,pageNow,managerEmpCheck,children,selectedRowKeys} = this.state;
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 0,
                }
            }
        };
        const upload = {
            // action: 'http://192.168.130.208:8080/fileUpload/fileUploadCommonPost',
            // data: (obj) => {
            //     return {fileName:obj}
            // },
            customRequest:(obj) => {

                         this.setState({
                             loadings:true
                         });
                Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                    .then(res => {
                        console.log('res',res);
                        if(res.errorCode == 0) {
                            Api.post('air/batchImport',{importFileName:res.data})
                                .then(res => {

                                    if(res.errorCode == 0) {
                                        notification.open({
                                            message: '导入成功',
                                            description: res.data,
                                        });
                                        this.setState({
                                            loadings:false
                                        })
                                    } else if(res.errorCode == 1) {
                                        notification.open({
                                            message: '！！！导入失败',
                                            description: res.data,
                                        });
                                        this.setState({
                                            loadings:false
                                        })
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
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return(

          <div>
              <Spin spinning={this.state.loadings} delay={500} >
                <div className="header">

                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <div style={{position:'absolute',top:'10px',right:'10px'}}>
                        <div style={{display: 'inline-block'}}>
                            <Upload {...upload}>
                                <Button className='btn_reload' style={{marginRight:'10px'}}>
                                    <Icon type="upload" /> 导入飞机信息
                                </Button>
                            </Upload>
                        </div>
                        <a href={urlDownload+'uploadTemplate/AIRPLANE_INFO_IMPORT_TEMPLATE.xlsx'} target="_blank"><Button className='btn_reload'><Icon type="download" />飞机信息模板下载</Button></a>
                    </div>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={50}>
                            <Col span={8} key={1} style={{ height:47 }}>
                                <FormItem {...formItemLayout} label={'机型'}>
                                    {getFieldDecorator('airplaneModel')(
                                        <Select
                                            style={{ width: '100%' }}
                                            onChange={handleChange}
                                            allowClear={true}
                                        >
                                            {
                                                children.map((s,v)=><Option key={v} value={s.airPlaneModel}>{s.airPlaneModel}</Option>)
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2}>
                                <FormItem {...formItemLayout} label={'MSN序号'}>
                                    {getFieldDecorator('airplaneSnSeq')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3}>
                                <FormItem {...formItemLayout} label={'发动机型号'}>
                                    {getFieldDecorator('engineModel')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={'APU型号'}>
                                    {getFieldDecorator('apuModel')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5}>
                                <FormItem {...formItemLayout} label={'所有者'}>
                                    {getFieldDecorator('airplaneOwner')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={8}>
                                <FormItem {...formItemLayout} label={'状态'}>
                                    {getFieldDecorator('airplaneState')(
                                        <Select>
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={9}>
                                <FormItem {...formItemLayout} label={'注册号'}>
                                    {getFieldDecorator('airplaneAcReg')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={7}>
                                <FormItem {...formItemLayout} label={'更新起止时间'}>
                                    {getFieldDecorator('updateTime')(
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
                    <div style={{width:'100%',height:'40px'}}>
                        <Button className="editable-add-btn btn_reload" onClick={this.showModalAdd} style={{float:'left',marginRight:'10px'}}><Icon type="plus" />新增</Button>
                        <Button className="editable-add-btn btn_reload" onClick={this.AircraftModel} style={{float:'left',marginRight:'10px'}}><Icon type="file-excel" />飞机机型管理</Button>
                        <Popconfirm title="确认要删除吗?" onConfirm={()=>this.deletes()} onCancel={this.cancel} okText="确认" cancelText="取消">
                        <Button className="editable-add-btn btn_delete" style={{float:'left'}}><Icon type="close" />批量删除</Button>
                        </Popconfirm>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                          <AddAirPlanInformation  onCancel={this.handleCancelAdd}/>
                        </Modal>
                        <Modal
                            title="更新飞机信息"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                        >
                            <UpdateUserList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                        <Modal
                            title="飞机机型管理"
                            visible={this.state.visible1}
                            onCancel={this.handleCancel1}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyc`}
                            width='90%'
                        >
                            <AircraftModelInformation />
                        </Modal>
                    </div>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        bordered
                        loading={this.state.loading}
                        size="middle"
                        rowSelection={rowSelection}
                    />
                    <Paginations
                        {...page}
                        onChange={this.onChange}
                    />


                </div>
              </Spin>
            </div>
        )
    }
}
const UserRoleManage = Form.create()(UserRoleManages);
export default UserRoleManage;

