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

class Establish extends Component {
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
     // 生产线经理和跟线员
     //    const children = [];
     //    const children1 = [];
     //    // for (let i = 10; i < 36; i++) {
     //    //     children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
     //    // }
     //    const value=this.props.isUpdate;
     //    const workStartTime=this.changetime(value.executeStartTime);
     //    const workEndTime=this.changetime(value.executeEndTime);
     //    // 生产线经理
     //    Api.post('weekWorkPackageManager/findEmpManagerByWwp',{'wwpId':value.id,
     //        'workStartTime':workStartTime,
     //        'workEndTime':workEndTime,
     //        'wwpEmpType':'M',
     //        'empName':'',
     //    }).then(res=>{
     //        // console.log('被选中',res);
     //        for (let i = 0; i < res.data.length; i++) {
     //            children.push(<Option key={i} value={res.data[i].id}>{res.data[i].empName+'('+res.data[i].empEaccount+')'}</Option>);
     //
     //        }
     //        this.setState({
     //            children:children,
     //        });
     //    });
     //    // 跟线员
     //    Api.post('weekWorkPackageManager/findEmpManagerByWwp',{'wwpId':value.id,
     //        'workStartTime':workStartTime,
     //        'workEndTime':workEndTime,
     //        'wwpEmpType':'E',
     //        'empName':'',
     //    }).then(res=>{
     //        for (let j = 0; j < res.data.length; j++) {
     //            children1.push(<Option key={j} value={res.data[j].id}>{res.data[j].empName+'('+res.data[j].empEaccount+')'}</Option>);
     //        }
     //        this.setState({
     //            children1:children1,
     //        });
     //    });
     //       const empMList=[];
     //       const empEList=[];
     //       if(value.empMList!=null){
     //           for(let i=0;i<value.empMList.length;i++){
     //               empMList.push(value.empMList[i].id);
     //           }
     //       }
     //    if(value.empEList!=null){
     //        for(let i=0;i<value.empEList.length;i++){
     //            empEList.push(value.empEList[i].id)
     //        }
     //    }
     //
     //    this.setState({
     //        empMList:empMList,
     //        empEList:empEList
     //    });
    }
    // ['wwpId','weekNo','airplaneRegNo','workInfo','commandNo','executeTime','airplaneStandDays','importStandInfo','company','totalWorkingHours','packageState'],
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
                                    message.success('保存成功！');
                                    sessionStorage.WorkPackage = true;
                                } else if (res.errorCode == 1) {
                                    message.error('！！！保存失败'+res.errorMsg);
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
        let startTime = new Date(isUpdate.executeStartTime).toLocaleDateString().replace(/\//g, "-");
        let endTime = new Date(isUpdate.executeEndTime).toLocaleDateString().replace(/\//g, "-");
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
                    {
                        isUpdate?<FormItem
                            {...formItemLayout}
                            label={`ID`}
                            style={{display:'none'}}
                        >
                            {getFieldDecorator(`wwpId`,{
                                initialValue: isUpdate.id
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>:null
                    }
                    <FormItem {...formItemLayout} label={`周数`}>
                        {getFieldDecorator(`weekNo`,{
                            initialValue: isUpdate?isUpdate.weekNo:'',
                            rules:[
                                {
                                    required:true,message:'请输入'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`机型`} style={{display:'none'}}>
                        {getFieldDecorator(`airplaneModel`,{
                            initialValue: isUpdate?isUpdate.airplaneModel:'',
                            rules:[
                                {
                                    required:true,message:'选择'
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
                            initialValue: isUpdate?isUpdate.airplaneRegNo:'',
                            rules:[
                                {
                                    required:true,message:'请输入'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`维修工作`}>
                        {getFieldDecorator(`workInfo`,{
                            initialValue: isUpdate?isUpdate.workInfo:'',
                            rules:[
                                {
                                    required:true,message:'请输入'
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
                                initialValue:isUpdate?isUpdate.commandNo:'',
                                // rules: [
                                //         { required: true, message: '请输入指令号' },
                                //         { validator:this.checkConfirm}
                                //     ],
                            })(
                                <Input
                                    // onBlur={_=>this.Verification()}
                                />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label={`执行时间段`}
                              validateStatus={value4?"warning":''}
                              help={value4?"修改之后，之前安排会被清空":''}>
                        {getFieldDecorator(`executeTime`,{
                            initialValue:isUpdate?
                                [
                                    moment(startTime, dateFormat), moment(endTime, dateFormat)
                                ]:[]
                                ,
                            rules:[
                                {
                                    required:true,message:'请选择执行日期'
                                }
                            ]
                        })(
                            <RangePicker
                                placeholder="" onChange={this.executeTime}
                            />
                        )}
                    </FormItem>
                    {/*<FormItem {...formItemLayout} label={`进场时间`}>*/}
                        {/*{getFieldDecorator(`goInAirportTime`,{*/}
                            {/*initialValue: isUpdate?isUpdate.goInAirportTime:'',*/}
                            {/*rules:[*/}
                                {/*{*/}
                                    {/*required:true,message:'请输入'*/}
                                {/*}*/}
                            {/*]*/}
                        {/*})(*/}
                            {/*<Input />*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem {...formItemLayout} label={`停场时间`}>
                        {getFieldDecorator(`airplaneStandDays`,{
                            initialValue: isUpdate?isUpdate.airplaneStandDays:'',
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
                            initialValue: isUpdate?isUpdate.importStandInfo:'',
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
                            initialValue: isUpdate?isUpdate.company:'',
                            rules:[
                                {
                                    required:true,message:'请输入'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`总工时`}>
                        {getFieldDecorator(`totalWorkingHours`,{
                            initialValue: isUpdate?isUpdate.totalWorkingHours:'',
                            rules:[
                                {
                                    required:true,message:'请输入总工时',
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {/*<FormItem {...formItemLayout} label={`生产线经理`}>*/}
                        {/*{getFieldDecorator(`empMList`,{*/}
                            {/*initialValue: this.state.empMList,*/}
                        {/*})(*/}
                            {/*<Select*/}
                                {/*Value={this.state.empMList}*/}
                                {/*mode="multiple"*/}
                                {/*style={{ width: '100%' }}*/}
                                {/*onChange={this.handleChange}*/}
                                {/*tokenSeparators={[',']}*/}
                                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                            {/*>*/}
                                {/*{this.state.children}*/}
                            {/*</Select>*/}
                        {/*)}*/}

                    {/*</FormItem>*/}
                    {/*<FormItem {...formItemLayout} label={`跟线员`}>*/}
                        {/*{getFieldDecorator(`empEList`,{*/}
                            {/*initialValue: this.state.empEList,*/}
                        {/*})(*/}
                            {/*<Select*/}
                                {/*Value={this.state.empEList}*/}
                                {/*mode="multiple"*/}
                                {/*style={{ width: '100%' }}*/}
                                {/*onChange={this.handleChange1}*/}
                                {/*tokenSeparators={[',']}*/}
                                {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                            {/*>*/}
                                {/*{this.state.children1}*/}
                            {/*</Select>*/}
                        {/*)}*/}

                    {/*</FormItem>*/}
                    <FormItem {...formItemLayout} label={`机械工时`}>
                        {getFieldDecorator(`machineHours`,{
                            initialValue: isUpdate?isUpdate.machineHours:'',
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
                            initialValue: isUpdate?isUpdate.electricHours:'',
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
                            initialValue: isUpdate?isUpdate.electronHours:'',
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
                            initialValue: isUpdate?isUpdate.cleanHours:'',
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
                            initialValue: isUpdate?isUpdate.cabinHours:'',
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
                            initialValue: isUpdate?isUpdate.ndtHours:'',
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
                            initialValue: isUpdate?isUpdate.metalworkingHours:'',
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
                            initialValue: isUpdate?isUpdate.lacqueringHours:'',
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
                            initialValue: isUpdate?isUpdate.packageState:'T',
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

Establish = Form.create()(Establish);
export default Establish;