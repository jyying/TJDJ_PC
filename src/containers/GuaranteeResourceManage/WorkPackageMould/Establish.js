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
            model:[]
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
                    console.log(res);
                    this.setState({
                        model:res.data.model,
                        stand:res.data.stand
                    });
                }
            })
    }

    handleSearch = (e) => {
        e.preventDefault();
        const form = this.props.form;
        form.validateFields((error,values) => {
          if(!error) {
              this.setState({
                  buttonLoading:true
              });
              if (this.state.Verification) {
                  const executeStartTime = TimeConversions.TIME(values.executeTime[0]._d);
                  const executeEndTime = TimeConversions.TIME(values.executeTime[1]._d);
                  values.executeStartTime = executeStartTime;
                  values.executeEndTime = executeEndTime;
                  delete values.executeTime;
                  Api.post(addOrUpdate,values)
                      .then(res => {
                          this.setState({
                              buttonLoading:false
                          });
                          if(res.errorCode == 0) {
                              message.success('成功');
                              sessionStorage.WorkPackage = true;
                          } else if (res.errorCode == 1) {
                              message.error('失败:'+res.errorMsg);
                          }
                      })
              }
          }
        });
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
        console.log(rule, value,this.state.Verification);
        if(this.state.Verification) {
            this.setState({
                Verification:false
            });
        }
        callback();
    };

    render () {
        const { getFieldDecorator} = this.props.form;
        const {isUpdate} = this.props;
        const {Verification,buttonLoading,stand,model} = this.state;
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
                    <FormItem {...formItemLayout} label={`机型`}>
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
                                rules: [
                                        { required: true, message: '请输入指令号' },
                                        { validator:this.checkConfirm}
                                    ],
                            })(
                                <Input onBlur={_=>this.Verification()}/>
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`执行时间段`}>
                        {getFieldDecorator(`executeTime`,{
                            initialValue:isUpdate?
                                [
                                    moment(TimeConversion.TIME(isUpdate.executeStartTime)),
                                    moment(TimeConversion.TIME(isUpdate.executeEndTime))
                                ]:[]
                                ,
                            rules:[
                                {
                                    required:true,message:'请选择执行日期'
                                }
                            ]
                        })(
                            <RangePicker
                                placeholder=""
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`停场时间`}>
                        {getFieldDecorator(`airplaneStandDays`,{
                            initialValue: isUpdate?isUpdate.airplaneStandDays:'',
                            rules:[
                                {
                                    required:true,message:'请输入'
                                }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`机位`}>
                        {getFieldDecorator(`standCode`,{
                            initialValue: isUpdate?isUpdate.standCode:'',
                            rules:[
                                {
                                    required:true,message:'请选择'
                                }
                            ]
                        })(
                            <Select>
                                {
                                    stand.map((s,v) =>
                                        <Option key={s.standNo}>{s.standNo}</Option>
                                    )
                                }
                            </Select>
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
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('packageState',{
                            initialValue: isUpdate?isUpdate.packageState:'T',
                        })(
                            <Select style={{ width: 120 }}>
                                <Option value="T">有效</Option>
                                <Option value="F">无效</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        <div className="modalButton">
                            <Button
                                size="large"
                                onClick={this.handleReset}
                            >
                                关闭
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={buttonLoading}
                                disabled={!Verification}
                            >
                                保存
                            </Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

Establish = Form.create()(Establish);
export default Establish;