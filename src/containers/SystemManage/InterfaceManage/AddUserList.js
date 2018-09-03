import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    message
} from 'antd';
import Api from '../../../api/request';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const InterfaceInfo = 'interfaceInfo/addOrUpdateInterfaceInfo';

class AddUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonLoading:false
        }
    }
 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                   buttonLoading:true
                });
                Api.post(InterfaceInfo,values).then(res=>{
                    this.setState({
                        buttonLoading:false
                    });
                    if(res) {
                        message.success('添加成功');
                        //this.props.form.resetFields();
                        sessionStorage.interface = true;
                    }
                })
            }
        });
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const {buttonLoading} = this.state;
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
                    label="名称"
                    hasFeedback
                >
                    {getFieldDecorator('interfaceName', {
                        rules: [{
                            required: true, message: '请输入接口名称!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="方法名称"
                    hasFeedback
                >
                    {getFieldDecorator('methodName', {
                        rules: [{
                            required: true, message: '请输入对应的方法名称!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="接口状态"
                >
                    {getFieldDecorator('interfaceState', {
                        initialValue: ['T'],
                    })(
                        <Select style={{ width: 120 }}>
                            <Option value="T">有效</Option>
                            <Option value="F">无效</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="接口方法说明"
                    hasFeedback
                >
                    {getFieldDecorator('methodRemark', {

                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >
                    {getFieldDecorator('interfaceRemark', {

                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>

                        <Button
                            size="large"
                            onClick={onCancel}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={buttonLoading}
                        >
                            确定
                        </Button>

                </FormItem>
            </Form>
        );
    }
}
const UserListForm = Form.create()(AddUserList);
export default UserListForm;
