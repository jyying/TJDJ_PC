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
        searchdata:[]
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.dUpdate;
        console.log('value',value);
        this.props.form.validateFields((err, values) => {
            const rpDate=values.rpDate?values.rpDate.format('YYYY-MM-DD'):'';
            const completeTime=values.completeTime?values.completeTime.format('YYYY-MM-DD'):'';
            // const Str=values.rpName;
            // const name=Str.split(",");




            console.log('values',values);
            if(!err){
                Api.post('technicalSuppDetail/addOrUpdate',{
                    tsdId:value.id,
                    tsdType:'C',
                    seqNo:values.seqNo,
                    rpId:values.rpId,
                    // rpName:name[1],
                    rpDate:rpDate,
                    airplaneNo:values.airplaneNo,
                    questionInfo:values.questionInfo,
                    dealInfo:values.dealInfo,
                    workSchedule:values.workSchedule,
                    completeTime:completeTime,
                    tsdRemark:values.tsdRemark,
                    state:values.state,
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('更新成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！更新失败');
                    }
                })
            }
        });
    };

    componentWillMount (){
        Api.post('employeeInfo/findEmployeeByConditionNoPage').then(res=>{
            this.setState({
                searchdata: res?res.data:[]
            });
        });
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
        const {searchdata}=this.state;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="项目号"
                        hasFeedback
                    >
                        {getFieldDecorator('seqNo',{
                            initialValue:value.seqNo,
                            rules: [{ required: true, message: '项目号不能为空!' }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="责任人"
                    >
                        {getFieldDecorator('rpId',{
                            initialValue:value.rpId,
                            rules: [{required: true, message: '责任人不能为空!',}],
                        })(
                            <Select
                                showSearch
                                optionFilterProp="children"
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    searchdata.map((s,v)=><Option key={v} value={s.id}>{s.empName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="记录日期"
                    >
                        {getFieldDecorator('rpDate',{
                            initialValue:moment(value.rpDate),
                            rules: [{ required: true, message: '记录日期不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="飞机号"
                    >
                        {getFieldDecorator('airplaneNo',{
                            initialValue:value.airplaneNo,
                            rules: [{ required: true, message: '飞机号不能为空!' }],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="技术问题描述"
                    >
                        {getFieldDecorator('questionInfo',{
                            initialValue:value.questionInfo,
                            rules: [{ required: true, message: '技术问题描述不能为空!' }],
                        })(
                            <Input  type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="处理措施"
                    >
                        {getFieldDecorator('dealInfo',{
                            initialValue:value.dealInfo,
                            rules: [{ required: true, message: '处理措施不能为空!' }],
                        })(
                            <Input  type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="工作进度"
                    >
                        {getFieldDecorator('workSchedule',{
                            initialValue:value.workSchedule,
                            rules: [{ required: true, message: '工作进度不能为空!' }],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="完成时间"
                    >
                        {getFieldDecorator('completeTime',{
                            initialValue:moment(value.completeTime),
                            rules: [{ required: true, message: '完成时间不能为空!' }],
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('tsdRemark',{
                            initialValue:value.tsdRemark,
                            rules: [{ required: true, message: '备注不能为空!' }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('state',{
                            initialValue:'T',
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
