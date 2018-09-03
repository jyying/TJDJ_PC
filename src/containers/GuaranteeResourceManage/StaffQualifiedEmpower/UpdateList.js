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




class UpdateList extends React.Component {
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
                    }else{
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



    render() {
        const data=this.props.data;
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
                    {getFieldDecorator('dataDictId', {
                        initialValue: [data[0].id]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典类型"
                    hasFeedback

                >
                    {getFieldDecorator('dictType', {
                        initialValue: [data[0].dictType]
                    })(
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            onSelect={this.handleSelect}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                        >
                            <Option value="P">P</Option>
                            <Option value="C">C</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典名"
                    hasFeedback
                >
                    {getFieldDecorator('dictName', {
                        initialValue: [data[0].dictName]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典代码"
                    hasFeedback
                >
                    {getFieldDecorator('dictCode', {
                        initialValue: [data[0].dictCode],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="父名"
                    hasFeedback
                    style={{display:this.state.vis}}
                >
                    {getFieldDecorator('parentName',{
                        initialValue: [data[0].parentName],
                    })(
                        <Cascader options={options}  placeholder="Please select" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                    hasFeedback
                >
                    {getFieldDecorator('dictState', {
                        initialValue: [data[0].dictState],
                    })(
                        <Cascader options={residences} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >

                    {getFieldDecorator('remark', {
                        initialValue: [data[0].remark],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="创建者"

                >
                    {getFieldDecorator('createName', {
                        initialValue: [data[0].createName],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="更新者"

                >
                    {getFieldDecorator('updateName', {
                        initialValue: [data[0].updateName],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}
const UserListForm = Form.create()(UpdateList);
export default UserListForm;
