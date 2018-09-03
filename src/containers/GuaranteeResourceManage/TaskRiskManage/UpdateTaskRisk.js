import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 文件更新
class UpdateTaskRisk extends React.Component {
    state = {
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.taskUpdate;
        this.props.form.validateFields((err, values) => {
            if(!err){
                Api.post('subTaskRisk/addOrUpdateSubTaskRisk',{
                    riskId:value.id,
                    subTaskId:value.subTaskId,
                    riskRemark:values.riskRemark,
                    riskState:values.riskState,
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('更新成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！更新失败');
                    }
                })
            }


        });
    };

    componentDidMount(){

    }

    render() {
        const value=this.props.taskUpdate;
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
                }
            },
        };

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="风险描述"
                    >
                        {getFieldDecorator('riskRemark',{
                            initialValue: value.riskRemark,
                            rules: [{ required: true, message: '风险描述不能为空!' }],
                        })(
                            <Input type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('riskState',{
                            initialValue:value.riskState,
                            rules: [{required: true, message: '请选择状态!',}],
                        })(
                            <Select>
                                <Option value="T">有效</Option>
                                <Option value="F">无效</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button size="large" onClick={onCancel}>取消</Button>
                        <Button type="primary" htmlType="submit" size="large">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  UpdateTaskRisks = Form.create()(UpdateTaskRisk);
export default UpdateTaskRisks;
