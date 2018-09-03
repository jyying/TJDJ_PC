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

const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];

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
                console.log(this.props.data[0].id,values);
                Api.post('workPackageInfo/updateSubTask',{
                    'stId':this.props.data[0].id,
                    'mcdRev':values.mcdRev,
                    'titleCn':values.titleCn,
                    'titleEn':values.titleEn,
                    'jcRev':values.jcRev,
                    'workArea':values.workArea,
                    'skill':values.skill,
                    'standardHour':values.standardHour,
                    'remark':values.remark,
                    'subTaskState':values.subTaskState?values.subTaskState[0]:''
                }).then(res => {
                    if(res.errorCode=='0'){
                        message.success('修改成功！');
                    }else{
                        message.error('修改失败！');
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

        return (


            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="厂家工卡＆修订日期"
                    hasFeedback
                >
                    {getFieldDecorator('mcdRev',{initialValue: data[0].mcdRev})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="英文标题"
                    hasFeedback
                >
                    {getFieldDecorator('titleCn',{initialValue: data[0].titleCn})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="中文标题"
                    hasFeedback
                >
                    {getFieldDecorator('titleEn',{initialValue: data[0].titleEn})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工卡版本号"
                    hasFeedback
                >
                    {getFieldDecorator('jcRev',{initialValue: data[0].jcRev})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工作区域"
                    hasFeedback
                >
                    {getFieldDecorator('workArea',{initialValue: data[0].workArea})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工种"
                    hasFeedback
                >
                    {getFieldDecorator('skill',{initialValue: data[0].skill})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="标准工时（单位小时）"
                    hasFeedback
                >
                    {getFieldDecorator('standardHour',{initialValue: data[0].standardHour})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="工卡状态"
                hasFeedback
            >
                {getFieldDecorator('subTaskState',{initialValue: [data[0].subTaskState]})(
                    <Select >
                        <Option value="T">有效</Option>
                        <Option value="F">无效</Option>
                        <Option value="D" >删除</Option>
                    </Select>
                )}
            </FormItem>


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
