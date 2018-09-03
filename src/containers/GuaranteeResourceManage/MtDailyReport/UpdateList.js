import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 文件更新
class UpdateList extends React.Component {
    state = {
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.dUpdate;
        console.log('value',value);
        this.props.form.validateFields((err, values) => {
            const stringDate=values.stringDate?values.stringDate.format('YYYY-MM-DD'):'';
            const deadlineDate=values.deadlineDate?values.deadlineDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/si/addOrUpdate',{
                    mdpId:value.id,
                    mtDrId:value.mtDrId,
                    snSeq:values.snSeq,
                    rsInfo:values.rsInfo,
                    pnNo:values.pnNo,
                    nameInfo:values.nameInfo,
                    quantity:values.quantity,
                    stringReason:values.stringReason,
                    stringDate:stringDate,
                    deadlineDate:deadlineDate,
                    safeguard:values.safeguard,
                    hanhour:values.hanhour,
                    typeInfo:values.typeInfo,
                    rowColor:values.rowColor,
                    state:values.state,
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
                        label="序号"
                        hasFeedback
                    >
                        {getFieldDecorator('snSeq',{
                            initialValue:value.snSeq,
                            rules: [{ required: true, message: '序号不能为空!' }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="恢复情况"
                    >
                        {getFieldDecorator('rsInfo',{
                            initialValue:value.rsInfo,
                            rules: [{ required: true, message: '恢复情况不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="件号"
                    >
                        {getFieldDecorator('pnNo',{
                            initialValue:value.pnNo,
                            rules: [{ required: true, message: '件号不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="名称"
                    >
                        {getFieldDecorator('nameInfo',{
                            initialValue:value.nameInfo,
                            rules: [{ required: true, message: '名称不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="数量"
                    >
                        {getFieldDecorator('quantity',{
                            initialValue:value.quantity,
                            rules: [{ required: true, message: '数量不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="串件原因"
                    >
                        {getFieldDecorator('stringReason',{
                            initialValue:value.stringReason,
                            rules: [{ required: true, message: '串件原因不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={2}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="串件日期"
                    >
                        {getFieldDecorator('stringDate',{
                            initialValue:moment(value.stringDate),
                            rules: [{ required: true, message: '串件日期不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="需求时间"
                    >
                        {getFieldDecorator('deadlineDate',{
                            initialValue:moment(value.deadlineDate),
                            rules: [{ required: true, message: '需求时间不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="保障状态"
                    >
                        {getFieldDecorator('safeguard',{
                            initialValue:value.safeguard,
                            rules: [{ required: true, message: '保障状态不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="工时"
                    >
                        {getFieldDecorator('hanhour',{
                            initialValue:value.hanhour,
                            rules: [{ required: true, message: '工时不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="需求类型"
                    >
                        {getFieldDecorator('typeInfo',{
                            initialValue:value.typeInfo,
                            rules: [{required: true, message: '请选择需求类型!',}],
                        })(
                            <Select>
                                <Option value="FC">FC</Option>
                                <Option value="DD">DD</Option>
                                <Option value="AOG">AOG</Option>
                                <Option value="定检">定检</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="本行数据颜色"
                    >
                        {getFieldDecorator('rowColor',{
                            initialValue:value.rowColor,
                            rules: [{required: true, message: '请选择本行数据颜色!',}],
                        })(
                            <Select>
                                <Option value="red">红色字体</Option>
                                <Option value="black">黑色字体</Option>
                                <Option value="pink">黑色字体+底纹</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('state',{
                            initialValue:value.state,
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
const  UpdateLists = Form.create()(UpdateList);
export default UpdateLists;
