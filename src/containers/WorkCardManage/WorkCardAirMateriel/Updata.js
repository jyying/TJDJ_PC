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
                Api.post('workPackageInfo/updateSubTaskEquipment',{
                    'seId':this.props.data[0].id,
                    'pnNo':values.pnNo,
                    'description':values.description,
                    'equipmentType':values.equipmentType,
                    'quantity':values.quantity,
                    'onCondition':values.onCondition,
                    'applicability':values.applicability,
                    'conditionNote':values.conditionNote,
                    'equipmentState':values.equipmentState,
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
                    label="件号"
                    hasFeedback
                >
                    {getFieldDecorator('pnNo',{initialValue: data[0].pnNo})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="描述"
                    hasFeedback
                >
                    {getFieldDecorator('description',{initialValue: data[0].description})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="设备类型"
                    hasFeedback
                >
                    {getFieldDecorator('equipmentType',{initialValue: data[0].equipmentType})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="数量"
                    hasFeedback
                >
                    {getFieldDecorator('quantity',{initialValue: data[0].quantity})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="视情或必需"
                    hasFeedback
                >
                    {getFieldDecorator('onCondition',{initialValue: data[0].onCondition})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="互换信息及备注"
                    hasFeedback
                >
                    {getFieldDecorator('conditionNote',{initialValue: data[0].conditionNote})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="适用性"
                    hasFeedback
                >
                    {getFieldDecorator('applicability',{initialValue: data[0].applicability})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工卡状态"
                    hasFeedback
                >
                    {getFieldDecorator('equipmentState',{initialValue: [data[0].equipmentState]})(
                        <Cascader options={residences} />
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
