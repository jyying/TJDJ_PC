import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker } from 'antd';

// 生产问题
class ProduceAddList extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.ProduceAdd;
        this.props.form.validateFields((err, values) => {
            // const stringDate=values.stringDate?values.stringDate.format('YYYY-MM-DD'):'';
            const submissionTime=values.submissionTime?values.submissionTime.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/pfp/addOrUpdate',{
                    mtDrId:value[0].id,
                    snSeq:values.snSeq,
                    personInfo:values.personInfo,
                    problemReport:values.problemReport,
                    submissionTime:submissionTime,
                    rpInfo:values.rpInfo,
                    impactInfo:values.impactInfo,
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
                        label="问题报告"
                    >
                        {getFieldDecorator('problemReport',{

                            rules: [{ required: true, message: '问题报告不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={4}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="提交时间"
                    >
                        {getFieldDecorator('submissionTime',{

                            rules: [{ required: true, message: '提交时间不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="责任单位"
                    >
                        {getFieldDecorator('rpInfo',{

                            rules: [{ required: true, message: '责任单位不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="影响"
                    >
                        {getFieldDecorator('impactInfo',{

                            rules: [{ required: true, message: '影响不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="处理方案与进度"
                    >
                        {getFieldDecorator('processInfo',{

                            rules: [{ required: true, message: '处理方案与进度不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={4}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="状态分类"
                    >
                        {getFieldDecorator('statusInfo',{
                            rules: [{required: true, message: '请选择状态分类!',}],
                            })(
                            <Select>
                                <Option value="监控中">监控中</Option>
                                <Option value="已完成">已完成</Option>
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
const  ProduceAddLists = Form.create()(ProduceAddList);
export default ProduceAddLists;
