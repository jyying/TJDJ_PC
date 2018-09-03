import React,{Component} from 'react';
import {
    Row, Col,
    Form, Input,
    Button,Table,Modal,
    DatePicker,
    Cascader,
    Pagination,message,
    Select
} from 'antd';
import moment from 'moment';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import TimeConversions from '../../../utils/TimeConversion';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const cheekCommandNo = 'weekWorkPackage/cheekCommandNo';
const addOrUpdate = 'weekWorkPackage/addOrUpdate';
const findAirModelAndStand = 'air/findAirModelAndStand';

class AddWorkPackage extends Component {
    constructor(props){
        super(props);
        this.state = {
            buttonLoading:false,
            Verification:false,
            stand:[],
            model:[],
            children:[],
            children1:[],
            value:[],
            value1:[],
            empMList:[],
            empEList:[],
            value4:''
        };

        this.form = this.props.form;
    }


    componentWillMount (){
        if(this.props.isUpdate) {
            this.state.Verification = true;
        }
        // 获取创建周计划所需机型、机位,放在此，实时更新分线信息
        Api.post(findAirModelAndStand)
            .then(res => {
                if(res.errorCode == 0) {
                    this.setState({
                        model:res.data.model,
                        stand:res.data.stand
                    });
                }
            });
    }


    handleSearch = (e) => {
        e.preventDefault();
        const form = this.props.form;
        const value=this.props.isUpdate;
        form.validateFields((error,values) => {
            // console.log('values',values);
                if(!error) {
                    // this.setState({
                    //     buttonLoading:true
                    // });
                    // console.log(values);
                    // if (this.state.Verification) {
                        const executeStartTime = values.executeTime[0].format('YYYY-MM-DD');
                        const executeEndTime = values.executeTime[1].format('YYYY-MM-DD');
                        values.executeStartTime = executeStartTime;
                        values.executeEndTime = executeEndTime;
                        delete values.executeTime;
                        Api.post(addOrUpdate,values)
                            .then(res => {
                                // console.log(res);
                                this.setState({
                                    buttonLoading:false
                                });
                                if(res.errorCode == 0) {
                                    message.success('新增成功！');
                                    sessionStorage.WorkPackage = true;
                                } else if (res.errorCode == 1) {
                                    message.error('新增失败:'+res.errorMsg);
                                }
                            })
                    }
                // }


        });
        // console.log('a',this.state.value,this.state.value1);
        // if(this.state.value.length>0){
        //     Api.post('weekWorkPackageManager/wwpEmpManagerScheduling',{'wwpId':value.id,
        //         'wwpEmpType':'M',
        //         'wwpEmpState':'T',
        //         'empManagerIds':this.state.value,
        //     }).then(res=>{
        //         // console.log('M',res);
        //         if(res.errorCode=='0'){
        //             message.success('保存成功！');
        //
        //         }else{
        //             message.error('！！！保存失败');
        //         }
        //     });
        // }
        // if(this.state.value1.length>0){
        //     Api.post('weekWorkPackageManager/wwpEmpManagerScheduling',{'wwpId':value.id,
        //         'wwpEmpType':'E',
        //         'wwpEmpState':'T',
        //         'empManagerIds':this.state.value1,
        //     }).then(res=>{
        //         // console.log('T',res);
        //         if(res.errorCode=='0'){
        //             message.success('保存成功！');
        //
        //         }else{
        //             message.error('！！！保存失败');
        //         }
        //     })
        // }

    };
    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };

    handleReset = () => {
      this.props.form.resetFields();
    };

    //  验证指令号
    Verification = () => {
        const form = this.props.form;
        form.validateFields(['commandNo'],(error,values) => {
            if(!error) {
                //console.log(values);
                Api.post(cheekCommandNo,values)
                    .then(res => {
                        if (res.errorCode == 1) {
                            this.setFields(values,res.data);
                        } else if (res.errorCode == 0){
                            this.setState({
                                Verification:true
                            });
                        }
                    })
            }
        });
    };

    //  错误提示
    setFields = (values,error) => {
        this.form.setFields({
            'commandNo':{
                value:values.commandNo,
                errors:[new Error(error)]
            }
        });
    };

    checkConfirm = (rule, value, callback) => {
        // console.log(rule, value,this.state.Verification);
        if(this.state.Verification) {
            this.setState({
                Verification:false
            });
        }
        callback();
    };

// 生产线经理和跟线员选择

 handleChange=(value)=> {
    // console.log(`selected ${value}`);
     this.setState({
         value:value
     })
};

handleChange1=(value)=> {
    // console.log(`selected ${value}`);
    this.setState({
        value1:value
    })
};

    executeTime=(value)=>{
        this.setState({
            value4:value
        })
    };

    render () {
        const {isUpdate} = this.props;
        // let startTime = new Date(isUpdate.executeStartTime).toLocaleDateString().replace(/\//g, "-");
        // let endTime = new Date(isUpdate.executeEndTime).toLocaleDateString().replace(/\//g, "-");
        const dateFormat = 'YYYY-MM-DD';
        const { getFieldDecorator} = this.props.form;
        const {Verification,buttonLoading,stand,model,value4} = this.state;
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
        const {onCancel} = this.props;
        return (
            <div>
                <Form
                    onSubmit={this.handleSearch}
                >
                    {/*{*/}
                        {/*isUpdate?<FormItem*/}
                            {/*{...formItemLayout}*/}
                            {/*label={`ID`}*/}
                            {/*style={{display:'none'}}*/}
                        {/*>*/}
                            {/*{getFieldDecorator(`wwpId`,{*/}
                                {/*initialValue: isUpdate.id*/}
                            {/*})(*/}
                                {/*<Input disabled/>*/}
                            {/*)}*/}
                        {/*</FormItem>:null*/}
                    {/*}*/}
                    <FormItem {...formItemLayout} label={`周数`}>
                        {getFieldDecorator(`weekNo`,{
                            // initialValue: isUpdate?isUpdate.weekNo:'',
                            rules:[
                                {
                                    required:true,message:'请输入周数'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`机型`} >
                        {getFieldDecorator(`airplaneModel`,{
                            // initialValue: '',
                            rules:[
                                {
                                    required:true,message:'选择机型'
                                }
                            ]
                        })(
                            <Select>
                                {
                                    model.map((s,v) =>
                                    <Option key={s.airPlaneModel}>{s.airPlaneModel}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`机号`}>
                        {getFieldDecorator(`airplaneRegNo`,{
                            // initialValue: isUpdate?isUpdate.airplaneRegNo:'',
                            rules:[
                                {
                                    required:true,message:'请输入机号'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`维修工作`}>
                        {getFieldDecorator(`workInfo`,{
                            rules:[
                                {
                                    required:true,message:'请输入维修工作'
                                }
                            ]
                        })(
                            <Input type="textarea" rows={4} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={`指令号`}
                        hasFeedback
                    >
                            {getFieldDecorator('commandNo', {
                                // rules: [
                                //         { required: true, message: '请输入指令号' },
                                //         { validator:this.checkConfirm}
                                //     ],
                            })(
                                <Input />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label={`执行时间段`}
                              // validateStatus={value4?"warning":''}
                              // help={value4?"修改之后，之前安排会被清空":''}
                        >
                        {getFieldDecorator(`executeTime`,{
                            // initialValue:isUpdate?
                            //     [
                            //         moment(startTime, dateFormat), moment(endTime, dateFormat)
                            //     ]:[]
                            //     ,
                            rules:[
                                {
                                    required:true,message:'请选择执行时间段'
                                }
                            ]
                        })(
                            <RangePicker
                                placeholder="" onChange={this.executeTime}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`停场时间`}>
                        {getFieldDecorator(`airplaneStandDays`,{
                            // initialValue: isUpdate?isUpdate.airplaneStandDays:'',
                            rules:[
                                {
                                    required:true,message:'请输入停场时间'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`机位`}>
                        {getFieldDecorator(`importStandInfo`,{
                            // initialValue: isUpdate?isUpdate.standCode:'',
                            rules:[
                                {
                                    required:true,message:'请输入机位'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`所属公司`}>
                        {getFieldDecorator(`company`,{
                            // initialValue: isUpdate?isUpdate.company:'',
                            rules:[
                                {
                                    required:true,message:'请输入所属公司'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`总工时`}>
                        {getFieldDecorator(`totalWorkingHours`,{
                            // initialValue: isUpdate?isUpdate.totalWorkingHours:'',
                            rules:[
                                {
                                    required:true,message:'请输入总工时',
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`机械工时`}>
                        {getFieldDecorator(`machineHours`,{
                            // initialValue: isUpdate?isUpdate.machineHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'机械工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`电气工时`}>
                        {getFieldDecorator(`electricHours`,{
                            // initialValue: isUpdate?isUpdate.electricHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入电气工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`电子工时`}>
                        {getFieldDecorator(`electronHours`,{
                            // initialValue: isUpdate?isUpdate.electronHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入电子工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`清洁工时`}>
                        {getFieldDecorator(`cleanHours`,{
                            // initialValue: isUpdate?isUpdate.cleanHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入清洁工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`客舱工时`}>
                        {getFieldDecorator(`cabinHours`,{
                            // initialValue: isUpdate?isUpdate.cabinHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入客舱工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`NDT工时`}>
                        {getFieldDecorator(`ndtHours`,{
                            // initialValue: isUpdate?isUpdate.ndtHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入NDT工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`金工工时`}>
                        {getFieldDecorator(`metalworkingHours`,{
                            // initialValue: isUpdate?isUpdate.metalworkingHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入金工工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`漆工工时`}>
                        {getFieldDecorator(`lacqueringHours`,{
                            // initialValue: isUpdate?isUpdate.lacqueringHours:'',
                            // rules:[
                            //     {
                            //         required:true,message:'请输入漆工工时',
                            //     }
                            // ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('packageState',{
                            initialValue: 'T',
                        })(
                            <Select>
                                <Option value="T">有效</Option>
                                <Option value="F">无效</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        {/*<div className="modalButton">*/}
                            <Button size="large" onClick={onCancel}>取消</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={buttonLoading}
                            >
                                确定
                            </Button>
                        {/*</div>*/}
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const AddWorkPackages= Form.create()(AddWorkPackage);
export default AddWorkPackages;