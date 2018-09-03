// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Icon,Select} from 'antd';
import {  Row, Col} from 'antd';
import Details from './Details';
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
 class TaskNoManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            UserRole:false,
            data: [],
            loading:true,
            userName:'',
            pageNow:1,
            page:{},
            DetailsData:false,
            // pnNo:'',
            // equipmentType:'',
            // equipmentState:''

        };
        this.columns = [{
            title: '件号',
            dataIndex: 'pnNo',
            key: 'pnNo',
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: '设备类型',
            dataIndex: 'equipmentType',
            key: 'equipmentType',
        // },
        // //     {
        // //     title: 'equipmentState',
        // //     dataIndex: 'equipmentState',
        // //     key: 'equipmentState',
        // //     render:(text,record) => {
        // //         const state = record.equipmentState;
        // //         if(state == 'T'){
        // //             return <span>有效</span>
        // //         }else if(state == 'F'){
        // //             return <span>无效</span>
        // //         }
        // //     }
        // // },
        //     {
        //     title: '更新时间',
        //     dataIndex: 'synchroTime',
        //     key: 'synchroTime',
        //     render:(text,record) => {
        //         const time =record.synchroTime!=null? this.changetime(record.synchroTime):'';
        //         return <span>{time}</span>
        //     }
        },  {
            width:200,
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <span>
                    <a onClick={()=>this.showModal(record)}>图片上传</a>

                 </span>
            ),
        }];

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
// 更新用户的Modal
    showModal = (record) => {
        let DetailsData = false;
        if(record.id) {
            DetailsData = record;
        }
        this.setState({
            visible: true,
            DetailsData:DetailsData
        });
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

 // 更新页面数据
    update(){
        Api.post('workPackageInfo/findEquipmentByCondition',{'pageNow':this.state.pageNow}).then(res=>{
            // console.log(res);
            this.setState({

                data:res? res.data:[],
                page:res.pageInfo,
                loading:false
            })
        })
    }
    componentDidMount(){
       this.update();
    }



// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['pnNo','equipmentType','equipmentState','pageNow'],(err, values) => {
            // console.log(values);
            Api.post('workPackageInfo/findEquipmentByCondition',{
                'pnNo':values.pnNo,
                'equipmentType':values.equipmentType,
                'equipmentState':'T',
                'pageNow':this.state.pageNow
            }).then(res=>{
                // console.log(res);
                this.setState({
                    loading:false,
                    data:res? res.data:[],
                    page:res.pageInfo,
                    pnNo:values.pnNo,
                    equipmentType:values.equipmentType,
                    equipmentState:'T',
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

       this.props.form.validateFields(['pnNo','equipmentType','equipmentState','pageNow'],(err, values) => {
           Api.post('workPackageInfo/findEquipmentByCondition',{
               'pnNo':this.state.pnNo,
               'equipmentType':this.state.equipmentType,
               'equipmentState':'T',
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
        const { data,page,pageNow} = this.state;
        // const suffix = form ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
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
                                <FormItem {...formItemLayout} label={`件号`}>
                                    {getFieldDecorator(`pnNo`,{
                                        initialValue: [],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`设备类型`}>
                                    {getFieldDecorator(`equipmentType`,{
                                        initialValue: [],
                                    })(
                                        <Select allowClear={true}>
                                            <Option value="AS">AS</Option>
                                            <Option value="CH">CH</Option>
                                            <Option value="TS" >TS</Option>
                                            <Option value="TO" >TO</Option>
                                            <Option value="GS" >GS</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {/*<Col span={8} key={3} >*/}
                                {/*<FormItem*/}
                                    {/*{...formItemLayout}*/}
                                    {/*label="状态"*/}
                                {/*>*/}
                                    {/*{getFieldDecorator('equipmentState',{*/}
                                        {/*initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Cascader options={residences} placeholder="" style={{ width: 110 }}/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
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
                            title="件号图片上传"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyb`}
                        >
                            <Details DetailsData={this.state.DetailsData}/>
                        </Modal>

                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'  loading={this.state.loading} bordered  size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const TaskNoManages = Form.create()(TaskNoManage);
export default TaskNoManages;


