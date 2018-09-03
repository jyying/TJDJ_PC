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

const addOrUpdate = 'weekWorkPackage/addOrUpdate';

class AddNrc extends React.Component {
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
}

    handleSearch = (e) => {
        e.preventDefault();
        const form = this.props.form;
        const value=this.props.isUpdate;
        form.validateFields((error,values) => {
            // console.log('values',values);
            const createdDate=values.createdDate?values.createdDate.format('YYYY-MM-DD'):'';
            const accDate=values.accDate?values.accDate.format('YYYY-MM-DD'):'';
                if(!error) {
                        Api.post('deferInfo/nrcAddOrUpdate',{
                            commandNo:values.commandNo,
                            nrcId:values.nrcId,
                            nrcNo:values.nrcNo,
                            defectNo:values.defectNo,
                            nrcType:values.nrcType,
                            createdDate:createdDate,
                            accDate:accDate,
                            itemno:values.itemno,
                            defectDesc:values.defectDesc,
                            nrcTaskType:values.nrcTaskType,
                            description:values.description,
                            total:values.total,
                        }).then(res => {
                                this.setState({
                                    buttonLoading:false
                                });
                                if(res.errorCode == 0) {
                                    message.success('新增成功！');
                                } else if (res.errorCode == 1) {
                                    message.error('！！！新增失败');
                                }
                            })
                    }
                // }


        });

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
                    <FormItem {...formItemLayout} label={`工作包号`}>
                        {getFieldDecorator(`commandNo`,{
                            rules:[
                                {
                                    required:true,message:'请输入工作包号'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`nrcID`}>
                        {getFieldDecorator(`nrcId`,{
                            rules:[
                                {
                                    required:true,message:'请输入nrcID'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`NRC类型`}>
                        {getFieldDecorator(`nrcType`,{
                            // initialValue: isUpdate?isUpdate.airplaneRegNo:'',
                            rules:[
                                {
                                    required:true,message:'请输入NRC类型'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`项次号`}>
                        {getFieldDecorator(`itemno`,{
                            rules:[
                                {
                                    required:true,message:'请输入项次号'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={`序号`}
                        hasFeedback
                    >
                            {getFieldDecorator('nrcNo', {
                                rules:[
                                    {
                                        required:true,message:'请输入序号'
                                    }
                                ]
                            })(
                                <Input />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`NRC号`}>
                        {getFieldDecorator(`defectNo`,{
                            // initialValue: isUpdate?isUpdate.airplaneStandDays:'',
                            rules:[
                                {
                                    required:true,message:'请输入序号'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`缺陷描述`}>
                        {getFieldDecorator(`defectDesc`,{
                            // initialValue: isUpdate?isUpdate.standCode:'',
                            rules:[
                                {
                                    required:true,message:'请选择缺陷描述'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`责任工种`}>
                        {getFieldDecorator(`nrcTaskType`,{
                            // initialValue: isUpdate?isUpdate.company:'',
                            rules:[
                                {
                                    required:true,message:'请输入责任工种'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`工种说明`}>
                        {getFieldDecorator(`description`,{
                            // initialValue: isUpdate?isUpdate.totalWorkingHours:'',
                            rules:[
                                {
                                    required:true,message:'请输入工种说明',
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`理论工时`}>
                        {getFieldDecorator(`total`,{
                            rules:[
                                {
                                    required:true,message:'请输入理论工时',
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`开卡时间`}>
                        {getFieldDecorator(`createdDate`,{
                            rules:[
                                {
                                    required:true,message:'请输入开卡时间',
                                }
                            ]
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`完工时间`}>
                        {getFieldDecorator(`accDate`,{
                            rules:[
                                {
                                    required:true,message:'请输入完工时间',
                                }
                            ]
                        })(
                            <DatePicker   format="YYYY-MM-DD" />
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

const AddNrcs= Form.create()(AddNrc);
export default AddNrcs;