/**
 * Created by Administrator on 2017/7/24/024.
 */
/**
 * Created by Administrator on 2017/7/20/020.
 */
import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
import Api from '../../../api/request';


const residences = [{
    value: 'T',
    label: 'T',
}, {
    value: 'F',
    label: 'F',
}, {
    value: 'D',
    label: 'D',
}];




class AddUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            vis:'none',
            data:'',
            options:[]
        };
    }



    handleSelect = (value,options)=> {
        console.log(value)
        if(value=='C'){
            console.log('its c')
            this.setState({
                vis:'block'
            });
            Api.post('dataDict/findDataDictByType').then(res=>{
                console.log(res.data);
                const options=[];
                for(let i=0;i<res.data.length;i++){
                    options.push({
                        value:res.data[i].id ,
                        label:res.data[i].dictName ,
                    })
                }
                // let datas = [res.data];
                // console.log(datas);
                this.setState({
                    options: options
                });
            })
        }else{
            console.log('its p')
            this.setState({
                vis:'none'
            })
        }
    }

    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                Api.post('dataDict/addOrUpdateDataDict',values).then(res=>{
                    console.log(res.data);
                    if(res.errorCode=='0'){
                        message.success('添加成功！');
                        // this.update();
                    }else{
                        message.error('添加失败！');
                    }
                })
            }
        });
        setTimeout(()=>{this.props.form.resetFields();},5000);
    };
// //页面更新
//     update(){
//         Api.post('dataDict/findDataDictByCondition').then(res=>{
//             console.log(res);
//             // console.log(parseInt(res.pageInfo.totalSize));
//             this.setState({
//                 data: res.data,
//                 currentPage:parseInt(res.pageInfo.currentPage),
//                 totalPageSize:parseInt(res.pageInfo.totalPageSize),
//                 totalSize:parseInt(res.pageInfo.totalSize)
//             })
//         })
//     }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const options=this.state.options;
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
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 60 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form onSubmit={this.handleSubmit}>
                {/*<FormItem*/}
                {/*{...formItemLayout}*/}
                {/*label="用户ID"*/}
                {/*hasFeedback*/}
                {/*>*/}
                {/*{getFieldDecorator('userId', {*/}
                {/*initialValue: [],*/}
                {/*rules: [{*/}
                {/*required: true, message: 'The input is not valid E-mail!',*/}
                {/*}, {*/}
                {/*validator: this.checkConfirm,*/}
                {/*}],*/}
                {/*})(*/}
                {/*<Input />*/}
                {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="用户ID"
                    hasFeedback
                >
                    {getFieldDecorator('employeeAuthId', {
                        rules: [{
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="员工ID"
                    hasFeedback

                >
                    {getFieldDecorator('employeeInfoId', {
                        rules: [{
                            required: true, message: 'Please input your userAccount!',
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典名称"
                    hasFeedback
                >
                    {getFieldDecorator('dictName')(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机型ID"
                    hasFeedback
                >
                    {getFieldDecorator('airplaneModelId')(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="机型ID(OLD)"
                    hasFeedback
                >
                    {getFieldDecorator('oldAirplaneModelId')(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                    hasFeedback
                >
                    {getFieldDecorator('authState', {
                        rules: [{ required: true, message: 'Please input your phone mobilePhone!' }],
                    })(
                        <Cascader options={residences} />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}
const UserListForm = Form.create()(AddUserList);
export default UserListForm;
