import React from 'react';
import { Form, Input, Cascader, Select, Button, message ,DatePicker} from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import Api from '../../../api/request';

const amState = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];
class UpdateAttendance extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        amTypes:[],
        vis:false,
    };
 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const data=this.props.data;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values,values.amType[0]);
                const startTime = new Date(values.Time[0]._d).toLocaleDateString().replace(/\//g, "-");
                const endTime = new Date(values.Time[1]._d).toLocaleDateString().replace(/\//g, "-");
                // console.log(startTime,endTime);
                Api.post('attendance/addOrUpdateAttendance',{
                    'attendanceId':data[0].id,
                    'empId':data[0].empId,
                    'amType':values.amType[0],
                    'startTime':startTime,
                    'endTime':endTime,
                    'amState':values.amState[0],
                    'workLocation':values.workLocation,
                }).then(res=>{
                    // console.log(res);
                    if(res.errorCode=='0'){
                        message.success('修改成功！');
                        // this.props.form.resetFields();
                    }else{
                        message.error('修改失败！');
                        // this.props.form.resetFields();
                    }
                })
            }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    // checkPassword = (rule, value, callback) => {
    //     const form = this.props.form;
    //     if (value && value !== form.getFieldValue('password')) {
    //         callback('Two passwords that you enter is inconsistent!');
    //     } else {
    //         callback();
    //     }
    // };
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }

        callback();
    };

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

// 新增员工排班类型下拉改变
    componentDidMount(){
        const amTypes=[];
        Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_HOLIDAY_TYPE'}).then(res=>{
            // console.log(res.data[0].dictName);
            for (let i=0;i<res.data.length;i++){
                amTypes.push({
                    value: res.data[i].id,
                    label: res.data[i].dictName,
                });
            }

            this.setState({
                amTypes:amTypes
            });
        });
    }

    render() {
        const {onCancel} = this.props;
        const data=this.props.data;
        let startTime = new Date(data[0].startTime).toLocaleDateString().replace(/\//g, "-");
        let endTime = new Date(data[0].endTime).toLocaleDateString().replace(/\//g, "-");
        // console.log(data);
        const { getFieldDecorator } = this.props.form;
        const dateFormat = 'YYYY-MM-DD';
        const amTypes=this.state.amTypes;
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
                },

            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                {/*<FormItem*/}
                {/*{...formItemLayout}*/}
                {/*label="员工ID"*/}
                {/*hasFeedback*/}
                {/*>*/}
                {/*{getFieldDecorator('empId', {*/}
                    {/*initialValue: [data[0].empId],*/}
                {/*rules: [{*/}
                {/*required: true, message: 'Please input your empName!',*/}
                {/*}, {*/}
                {/*validator: this.checkConfirm,*/}
                {/*}],*/}
                {/*})(*/}
                {/*<Input disabled/>*/}
                {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="请假类型"
                    hasFeedback
                >
                    {getFieldDecorator('amType',{
                        initialValue: [data[0].amType],
                        rules: [{
                            required: true, message: '请选择请假类型!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Cascader options={amTypes} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="开始/结束(时间)"
                    hasFeedback
                >
                    {getFieldDecorator('Time', {
                        initialValue:[moment(startTime, dateFormat), moment(endTime, dateFormat)],
                        rules: [{
                            required: true, message: '请选择开始结束时间!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <RangePicker  format="YYYY-MM-DD"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                    hasFeedback
                >
                    {getFieldDecorator('amState',{
                        initialValue: [data[0].amState],
                        rules: [{
                            required: true, message: '请选择状态!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Cascader options={amState} onChange={this.onChange}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工作地点"
                    hasFeedback
                >
                    {getFieldDecorator('workLocation', {
                        initialValue: [data[0].workLocation],
                        rules: [{
                            required: true, message: '请输入工作地点!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button size="large" onClick={onCancel}>取消</Button>
                    <Button type="primary" htmlType="submit" size="large">确定</Button>
                </FormItem>
            </Form>
        );
    }
}
const UpdateAttendanceForm = Form.create()(UpdateAttendance);
export default UpdateAttendanceForm;
