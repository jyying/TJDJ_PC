import React from 'react';
import { Form, Input, Cascader, Select, Button, message,DatePicker } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';

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
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            //console.log(values.userId);
            if (!err) {
                Api.post('role/saveOrUpdateRole',{
                    'roleId':this.props.data[0].id,
                    'roleCode':values.roleCode,
                    'roleName':values.roleName,
                    'roleState':values.roleState[0]
                }).then(res=>{
                    //console.log(res);
                    if(res.errorCode=='0'){
                        message.success('更新成功！');
                        //this.props.form.resetFields();
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
        const data=this.props.data;
        //console.log(data[0])
    }

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
                <FormItem
                    {...formItemLayout}
                    label="角色编码"
                    hasFeedback
                >
                    {getFieldDecorator('roleCode',{initialValue: data[0].roleCode})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="角色名称"
                    hasFeedback
                >
                    {getFieldDecorator('roleName',{initialValue: data[0].roleName})(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="用户状态"
                >
                    {getFieldDecorator('roleState',{initialValue: [data[0].roleState]})(
                        <Select >
                            <Option value="T">有效</Option>
                            <Option value="F">无效</Option>
                            <Option value="D" >删除</Option>
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
