import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
import Api from '../../../api/request';


class AddAircraftModel extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Api.post('airPlaneModel/addOrUpdateAirPalneModel',values).then(res=>{
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else{
                        message.error('添加失败:'+res.errorMsg);
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
                    label="飞行机型"
                    hasFeedback
                >
                    {getFieldDecorator('airPlaneModel', {
                        rules: [{
                            required: true, message: '请填入你的机型!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机型全称"
                    hasFeedback
                >
                    {getFieldDecorator('airPlaneModelName', {
                        rules: [{
                            required: true, message: '请填入机型全称!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机型匹配简称"
                    hasFeedback
                >
                    {getFieldDecorator('airPlaneModelMatch', {
                        rules: [{
                            required: true, message: '请填入机型匹配简称!',
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
                <FormItem {...tailFormItemLayout}>
                    <Button size="large" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit" size="large">确定</Button>
                </FormItem>
            </Form>
        );
    }
}
const AddAircraftModels = Form.create()(AddAircraftModel);
export default AddAircraftModels;
