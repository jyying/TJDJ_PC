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

import Api from '../../../api/request';

const TaskUpdateURL = 'workPackageInfo/updateTask';


class TaskUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonLoading:false
        }
    }

    componentDidMount(){

    }

    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            if (!err) {
                this.setState({
                    buttonLoading:true
                });
                Api.post(TaskUpdateURL,values).then(res=>{
                    this.setState({
                        buttonLoading:false
                    });
                    if(res.errorCode == 0){
                        message.success('更新成功！');
                        sessionStorage.Task = true;
                    } else if(res.errorCode == 1){
                        message.error(res.errorMsg);
                    }
                });
            }
        });
    };

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
                }
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
                    {getFieldDecorator('tId', {
                        initialValue:data.id
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Task类型"
                    hasFeedback
                >
                    {getFieldDecorator('taskType', {
                        initialValue:data.taskType,
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="中文标题"
                    hasFeedback
                >
                    {getFieldDecorator('titleCn', {
                        initialValue:data.titleCn,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="英文标题"
                    hasFeedback
                >
                    {getFieldDecorator('titleEn', {
                        initialValue:data.titleEn,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="依据"
                    hasFeedback
                >
                    {getFieldDecorator('baseline', {
                        initialValue:data.baseline,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="版本"
                    hasFeedback
                >
                    {getFieldDecorator('revision', {
                        initialValue:data.revision,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工作类别"
                    hasFeedback
                >
                    {getFieldDecorator('taskNature', {
                        initialValue:data.taskNature,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="首检"
                    hasFeedback
                >
                    {getFieldDecorator('threshold', {
                        initialValue:data.threshold,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="重复检"
                    hasFeedback
                >
                    {getFieldDecorator('interv', {
                        initialValue:data.interv,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="单位"
                    hasFeedback
                >
                    {getFieldDecorator('unit', {
                        initialValue:data.unit,
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="TASK状态"
                >
                    {getFieldDecorator('taskState', {
                        initialValue:data.taskState,
                    })(
                        <Select style={{ width: 120 }}>
                            <Option value="T">有效</Option>
                            <Option value="F">无效</Option>
                        </Select>
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
const TaskUpdateForm = Form.create()(TaskUpdate);
export default TaskUpdateForm;
