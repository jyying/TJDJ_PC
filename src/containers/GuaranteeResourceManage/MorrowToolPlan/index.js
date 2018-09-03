import React from 'react';
import {
    Form,
    Input,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    Icon,
} from 'antd';
import {  Row, Col} from 'antd';
import MorrowToolPlanFind from './MorrowToolPlanFind';
import AddToolPlan from './AddToolPlan';
import Api from '../../../api/request';
import TimeConversions from '../../../utils/TimeConversion';
import { Tabs } from 'antd';
import Pagination from '../../../components/Pagination';
//  url
const findByCondition = 'weekWorkPackage/findByCondition';
const findBattleLine = 'weekWorkPackage/findBattleLine';
const changeInterfaceState = 'interfaceInfo/changeInterfaceState';
const findInterfaceById = 'interfaceInfo/findInterfaceById';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

let modalKey = 0;   //  用于重置modal


// 工作包生产准备工作单
class MorrowToolPlan extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            materialVisible:false,
            addMaterialVisible:false,
            WorkPlansCheck:false,
            data: [],
            tableLoading:true,
            Line:[],
            searchCriteria:{},
            page:{},
            pageNow:1,
            materials:false,
            Addmaterials:false
        };

        this.columns = [
            {
                title: '飞机号',
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

            }, {
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
            },
            {
            title: '停场时间',
            dataIndex: 'airplaneStandDays',
            key: 'airplaneStandDays',
        },{
            title: '机位',
            dataIndex: 'standCode',
            key: 'standCode',
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
       }, {
                title: '总工时',
                dataIndex: 'totalWorkingHours',
                key: 'totalWorkingHours',
        }, {
            title: '操作',
            key: 'action',
            width: '100px',
            render: (text, record,index) => {
                //console.log(text.battleLine);
                return (
                        <span className="action">
                            <a onClick={()=>this.materialFind(record)}>查询</a>
                            <span className="ant-divider" />
                            <a onClick={()=>this.addMaterial(record)}>新增航材工具准备清单</a>
                        </span>

                )
            },
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

    componentWillMount () {
        this.update();
    }

    // 根据工作包ID新增航材工具准备
    addMaterial = (record) => {
        // console.log('工作包id',record.id);
        let Addmaterials = false;
        if(record.id) {
            Addmaterials = record;
        }
        this.setState({
            Addmaterials:Addmaterials,
            addMaterialVisible: true
        });
    };
    addMaterialCancel = () => {
        this.setState({
            addMaterialVisible:false
        });

    };

// 根据工作包ID查询航材工具准备
    materialFind = (record) => {
        // console.log('工作包id',record.id);
        let materials = false;
        if(record.id) {
            materials = record;
        }
        this.setState({
            materials:materials,
            materialVisible: true
        });
    };
    materialCancel = () => {
        this.setState({
            materialVisible:false
        });

    };


  // 更新页面数据
    update(){
        this.props.form.validateFields(['commandNo','executeTime','packageState','pageNow'],(err, values) => {

            if(values.executeTime && values.executeTime.length > 0) {
                const executeStartTime = TimeConversions.TIME(values.executeTime[0]._d);
                const executeEndTime = TimeConversions.TIME(values.executeTime[1]._d);
                values.executeStartTime = executeStartTime;
                values.executeEndTime = executeEndTime;
            }
            delete values.executeTime;

            Api.post(findByCondition,values).then(res=>{
                console.log('res',res);
                if(res.errorCode == 0) {
                    this.setState({
                        data:res? res.data:[],
                        tableLoading:false,
                        page:res.pageInfo,
                        searchCriteria:values
                    });
                }
            })
        });


        // // 获取分线信息,放在此，实时更新分线信息
        // Api.post(findBattleLine)
        //     .then(res => {
        //         if(res.errorCode == 0) {
        //             //console.log(res.data);
        //             this.setState({
        //                 Line:res.data
        //             })
        //         }
        //     });
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

// 分页查询
    onChange = (pageNumber) => {
        //console.log('Page: ', pageNumber);
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        // this.setState({  //  此处有坑
        //    tableLoading:true
        // });
        Api.post(findByCondition,values).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data:res? res.data:[],
                    tableLoading:false,
                    pageNow:pageNumber
                });
            }
        })
    };


    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const {data , tableLoading, materialVisible, page,pageNow, addMaterialVisible} = this.state;
        modalKey++;
        return(
            <div>
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
                                <FormItem {...formItemLayout} label={`指令号`}>
                                    {getFieldDecorator(`commandNo`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} style={{display:'none'}}>
                                <FormItem
                                    {...formItemLayout}
                                    label="状态"
                                >
                                    {getFieldDecorator('packageState',{
                                        initialValue: 'T',
                                    })(
                                        <Select style={{ width: 120 }}>
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3}>
                                <FormItem {...formItemLayout} label={`执行时间段`}>
                                    {getFieldDecorator(`executeTime`,{
                                        initialValue:[],
                                    })(
                                        <RangePicker
                                            placeholder=""
                                        />
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
                    <div style={{width:'100%'}}>
                        <Modal
                            title="次日航材工具准备查看"
                            visible={materialVisible}
                            onCancel={this.materialCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key`}
                            width="85%"
                        >
                            <MorrowToolPlanFind materials={this.state.materials}/>
                        </Modal>
                        <Modal
                            title="新增航材工具准备清单"
                            visible={addMaterialVisible}
                            onCancel={this.addMaterialCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key1`}
                        >
                            <AddToolPlan Addmaterials={this.state.Addmaterials} onCancel={this.addMaterialCancel}/>
                        </Modal>
                    </div>

                    <Table rowKey='id'
                           loading={tableLoading}
                           columns={columns}
                           dataSource={data}
                           pagination={false}
                           bordered
                           size="middle"
                           className='table'
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const MorrowToolPlans = Form.create()(MorrowToolPlan);
export default MorrowToolPlans;


