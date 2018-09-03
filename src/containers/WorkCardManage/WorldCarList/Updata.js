import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message,DatePicker  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// const AutoCompleteOption = AutoComplete.Option;
const { RangePicker } = DatePicker;
// const residences = [{
//     value: 'T',
//     label: '有效',
// }, {
//     value: 'F',
//     label: '无效',
// }, {
//     value: 'D',
//     label: '删除',
// }];
// const exresidences = [{
//     value: 'S',
//     label: '开始',
// }, {
//     value: 'E',
//     label: '结束',
// }, {
//     value: 'F',
//     label: '失败',
// }];
class UpdateList extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        airplaneCtaDate:'',
        airplaneDeliveryDate:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const startTime = new Date(values.Time[0]._d).toLocaleDateString().replace(/\//g, "-")+ " " + new Date(values.Time[0]._d).toTimeString().substr(0, 8);
                const endTime = new Date(values.Time[1]._d).toLocaleDateString().replace(/\//g, "-")+ " " +  new Date(values.Time[1]._d).toTimeString().substr(0, 8);
                console.log(values);
                Api.post('workPackageInfo/updateSubTaskList',{
                    'stlId':this.props.data[0].id,
                    'revision':values.revision,
                    'mcdRev':values.mcdRev,
                    'skill':values.skill,
                    'workArea':values.workArea,
                    'content':values.content,
                    'threshold':values.threshold,
                    'manHours':values.manHours,
                    'taskType':values.taskType,
                    'remark':values.remark,
                    'actualHour':values.actualHour,
                    'listState':values.listState?values.listState[0]:'',
                    'executeBy':values.executeBy,
                    'executeStartTime':startTime,
                    'executeEndTime':endTime,
                    'executeStatus':values.executeStatus?values.executeStatus[0]:'',
                    'executeRemark':values.executeRemark
                }).then(res => {
                    if(res.errorCode=='0'){
                        message.success('更新成功！');

                    }else{
                        message.error('更新失败！');
                    }
                })
            }
        });
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

    componentDidMount(){

    }

    render() {
        const data=this.props.data;
        const { getFieldDecorator } = this.props.form;
        const {onCancel} = this.props;
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
        let startTime = new Date(data[0].executeStartTime).toLocaleDateString().replace(/\//g, "-")+ " " +new Date(data[0].executeStartTime).toTimeString().substr(0, 8);
        let endTime = new Date(data[0].executeEndTime).toLocaleDateString().replace(/\//g, "-")+ " " + new Date(data[0].executeEndTime).toTimeString().substr(0, 8);
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        return (
            <Form onSubmit={this.handleSubmit}
                  className="ant-advanced-search-form">


                <Row gutter={10}>
                    <Col span={8} key={1} >
                        <FormItem
                            {...formItemLayout}
                            label="厂家工卡＆修订日期"
                            hasFeedback
                        >
                            {getFieldDecorator('mcdRev',{initialValue: data[0].mcdRev})(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key={2} >
                <FormItem
                    {...formItemLayout}
                    label="版本号"
                    hasFeedback
                >
                    {getFieldDecorator('revision',{initialValue: data[0].revision})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={3} >
                <FormItem
                    {...formItemLayout}
                    label="工作内容"
                    hasFeedback
                >
                    {getFieldDecorator('content',{initialValue: data[0].content})(
                        <Input  />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={4} >
                <FormItem
                    {...formItemLayout}
                    label="间隔"
                    hasFeedback
                >
                    {getFieldDecorator('threshold',{initialValue: data[0].threshold})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={5} >
                <FormItem
                    {...formItemLayout}
                    label="工作区域"
                    hasFeedback
                >
                    {getFieldDecorator('workArea',{initialValue: data[0].workArea})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={6} >
                <FormItem
                    {...formItemLayout}
                    label="工种"
                    hasFeedback
                >
                    {getFieldDecorator('skill',{initialValue: data[0].skill})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={7} >
                <FormItem
                    {...formItemLayout}
                    label="工时（单位小时）"
                    hasFeedback
                >
                    {getFieldDecorator('manHours',{initialValue: data[0].manHours})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={8} >
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >
                    {getFieldDecorator('remark',{initialValue: data[0].remark})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={9} >
                <FormItem
                    {...formItemLayout}
                    label="工卡类型"
                    hasFeedback
                >
                    {getFieldDecorator('taskType',{initialValue: data[0].taskType})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={10} >
                <FormItem
                    {...formItemLayout}
                    label="实际工时"
                    hasFeedback
                >
                    {getFieldDecorator('actualHour',{initialValue: data[0].actualHour})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={8} key={11} >
                <FormItem
                    {...formItemLayout}
                    label="执行人"
                    hasFeedback
                >
                    {getFieldDecorator('executeBy',{initialValue: data[0].executeBy})(
                        <Input />
                    )}
                </FormItem>
                    </Col>

                    <Col span={8} key={12} >
                <FormItem
                    {...formItemLayout}
                    label="执行状态"
                    hasFeedback
                >
                    {getFieldDecorator('executeStatus',{initialValue: data[0].executeStatus})(
                        <Select initialValue={data[0].executeStatus} >
                            <Option value="S">开始</Option>
                            <Option value="E">结束</Option>
                            <Option value="F" >失败</Option>
                        </Select>
                    )}
                </FormItem>
                    </Col>

                    <Col span={18} key={13} >
                        <FormItem
                            {...formItemLayout}
                            label="执行开始/结束(时间)"
                            hasFeedback
                        >
                            {getFieldDecorator('Time', {
                                initialValue:[moment(startTime, dateFormat), moment(endTime, dateFormat)],
                                rules: [{
                                    required: true, message: '请选择开始结束时间!',
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <RangePicker showTime  format="YYYY-MM-DD HH:mm:ss"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10} key={14} >
                <FormItem
                    {...formItemLayout}
                    label="执行备注"
                    hasFeedback
                >
                    {getFieldDecorator('executeRemark',{initialValue: data[0].executeRemark})(
                        <Input />
                    )}
                </FormItem>
                    </Col>
                    <Col span={12} key={15} >
                <FormItem
                {...formItemLayout}
                label="工卡清单状态"
                hasFeedback
            >
                {getFieldDecorator('listState',{initialValue: [data[0].listState]})(
                    <Select initialValue={data[0].listState} >
                        <Option value="T">有效</Option>
                        <Option value="F">无效</Option>
                        <Option value="D" >删除</Option>
                    </Select>
                )}
            </FormItem>

                    </Col>
                </Row>
                <FormItem {...tailFormItemLayout}>
                    <Button size="large" onClick={onCancel}>关闭</Button>
                    <Button type="primary" htmlType="submit" size="large">保存</Button>
                </FormItem>

            </Form>
        );
    }

}

const Updata = Form.create()(UpdateList);
export default Updata;
