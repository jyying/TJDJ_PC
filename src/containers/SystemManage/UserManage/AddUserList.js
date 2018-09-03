import React from 'react';
import { Form, Input, Cascader, Select, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';


const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
// }, {
//     value: 'D',
//     label: '删除',
}];

class AddUserList extends React.Component {
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
                Api.post('user/addOrUpdateUser',{
                    'userAccount':values.user,
                    'userPwd':values.passW,
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
                        message.success('添加成功！');
                    }else{
                        message.error('失败：'+res.errorMsg);
                    }
                })
            }
        });
    };
    // handleConfirmBlur = (e) => {
    //     const value = e.target.value;
    //     this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // };
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

    render() {
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
                    span: 14,
                    offset: 2,
                },
            },
        };
        // const prefixSelector = getFieldDecorator('prefix', {
        //     initialValue: '86',
        // })(
        //     <Select style={{ width: 60 }}>
        //         <Option value="86">+86</Option>
        //         <Option value="87">+87</Option>
        //     </Select>
        // );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
        const {onCancel} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="账号"
                    hasFeedback
                >
                    {getFieldDecorator('user', {
                        rules: [{
                            required: true, message: '请输入账号!',
                        }, {
                            validator: this.checkConfirm,
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
                    {getFieldDecorator('passW', {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }],
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('userName', {
                        rules: [{
                            required: true, message: '请输入姓名!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="邮箱"
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '请输入邮箱!',
                        }, {
                            required: true, message: '请输入邮箱!',
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
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(
                        <Input  style={{ width: '100%' }} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="E账号"
                    hasFeedback
                >
                    {getFieldDecorator('userEAccount', {
                        rules: [{
                            required: true, message: '请输入E账号!',
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
                        initialValue: 'T',
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

                >
                    {getFieldDecorator('userType', {
                        initialValue: 'A',
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
const UserListForm = Form.create()(AddUserList);
export default UserListForm;
