import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message,DatePicker  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];
function onChange(date, dateString) {
    console.log(date, dateString);
}
class AddUserList extends React.Component {
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
            if (!err) {
                Api.post('role/saveOrUpdateRole',{
                    'roleCode':values.roleCode,
                    'roleName':values.roleName,
                    'roleState':values.roleState[0]
                }).then(res=>{
                    //console.log(res.data, values);
                    // console.log(res);
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else{
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
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 60 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="角色编号"
                    hasFeedback
                >
                    {getFieldDecorator('roleCode')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="角色名称"
                    hasFeedback
                >
                    {getFieldDecorator('roleName')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"

                    hasFeedback
                >
                    {getFieldDecorator('roleState')(
                        <Cascader options={residences} />
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
