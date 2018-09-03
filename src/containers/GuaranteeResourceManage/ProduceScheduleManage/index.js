// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Select,Icon,message,notification,Popconfirm} from 'antd';
import {  Row, Col} from 'antd';
import UpdateDocument from './UpdateDocument';
import UploadDocument from './UploadDocument';
import { Tabs } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}];
let modalKey = 0;   //  用于重置modal
// 生产进度管理——文档管理
 class ProduceScheduleManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visible1: false,
            update:false,
            UserRole:false,
            data: [],
            loading:true,
            userName:'',
            pageNow:1,
            page:{},
            DetailsDatas:false,
            choose:false,
            docType:[]
        };

        this.columns = [{
            title: '文档类型名称',
            dataIndex: 'docTypeName',
            key: 'docTypeName',
        }, {
            title: '文档名称',
            dataIndex: 'docName',
            key: 'docName',

        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record) => {
                const time =record.updateTime!=null? this.changetime(record.updateTime):'';
                return <span>{time}</span>
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '文档状态',
            dataIndex: 'docState',
            key: 'docState',
            render:(text,record) => {
                const state = record.docState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }
            }
            // render: (text, record,index) => (
            //     <Select
            //         defaultValue={record.docState}
            //         style={{ width: 70}}
            //         onSelect={(value,e)=>this.changeListState(e,record,value)}
            //
            //     >
            //         <Option value="T" >有效</Option>
            //         <Option value="F" >无效</Option>
            //     </Select>
            //
            // )
        }, {


            title: '下载',
            key: 'download',
            render: (text, record,index) => {
                return (
                    <span className="action">
                        <a href={record.visitPreFix+'/'+record.docUrl} target="_blank">文档下载</a>
                     </span>
                )
            },
        }, {

            title: '操作',
            key: 'action',
            render: (text, record,index) => {
                return (
                        <span className="action">
                             <a onClick={()=>this.showModal(record)}>修改</a>
                            <span className="ant-divider" />
                            <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                        </span>
                )
            },
        }
        ];



    }
     // 文档删除
     delete=(e)=> {
         Api.post('document/updateDocument',{docId:e.id,docTypeId:e.docTypeId,docName:e.docName,docState:'D',docUrl:e.docUrl,remark:e.remark})
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
//     changeListState = (e,record,value) => {
//         // console.log('aaa',record);
//         if(value){
//             // console.log('aa',value);
//             Api.post('document/updateDocument',{docId:record.id,docTypeId:record.docTypeId,docName:record.docName,docState:value,docUrl:record.docUrl,remark:record.remark
//             }).then(res=>{
//                 // console.log(res);
//                 if(res.errorCode=='0'){
//                     message.success('修改成功！');
//                     this.update();
//                 }else{
//                     message.error('修改失败！');
//                 }
//             })
//         }
//
//     };

     //将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
         return Y+M+D
     };
// 更新用户的Modal
    showModal = (record) => {
        // console.log('record',record);
        let DetailsDatas = false;
        if(record.id) {
            DetailsDatas = record;
        }
        this.setState({
            visible: true,
            DetailsDatas:DetailsDatas,
        });
    };
    handleCancel = (e) => {
        this.update();
        this.setState({
            visible: false,
        });
    };
    // 文件上传的Modal
    uploadshowModal = () => {

        this.setState({
            visible1: true,
        });
    };
    uploadhandleCancel = (e) => {
        this.update();
        this.setState({
            visible1: false,
        });
    };

 // 更新页面数据
    update(){
        Api.post('document/findDocumentList',{'pageNow':this.state.pageNow}).then(res=>{
            this.setState({
                data:res? res.data:[],
                page:res.pageInfo,
                loading:false
            })
        })
    }
    componentDidMount(){
       this.update();
// 获取文档类型列表
        Api.post('document/findDocumentTypeList').then(res=>{
            this.setState({
                docType:res?res.data:[]
            });
        });
    }


// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['docTypeId','docName','docState','updateTime'],(err, values) => {
            // console.log(values);
            Api.post('document/findDocumentList',{
                'docTypeId':values.docTypeId.length>0?values.docTypeId:'',
                'docName':values.docName,
                'docState':values.docState,
                'updateStartTime':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                'updateEndTime':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                'pageNow':this.state.pageNow
            }).then(res=>{
                // console.log(res);
                this.setState({
                    loading:false,
                    data:res? res.data:[],
                    page:res.pageInfo,
                    docTypeId:values.docTypeId.length>0?values.docTypeId:'',
                    docName:values.docName,
                    docState:values.docState,
                    updateStartTime:values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    updateEndTime:values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):'',
                    pageNow:this.state.pageNow
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
// 分页查询
   onChange = (pageNumber) => {

       this.props.form.validateFields(['docTypeId','docName','docState','updateTime'],(err, values) => {
           Api.post('document/findDocumentList',{
               'docTypeId':this.state.docTypeId,
               'docName':this.state.docName,
               'docState':this.state.docState,
               'updateStartTime':this.state.updateStartTime,
               'updateEndTime':this.state.updateEndTime,
               'pageNow':pageNumber
           }).then(res=>{
               this.setState({
                   loading:false,
                   data:res? res.data:[],
                   page:res.pageInfo,
               });
           })
       });
};



    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        // const form=this.props.form.getFieldValue('userAcc');
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };

        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data,page,pageNow,docType} = this.state;
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
                            <Col span={8} key={1} >
                                <FormItem {...formItemLayout} label={`文档类型`}>
                                    {getFieldDecorator(`docTypeId`,{
                                        initialValue: [],
                                    })(
                                        <Select>
                                            {
                                                docType.map((s,v)=>
                                                    <Option key={v} value={s.id}>{s.dictValue}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`文档名称`}>
                                    {getFieldDecorator(`docName`,{
                                        initialValue: [],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem
                                    {...formItemLayout}
                                    label="文档状态"
                                >
                                    {getFieldDecorator('docState',{
                                    })(
                                        <Select>
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4} style={{display:'none'}}>
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
                    <div style={{width:'100%',height:'40px'}}>
                        <Button onClick={()=>this.uploadshowModal()} className="btn_reload" style={{float:'left'}}>
                            <Icon type="upload" />新增
                        </Button>
                        <Modal
                            title='修改'
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                        >
                                <UpdateDocument DetailsDatas={this.state.DetailsDatas} onCancel={this.handleCancel}/>
                        </Modal>
                        <Modal
                            title='新建'
                            visible={this.state.visible1}
                            onCancel={this.uploadhandleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                            <UploadDocument onCancel={this.uploadhandleCancel}/>
                        </Modal>

                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'  loading={this.state.loading} bordered size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const ProduceScheduleManages = Form.create()(ProduceScheduleManage);
export default ProduceScheduleManages;


