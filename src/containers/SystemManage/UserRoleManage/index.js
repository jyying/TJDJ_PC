import './index.css'
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Icon,Select,Popconfirm,Tabs,Row, Col,message  } from 'antd';
import UpdateUserList from './UpdateUserList';
import AddUserList from './AddUserList';
import UpdataPrivilege from './UpdataPrivilege';
import MenuPrivilege from './MenuPrivilege';
import Paginations from '../../../components/Pagination';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
const { RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
let modalKey = 0;   //  用于重置modal
// 分页选择
function onChange(pageNumber) {
    console.log('Page: ', pageNumber);
}

const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];
class UserRoleManages extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            load:false,
            menu:false,
            role:false,
            data: [],
            roleId:'',
            roleName:'',
            searchCriteria:{},
            page:{},
            pageNow:1,
            tableLoading:false
        };
        this.columns = [{
            title: '角色编号',
            dataIndex: 'roleCode',
            key: 'roleCode',
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        }, {
            title: '状态',
            dataIndex: 'roleState',
            key: 'roleState',
            render:(text,record,index) => {
                const state = record.roleState;
                if(state == 'T'){
                    return <span>有效</span>
                }else if(state == 'F'){
                    return <span>无效</span>
                }else if(state == 'D'){
                    return <span>删除</span>
                }
            }
        }, {
            title: '更新人',
            dataIndex: 'updateName',
            key: 'updateName',
        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render:(text,record,index) => {
                const time = this.changetime(record.updateTime);
                return <span>{time}</span>
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <span>
                    <a onClick={()=>this.showModal(text, record,index)}>修改</a>
                    {/*<span className="ant-divider" />*/}
                    {/*<a onClick={()=>this.showModal2(index)}>接口权限管理</a>*/}
                    <span className="ant-divider" />
                    <a onClick={()=>this.showModal3(index)}>菜单权限管理</a>
                     <span className="ant-divider" />
                    <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                 </span>
            ),
        }];

    }
    // 用户角色删除
    delete=(e)=> {
        Api.post('role/saveOrUpdateRole',{
            'roleId':e.id,
            'roleCode':e.roleCode,
            'roleName':e.roleName,
            'roleState':'D'})
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



// 更新用户的Modal
    showModal = (text, record,index) => {
        //console.log(record,index);
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        // console.log('information',information);
        this.setState({
            visible: true,
            information:information
        });

    };
    // 权限管理的Modal
    showModal2 = (index) => {
        const { data } = this.state;
        const roleId = data[index].id;
        const roleName = data[index].roleName;
        this.setState({
            roleId:roleId,
            roleName:roleName,
            load: true
        });
    };
    // 权限管理的Modal
    showModal3 = (index) => {
        const { data } = this.state;
        const roleId = data[index].id;
        const roleName = data[index].roleName;
        this.setState({
            roleId:roleId,
            roleName:roleName,
            menu: true
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
        this.setState({
            tableLoading:true
        });
        Api.post('role/findRole').then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res ? res.data : [],
                    tableLoading: false,
                    page: res.pageInfo
                });
            // }
        })
    }
    componentDidMount(){
        this.update();
    }
    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };
    handleCancel = (e) => {
        this.update();
        this.setState({
            visible: false
        });
    };
    handleCancel2 = (e) => {
        this.update();
        this.setState({
            load: false
        });
    };
    handleCancel3 = (e) => {
        this.update();
        this.setState({
            menu: false
        });
    };
    handleCancelAdd = (e) => {
        // console.log(e);
        this.update();
        this.setState({
            update:false
        });
    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('values',values);
            this.setState({
                tableLoading:true
            });
            if (!err) {
                Api.post('role/findRole',{
                    'roleCode':values.roleCode,
                    'roleName':values.roleName,
                    'roleState':values.roleState,
                    'updateTimeStart':values.updateTime ? values.updateTime[0].format('YYYY-MM-DD'):'',
                    'updateTimeEnd':values.updateTime ? values.updateTime[1].format('YYYY-MM-DD'):''
                }).then(res=>{
                    console.log('res',res);
                    this.setState({
                        data: res ? res.data : [],
                        tableLoading: false,
                        page: res.pageInfo,
                        searchCriteria: values
                    });

                })
            }

        });
    };
    // 分页查询
    onChange = (pageNumber) => {
        //console.log('Page: ', pageNumber);
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        Api.post('role/findRole',values).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    tableLoading:false,
                    pageNow:pageNumber,
                    searchCriteria:values
                });
            // }
        })
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };
    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data,page,tableLoading } = this.state;
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
                            <Col span={8} key={1}>
                                <FormItem {...formItemLayout} label={'角色编码'}>
                                    {getFieldDecorator('roleCode')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2}>
                                <FormItem {...formItemLayout} label={'角色名称'}>
                                    {getFieldDecorator('roleName')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} style={{height:49}}>
                                <FormItem {...formItemLayout} label={'状态'}>
                                    {getFieldDecorator('roleState')(
                                        <Select >
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="" >全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem
                                    {...formItemLayout}
                                    label="更新起止时间"
                                >
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
                        <Button className="editable-add-btn btn_reload"  onClick={this.showModalAdd} style={{float:'left'}}><Icon type="plus" />新增</Button>
                        <Modal
                            title="新建"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyd`}

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
                            key={`${modalKey}keyc`}
                        >
                            <UpdateUserList data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                        <Modal
                            title="接口权限管理"
                            visible={this.state.load}
                            onCancel={this.handleCancel2}
                            maskClosable={false}
                            footer={null}
                            width="60%"
                            key={`${modalKey}keyb`}
                        >
                            <UpdataPrivilege data={this.state} onCancel={this.handleCancel2}/>
                        </Modal>
                        <Modal
                            title="菜单权限管理"
                            visible={this.state.menu}
                            onCancel={this.handleCancel3}
                            maskClosable={false}
                            footer={null}
                            width="60%"
                            key={`${modalKey}keya`}
                        >
                            <MenuPrivilege data={this.state} onCancel={this.handleCancel3}/>
                        </Modal>

                    </div>
                    <Table rowKey="id" columns={columns} dataSource={data} bordered size="middle" loading={tableLoading} pagination={false}/>
                    <Paginations
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const UserRoleManage = Form.create()(UserRoleManages);
export default UserRoleManage;

