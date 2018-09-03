import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message,DatePicker  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// const AutoCompleteOption = AutoComplete.Option;

const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];

class AddAirPlanInformation extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        children:[]
    };
    // 增加
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                Api.post('air/addOrUpdateAirPalne',{
                    'aiId':'',
                    'airplaneModelId':values.airplaneModelId,
                    'airplaneAcReg':values.airplaneAcReg,
                    'airplaneOwner':values.airplaneOwners,
                    'airplaneIpcCode':values.airplaneIpcCode,
                    'airplaneSnSeq':values.airplaneSnSeq,
                    'airplaneCtaDate':values.airplaneCtaDate?values.airplaneCtaDate.format('YYYY-MM-DD'):'',
                    'airplaneDeliveryDate':values.airplaneDeliveryDate?values.airplaneDeliveryDate.format('YYYY-MM-DD'):'',
                    'engineModel':values.engineModel,
                    'apuModel':values.apuModels,
                    'airplaneOtoOperators':values.airplaneOtoOperators,
                    'remark':values.remark,
                    'airplaneState':values.airplaneState[0]
                }).then(res=>{
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else{
                        message.error('注册号输入错误');
                    }
                });
            }
        });
        //setTimeout(()=>{this.props.form.resetFields();},5000);
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

    componentDidMount(){
        const data=this.props.data;
        Api.post('air/findAllAirPlaneModel').then(res => {

            this.setState({
                children: res.data,
            });
        })
    }
    render() {
        const data=this.props.data;
        const { getFieldDecorator } = this.props.form;
        const {onCancel} = this.props;
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
        const {children} = this.state;
        const dateFormat = 'YYYY-MM-DD';

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="机型"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneModelId',{
                        rules: [{ required: true, message: '机型不能为空!' }],
                    })(
                        <Select
                            style={{ width: '100%' }}
                        >
                            {
                                children.map((s,v)=><Option key={v} value={s.id}>{s.airPlaneModel}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="注册号"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneAcReg',{
                        rules: [{ required: true, message: '注册号不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="所有者"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneOwners')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="IPC有效号"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneIpcCode')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="MSN序号"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneSnSeq',{
                        rules: [{ required: true, message: 'MSN序号不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="初始出口适航证日期"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneCtaDate')(
                        <DatePicker />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="交付日期"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneDeliveryDate')(
                        <DatePicker/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="发动机型号"
                    hasFeedback
                >
                    {getFieldDecorator('engineModel')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="APU型号"
                    hasFeedback
                >
                    {getFieldDecorator('apuModels')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="责任人"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneOtoOperators')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >
                    {getFieldDecorator('remark')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneState',{initialValue: ['T']})(
                        <Cascader options={residences}/>
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
const AddAirPlanInformationForm = Form.create()(AddAirPlanInformation);
export default AddAirPlanInformationForm;
