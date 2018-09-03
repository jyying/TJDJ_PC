import React,{Component} from 'react';
import {Table,Tabs,Form,Input,Row,Col,Button,Icon,Modal,Select,message} from 'antd';
import Api from '../../../api/request';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

const findEmployeeLoginByEmpId = 'employeeLogin/findEmployeeLoginByEmpId';
const findLoginInfoForEmployee = 'employeeLogin/findLoginInfoForEmployee';
const addOrUpdateEmployeeLogin = 'employeeLogin/addOrUpdateEmployeeLogin';

class LoginManage extends Component {
    constructor(){
        super();
        this.state = {
            data:[],
            tableLoading:true,
            isAccount:true,
            selectedRows:{},
            selectedRowKeys:[],
            selectOption:[],
            buttonLoading:false,
            modal:false,
            tableModify:{}
        };
        this.columns = [
            {
                title:'账号',
                dataIndex:'empLoginAccount',
                key:'empLoginAccount'
            },{
                title:'账号状态',
                dataIndex:'empLoginState',
                key:'empLoginState'
            },{
                title: '操作',
                key: 'action',
                render: (text, record,index) => (
                    <span>
                        {
                            this.state.isAccount?<a onClick={()=>this.modalShow(record)}>修改</a>:null
                        }
                    </span>
                ),
            }
        ]
    }


    componentWillMount () {
        this.update();
    }

    update = _ => {
        const {id} = this.props.data;
        Api.post(findEmployeeLoginByEmpId,{employeeInfoId:id})
            .then(res => {
                if(res.errorCode == 0) {
                    //console.log(res);
                    this.setState({
                        data:res.data?[res.data]:[],
                        isAccount:res.data?true:false,
                        tableLoading:false
                    })
                }
            })
    };

    handleSearch = e => {
        e.preventDefault();
        this.search(res=>this.setState({
            data:res.data
        }));
    };

    search = fn => {
        this.props.form.validateFields(['userAccount','userName'],(err, values) => {
            //console.log(values);
            Api.post(findLoginInfoForEmployee,values)
                .then(res => {
                    //console.log(res);
                    if(res.errorCode == 0) {
                            fn(res);
                    }
                })
        });
    };

    modify = e => {
        this.props.form.validateFields(['userId','loginInfoState'],(err, values) => {

            const type = e.target.dataset.type;
            const selectedRows = this.state.selectedRows[0];
            const employeeInfoId = this.props.data.id;
            values.employeeInfoId = employeeInfoId;
            if(type == 'add'){
                values.userId = selectedRows.userId;
                values.loginInfoState = 'T';
            }

            //console.log(type,values,selectedRows);

            Api.post(addOrUpdateEmployeeLogin,values)
                .then(res => {
                    //console.log(res);
                    if(res.errorCode == 0) {
                        message.success('修改成功');
                        this.update();
                        this.setState({
                            modal:false
                        })
                    }
                })
        });
    };

    modalShow = record => {
        //console.log(record);
        this.search(res=>this.setState({
            selectOption:res.data
        }));
        this.setState({
            modal:true,
            tableModify:record
        })
    };

    modalClose = _ => {
        this.setState({
            modal:false
        })
    };

    onSelectChange = (selectedRowKeys,selectedRows) => {
        //console.log(selectedRowKeys,selectedRows);
        this.setState({selectedRowKeys,selectedRows});
    };

    render(){
        const {tableLoading,data,isAccount,selectedRowKeys,buttonLoading,modal,tableModify,selectOption} = this.state;
        const { getFieldDecorator} = this.props.form;
        const columns = this.columns;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 },
        };
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange:this.onSelectChange
        };
        const locale = {
            emptyText:'请选择人员'
        };
        //console.log(this.state);
        return (
            <div>
                {
                    !isAccount?
                        <div className="header">
                            <Tabs defaultActiveKey="1" >
                                <TabPane tab="可分配的登录用户" key="1"></TabPane>
                            </Tabs>
                            <Form
                                onSubmit={this.handleSearch}
                            >
                                <Row gutter={8}>
                                    <Col span={8} key={1} >
                                        <FormItem {...formItemLayout} label={`姓名`}>
                                            {getFieldDecorator(`userAccount`)(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2} >
                                        <FormItem {...formItemLayout} label={`编号`}>
                                            {getFieldDecorator(`userName`)(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={2}>
                                        <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                                    </Col>
                                </Row>
                                {/*<Row>*/}
                                    {/*<Col span={24}>*/}
                                        {/*<Button type="primary" htmlType="submit">查询</Button>*/}
                                    {/*</Col>*/}
                                {/*</Row>*/}
                            </Form>
                        </div>
                        :null
                }
                {
                    !isAccount?<div style={{overflow:'hidden',marginBottom:'10px'}}>
                        <Button  className="button-data btn_reload" data-type="add" onClick={this.modify} style={{float:'left'}}>确认</Button>
                    </div>:null
                }
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    rowSelection={!isAccount?rowSelection:null}
                    rowKey='userId'
                    loading={tableLoading}
                    locale={locale}
                    bordered size="middle"
                />

                <Modal
                    visible={modal}
                    onCancel={this.modalClose}
                    title="修改登陆信息"
                    footer={null}
                >

                    <Form
                        onSubmit={this.modify}
                        data-type="modify"
                    >
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                            hasFeedback
                        >
                            {getFieldDecorator('userId', {
                                initialValue:tableModify.userId?tableModify.userId:null,
                                rules: [
                                    {
                                        required: true
                                    }
                                ],
                            })(
                                <Select>
                                    <Option value={tableModify.userId}>{tableModify.empLoginAccount}</Option>
                                    {
                                        selectOption.map((s,v)=> <Option key={v} value={s.userId}>{s.userName}</Option> )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="登陆信息状态"
                            hasFeedback
                        >
                            {getFieldDecorator('loginInfoState', {
                                initialValue:tableModify.empLoginState?tableModify.empLoginState:null,
                            })(
                                <Select>
                                    <Option value="T">有效</Option>
                                    <Option value="F">无效</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <div className="modalButton">
                                <Button
                                    size="large"
                                    onClick={this.handleReset}
                                >
                                    关闭
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={buttonLoading}
                                >
                                    保存
                                </Button>
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

LoginManage = Form.create()(LoginManage);

export default LoginManage;