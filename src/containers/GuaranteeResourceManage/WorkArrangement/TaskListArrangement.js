import React from 'react';
import { Form, Input, Tabs , Table, Icon, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const workType = [{
    value: 'D',
    label: '白班',
}, {
    value: 'N',
    label: '晚班',
}];
const allotType = [{
    value: 'PD',
    label: '一线员工',
    children: [{
        value: 'P',
        label: '工作包',
    },{
        value: 'D',
        label: '工作日',
    }],
}];



class TaskListArrangement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            data: [],
            loading:false,
            page:{},
            selectedRowKeys: [],
            Line:[],
        };
        this.columns = [ {
            title: '序号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (text, record,index) => (
                <div>
                    <span>{index+1}</span>
                </div>
            ),
        },
            {
            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: 'E账号',
            dataIndex: 'empEaccount',
            key: 'empEaccount',
        }, {
            title: '部门',
            dataIndex: 'empDepartment',
            key: 'empDepartment',
        // }, {
        //     title: 'empLevel',
        //     dataIndex: 'empLevel',
        //     key: 'empLevel',
        }, {
            title: '分线',
            dataIndex: 'empBattleLineName',
            key: 'empBattleLineName',
        // }, {
        //     title: 'airplaneArea',
        //     dataIndex: 'airplaneArea',
        //     key: 'airplaneArea',
        }, {
            title: '专业',
            dataIndex: 'empSpecialty',
            key: 'empSpecialty',
        }];


    };

    componentWillMount () {
        // 获取分线信息,放在此，实时更新分线信息
        Api.post('weekWorkPackage/findBattleLine')
            .then(res => {
                if(res.errorCode == 0) {
                    this.setState({
                        Line:res.data
                    })
                }
            });

    }
// Admin根据工作包查询符合条件的【用于工作包日计划】的人员
    Submit = (e) => {
        e.preventDefault();
        this.setState({
            loading:true,

        });
        const value=this.props.wwpDayPlan;
            const workTime=this.changetime(value.executeTime);
            // console.log(workTime,value.wwpId,value.id);
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    Api.post('weekWorkPackageEmployee/findEmpForWwpa',{'wwpId':value.wwpId,
                        'workStartTime':workTime,
                        'workEndTime':workTime,
                        'workType':values.workType,
                        'empName':values.empName?values.empName:'',
                        'wwpaId':value.id,
                        'battleLine':values.battleLine?values.battleLine:'',
                    }).then(res=>{
                        // console.log(res);
                        // 被选中员工
                        let newSelectedRowKeys = [];
                        if(res.data){
                            for(let i=0;i<res.data.length;i++){
                                if(res.data[i].checked=='T'){
                                    newSelectedRowKeys.push(res.data[i].id);
                                }
                            }
                            this.setState({
                                data:res? res.data:[],
                                page:res.pageInfo,
                                loading:false,
                                selectedRowKeys:newSelectedRowKeys
                            })
                        }

                    })
                }
            });
        // });


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

   onChange=(value)=>{
    // console.log(value);
};

// 监听人员是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
 // 工作包日计划一线员工安排
    save = () => {
        const empManagerIds = this.state.selectedRowKeys;
        const value=this.props.wwpDayPlan;
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(values);
            //    人员类型
            if(empManagerIds.length>0){
                Api.post('weekWorkPackageEmployee/wwpEmpSchedulingByWwp',{
                    'wwpId':value.wwpId,
                    'wwpaId':value.id,
                    'pdState':'T',
                    'workType':values.workType,
                    'employeeIds':empManagerIds,
                    'remark':'',
                    'battleLine':values.battleLine?values.battleLine:'',
                }).then(res=>{
                    // console.log(res);
                    if(res.errorCode=='0'){
                        message.success('安排成功！');
                    }else{
                        message.error('安排失败！');
                    }
                })
            }else {
                message.warning('未选择人员');
            }


        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.WorkDaySubmit();
    };
    handleChange=(value)=>{
        console.log(`selected ${value}`);
        if(value){
            this.setState({
                data:[],
            })
        }
    };
    render() {
        const value=this.props.wwpDayPlan;
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

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="输入查询条件" key="1"></TabPane>
                    </Tabs>
                        <Form onSubmit={this.Submit}>
                            <Row gutter={40}>
                                <Col span={8} key={1} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="排班类型"

                                        >
                                            {getFieldDecorator('workType', {
                                                initialValue: ['D'],
                                                rules: [{
                                                    required: true, message: '请选择排班类型!',
                                                }, {
                                                    validator: this.checkConfirm,
                                                }],
                                            })(
                                                <Select onChange={this.handleChange}>
                                                    <Option value="D">白班</Option>
                                                    <Option value="N">晚班</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                </Col>
                                <Col span={8} key={2} >
                                    <FormItem
                                        {...formItemLayout}
                                        label="分线"

                                    >
                                        {getFieldDecorator('battleLine', {
                                            initialValue:value.battleLine,
                                        })(
                                            <Select allowClear={true}
                                            >
                                                {
                                                    this.state.Line.map((s,v)=>
                                                        <Option
                                                            key={v}
                                                            value={s.id}
                                                        >{s.dictName}</Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8} key={3} >
                                <FormItem
                                {...formItemLayout}
                                label="员工姓名"
                                hasFeedback
                                help="多个姓名查询使用空格分隔"
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
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                        重置
                                    </Button>
                                    <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>

                                </Col>
                            </Row>
                        </Form>
                </div>
                <div className="content" >
                    <Row  type="flex" justify="end">
                            <Col span={6} style={{marginBottom:'10px'}}>
                                <Button type="primary" onClick={this.save}>增加</Button>
                            </Col>
                    </Row>
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} rowSelection={rowSelection} bordered size="middle"/>
                    <Pagination
                        {...page}
                        onChange={this.onChangePage}
                    />
                </div>
            </div>
        );
    }
}
const TaskListArrangementForm = Form.create()(TaskListArrangement);
export default TaskListArrangementForm;
