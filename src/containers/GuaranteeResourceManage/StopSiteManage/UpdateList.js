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
                Api.post('airPlaneStandInfo/addOrUpdateAirPlaneStandInfo',{
                    'airPalneStandInfoId':data[0].id,
                    'hangarName':values.hangarName,
                    'hangarAbb':values.hangarAbb,
                    'terminalName':values.terminalName,
                    'terminalNo':values.terminalNo,
                    'standName':values.standName,
                    'standNo':values.standNo,
                    'remark':values.remark,
                }).then(res=>{
                    if(res.errorCode=='0'){
                        message.success('更新成功！');
                    }else {
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
                    {/*{getFieldDecorator('airPalneStandInfoId', {*/}
                        {/*initialValue: data[0].id,*/}
                    {/*})(*/}
                        {/*<Input disabled/>*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="机库"
                    hasFeedback
                >
                    {getFieldDecorator('hangarName', {
                        initialValue: data[0].hangarName,
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
                    {getFieldDecorator('hangarAbb', {
                        initialValue: data[0].hangarAbb,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机库名称"
                    hasFeedback
                >
                    {getFieldDecorator('terminalName', {
                        initialValue: data[0].terminalName,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="航站编号"
                    hasFeedback
                >
                    {getFieldDecorator('terminalNo', {
                        initialValue: data[0].terminalNo,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机位名称"
                    hasFeedback
                >
                    {getFieldDecorator('standName', {
                        initialValue: data[0].standName,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机位编号"
                    hasFeedback
                >
                    {getFieldDecorator('standNo', {
                        initialValue: data[0].standNo,
                        rules: [{
                            required: true,
                        }],
                    })(
                        <Input/>
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
                    <Button type="primary" htmlType="submit" size="large">确定</Button>
                </FormItem>
            </Form>
        );
    }
}
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
