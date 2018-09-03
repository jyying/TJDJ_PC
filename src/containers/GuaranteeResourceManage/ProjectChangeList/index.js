import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Modal, Icon, message,Tabs } from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

// 定检维修项目变更清单R01
class ProjectChangeList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data1: [],
            tableLoading:false,
            tableLoad:true,
            tableLoad1:true,
            datas:[],
            Selected:'',
            value:[],
            empAdjustments:'',
            page:{},
            tableContainer:[],
            visible:false,
            pageNow:1
        };

        this.columns = [{
            title: '项次',
            dataIndex: 'seqNo',
        }, {
            title: '系统序号',
            dataIndex: 'itemNo',
        },{
            title: '项目号',
            dataIndex: 'taskNo',
        },{
            title: '工卡号',
            dataIndex: 'subTaskNo',
        }, {
            title: '工卡版本号',
            dataIndex: 'revision',

        },{
            title: '工作内容',
            dataIndex: 'content',
        },{
            title: '增/删/改版',
            dataIndex: 'changeMode',
            render:(text,record) => {
                const value=record.changeMode;
                if(value=='1'){
                    return <span>增</span>
                }if(value=='2'){
                    return <span>改</span>
                }if(value=='3'){
                    return <span>删</span>
                }

            }
        }, {
            title: '变更日期',
            dataIndex: 'updateTime',
            render:(text,record) => {
                const time =record.updateTime!=null?record.updateTime:null;
                return <span>{new Date(time).toLocaleDateString().replace(/\//g, "-") + " " + new Date(time).toTimeString().substr(0, 8)}</span>
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

    componentDidMount () {
        this.update();

    }

    // 更新页面数据
    update(){
        this.setState({
            tableLoading:true,
        });
        const value=this.props.Jobcardchecks;
        // this.props.form.validateFields((err, values) => {
            // console.log(values);
            // if(!err){
                Api.post('weekWorkPackage/findRecordDetailsByCondition',{
                    wwpId:value.id
                }).then(res=>{
                    console.log('工作包',res);
                    this.setState({
                        tableLoading:false,
                    });
                    if(res.errorCode == 0) {
                        this.setState({
                            data: res? res.data:[],
                            page:res.pageInfo,
                        });
                    }else {
                        this.setState({
                            data:[],
                        });
                    }
                })
            // }else {
            //     this.setState({
            //         tableLoading:false,
            //     });
            // }

        // });
    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.update();
    };

    handleReset = () => {
        this.props.form.resetFields();
    };
// 分页查询
    onChange = (pageNumber) => {
        const value=this.props.Jobcardchecks;
        Api.post('weekWorkPackage/findRecordDetailsByCondition',{
            wwpId:value.id,
            pageNow:pageNumber
        }).then(res=>{
            this.setState({
                tableLoading:false,
            });
            if(res.errorCode == 0) {
                this.setState({
                    data: res? res.data:[],
                    page:res.pageInfo,
                });
            }else {
                this.setState({
                    data:[],
                });
            }
        })
    };


    render(){
        const value=this.props.Jobcardchecks;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const columns1 = this.columns1;
        const {data ,visible,tableLoading,Selected,page,values,key,tableContainer} = this.state;
        modalKey++;
        const d = new Date();
        return(
            <div>
                {/*<div className="header work-package">*/}
                    {/*<Tabs defaultActiveKey="1" >*/}
                        {/*<TabPane tab="多条件查询" key="1"></TabPane>*/}
                    {/*</Tabs>*/}

                    {/*<Form onSubmit={this.handleSearch}>*/}
                        {/*<Row gutter={40}>*/}
                            {/*<Col span={8} key={2} >*/}
                                {/*<FormItem {...formItemLayout} label={`指令号`}>*/}
                                    {/*{getFieldDecorator('commandNo',{*/}
                                        {/*rules: [{*/}
                                            {/*required: true, message: '请输入指令号!'}],*/}
                                    {/*})(*/}
                                        {/*<Input />*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            {/*<Col span={6} style={{ textAlign: 'right' }}>*/}
                                {/*<Button style={{ marginLeft: 8}} className='btn_reload' onClick={this.handleReset}><Icon type="reload" style={{color: '#108ee9' }} />*/}
                                    {/*重置*/}
                                {/*</Button>*/}
                                {/*<Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    {/*</Form>*/}
                {/*</div>*/}
                <div className="content content_table1" >
                    {/*<Form onSubmit={this.SaveDate}>*/}
                        {/*<div style={{float: 'left'}}>*/}
                            {/*<Button  htmlType="submit" className="editable-add-btn btn_reload"><Icon type="save" style={{color: '#108ee9' }} />保存</Button>*/}
                        {/*</div>*/}

                    <table >
                        <caption >定检维修项目变更清单</caption>
                        <tbody>
                        <tr>
                            <td className="td_color">机号A/C</td>
                            <td>{value.airplaneRegNo}</td>
                            <td className="td_color">日期</td>
                            <td>{d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}</td>
                            <td className="td_color">地点</td>
                            <td>{value.importStandInfo}</td>
                            <td className="td_color">定检级别</td>
                            <td></td>
                            <td className="td_color">工作包号</td>
                            <td>{value.commandNo}</td>
                        </tr>
                        </tbody>

                    </table>
                    <Table bordered dataSource={data} columns={columns}  loading={tableLoading} rowKey='id' pagination={false} size="middle" className='ChangeList'
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                    {/*</Form >*/}

                </div>
            </div>
        )
    }
}
const ProjectChangeLists = Form.create()(ProjectChangeList);
export default ProjectChangeLists;


