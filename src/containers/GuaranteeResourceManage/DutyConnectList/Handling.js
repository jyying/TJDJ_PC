import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 处理
class Handling extends React.Component {
    state = {
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.handlingDate;
        this.props.form.validateFields((err, values) => {
            if(!err){
                Api.post('workHandover/dealWorkHandover',{
                    whoId:value.id,
                    processResult:values.processResult,
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('提交成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！提交失败');
                    }
                })
            }
        });
    };

    componentDidMount(){

    }

    render() {
        const value=this.props.dUpdate;
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
                        label="处理过程及结果"
                    >
                        {getFieldDecorator('processResult',{
                            rules: [{ required: true, message: '处理过程及结果不能为空!' }],
                        })(
                            <Input type="textarea" rows={4} placeholder="" />
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
const  Handlings = Form.create()(Handling);
export default Handlings;
