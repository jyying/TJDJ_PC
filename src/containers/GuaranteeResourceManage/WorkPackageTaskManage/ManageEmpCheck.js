import React from 'react';
import { Form, Input, Tabs , Table, Cascader, Select, Row, Col, Pagination, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';
// import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const allotType = [{
    value: 'MD',
    label: '人员类型',
    children: [{
        value: 'M',
        label: '生产线经理',
    }, {
        value: 'E',
        label: '跟线员',
    }],
}];


// 生产线经理安排
class ManageEmpCheck extends React.Component {
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
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'index',
            render:(text,record,index) => {
                return <span>{index+1}</span>
            }
        }, {
            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: 'E账号',
            dataIndex: 'empEaccount',
            key: 'empEaccount',
        }, {
            title: '分线',
            dataIndex: 'empBattleLineName',
            key: 'empBattleLineName',
        }, {
            title: '部门',
            dataIndex: 'empDepartment',
            key: 'empDepartment',
        }, {
            title: '专业',
            dataIndex: 'empSpecialty',
            key: 'empSpecialty',
        }];


    };


// 根据工作包分线查询符合条件的员工列表提交
    ManageWorkDaySubmit = (e) => {
        e.preventDefault();
        const value=this.props.isFind;
        // console.log('value',value);
            const workStartTime=this.changetime(value.executeStartTime);
            const workEndTime=this.changetime(value.executeEndTime);
            // console.log(workStartTime,workEndTime);
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    // console.log('Received values of form: ', values);
                    Api.post('weekWorkPackageManager/findEmpManagerByWwp',{'wwpId':value.id,
                        'workStartTime':workStartTime,
                        'workEndTime':workEndTime,
                        'wwpEmpType':'E',
                        'empName':values.empName?values.empName:'',
                    }).then(res=>{
                        // console.log('被选中',res);
                        // 被选中员工
                        let newSelectedRowKeys = [];
                        for(let i=0;i<res.data.length;i++){
                            if(res.data[i].checked=='T'){
                                newSelectedRowKeys.push(res.data[i].id);
                            }
                        }
                        this.setState({
                            data:res? res.data:[],
                            // currentPage:parseInt(res.pageInfo.currentPage),
                            // totalSize:parseInt(res.pageInfo.totalSize),
                            loading:false,
                            selectedRowKeys:newSelectedRowKeys,
                            wwpId:value.id,
                            workStartTime:workStartTime,
                            workEndTime:workEndTime,
                            wwpEmpType:'E',
                            empName:values.empName?values.empName:'',
                            pageNow:this.state.pageNow
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
        const value=this.props.isFind;
        // console.log('value',value);
        const workStartTime=this.changetime(value.executeStartTime);
        const workEndTime=this.changetime(value.executeEndTime);
        // console.log(workStartTime,workEndTime);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Api.post('weekWorkPackageManager/findEmpManagerByWwp',{'wwpId':value.id,
                    'workStartTime':workStartTime,
                    'workEndTime':workEndTime,
                    'wwpEmpType':'E',
                    'empName':values.empName?values.empName:'',
                }).then(res=>{
                    // console.log('被选中',res);
                    // 被选中员工
                    let newSelectedRowKeys = [];
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i].checked=='T'){
                            newSelectedRowKeys.push(res.data[i].id);
                        }
                    }
                    this.setState({
                        data:res? res.data:[],
                        // currentPage:parseInt(res.pageInfo.currentPage),
                        // totalSize:parseInt(res.pageInfo.totalSize),
                        loading:false,
                        selectedRowKeys:newSelectedRowKeys,
                        wwpId:value.id,
                        workStartTime:workStartTime,
                        workEndTime:workEndTime,
                        wwpEmpType:'E',
                        empName:values.empName?values.empName:'',
                        pageNow:this.state.pageNow
                    })
                })
            }
        });
    }

   onChange=(pageNumber)=>{
       const value=this.props.isFind;
       this.props.form.validateFieldsAndScroll((err, values) => {
           if (!err) {
               // console.log('Received values of form: ', values);
               Api.post('weekWorkPackageManager/findEmpManagerByWwp',{wwpId:this.state.wwpId,
                   workStartTime:this.state.workStartTime,
                   workEndTime:this.state.workEndTime,
                   wwpEmpType:this.state.wwpEmpType,
                   empName:this.state.empName,
                   pageNow:pageNumber
               }).then(res=>{
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
                   })
               })
           }
       });
};

// 监听人员是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
 // 工作包生产线经理、跟线员安排
    save = () => {
        const empManagerIds = this.state.selectedRowKeys;
        // console.log('empManagerIds',empManagerIds);
        const value=this.props.isFind;
        // console.log('包名',value.id);
        this.props.form.validateFieldsAndScroll((err, values) => {
            //    人员类型
                Api.post('weekWorkPackageManager/wwpEmpManagerScheduling',{'wwpId':value.id,
                    'wwpEmpType':values.allotType[1],
                    'wwpEmpState':'T',
                    'empManagerIds':empManagerIds,
                }).then(res=>{
                    // console.log(res);
                    if(res.errorCode=='0'){
                        message.success('安排成功！');

                    }else{
                        message.error('安排失败！');
                    }
                })

        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        this.WorkDaySubmit();
    };

    render() {
        const columns = this.columns;
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const {page}=this.state;
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

                                <Col span={8} key={5} style={{display:'none'}}>
                                        <FormItem
                                        {...formItemLayout}
                                        label="分配类型"

                                    >
                                        {getFieldDecorator('allotType', {
                                            initialValue: ['MD','E'],
                                            rules: [{
                                                required: true, message: '请选择分配类型!',
                                            }, {
                                                validator: this.checkConfirm,
                                            }],
                                        })(
                                            <Cascader options={allotType}  showSearch placeholder="" disabled/>
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
                            </Row>
                            <Row>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                        重置
                                    </Button>
                                    <Button type="primary" htmlType="submit">查询</Button>

                                </Col>
                            </Row>
                        </Form>
                </div>
                <div className="content" >
                    <Row  type="flex" justify="end">
                            <Col span={6} style={{marginBottom:'10px'}}>
                                <Button type="primary" onClick={this.save}>保存</Button>
                            </Col>
                    </Row>
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} rowSelection={rowSelection} bordered size="middle"/>
                    {/*<Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条`}/>*/}
                </div>
            </div>
        );
    }
}
const ManageEmpCheckForm = Form.create()(ManageEmpCheck);
export default ManageEmpCheckForm;
