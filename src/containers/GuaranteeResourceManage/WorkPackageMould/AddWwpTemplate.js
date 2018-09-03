import React from 'react';
import { Form, Input, Cascader, Select, Button, message,Upload,Icon,notification} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';

// 文件新增
class AddWwpTemplate extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const data=this.props.DetailsDatas;
        this.props.form.validateFields(['tptName','tptLevel','tptRemark'],(err, values) => {
            console.log('values',values);
            if(values.tptName!==undefined&& values.tptLevel!=undefined){
                Api.post('weekWorkPackageTemplate/addOrUpdateWwpTemplate',{
                    tptName:values.tptName,
                    tptLevel:values.tptLevel,
                    tptRemark:values.tptRemark,
                    tptState:'T',
                }).then(res => {
                        // console.log('添加后',res);
                        if(res.errorCode == 0) {
                            message.success('添加成功！');
                        } else if(res.errorCode == 1) {
                            message.error('！！！添加失败');
                        }
                    })
            }

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
                    span: 14,
                    offset: 2,
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
                        <Button size="large" onClick={onCancel}>取消</Button>
                        <Button type="primary" htmlType="submit" size="large">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  AddWwpTemplates = Form.create()(AddWwpTemplate);
export default AddWwpTemplates;
