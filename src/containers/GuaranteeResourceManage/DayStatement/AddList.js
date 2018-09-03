import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 文件更新
class AddList extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.AddData;
        console.log('value',value);
        this.props.form.validateFields((err, values) => {
            if(!err){
                Api.post('wwpBugSummary/addOrUpdate',{
                    bsId:'',
                    wwpId:value.wwpId,
                    wwpaId:value.id,
                    airplaneNo:value.wwpAirplaneRegNo,
                    dailySchedule:values.dailySchedule,
                    hcToolInfo:values.hcToolInfo,
                    bugInfo:values.bugInfo,
                    updateState:values.updateState,
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
                        {getFieldDecorator('wwpAirplaneRegNo',{
                            initialValue:value.wwpAirplaneRegNo,
                            rules: [{ required: true, message: '飞机号不能为空!' }],
                        })(
                            <Input  placeholder="" disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="当日进度"
                    >
                        {getFieldDecorator('dailySchedule',{
                            rules: [{required: true, message: '请选择当日进度!',}],
                            })(
                            <Select>
                                <Option value="正常">正常</Option>
                                <Option value="非正常">非正常</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="航材、工具保障"
                    >
                        {getFieldDecorator('hcToolInfo',{
                            rules: [{ required: true, message: '航材、工具保障不能为空!' }],
                        })(
                            <Input  type="textarea" rows={2} placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="影响工作进度描述"
                    >
                        {getFieldDecorator('bugInfo',{
                            rules: [{ required: true, message: '影响工作进度描述不能为空!' }],
                        })(
                            <Input type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否更新"
                    >
                        {getFieldDecorator('updateState',{
                            rules: [{required: true, message: '请选择是否更新!',}],
                        })(
                            <Select>
                                <Option value="是">是</Option>
                                <Option value="否">否</Option>
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
const  AddLists = Form.create()(AddList);
export default AddLists;
