import React from 'react';
import { Form, Input, Cascader, Select, Button, message,Upload,Icon,notification} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 文件更新
class UpdateWwpTemplate extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        docTypeId:[]
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const data=this.props.WwpTemplate;
        this.props.form.validateFields(['tptName','tptLevel','tptRemark','tptState'],(err, values) => {
            console.log(values);
            if(values.tptName!==''&& values.tptLevel!=''){
                Api.post('weekWorkPackageTemplate/addOrUpdateWwpTemplate',{wwptId:data.id,tptName:values.tptName,tptLevel:values.tptLevel,tptRemark:values.tptRemark,tptState:'T'})
                    .then(res => {
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
        const {onCancel} = this.props;
        const data=this.props.WwpTemplate;
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
                    <FormItem {...formItemLayout} label={`工作包模版名称`}>
                        {getFieldDecorator(`tptName`,{
                            initialValue: data.tptName,
                            rules: [{ required: true, message: '工作包模版名称不能为空!' }],
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`工作包模版级别`}>
                        {getFieldDecorator(`tptLevel`,{
                            initialValue: data.tptLevel,
                            rules: [{ required: true, message: '工作包模版级别不能为空!' }],
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`备注`}>
                        {getFieldDecorator(`tptRemark`,{
                            initialValue: data.tptRemark,
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
const  UpdateWwpTemplates = Form.create()(UpdateWwpTemplate);
export default UpdateWwpTemplates;
