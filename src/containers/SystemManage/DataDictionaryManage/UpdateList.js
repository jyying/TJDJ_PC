/**
 * Created by Administrator on 2017/7/20/020.
 */
import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
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

class UpdateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            vis:'none',
            data:'',
            options:[],
            boolean:true
        };
    }
    componentDidMount(){
        //console.log(this.props.data[0].dictType);
        if(this.props.data[0].dictType=='C'){
            this.setState({
                vis:'block',
            });
            Api.post('dataDict/findDataDictByType').then(res=>{
                const options=[];
                for(let i=0;i<res.data.length;i++){
                    options.push({
                        value:res.data[i].id ,
                        label:res.data[i].dictName ,
                    })
                }
                this.setState({
                    options: options,
                    boolean:true
                });
            })
        }else{
            this.setState({
                vis:'none',
                boolean:false
            })
        }
    }
    handleSelect = (value,options)=> {
        if(value=='C'){
            this.setState({
                vis:'block'
            });
            Api.post('dataDict/findDataDictByType').then(res=>{
                const options=[];
                for(let i=0;i<res.data.length;i++){
                    options.push({
                        value:res.data[i].id ,
                        label:res.data[i].dictName ,
                    })
                }
                this.setState({
                    options: options
                });
            })
        }else{
            this.setState({
                vis:'none'
            })
        }
    };

    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const data=this.props.data;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
               Api.post('dataDict/addOrUpdateDataDict',{
                   'dataDictId':data[0].id,
                   'dictType':values.dictType,
                   'dictName':values.dictName,
                   'dictCode':values.dictCode,
                   'dictValue':values.dictValue,
                   'parentId':values.parentId?values.parentId[0]:'',
                   'dictState':values.dictState[0],
                   'remark':values.remarks,
               }).then(res=>{
                   if(res.errorCode=='0'){
                       message.success('更新成功！');
                   }else if(res.errorMsg=='字典代码已存在，修改失败'){
                       message.error('字典代码已存在！');
                   } else{
                       message.error('更新失败！');
                   }
               })
            }
        });
    };

    render() {
        const data=this.props.data;
        const { getFieldDecorator } = this.props.form;
        const {onCancel} = this.props;
        const options=this.state.options;
        const boolean=this.state.boolean;
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
                    {/*label="用户ID"*/}
                    {/*hasFeedback*/}
                {/*>*/}
                    {/*{getFieldDecorator('dataDictId', {*/}
                        {/*initialValue: [data[0].id]*/}
                    {/*})(*/}
                        {/*<Input />*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem
                    {...formItemLayout}
                    label="字典类型"
                    hasFeedback

                >
                    {getFieldDecorator('dictType', {
                        initialValue: data[0].dictType,
                        rules: [{
                                required: true
                            }],
                    })(
                        <Select
                            showSearch
                            // style={{ width: 200 }}
                            optionFilterProp="children"
                            onSelect={this.handleSelect}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                        >
                            <Option value="P">父型</Option>
                            <Option value="C">子型</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典名"
                    hasFeedback
                >
                    {getFieldDecorator('dictName', {
                        initialValue: data[0].dictName,
                        rules: [{
                            required: true
                        }],
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
                        initialValue: data[0].dictCode,
                        rules: [{
                            required: true
                        }],
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="字典状态"
                    hasFeedback
                >
                    {getFieldDecorator('dictState',{
                        initialValue: [data[0].dictState],
                        rules: [{
                            required: true
                        }],
                    })(
           //             {/*<Cascader options={residences} placeholder=""/>*/}
                        <Select initialValue={data[0].dictState} >
                            <Option value="T">有效</Option>
                            <Option value="F">无效</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="字典值"
                    hasFeedback
                    style={{display:this.state.vis}}
                >
                    {getFieldDecorator('dictValue', {
                        initialValue: data[0].dictValue,
                        rules: [{
                            required: boolean
                        }],

                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="父型名称"
                    hasFeedback
                    style={{display:this.state.vis}}
                >
                    {getFieldDecorator('parentId',{
                         initialValue: [data[0].parentId],
                        rules: [{
                            required: true
                        }],
                    })(
                        <Cascader options={options}  placeholder="" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >

                    {getFieldDecorator('remarks', {
                        initialValue: data[0].remark,
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
const UserListForm = Form.create()(UpdateList);
export default UserListForm;
