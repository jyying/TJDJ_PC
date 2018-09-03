import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Modal, Icon, message,Tabs } from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import SaveWwpTemplate from './SaveWwpTemplate';
import moment from 'moment';
import Pagination from '../../../components/Pagination';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

// 工作包工卡安排详情查询
class workPackageSubTaskArrDetail extends React.Component{
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
            visible:false
        };

        this.columns = [{
            title: '周数',
            dataIndex: 'weekNo',
            key: 'weekNo',
        }, {
            title: '机型',
            dataIndex: 'airplaneModel',
            key: 'airplaneModel',
        }, {
            title: '机号',
            dataIndex: 'airplaneRegNo',
            key: 'airplaneRegNo',
        },{
            title: '维修工作',
            dataIndex: 'workInfo',
            key: 'workInfo',
            width: '200px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workInfo}>{record.workInfo}</div>
            }
        },{
            title: '指令号',
            dataIndex: 'commandNo',
            key: 'commandNo',

        },{
            title: '执行开始日期',
            dataIndex: 'executeStartTime',
            key: 'executeStartTime',
            render:(text,record) => {
                const time = this.changetime(record.executeStartTime);
                return <span>{time}</span>
            }
        }, {
            title: '执行结束日期',
            dataIndex: 'executeEndTime',
            key: 'executeEndTime',
            render:(text,record) => {
                const time = this.changetime(record.executeEndTime);
                return <span>{time}</span>
            }
        },{
            title: '停场时间',
            dataIndex: 'airplaneStandDays',
            key: 'airplaneStandDays',
        },{
            title: '机位',
            dataIndex: 'importStandInfo',
            key: 'importStandInfo',
        }, {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
        }, {
            title: '生产线经理',
            dataIndex: 'empMNames',
            key: 'empMNames',
        }, {
            title: '跟线员',
            dataIndex: 'empENames',
            key: 'empENames',
        },{
            title: '总工时',
            dataIndex: 'totalWorkingHours',
            key: 'totalWorkingHours',
        },{
            title: '机械工时',
            dataIndex: 'machineHours',
            key: 'machineHours',
        },{
            title: '电气工时',
            dataIndex: 'electricHours',
            key: 'electricHours',
        },{
            title: '电子工时',
            dataIndex: 'electronHours',
            key: 'electronHours',
        },{
            title: '清洁工时',
            dataIndex: 'cleanHours',
            key: 'cleanHours',
        },{

            title: '客舱工时',
            dataIndex: 'cabinHours',
            key: 'cabinHours',
        },{
            title: 'NDT工时',
            dataIndex: 'ndtHours',
            key: 'ndtHours',
        },{
            title: '金工工时',
            dataIndex: 'metalworkingHours',
            key: 'metalworkingHours',
        },{
            title: '漆工工时',
            dataIndex: 'lacqueringHours',
            key: 'lacqueringHours',
        },{
            title: '分线',
            dataIndex: 'battleLineName',
            key: 'battleLineName',
        }];

        // 工卡明细
        // this.expandedRowRender = () => {
        //     const columns = [
        //         { title: '序号', dataIndex: 'seqNo', key: 'seqNo'},
        //         { title: '项号', dataIndex: 'itemNo', key: 'itemNo' },
        //         { title: '任务号', dataIndex: 'taskNo', key: 'taskNo'},
        //         { title: '工卡号', dataIndex: 'subTaskNo', key: 'subTaskNo'},
        //         { title: '版本号', dataIndex: 'revision', key: 'revision'},
        //         // { title: 'mcdRev', dataIndex: 'mcdRev', key: 'mcdRev',width:'5%' },
        //         { title: '工种', dataIndex: 'skill', key: 'skill'},
        //         { title: '区域', dataIndex: 'workArea', key: 'workArea'},
        //         { title: '工作内容', dataIndex: 'content', key: 'content' ,width:'300px',
        //             render:(text,record) => {
        //                 return <div title={record.content}>{record.content}</div>
        //             }},
        //         { title: '间隔', dataIndex: 'threshold', key: 'threshold'},
        //         { title: '工时', dataIndex: 'manHours', key: 'manHours' },
        //         { title: '备注', dataIndex: 'remark', key: 'remark' },
        //
        //     ];
        //     // const state = this.state;
        //     const {  selectedRowKeys } = this.state;
        //     const rowSelection = {
        //         selectedRowKeys,
        //         onChange: this.onSelectChange,
        //     };
        //     const expandedRowRender1=this.expandedRowRender1;
        //     return (
        //         <div>
        //             <Table
        //                 rowSelection={rowSelection}
        //                 rowKey='stlId'
        //                 columns={columns}
        //                 dataSource={this.state.datas}
        //                 pagination={false}
        //                 loading={this.state.tableLoad}
        //                 expandedRowRender={expandedRowRender1}
        //                 onExpand={this.onExpand1}
        //                 expandedRowKeys={[this.state.Selected1]}
        //                 bordered
        //                 size="middle"
        //             />
        //             <Pagination
        //                 {...this.state.page1}
        //                 onChange={this.onChange1}
        //             />
        //         </div>
        //     );
        // };

        this.columns1 = [{
            title: '大区域',
            dataIndex: 'largeAreaName',
            key: 'largeAreaName',
        }, {
            title: '小区域',
            dataIndex: 'smallArea',
            key: 'smallArea',
        }, {
            title: '区域备注',
            dataIndex: 'remarkArea',
            key: 'remarkArea',
        }, {
            title: '序号',
            dataIndex: 'seqNo',
            key: 'seqNo',
        },{
            title: '维修工作',
            dataIndex: 'content',
            key: 'content',
            width: '200px',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.content}>{record.content}</div>
            }
        },{
            title: '项号',
            dataIndex: 'itemNo',
            key: 'itemNo',

        }, {
            title: '任务号',
            dataIndex: 'taskNo',
            key: 'taskNo',
        },{
            title: '工卡号',
            dataIndex: 'subTaskNo',
            key: 'subTaskNo',
        },{
            title: '版本号',
            dataIndex: 'revision',
            key: 'revision',
        }, {
            title: '工种',
            dataIndex: 'skill',
            key: 'skill',
        }, {
            title: '间隔',
            dataIndex: 'threshold',
            key: 'threshold',
        }, {
            title: '工时',
            dataIndex: 'manHours',
            key: 'manHours',
        }];
        this.columns2 = [
            { title: '序号', dataIndex: 'seqNo'},
            { title: '小区域', dataIndex: 'smallArea',width:60},
            { title: '工卡号', dataIndex: 'subTaskNo'},
            { title: '工作内容', dataIndex: 'content',width: '120px', className:'table_workInfo',
                render:(text,record) => {
                    return <div title={record.content}>{record.content}</div>
                }},
            { title: '备注', dataIndex: 'remarkArea' },
        ];

    }
// 点击展开项列表
//     onExpand=(expanded,record,index)=>{
//         console.log(expanded,record,record.id,index);
//         const Selected = record.id;
//         if(!expanded) {
//             this.setState({Selected:''});
//             return;
//         }
//
//         this.setState({Selected});
//         // let wwpdata = false;
//         // if(Selected) {
//         //     wwpdata = record;
//         // }
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

    componentDidMount () {
        // this.update();

    }

    // 更新页面数据
    update(){
        this.setState({
            tableLoading:true,
        });
        this.props.form.validateFields((err, values) => {
            console.log(values);
            if(values.commandNo!=undefined){
                Api.post('workPackageSubTaskArrDetail/findWeekWorkPackageByWwpaAndArea',values).then(res=>{
                    console.log('工作包',res);
                    this.setState({
                        tableLoading:false,
                    });
                    // const value=res.data.tjRcWwpArrangeList !=null?res.data.tjRcWwpArrangeList:'';
                    // this.setState({
                    //     tableContainer:value,
                    // });


                    if(res.errorCode == 0) {
                        this.setState({
                            data: res? [res.data]:[],
                            page:res.pageInfo,
                            Selected:res.data.id,
                            tableContainer:res.data?res.data.tjRcWwpArrangeList:'',
                        });
                    }else {
                        this.setState({
                            data:[],
                        });
                        message.error('输入指令号不存在');
                    }
                })
            }else {
                this.setState({
                    tableLoading:false,
                });
                    message.error('请输入指令号');
            }

        });
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
    };

// 保存为工作包模板的Modal
    SaveWwpTemplate = () => {
        this.setState({
            visible: true,
        });
        // this.update();
    };
    SaveWwpTemplateCancel = (e) => {
        // this.update();
        this.setState({
            visible: false,
        });
    };

    // Dates=()=>{
    //     let now = new Date().getTime();
    //     let tomorrow = new Date(Number(now) + 24 * 3600 * 1000);
    //     let year = tomorrow.getFullYear();
    //     let month = tomorrow.getMonth() + 1;
    //     month = month < 10 ? '0' + month : month;
    //     let day = tomorrow.getDate();
    //     day = day < 10 ? '0' + day : day;
    //     return year + '-' + month + '-' + day;
    // };
    callback=(key)=> {
    console.log(key);
};

    render(){
        const expandedRowRender=this.expandedRowRender;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const columns1 = this.columns1;
        const columns2=this.columns2;
        const {data ,visible,tableLoading,Selected,page,values,key,tableContainer} = this.state;
        modalKey++;
        let a = Object.entries(tableContainer);

        let workType = ['机身','大翼','动力','电子','客舱','金工和NDT'];
        return(
            <div style={{width:'2000px'}}>
                <div className="header work-package">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>

                    <Form

                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={5} key={2} >
                                <FormItem {...formItemLayout} label={`指令号`}>
                                    {getFieldDecorator('commandNo',{
                                        rules: [{
                                            required: true, message: '请输入指令号!'}],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={3} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8}} className='btn_reload' onClick={this.handleReset}><Icon type="reload" style={{color: '#108ee9' }} />
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
                    <div style={{width:'100%',height:'40px'}}>
                        <div style={{float: 'right'}}>
                            <Button type="primary" onClick={()=>this.SaveWwpTemplate() } style={{display:data.length>0?'block':'none'}}><Icon type="save" style={{color: '#fff' }} />保存工作包模板</Button>
                        </div>
                        <Modal
                            title="保存为模板"
                            visible={visible}
                            onCancel={this.SaveWwpTemplateCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key4`}
                        >
                            <SaveWwpTemplate data={data} onCancel={this.SaveWwpTemplateCancel}/>
                        </Modal>
                    </div>
                    <Table rowKey='id'
                           loading={tableLoading}
                           columns={columns}
                           dataSource={data}
                           pagination={false}
                           expandedRowKeys={[Selected]}
                           // onExpand={this.onExpand}
                           // expandedRowRender={record=><div>
                           //     {
                           //         Object.is(tableContainer)?null:
                           //             tableContainer.map((s,v)=>{
                           //                 let a = Object.keys(s);
                           //                 let data = s[a[0]];
                           //                 if(data.length>0){
                           //                     return(
                           //                         <Table rowKey={data.stlId}  title={() => a[0]} columns={columns1} dataSource={data} pagination={false} bordered size="middle" className='tableTitle'/>
                           //                     )
                           //                 }
                           //
                           //             })
                           //     }
                           // </div>}
                           bordered
                           // scroll={{ x: 2000,y:h>900?450:350}}
                           size="middle"
                           className='table'
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                    <div>
                        <Tabs defaultActiveKey="0" onChange={this.callback} size="small">
                        {
                            tableContainer.length>0?
                                tableContainer.map((s,v)=>{
                                    let a = Object.keys(s);
                                    let b=Object.entries(s);
                                    // console.log('aaa',a,b,s);
                                        return(
                                                <TabPane tab={a[0]} key={v}>
                                                    <Row className='tab_row'>
                                                        {
                                                            workType.map((m,n)=>
                                                            <Col className='tab_col' key={n}>
                                                                <p >{m}</p>
                                                                <div>
                                                                    {
                                                                        s[a][m]?
                                                                                <Table rowKey='id' columns={columns2} dataSource={s[a][m]} pagination={false} bordered size="middle"  className='table'/>
                                                                            :null
                                                                    }
                                                                </div>
                                                            </Col>
                                                            )
                                                        }
                                                    </Row>
                                                </TabPane>
                                        )
                                }):null
                        }
                        </Tabs>
                    </div>


                </div>
            </div>
        )
    }
}
const workPackageSubTaskArrDetails = Form.create()(workPackageSubTaskArrDetail);
export default workPackageSubTaskArrDetails;

