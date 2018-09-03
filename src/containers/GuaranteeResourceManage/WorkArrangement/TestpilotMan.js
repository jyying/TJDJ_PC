import React from 'react';
import { Form, Input, Tabs , Table, Cascader, Icon, Row, Col, Pagination , Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const empType = [{
    value: 'T',
    label: '试车员',
    }, {
        value: 'O',
        label: '观察员',
    }];



// 分配 试车员、观察员
class TestpilotMan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            data: [],
            loading:false,
            page:{},
            selectedRowKeys: [],
            pageNow:1,
            empType:''
        };
        this.columns = [{
            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: 'E账号',
            dataIndex: 'empEaccount',
            key: 'empEaccount',
        }, {
            title: '员工编号',
            dataIndex: 'empNo',
            key: 'empNo',
        }, {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
        }, {
            title: '专业',
            dataIndex: 'specialty',
            key: 'specialty',
        }, {
            title: '分线',
            dataIndex: 'battleLineName',
            key: 'battleLineName',
        }];


    };


// 查询员工列表【用于分配 试车员、观察员】
    ManageWorkDaySubmit = (e) => {
        e.preventDefault();
        const value=this.props.Find;
        this.setState({
            loading:true,
        });
            this.props.form.validateFields(['empType','empName','empEAccount'],(err, values) => {
                if (!err) {
                    // console.log('Received values of form: ', values);
                    Api.post('weekWorkPackageEmployee/findEmpForTestpilotManObserverMan',{
                        'wwpaId':value.id,
                        'testpilotMan':values.empType[0]=='T'&&value.testpilotMan!=null?value.testpilotMan:'',
                        'observerMan':values.empType[0]=='O'&&value.observerMan!=null?value.observerMan:'',
                        'pageNow':this.state.pageNow,
                        'empType':values.empType?values.empType[0]:'',
                        'empName':values.empName?values.empName:'',
                        'empEAccount':values.empEAccount?values.empEAccount:'',
                    }).then(res=>{
                        console.log('被选中',res);
                        // 被选中员工
                        let newSelectedRowKeys = [];
                        for(let i=0;i<res.data.length;i++){
                            if(res.data[i].checked=='T'){
                                newSelectedRowKeys.push(res.data[i].id);
                            }
                        }
                        this.setState({
                            data:res? res.data:[],
                            currentPage:parseInt(res.pageInfo.currentPage),
                            totalSize:parseInt(res.pageInfo.totalSize),
                            loading:false,
                            selectedRowKeys:newSelectedRowKeys,
                            wwpaId:value.id,
                            empType:values.allotType?values.allotType[0]:'',
                            empName:values.empName?values.empName:'',
                            empEAccount:values.empEAccount?values.empEAccount:'',
                            testpilotMan:values.empType[0]=='T'&&value.testpilotMan!=null?value.testpilotMan:'',
                            observerMan:values.empType[0]=='O'&&value.observerMan!=null?value.observerMan:'',
                            pageNow:this.state.pageNow,
                        })
                    })
                }
            });

    };

    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

//
    componentDidMount(){

    }

    // 分页查询
    onChange = (pageNumber) => {
        // console.log(pageNumber);
        const value=this.props.Find;
        this.props.form.validateFields(['empType','empName','empEAccount'],(err, values) => {
            // console.log(values);
            Api.post('weekWorkPackageEmployee/findEmpForTestpilotManObserverMan',{
                'wwpaId':value.id,
                'testpilotMan':this.state.testpilotMan,
                'observerMan':this.state.observerMan,
                'empType':this.state.empType,
                'empName':this.state.empName,
                'empEAccount':this.state.empEAccount,
                'pageNow':pageNumber
            }).then(res=>{
                // console.log('分页后',res);
                // 被选中员工
                let newSelectedRowKeys = [];
                for(let i=0;i<res.data.length;i++){
                    if(res.data[i].checked=='T'){
                        newSelectedRowKeys.push(res.data[i].id);
                    }
                }
                this.setState({
                    selectedRowKeys:newSelectedRowKeys,
                    loading:false,
                    data:res? res.data:[],
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalSize:parseInt(res.pageInfo.totalSize),
                });
            })
        });
    };

// 监听人员是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
 // 分配 试车员、观察员
    save = () => {
        const empManagerIds = this.state.selectedRowKeys;
        const value=this.props.Find;
        // console.log('包名',value);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(empManagerIds.length>0){
                if(values.empType[0]=='T'){
                    //    试车员类型
                    Api.post('weekWorkPackageEmployee/saveOrUpdateTestpilotMan',{'wwpaId':value.id,
                        'testpilotMan':empManagerIds,
                    }).then(res=>{
                        // console.log(res);
                        if(res.errorCode=='0'){
                            message.success('试车员安排成功！');

                        }else{
                            message.error('试车员安排失败！');
                        }
                    })

                }else {
                    //    观察员类型
                    Api.post('weekWorkPackageEmployee/saveOrUpdateObserverManName',{'wwpaId':value.id,
                        'observerMan':empManagerIds,
                    }).then(res=>{
                        // console.log(res);
                        if(res.errorCode=='0'){
                            message.success('观察员安排成功！');

                        }else{
                            message.error('观察员安排失败！');
                        }
                    })
                }
            }else {
                message.warning('未选择人员');
            }



        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const columns = this.columns;
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const {page,pageNow}=this.state;
        const { data } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 0,
                },
            },
        };

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="输入查询条件" key="1"></TabPane>
                    </Tabs>
                        <Form onSubmit={this.ManageWorkDaySubmit}>
                            <Row gutter={40}>

                                <Col span={8} key={5} >
                                        <FormItem
                                        {...formItemLayout}
                                        label="分配类型"

                                    >
                                        {getFieldDecorator('empType', {
                                            initialValue: ['T'],
                                            rules: [{
                                                required: true, message: '请选择分配类型!',
                                            }, {
                                                validator: this.checkConfirm,
                                            }],
                                        })(
                                            <Cascader options={empType}  showSearch placeholder=""/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8} key={1} >
                                    <FormItem
                                    {...formItemLayout}
                                    label="员工姓名"
                                    hasFeedback
                                    >
                                    {getFieldDecorator('empName', {
                                    })(
                                    <Input />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={8} key={2} >
                                    <FormItem
                                        {...formItemLayout}
                                        label="员工E账号"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('empEAccount', {
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
                                    <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>

                                </Col>
                            </Row>
                        </Form>
                </div>
                <div className="content" >
                    <div style={{width:'100%',height:'40px'}}>

                                <Button  onClick={this.save} className="btn_reload" style={{float:'left'}}>保存</Button>

                    </div>
                    <Table  columns={columns} dataSource={data}  rowKey='id' loading={this.state.loading} rowSelection={rowSelection} pagination={false} bordered size="middle"/>
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条`}/>
                </div>
            </div>
        );
    }
}
const TestpilotManForm = Form.create()(TestpilotMan);
export default TestpilotManForm;
