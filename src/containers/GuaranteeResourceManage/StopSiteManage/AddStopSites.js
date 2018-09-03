import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
import Api from '../../../api/request';

const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}, {
    value: 'D',
    label: '删除',
}];

class AddStopSite extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Api.post('airPlaneStandInfo/addOrUpdateAirPlaneStandInfo',{
                    'hangarName':values.hangarName,
                    'hangarAbb':values.hangarAbb,
                    'terminalName':values.terminalName,
                    'terminalNo':values.terminalNo,
                    'standName':values.standName,
                    'standNo':values.standNo,
                    'remark':values.remark,
                    'standState':values.standState
                }).then(res=>{
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else if(res.errorMsg=='机位存在'){
                        message.error('机位已存在！');
                    } else{
                        message.error('添加失败！');
                    }
                })
            }
        });
    };

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
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
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="机库"
                    hasFeedback
                >
                    {getFieldDecorator('hangarName',{
                        rules: [{ required: true, message: '机库不能为空!' }],
                    })(

                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机库缩写"
                    hasFeedback
                >
                    {getFieldDecorator('hangarAbb')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="航站名称"
                    hasFeedback
                >
                    {getFieldDecorator('terminalName')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="航站编号"
                    hasFeedback
                >
                    {getFieldDecorator('terminalNo')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机位名称"
                    hasFeedback
                >
                    {getFieldDecorator('standName')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机位编号"
                    hasFeedback
                >
                    {getFieldDecorator('standNo',{
                        rules: [{
                        required: true, message: '请输入你的机位编号!',
                    }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >
                    {getFieldDecorator('remark')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={`机位状态`}
                    hasFeedback
                >
                    {getFieldDecorator(`standState`)(
                        <Select>
                            <Option value="T">有效</Option>
                            <Option value="F">无效</Option>
                            <Option value="">全部</Option>
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
const AddStopSites = Form.create()(AddStopSite);
export default AddStopSites;
