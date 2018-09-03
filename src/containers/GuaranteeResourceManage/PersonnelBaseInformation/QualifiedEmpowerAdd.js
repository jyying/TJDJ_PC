import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
import Api from '../../../api/request';


const authState = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}, {
    value: 'D',
    label: '删除',
}];


class QualifiedEmpowerAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            battleLine:[],
            empLevel:[],
            airplaneArea:[],
            airplaneModelId:[]
        };

    }

    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const EnpowerData=this.props.EnpowerData;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Api.post('employeeAuth/addOrUpdateEmployeeAuth',{'employeeInfoId':EnpowerData[0].id,
                    'airplaneModelId':values.airplaneModelId?values.airplaneModelId[0]:'',
                    'oldAirplaneModelId':values.airplaneModelId?values.airplaneModelId[0]:'',
                    'empLevel':values.empLevel?values.empLevel[0]:'',
                    'oldEmpLevel':values.empLevel?values.empLevel[0]:'',
                    'airplaneArea':values.airplaneArea?values.airplaneArea[0]:'',
                    'oldAirplaneArea':values.airplaneArea?values.airplaneArea[0]:'',
                    'authState':values.authState[0],
                }).then(res=>{
                    // console.log('res',res);
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                    }else {
                        message.error('添加失败！');
                    }
                })
            }
        });
        setTimeout(()=>{this.props.form.resetFields();},5000);
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };
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

// 员工级别、飞机区域下拉改变
    componentDidMount(){
        const airplaneArea =[];
        const empLevel=[];
        const airplaneModelId=[];
        // 飞机区域
        Api.post('dataDict/findDataDictByCode',{'dictCode':'AIR_AREA'}).then(res=>{
            // console.log(res.data[0].dictName);
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
        // 员工级别
        Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_LEVEL'}).then(res=>{
            // console.log(res.data[0].dictName);
            for (let i=0;i<res.data.length;i++){
                empLevel.push({
                    value: res.data[i].id,
                    label: res.data[i].dictName,
                });
            }
            this.setState({
                empLevel:empLevel
            });
        });
        // 机型ID
        Api.post('air/findAllAirPlaneModel').then(res=>{
            // console.log(res.data[0].dictName);
            for (let i=0;i<res.data.length;i++){
                airplaneModelId.push({
                    value: res.data[i].id,
                    label: res.data[i].airPlaneModel,
                });
            }
            this.setState({
                airplaneModelId:airplaneModelId
            });
        })
    }

    render() {
        const EnpowerData=this.props.EnpowerData;
        // console.log('EnpowerData',EnpowerData);
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const empLevel=this.state.empLevel;
        const airplaneArea=this.state.airplaneArea;
        const airplaneModelId=this.state.airplaneModelId;
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
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 0,
                },
            },
        };

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form onSubmit={this.handleSubmit}>

                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="员工ID"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*{getFieldDecorator('employeeInfoId', {*/}
                        {/*initialValue: [EnpowerData[0].id],*/}
                        {/*rules: [{*/}
                            {/*required: true, message: 'Please input your employeeInfoId!',*/}
                        {/*}, {*/}
                            {/*validator: this.checkConfirm,*/}
                        {/*}],*/}
                    {/*})(*/}
                        {/*<Input disabled/>*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="机型"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneModelId', {
                        initialValue: [],
                    })(
                        <Cascader
                            options={airplaneModelId}
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机型"
                    hasFeedback
                    style={{display:'none'}}
                >
                    {getFieldDecorator('airplaneModelId', {
                        initialValue: [],
                    })(
                        <Cascader options={airplaneModelId} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="员工级别"
                    hasFeedback
                >
                    {getFieldDecorator('empLevel',{
                        initialValue: [],
                    })(
                        <Cascader options={empLevel}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="员工级别"
                    hasFeedback
                    style={{display:'none'}}
                >
                    {getFieldDecorator('empLevel',{
                        initialValue: [],
                    })(
                        <Cascader options={empLevel} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="飞机区域"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneArea',{
                        initialValue: [],
                    })(
                        <Cascader options={airplaneArea} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="飞机区域"
                    hasFeedback
                    style={{display:'none'}}
                >
                    {getFieldDecorator('airplaneArea',{
                        initialValue: [],
                    })(
                        <Cascader options={airplaneArea} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="员工状态"

                >
                    {getFieldDecorator('authState', {
                        initialValue: ['T'],
                    })(
                        <Cascader options={authState} />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}
const QualifiedEmpowerAddForm = Form.create()(QualifiedEmpowerAdd);
export default QualifiedEmpowerAddForm;
