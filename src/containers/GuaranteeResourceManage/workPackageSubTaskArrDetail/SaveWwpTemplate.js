import React from 'react';
import { Form, Input, Cascader, Select, Button, message,Upload,Icon,notification} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';

// 保存工作包模板
class SaveWwpTemplate extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.data;
        this.props.form.validateFields(['tptName','tptLevel','tptRemark'],(err, values) => {
            Api.post('workPackageSubTaskArrDetail/createWwpTemplate',{
                tptName:values.tptName,
                tptLevel:values.tptLevel,
                tptRemark:values.tptRemark,
                wwpId:value[0].id,
               })
                .then(res => {
                    // console.log('保存',res);
                    if(res.errorCode == 0) {
                       message.success('保存成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！保存失败',res.errorMsg);
                    }
                })

        });
    };

    render() {
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
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 0,
                },
            },
        };

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label={`工作包模版名称`}>
                        {getFieldDecorator(`tptName`,{
                            rules: [{ required: true, message: '工作包模版名称不能为空!' }],
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`工作包模版级别`}>
                        {getFieldDecorator(`tptLevel`,{
                            rules: [{ required: true, message: '工作包模版级别不能为空!' }],
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`备注`}>
                        {getFieldDecorator(`tptRemark`,{
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button size="large" onClick={onCancel}>关闭</Button>
                        <Button type="primary" htmlType="submit" size="large">提交</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  SaveWwpTemplates = Form.create()(SaveWwpTemplate);
export default SaveWwpTemplates;
