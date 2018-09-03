import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { DatePicker } from 'antd';
import Api from '../../../api/request';


// 工作包问题明细
class Qdetail extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:'',
        searchdata:[]
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.Qdetail;
        // console.log('value',value);
        this.props.form.validateFields((err, values) => {
            const rpDate=values.rpDate?values.rpDate.format('YYYY-MM-DD'):'';
            const completeTime=values.completeTime?values.completeTime.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('technicalSuppDetail/addOrUpdate',{
                    tsdType:'Q',
                    tsId:value.id,
                    seqNo:values.seqNo,
                    rpId:values.rpId,
                    rpDate:rpDate,
                    airplaneNo:values.airplaneNo,
                    questionInfo:values.questionInfo,
                    dealInfo:values.dealInfo,
                    workSchedule:values.workSchedule,
                    completeTime:completeTime,
                    tsdRemark:values.tsdRemark,
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

    componentWillMount (){
        Api.post('employeeInfo/findEmployeeByConditionNoPage').then(res=>{
                this.setState({
                    searchdata: res?res.data:[]
                });
        });
    }
     handleChange=(value)=> {
    // console.log(`selected ${value}`);
};

   handleBlur=()=> {
    // console.log('blur');
};

     handleFocus=()=>{
    // console.log('focus');
};
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
                            rules: [{ required: true, message: '备注不能为空!' }],
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
const  Qdetails = Form.create()(Qdetail);
export default Qdetails;
