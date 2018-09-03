import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker } from 'antd';

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
        const value=this.props.DailyReport;
        console.log('value',value);
        this.props.form.validateFields((err, values) => {
            const stringDate=values.stringDate?values.stringDate.format('YYYY-MM-DD'):'';
            const deadlineDate=values.deadlineDate?values.deadlineDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/si/addOrUpdate',{
                    mtDrId:value[0].id,
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
                        label="序号"
                        hasFeedback
                    >
                        {getFieldDecorator('snSeq',{

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

                            rules: [{ required: true, message: '串件原因不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="串件日期"
                    >
                        {getFieldDecorator('stringDate',{

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

                            rules: [{ required: true, message: '保障状态不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={2}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="工时"
                    >
                        {getFieldDecorator('hanhour',{

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
                            rules: [{required: true, message: '请选择本行数据颜色!',}],
                        })(
                            <Select>
                                <Option value="red">红色字体</Option>
                                <Option value="black">黑色字体</Option>
                                <Option value="pink">黑色字体+底纹</Option>
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
