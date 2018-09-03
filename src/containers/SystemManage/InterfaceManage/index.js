import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Select,message,Tabs,Row, Col,Icon} from 'antd';
import UpdateUserList from './UpdateUserList';
import AddUserList from './AddUserList';
import Api from '../../../api/request';
import TimeConversions from '../../../utils/TimeConversion';
import Pagination from '../../../components/Pagination';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
let modalKey = 0;

//  url
const interfaceInfo = 'interfaceInfo/findInterfaceByCondition';
const addOrUpdateInterfaceInfo = 'interfaceInfo/addOrUpdateInterfaceInfo';
const changeInterfaceState = 'interfaceInfo/changeInterfaceState';
const findInterfaceById = 'interfaceInfo/findInterfaceById';

// 用户管理
 class InterfaceManage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            tableLoading:false,
            searchCriteria:{},
            page:{},
            pageNow:1
        };
        this.columns = [{
            title: '名称',
            dataIndex: 'interfaceName',
            key: 'interfaceName',
        }, {
            title: '方法名称',
            dataIndex: 'methodName',
            key: 'methodName',
        }, {
            title: '接口状态',
            key: 'interfaceState',
            width:'100px',
            render: (text, record,index) => (
                <Select
                    defaultValue={record.interfaceState}
                    style={{ width: 80 }}
                    onChange={(value) => this.change(value,record)}
                >
                    <Option value="T">有效</Option>
                    <Option value="F">无效</Option>
                </Select>
            )
        },{
            title: '更新人',
            dataIndex: 'updateName',
            key: 'updateName',
        },{
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record) => {
                const time = this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        },{
            title: '备注',
            dataIndex: 'methodRemark',
            key: 'methodRemark',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record,index) =>(
                <span>
                    <a onClick={()=>this.showModal(text, record,index)}>更新</a>
                 </span>
                )
            ,
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
//  更新接口状态
    change = (value,record) => {
        Api.post('interfaceInfo/changeInterfaceState',{interfaceInfoId:record.id,interfaceState:value})
            .then(res => {
                if(res) {
                    message.success('更改状态成功');
                }
            })
    };
// 更新用户的Modal
    showModal = (text, record,index) => {
        //console.log(text,record,index);
        this.setState({
            visible: true,
            information:text
        });
    };

    handleCancel = (e) => {
        if(sessionStorage.interface) {
            this.update();
            sessionStorage.clear('interface');
        }
        modalKey++;
        this.setState({
            visible: false,
        });
    };
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };
 // 更新页面数据
    update(){
        this.props.form.validateFields(['methodName','interfaceName','interfaceState','executeTime','pageNow'],(err, values) => {

            if(values.executeTime && values.executeTime.length > 0) {
                const updateTimeStart = TimeConversions.TIME(values.executeTime[0]._d);
                const updateTimeEnd = TimeConversions.TIME(values.executeTime[1]._d);
                values.updateTimeStart = updateTimeStart;
                values.updateTimeEnd = updateTimeEnd;
            }
            delete values.executeTime;

            this.setState({
                tableLoading:true
            });
            Api.post(interfaceInfo,values).then(res=>{
                // console.log('res',res);
                // if(res.errorCode == 0) {
                    this.setState({
                        data: res ? res.data : [],
                        tableLoading: false,
                        page: res.pageInfo,
                        searchCriteria: values
                    });
                // }
            })
        });
    };

// 分页查询
    onChange = (pageNumber) => {
        //console.log('Page: ', pageNumber);
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        Api.post(interfaceInfo,values).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    tableLoading:false,
                    pageNow:pageNumber
                });
            // }
        })
    };
    componentDidMount(){
       this.update();
    }

    handleCancelAdd = (e) => {
        if(sessionStorage.interface) {
            this.update();
            sessionStorage.clear('interface');
        }
        this.setState({
            update:false
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
    };

    render(){
        //console.log(this.props);
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data ,tableLoading,page,pageNow} = this.state;
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
                                <FormItem {...formItemLayout} label={`名称`}>
                                    {getFieldDecorator(`interfaceName`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`方法名`}>
                                    {getFieldDecorator(`methodName`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem
                                    {...formItemLayout}
                                    label="接口状态"
                                >
                                    {getFieldDecorator('interfaceState',{
                                        initialValue: 'T',
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
                            <Col span={8} key={5} style={{display:'none'}}>
                                <FormItem {...formItemLayout} label={`页码`}>
                                    {getFieldDecorator(`pageNow`,{
                                        initialValue:pageNow,
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit" ><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content">
                    <div style={{width:'100%',height:'40px'}}>
                        <Button className="editable-add-btn btn_reload" onClick={this.showModalAdd}  style={{float:'left'}}><Icon type="plus" />新增</Button>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={this.state.count}
                        >
                           <AddUserList onCancel={this.handleCancelAdd}/>
                        </Modal>

                        <Modal
                            title="更新"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key = {`key${modalKey}`}
                        >
                            <UpdateUserList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                    </div>
                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false} bordered size="middle"/>

                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const InterfaceManages = Form.create()(InterfaceManage);
export default InterfaceManages;


