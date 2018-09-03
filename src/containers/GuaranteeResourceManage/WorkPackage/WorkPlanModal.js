import React from 'react';
import { Form, Input, Cascader, Select, Button, message,Upload,Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';

const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}];


// 工卡安排
class WorkPlanModal extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        airplaneArea:[],
        TaskPlanDay:[]
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const wwpdata=this.props.wwpdata;
        const value=this.props.WorkPlan;
        console.log('value',value);
        if(value.length>0){
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    Api.post('weekWorkPackageTask/saveSubTaskListArrange',{
                        'wwpId':wwpdata.id,
                        'wwpaId':values.wwpaId,
                        'stlIds':value,
                        'largeAreaId':values.largeAreaId,
                        'smallArea':values.smallArea,
                        'remarkArea':values.remarkArea?values.remarkArea:'',
                    }).then(res=>{
                        // console.log(res);
                        if(res.errorCode=='0'){
                            message.success('安排成功！');
                        }else{
                            message.error('安排失败：'+res.errorMsg);
                        }
                    })
                }
            });
        }else {
            message.error('请先选择需要安排的工卡！！！');
        }

    };
    // handleConfirmBlur = (e) => {
    //     const value = e.target.value;
    //     this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // };
    //
    // checkConfirm = (rule, value, callback) => {
    //     const form = this.props.form;
    //     if (value && this.state.confirmDirty) {
    //         form.validateFields(['confirm'], { force: true });
    //     }
    //
    //     callback();
    // };
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };

    componentDidMount(){
       const wwpdata=this.props.wwpdata;
       // console.log('wwpdata',wwpdata);
        const value=this.props.WorkPlan;
        // console.log('value',value);
        // 飞机区域--
        const airplaneArea =[];
        Api.post('dataDict/findDataDictByCode',{'dictCode':'AIR_AREA'}).then(res=>{
            for (let i=0;i<res.data.length;i++){
                airplaneArea.push({
                    value: res.data[i].id,
                    label: res.data[i].dictName,
                });
            }
            this.setState({
                airplaneArea:airplaneArea
            });
        });
// 工作包工作日计划
        const TaskPlanDay =[];
        Api.post('weekWorkPackageTask/findWwpaBywwpId',{
            'wwpId':wwpdata.id,
        }).then(res=>{
            console.log(res);
            for (let i=0;i<res.data.length;i++){
                TaskPlanDay.push({
                    value: res.data[i].id,
                    label: this.changetime(res.data[i].executeTime),
                });
            }
            this.setState({
                TaskPlanDay:TaskPlanDay,
            });

        })
    }

    render() {
        const {onCancel} = this.props;
        const airplaneArea =this.state.airplaneArea;
        const TaskPlanDay=this.state.TaskPlanDay;
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
                },

            },
        };

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label={`大区域`}>
                        {getFieldDecorator(`largeAreaId`,{
                            rules: [{ required: true, message: '大区域不能为空!' }],
                        })(
                            <Select>
                                {
                                    airplaneArea.map((s,v)=>
                                        <Option key={v} value={s.value}>{s.label}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`小区域`}>
                        {getFieldDecorator(`smallArea`,{
                            initialValue: [],
                            rules: [{ required: true, message: '小区域不能为空!' }],
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="安排时间"
                    >
                        {getFieldDecorator('wwpaId',{
                            rules: [{ required: true, message: '时间不能为空!' }],
                        })(
                            <Select>
                                {
                                    TaskPlanDay.map((s,v)=>
                                        <Option key={v} value={s.value}>{s.label}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`备注`}>
                        {getFieldDecorator(`remarkArea`,{
                            initialValue: [],
                        })(
                            <Input placeholder="" />
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
const  WorkPlanModals = Form.create()(WorkPlanModal);
export default WorkPlanModals;
