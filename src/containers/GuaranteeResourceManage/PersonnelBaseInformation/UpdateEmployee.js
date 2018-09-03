import React from 'react';
import { Form, Input, Cascader, Select, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import Api from '../../../api/request';

const residences = [{
    value: 'T',
    label: '有',
}, {
    value: 'F',
    label: '无   ',
}];
const empState = [{
    value: 'T',
    label: '有效',
}, {
    value: 'R',
    label: '无效',
}];
class UpdateUserList extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        battleLines:[]
    };
 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const data=this.props.data;
        // console.log(data[0].id);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Api.post('employeeInfo/addOrUpdateEmployeeInfo',{
                    'employeeInfoId':data[0].id,
                    'empName':values.empName,
                    'empEaccount':values.empEaccount,
                    'empNo':values.empNo,
                    'department':values.department,
                    'specialty':values.specialty,
                    'battleLine':values.battleLine,
                    'authInfo':values.authInfo[0],
                    'empState':values.empState,
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

// 新增员工分线下拉改变
    componentDidMount(){
        const battleLines =[];
        Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_BATTLE_LINE'}).then(res=>{
            // console.log(res.data[0].dictName);
            for (let i=0;i<res.data.length;i++){
                battleLines.push({
                    value: res.data[i].id,
                    label: res.data[i].dictName,
                });
            }
            // console.log(battleLines);
            this.setState({
                battleLines:battleLines
            });
        })
    }
    onChange=()=>{

    };
    render() {
        const data=this.props.data;
        // console.log(data[0].battleLine);
        const { getFieldDecorator } = this.props.form;
        const battleLines =this.state.battleLines;
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

                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('empName', {
                        initialValue: [data[0].empName],
                        rules: [{
                            required: true, message: '请填写姓名!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="E账号"
                    hasFeedback
                >
                    {getFieldDecorator('empEaccount', {
                        initialValue: [data[0].empEaccount],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="编号"
                    hasFeedback
                >
                    {getFieldDecorator('empNo', {
                        initialValue: [data[0].empNo],
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
                    label="部门"
                    hasFeedback
                >
                    {getFieldDecorator('department', {
                        initialValue: [data[0].department],
                        rules: [{
                            required: true, message: '请填写部门!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="专业"
                    hasFeedback
                >
                    {getFieldDecorator('specialty', {
                        initialValue: [data[0].specialty],
                        rules: [{
                            validator: this.checkConfirm,
                        }, {
                            required: true, message: '请填写专业!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分线"
                >
                    {getFieldDecorator('battleLine',{
                        initialValue: data[0].battleLine,
                    })(

                        <Select>
                            {
                                battleLines.map((s,v)=>
                                    <Option key={v} value={s.value}>{s.label}</Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否有授权"
                    style={{display:'none'}}
                >
                    {getFieldDecorator('authInfo', {
                        initialValue: [data[0].authInfo],
                    })(
                        <Cascader options={residences} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="员工状态"

                >
                    {getFieldDecorator('empState', {
                        initialValue: data[0].empState,
                    })(
                        <Select>
                            <Option value="T">正常</Option>
                            <Option value="R">离职/调走</Option>
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
