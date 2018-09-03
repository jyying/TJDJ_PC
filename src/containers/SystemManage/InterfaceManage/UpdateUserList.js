import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    message
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import Api from '../../../api/request';

const InterfaceInfo = 'interfaceInfo/addOrUpdateInterfaceInfo';


class UpdateUserList extends React.Component {
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
                    if(res.errorCode == 0){
                        message.success('更新成功！');
                        sessionStorage.interface = true;
                    }
                });
            }
        });
    };

    componentDidMount(){

    }

    render() {
        const data = this.props.data;
        const { getFieldDecorator } = this.props.form;
        const {buttonLoading} = this.state;
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
                    label="id"
                    style={{display:'none'}}
                >
                    {getFieldDecorator('interfaceInfoId', {
                        initialValue:data.id
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称"
                    hasFeedback
                >
                    {getFieldDecorator('interfaceName', {
                        initialValue:data.interfaceName,
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
                        initialValue:data.methodName,
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
                        initialValue:data.interfaceState,
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
                        initialValue:data.methodRemark,
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
                        initialValue:data.interfaceRemark,
                    })(
                        <Input />
                    )}
                </FormItem>


                <FormItem {...tailFormItemLayout}>
                    <Button size="large" onClick={onCancel}>取消</Button>
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
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
