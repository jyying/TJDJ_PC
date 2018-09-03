import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker } from 'antd';

// 工具问题
class ToolAddList extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.ToolAdd;
        this.props.form.validateFields((err, values) => {
            // const stringDate=values.stringDate?values.stringDate.format('YYYY-MM-DD'):'';
            const deadlineDate=values.deadlineDate?values.deadlineDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/pft/addOrUpdate',{
                    mtDrId:value[0].id,
                    snSeq:values.snSeq,
                    personInfo:values.personInfo,
                    pnNo:values.pnNo,
                    nameInfo:values.nameInfo,
                    quantity:values.quantity,
                    workRp:values.workRp,
                    rpInfo:values.rpInfo,
                    deadlineDate:deadlineDate,
                    processInfo:values.processInfo,
                    statusInfo:values.statusInfo,
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
                        label="反馈者"
                    >
                        {getFieldDecorator('personInfo',{

                            rules: [{ required: true, message: '反馈者不能为空!' }],
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
                            <Input  placeholder="" type="textarea" rows={2}/>
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
                        label="涉及工作项目"
                    >
                        {getFieldDecorator('workRp',{

                            rules: [{ required: true, message: '涉及工作项目不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={4}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="责任单位"
                    >
                        {getFieldDecorator('rpInfo',{

                            rules: [{ required: true, message: '串件原因不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="需求时间"
                    >
                        {getFieldDecorator('deadlineDate',{

                            rules: [{ required: true, message: '串件日期不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="处理方案与进度"
                    >
                        {getFieldDecorator('processInfo',{

                            rules: [{ required: true, message: '保障状态不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={4}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态分类"
                    >
                        {getFieldDecorator('statusInfo',{
                            rules: [{required: true, message: '请选择需求类型!',}],
                            })(
                            <Select>
                                <Option value="监控中">监控中</Option>
                                <Option value="已保障">已保障</Option>
                                <Option value="已处理">已处理</Option>
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
const  ToolAddLists = Form.create()(ToolAddList);
export default ToolAddLists;
