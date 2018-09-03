import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 文件更新
class AddTaskRisk extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.state.data;
        this.props.form.validateFields((err, values) => {
            // console.log('a',values,value,value.data.subTaskId);
            if(values.subTaskId!=undefined&&values.riskRemark!=undefined){
                Api.post('subTaskRisk/addOrUpdateSubTaskRisk',{
                    riskId:'',
                    subTaskId:value.data.subTaskId,
                    riskRemark:values.riskRemark,
                    riskState:'T',
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

    checkSubTask = (rule, value, callback) => {
        const form = this.props.form;
        if (value &&  value !== this.state.data.subTaskNo) {
            callback(this.state.data.errorMsg);
        } else {
            callback();
        }
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        Api.post('workPackageInfo/checkSubTask',{subTaskNo:value}).then(res=>{
            // console.log('cccc',res);
            if(res.errorCode==0){
                this.setState({
                    confirmDirty: this.state.confirmDirty|| !!value ,
                    data:res
                });
            }else {
                this.props.form.resetFields(['subTaskId']);
                this.setState({
                    data:res
                });
            }

        });

    };

    render() {
        const {data} = this.state;
        // console.log('data',data);
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
                        label="工卡号"
                         help={data.errorMsg}

                    >
                        {getFieldDecorator('subTaskId', {
                            rules: [{
                                required: true, message: '请输入工卡号!',},{
                                validator: this.checkSubTask,
                            }
                                ],

                        })(
                            <Input  onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="风险描述"
                    >
                        {getFieldDecorator('riskRemark',{
                            rules: [{ required: true, message: '风险描述不能为空!' }],
                        })(
                            <Input type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="状态"*/}
                    {/*>*/}
                        {/*{getFieldDecorator('riskState',{*/}
                            {/*rules: [{required: true, message: '请选择状态!',}],*/}
                        {/*})(*/}
                            {/*<Select>*/}
                                {/*<Option value="T">有效</Option>*/}
                                {/*<Option value="F">无效</Option>*/}
                            {/*</Select>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}

                    <FormItem {...tailFormItemLayout}>
                        <Button  onClick={onCancel} className='btn_reload'>取消</Button>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  AddTaskRisks = Form.create()(AddTaskRisk);
export default AddTaskRisks;
