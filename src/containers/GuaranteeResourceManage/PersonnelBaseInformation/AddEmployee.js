import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
import Api from '../../../api/request';


const residences = [{
    value: 'T',
    label: '有',
}, {
    value: 'F',
    label: '无',
}];
const empState = [{
    value: 'T',
    label: '正常',
}, {
    value: 'R',
    label: '离职/调走',
}];


class AddUserList extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
           battleLine:[]
        };

    }

 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Api.post('employeeInfo/addOrUpdateEmployeeInfo',{'empEaccount':values.empEaccount,
                    'empName':values.empName,
                    'empNo':values.empNo,
                    'department':values.department,
                    'specialty':values.specialty,
                    'battleLine':values.battleLine?values.battleLine[0]:'',
                    'authInfo':values.authInfo[0],
                    'empState':values.empState,
                }).then(res=>{
                    // console.log(res);
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else {
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
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
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
    const battleLine =[];
    Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_BATTLE_LINE'}).then(res=>{
        // console.log(res.data[0].dictName);
        for (let i=0;i<res.data.length;i++){
       battleLine.push({
        value: res.data[i].id,
        label: res.data[i].dictName,
    });
}
        this.setState({
            battleLine:battleLine
        });
    })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const battleLine=this.state.battleLine;
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

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
        const {onCancel} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>

                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('empName', {
                        rules: [{
                            required: true, message: '请填写员工姓名!',
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
                        rules: [{
                            required: true, message: '请填写员工编号!',
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
                        rules: [{
                            required: true, message: '请填写员工部门!',
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
                        rules: [{
                            validator: this.checkConfirm,
                        }, {
                            required: true, message: '请填写员工专业!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="分线"
                    hasFeedback
                >
                    {getFieldDecorator('battleLine',{
                        // initialValue: [],
                    })(
                        <Cascader options={battleLine} onChange={this.onChange} placeholder=""/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否有授权"
                    style={{display:'none'}}
                >
                    {getFieldDecorator('authInfo', {
                        initialValue: ['T'],
                    })(
                        <Cascader options={residences} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="员工状态"

                >
                    {getFieldDecorator('empState', {
                        initialValue: 'T',
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
const UserListForm = Form.create()(AddUserList);
export default UserListForm;
