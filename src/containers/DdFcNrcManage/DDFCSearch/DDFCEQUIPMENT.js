// import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Icon,DatePicker,Pagination} from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
import Api from '../../../api/request';
// import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



const receiveState = [{
    value: 'A',
    label: '待领取',
}, {
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}, {
    value: 'D',
    label: '删除',
}, {
    value: 'C',
    label: '取消',
}, {
    value: '',
    label: '全部',
}];

const executeStatus = [{
    value: 'S',
    label: '执行成功',
}, {
    value: 'F',
    label: '执行失败',
}, {
    value: '',
    label: '全部',
}];
let modalKey = 0;   //  用于重置modal
// 员工工卡领取记录
 class Ddfcequipment extends React.Component{
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
            deferId:''

        };
        this.columns = [{
        //     title: 'DD/FC编号',
        //     dataIndex: 'deferId',
        //     key: 'deferId',
        // }, {
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
        }, {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record) => {
                const time =record.updateTime==null?'': this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        }];

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
        const value=this.props.DdfcequipmentData;
        Api.post('deferInfo/findDDFCEquipmentByCondition',{'deferId':value.id,'pageNow':this.state.pageNow}).then(res=>{
            console.log(res);
            this.setState({
                data:res? res.data:[],
                currentPage:parseInt(res.pageInfo.currentPage),
                totalSize:parseInt(res.pageInfo.totalSize),
                loading:false,
                deferId:value.deferId,
                pageNow:this.state.pageNow
            })
        })
    }
    componentDidMount(){
       this.update();
    }



// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        const value=this.props.DdfcequipmentData;
        this.props.form.validateFields((err, values) => {
            // console.log(values);
            Api.post('deferInfo/findDDFCEquipmentByCondition',{
                'deferId':value.id,
                'pnNo':values.pnNo,
                'equipmentType':values.equipmentType,
                'equipmentState':'T',
                'pageNow':this.state.pageNow
            }).then(res=>{
                // console.log('筛选后',res);
                this.setState({
                    loading:false,
                    data:res? res.data:[],
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalSize:parseInt(res.pageInfo.totalSize),
                    deferId:value.deferId,
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
        this.update();
    };
// 分页查询
   onChange = (pageNumber) => {
       // this.props.form.validateFields(['deferId','pnNo','equipmentType'],(err, values) => {
           Api.post('deferInfo/findDDFCEquipmentByCondition',{
               'deferId':this.state.deferId,
               'pnNo':this.state.pnNo,
               'equipmentType':this.state.equipmentType,
               'equipmentState':'T',
               'pageNow':pageNumber
           }).then(res=>{
               this.setState({
                   loading:false,
                   data:res? res.data:[],
                   currentPage:parseInt(res.pageInfo.currentPage),
                   totalSize:parseInt(res.pageInfo.totalSize),
               });
           })
       // });
};

    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data,page,pageNow} = this.state;
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
                            {/*<Col span={8} key={1} >*/}
                                {/*<FormItem {...formItemLayout} label={`DD/FC编号`}>*/}
                                    {/*{getFieldDecorator(`deferId`,{*/}
                                        {/*initialValue: [],*/}
                                    {/*})(*/}
                                        {/*<Input placeholder="" />*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`件号`}>
                                    {getFieldDecorator(`pnNo`,{
                                        initialValue: [],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem {...formItemLayout} label={`设备类型`}>
                                    {getFieldDecorator(`equipmentType`,{
                                        initialValue: [],
                                    })(
                                        <Input placeholder="" />
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
                        {/*<Row>*/}
                            {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>*/}
                                    {/*重置*/}
                                {/*</Button>*/}
                                {/*<Button type="primary" htmlType="submit">查询</Button>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    </Form>
                </div>
                <div className="content">
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'  loading={this.state.loading} size="middle" bordered />
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条`}/>
                </div>
            </div>
        )
    }
}
const Ddfcequipments = Form.create()(Ddfcequipment);
export default Ddfcequipments;


