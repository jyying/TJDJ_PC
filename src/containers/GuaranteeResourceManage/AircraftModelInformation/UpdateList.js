import React from 'react';
import { Form, Input, Cascader, Select, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';

class UpdateUserList extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const data=this.props.data;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                Api.post('airPlaneModel/addOrUpdateAirPalneModel',{
                    'airPlaneModeId':data[0].id,
                    'airPlaneModel':values.airPlaneModel,
                    'remark':values.remark,
                    'airPlaneModelName':values.airPlaneModelName,
                    'airPlaneModelMatch':values.airPlaneModelMatch,
                }).then(res=>{
                    if(res.errorCode==0){
                        message.success('更新成功！');
                    }else{
                        message.error('更新失败：'+res.errorMsg);
                    }
                })
            }
        });
    };
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value == this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }

        callback();
    };
    render() {
        const data=this.props.data;
        const {onCancel} = this.props;
        const { getFieldDecorator } = this.props.form;
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
                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="机型ID"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*{getFieldDecorator('id', {*/}
                        {/*initialValue: [data[0].id],*/}
                    {/*})(*/}
                        {/*<Input disabled/>*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="飞机机型"
                    hasFeedback
                >
                    {getFieldDecorator('airPlaneModel', {
                        initialValue: data[0].airPlaneModel,
                        rules: [{
                            required: true, message: '请填写飞机机型!',
                        },{
                            validator: this.checkConfirm,
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
                        initialValue: data[0].airPlaneModelName,
                        rules: [{
                            required: true, message: '请填写机型全称!',
                        },{
                            validator: this.checkConfirm,
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
                        initialValue: data[0].airPlaneModelMatch,
                        rules: [{
                            required: true, message: '请填写机型机型匹配简称!',
                        },{
                            validator: this.checkConfirm,
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
                    {getFieldDecorator('remark', {
                        initialValue: data[0].remark,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button size="large" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit" size="large">确认</Button>
                </FormItem>
            </Form>
        );
    }
}
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
