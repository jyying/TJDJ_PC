import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { DatePicker } from 'antd';
import Api from '../../../api/request';


// 修改问题项
class ProblemUpdate extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:'',
        searchdata:[]
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.titleQ;
        console.log('value',value);
        this.props.form.validateFields((err, values) => {
            if(!err){
                Api.post('technicalSupport/addOrUpdate',{
                    tsId:value.id,
                    wwpId:value.wwpId,
                    wwpaId:value.wwpaId,
                    commandNo:value.commandNo,
                    dailyDate:this.changetime(value.dailyDate),
                    tsTitle:values.tsTitle,
                    state:'T',
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('修改成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！修改失败');
                    }
                })
            }

        });
    };
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };
    componentWillMount (){

    }
    render() {
        const value=this.props.titleQ;
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
                        label="标题"
                    >
                        {getFieldDecorator('tsTitle',{
                            initialValue:value.tsTitle,
                            rules: [{ required: true, message: '标题不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={2} />
                        )}
                    </FormItem>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="备注"*/}
                    {/*>*/}
                        {/*{getFieldDecorator('tsRemark',{*/}
                            {/*initialValue:value.tsRemark,*/}
                            {/*rules: [{ required: true, message: '备注不能为空!' }],*/}
                        {/*})(*/}
                            {/*<Input  placeholder="" />*/}
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
const ProblemUpdates = Form.create()(ProblemUpdate);
export default ProblemUpdates;
