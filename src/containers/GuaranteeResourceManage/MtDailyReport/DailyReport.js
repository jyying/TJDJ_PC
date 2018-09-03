import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker } from 'antd';
import moment from 'moment';

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
        const value=this.props.valueData;
        const dailyDate=this.props.valueTime;
        console.log('value',value,dailyDate);
        this.props.form.validateFields((err, values) => {
            const newDateOutput=values.newDateOutput?values.newDateOutput.format('YYYY-MM-DD'):'';
            // console.log('newDateOutput',newDateOutput);
            if(!err){
                Api.post('mtDailyReport/addOrUpdate',{
                    wwpId:value[0].wwpId,
                    wwpaId:value[0].id,
                    commandNo:value[0].wwpCommandNo,
                    dailyDate:dailyDate,
                    stringQuality:values.stringQuality,
                    cusName:values.cusName,
                    srInfo:values.srInfo,
                    newDateOutput:newDateOutput,
                    stlTotal:values.stlTotal,
                    stlCompletedNum:values.stlCompletedNum,
                    stlAddNum:values.stlAddNum,
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
    checkConfirm = (rule, value, callback) => {
        const reg=new RegExp("^[0-9]*[1-9][0-9]*$");
        if (!reg.test(value)) {
            callback('只能输入数字!');
        } else {
            callback();
        }
    };
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
                        label="串件数量"
                        hasFeedback
                    >
                        {getFieldDecorator('stringQuality',{
                            rules: [{ required: true, message: '串件数量不能为空!' }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="客户"
                    >
                        {getFieldDecorator('cusName',{
                            rules: [{ required: true, message: '客户不能为空!' }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="监修代表"
                    >
                        {getFieldDecorator('srInfo',{
                            rules: [{ required: true, message: '监修代表不能为空!' }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="出厂日期变更"
                    >
                        {getFieldDecorator(`newDateOutput`,{
                            rules: [{ required: true, message: '日期不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="总工卡数"
                    >
                        {getFieldDecorator('stlTotal',{
                            rules: [{ required: true, message: '总工卡数不能为空!' }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="完工工卡数"
                    >
                        {getFieldDecorator('stlCompletedNum',{
                            rules: [{ required: true, message: '完工工卡数不能为空!' }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="增加工卡数量"
                    >
                        {getFieldDecorator('stlAddNum',{
                            rules: [{required: true, message: '增加工卡数量不能为空!',}],
                        })(
                            <Input  placeholder="" />
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
