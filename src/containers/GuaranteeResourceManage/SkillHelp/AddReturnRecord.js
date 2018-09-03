import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 新增当日定检飞机退单统计
class AddReturnRecord extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.AddData;
        this.props.form.validateFields((err, values) => {
            if(!err){
                Api.post('subtaskReturnRecord/addOrUpdate',{
                    wwpId:value.wwpId,
                    wwpaId:value.id,
                    airplaneNo:value.wwpAirplaneRegNo,
                    snNo:values.snNo,
                    itemNo:values.itemNo,
                    subtaskNo:values.subtaskNo,
                    workInfo:values.workInfo,
                    returnReason:values.returnReason,
                    state:'T',
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('新增成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！新增失败');
                    }
                })
            }

        });
    };

    componentDidMount(){

    }

    render() {
        const value=this.props.AddData;
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
                        label="飞机号"
                    >
                        {getFieldDecorator('airplaneNo',{
                            initialValue:value.wwpAirplaneRegNo,
                            rules: [{ required: true, message: '飞机号不能为空!' }],
                        })(
                            <Input  placeholder="" disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="SN"
                    >
                        {getFieldDecorator('snNo',{
                            rules: [{required: true, message: 'SN不能为空!',}],
                            })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="ITEM"
                    >
                        {getFieldDecorator('itemNo',{
                            rules: [{required: true, message: 'ITEM不能为空!',}],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="工卡号"
                    >
                        {getFieldDecorator('subtaskNo',{
                            rules: [{ required: true, message: '工卡号不能为空!' }],
                        })(
                            <Input   placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="工作内容"
                    >
                        {getFieldDecorator('workInfo',{
                            rules: [{ required: true, message: '工作内容不能为空!' }],
                        })(
                            <Input type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="退单原因"
                    >
                        {getFieldDecorator('returnReason',{
                            rules: [{required: true, message: '请选择退单原因!',}],
                        })(
                            <Select>
                                <Option value="航材">航材</Option>
                                <Option value="工具设备">工具设备</Option>
                                <Option value="人力">人力</Option>
                                <Option value="停场时间">停场时间</Option>
                                <Option value="天气">天气</Option>
                                <Option value="方案">方案</Option>
                                <Option value="工卡">工卡</Option>
                                <Option value="机位">机位</Option>
                                <Option value="其他">其他</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button  onClick={onCancel} className='btn_reload'>取消</Button>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  AddReturnRecords = Form.create()(AddReturnRecord);
export default AddReturnRecords;
