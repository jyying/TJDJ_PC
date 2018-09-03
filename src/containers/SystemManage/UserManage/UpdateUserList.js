import React from 'react';
import { Form, Input, Cascader, Select, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
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
                // console.log('Received values of form: ', values);
                Api.post('user/addOrUpdateUser',{
                    'userId':data[0].id,
                    'userAccount':values.userAccount,
                    'userPwd':values.userPwd,
                    'userName':values.userName,
                    'userEmail':values.email,
                    'mobilePhone':values.mobilePhone,
                    'userEAccount':values.userEAccount,
                    'userState':values.userState,
                    'remark':values.remark,
                    'userType':values.userType
                }).then(res=>{
                    // console.log(res);
                    if(res.errorCode=='0'){
                        message.success('修改成功！');
                    }else{
                        message.error('失败：'+res.errorMsg);
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
        const data=this.props.data;
    }

    render() {
        const data=this.props.data;
        // console.log(data[0]);
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
        const {onCancel} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="用户ID"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*{getFieldDecorator('userId', {*/}
                        {/*initialValue: [data[0].id],*/}
                        {/*rules: [{*/}
                            {/*required: true, message: 'The input is not valid E-mail!',*/}
                        {/*}, {*/}
                            {/*validator: this.checkConfirm,*/}
                        {/*}],*/}
                    {/*})(*/}
                        {/*<Input disabled/>*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="账号"
                    hasFeedback
                >
                    {getFieldDecorator('userAccount', {
                        initialValue: [data[0].userAccount],
                        rules: [{
                            required: true, message: '请填写账号!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                >
                    {getFieldDecorator('userPwd', {
                        initialValue: [data[0].userPwd],
                        rules: [{
                            required: true, message: '请填写密码!',
                        }],
                    })(
                        <Input  onBlur={this.handleConfirmBlur} placeholder="请输入新密码" type="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('userName', {
                        initialValue: [data[0].userName],
                        rules: [{
                            required: true, message: '请填写姓名!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="邮箱"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        initialValue: [data[0].userEmail],
                        rules: [{
                            validator: this.checkConfirm,
                        }, {
                            required: true, message: '请填写邮箱!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机号"
                    hasFeedback
                >
                    {getFieldDecorator('mobilePhone', {
                        initialValue: [data[0].mobilePhone],
                        rules: [{ required: true, message: '请填写手机号!' }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="E账号"
                    hasFeedback
                >

                    {getFieldDecorator('userEAccount', {
                        initialValue: [data[0].userEAccount],
                        rules: [{
                            required: true, message: '请填写E账号!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="用户状态"

                >
                    {getFieldDecorator('userState', {
                        initialValue: data[0].userState,
                        rules: [{required: true, message: '请选择用户状态!' }],
                    })(
                        <Select>
                            <Option value="T">有效</Option>
                            <Option value="F">无效</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="账号类型"
                    validateStatus="warning"
                    help="当类型为‘管理员’时，登录账号为本系统账号；当类型为‘员工’时，登录账号为E账号"
                >
                    {getFieldDecorator('userType', {
                        initialValue: [data[0].userType],
                    })(
                        <Select>
                            <Option value="A">管理员</Option>
                            <Option value="E">员工</Option>
                        </Select>
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
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
