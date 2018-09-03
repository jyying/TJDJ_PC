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

class UpdateUserList extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        // airplaneCtaDate:'',
        // airplaneDeliveryDate:''
    };
 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const airplaneCtaDate =new Date(values.airplaneCtaDate._d).toLocaleDateString().replace(/\//g, "-");
                const airplaneDeliveryDate =new Date(values.airplaneDeliveryDate._d).toLocaleDateString().replace(/\//g, "-");
                Api.post('air/addOrUpdateAirPalne',{
                    'aiId':this.props.data[0].id,
                    'airplaneModelId':this.props.data[0].airplaneModelId,
                    'airplaneAcReg':values.airplaneAcReg,
                    'airplaneOwner':values.airplaneOwner,
                    'airplaneIpcCode':values.airplaneIpcCode,
                    'airplaneSnSeq':values.airplaneSnSeq,
                    'airplaneCtaDate':airplaneCtaDate,
                    'airplaneDeliveryDate':airplaneDeliveryDate,
                    'engineModel':values.engineModel,
                    'apuModel':values.apuModel,
                    'airplaneOtoOperators':values.airplaneOtoOperators,
                    'remark':values.remark,
                    'airplaneState':values.airplaneState[0]
                }).then(res => {
                    if(res.errorCode=='0'){
                        message.success('更新成功！');
                    }else{
                        message.error('注册号输入错误');//res.errorMsg
                    }
                })
            }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    // checkPassword = (rule, value, callback) => {
    //     const form = this.props.form;
    //     if (value && value !== form.getFieldValue('password')) {
    //         callback('Two passwords that you enter is inconsistent!');
    //     } else {
    //         callback();
    //     }
    // };
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
        const data=this.props.data;
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
                    span: 14,
                    offset: 2,
                },

            },
        };
        const dateFormat = 'YYYY-MM-DD';
        let airplaneCtaDate = new Date(data[0].airplaneCtaDate).toLocaleDateString().replace(/\//g, "-");
        let airplaneDeliveryDate = new Date(data[0].airplaneDeliveryDate).toLocaleDateString().replace(/\//g, "-");
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="注册号"
                    hasFeedback

                >
                    {getFieldDecorator('airplaneAcReg',{
                        initialValue: [data[0].airplaneAcReg],
                        rules: [{ required: true, message: '注册号不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="所有者"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneOwner',{initialValue: [data[0].airplaneOwner]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="IPC有效号"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneIpcCode',{initialValue: [data[0].airplaneIpcCode]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="MSN序号"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneSnSeq',{
                        initialValue: [data[0].airplaneSnSeq],
                        rules: [{ required: true, message: 'MSN序号不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="初始出口适航证日期"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneCtaDate',{initialValue: moment(data[0].airplaneCtaDate)})(
                        <DatePicker placeholder='' />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="交付日期"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneDeliveryDate',{initialValue: moment(data[0].airplaneDeliveryDate)})(
                        <DatePicker placeholder='' />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="发动机型号"
                    hasFeedback
                >
                    {getFieldDecorator('engineModel',{initialValue: [data[0].engineModel]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="APU型号"
                    hasFeedback
                >
                    {getFieldDecorator('apuModel',{initialValue: [data[0].apuModel]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="责任人"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneOtoOperators',{initialValue: [data[0].airplaneOtoOperators]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >
                    {getFieldDecorator('remark',{initialValue: [data[0].remark]})(
                        <Input />
                    )}
                </FormItem><FormItem
                {...formItemLayout}
                label="飞机状态"
                hasFeedback
            >
                {getFieldDecorator('airplaneState',{initialValue: [data[0].airplaneState]})(
                    <Select allowClear={true}>
                        <Option value="T">有效</Option>
                        <Option value="F">无效</Option>
                    </Select>
                )}
            </FormItem>


                <FormItem {...tailFormItemLayout}>
                    <Button size="large" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit" size="large">确定</Button>
                </FormItem>
            </Form>
        );
    }
}
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
