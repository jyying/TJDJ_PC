import React from 'react';
import { Form, Input, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
import Api from '../../../api/request';

const FormItem = Form.Item;
const Option = Select.Option;



class AddDataDictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            vis:'none',
            data:'',
            options:[],
            addShow:false,
            boolean:true,
            attendance:false
        };
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    //选择框
    handleSelect = (value,options)=> {
        if(value=='C'){
            this.setState({
                vis:'block',

            });
            Api.post('dataDict/findDataDictByType').then(res=>{
                const options=[];
                // for(let i=0;i<res.data.length;i++){
                //     options.push({
                //         value:res.data[i].id ,
                //         label:res.data[i].dictName ,
                //     })
                // }
                this.setState({
                    options: res.data,
                    boolean:true ,
                });
            })
        }else{
            this.setState({
                vis:'none',
                boolean:false
            })
        }
    };

    SelectOption = (value,options)=> {
        if(value=='F4721DE281FC779270F543AEAC63696CC546DAAB435847818EB2981B4DFC54FF'){
            this.setState({
                attendance:true,

            });
        }else {
            this.setState({
                attendance:false,
            });
        }
    };

    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(this.state.attendance){
                    if(values.dictValue=='T'||values.dictValue=='T'){
                        Api.post('dataDict/addOrUpdateDataDict',{
                            'dataDictId':values.dataDictId,
                            'dictType':values.dictType,
                            'dictName':values.dictName,
                            'dictCode':values.dictCode,
                            'dictValue':values.dictValue,
                            'parentId':values.parentId ? values.parentId:'',
                            'dictState':values.dictState[0],
                            'remark':values.remark,
                            'parentName':values.parentName
                        }).then(res=>{
                            if(res.errorCode=='0'){
                                message.success('添加成功！');
                            }else if(res.errorMsg=='字典代码已存在,添加失败'){
                                message.error('字典代码已存在！');
                            }else{
                                message.error('添加失败！');
                            }
                        })
                    }else {
                        message.error('字典值输入有误')
                    }
                }else {
                    Api.post('dataDict/addOrUpdateDataDict',{
                        'dataDictId':values.dataDictId,
                        'dictType':values.dictType,
                        'dictName':values.dictName,
                        'dictCode':values.dictCode,
                        'dictValue':values.dictValue,
                        'parentId':values.parentId ? values.parentId:'',
                        'dictState':values.dictState[0],
                        'remark':values.remark,
                        'parentName':values.parentName
                    }).then(res=>{
                        if(res.errorCode=='0'){
                            message.success('添加成功！');
                        }else if(res.errorMsg=='字典代码已存在,添加失败'){
                            message.error('字典代码已存在！');
                        }else{
                            message.error('添加失败！');
                        }
                    })
                }

            }
        });
    };

    render() {

        const { getFieldDecorator } = this.props.form;
        const options=this.state.options;
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
        const boolean=this.state.boolean;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="字典类型"
                    hasFeedback
                >
                    {getFieldDecorator('dictType', {
                        rules: [{
                            required: true, message: '请选择字典类型!',
                        }],
                    })(
                        <Select
                            onSelect={this.handleSelect}
                        >
                            <Option value="P">父型</Option>
                            <Option value="C">子型</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="父型名称"
                    hasFeedback
                    style={{display:this.state.vis}}
                >
                    {getFieldDecorator('parentId',{
                            // initialValue: this.state.boolean,
                            rules: [{
                                required: true, message: '请输入父型名称!',
                            }],

                        }

                    )(
                            <Select onSelect={this.SelectOption}>
                        {
                            options.map((s,v)=>
                                <Option key={v} value={s.id}>{s.dictName}</Option>
                            )
                        }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典名称"
                    hasFeedback
                >
                    {getFieldDecorator('dictName', {
                        rules: [{
                            required: true, message: '请输入字典名称!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="字典代码"
                    hasFeedback
                >
                    {getFieldDecorator('dictCode', {
                        rules: [{
                            required: true, message: '请输入字典代码!',
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="字典状态"
                    hasFeedback
                >
                    {getFieldDecorator('dictState', {
                        rules: [{ required: true, message: '请选择字典状态!' }],
                    })(
                        <Select>
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
                     validateStatus={this.state.attendance?"warning":''}
                     help={this.state.attendance?"只能输入T(前一天可安排晚班),F（前一天不能安排晚班）":''}
                >
                    {getFieldDecorator('dictValue',{
                        rules: [{
                            required: true, message: '请输入字典值!',
                        }],
                    })(
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

                {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label="父型名称"*/}
                    {/*hasFeedback*/}
                    {/*style={{display:this.state.vis}}*/}
                {/*>*/}
                    {/*{getFieldDecorator('parentId'*/}

                    {/*)(*/}
                        {/*<Cascader options={options}  placeholder=""  style={{width:165}} />*/}
                    {/*)}*/}
                {/*</FormItem>*/}
                <FormItem {...tailFormItemLayout}>

                        <Button
                            size="large"
                            onClick={onCancel}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                        >
                            确定
                        </Button>

                </FormItem>
            </Form>
        );
    }
}
const DataDictionaryListForm = Form.create()(AddDataDictionary);
export default DataDictionaryListForm;
