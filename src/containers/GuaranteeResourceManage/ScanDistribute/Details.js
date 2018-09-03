import React from 'react';
import { Form, Input, Cascader, Select, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';


const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
// }, {
//     value: 'D',
//     label: '删除',
}];

class Details extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };


//     if(value2=='STL'){
//     Api.post('weekWorkPackageManagerOperating/empEcoverWorInfoList',{
//     'receiveType':value2,
//     'stlId':value1.id,
//     'wwpId':value1.wwpId,
//     'executeStatus':'E',
//     'executeRemark':values.executeRemark,
// }).then(res=>{
//     if(res.errorCode=='0'){
//         message.success('回收成功！');
//     }else{
//         message.error('回收失败：'+res.errorMsg);
//     }
// })
// }
// if(value2=='DDFC'){
//     Api.post('weekWorkPackageManagerOperating/empEcoverWorInfoList',{
//         'receiveType':value2,
//         'deferId':value1.id,
//         'executeStatus':'E',
//         'executeRemark':values.executeRemark,
//     }).then(res=>{
//         if(res.errorCode=='0'){
//             message.success('回收成功！');
//         }else{
//             message.error('回收失败：'+res.errorMsg);
//         }
//     })
// }
// if(value2=='NRC'){
//     Api.post('weekWorkPackageManagerOperating/empEcoverWorInfoList',{
//         'receiveType':value2,
//         'nrcId':value1.id,
//         'executeStatus':'E',
//         'executeRemark':values.executeRemark,
//         'wwpId':value1.wwpId,
//     }).then(res=>{
//         if(res.errorCode=='0'){
//             message.success('回收成功！');
//         }else{
//             message.error('回收失败：'+res.errorMsg);
//         }
//     })
// }



    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        // const value1=this.props.DistributeDate;
        const value2=this.props.value;
        const selectedRows=this.props.selectedRow;
        // console.log('aa',selectedRows,value2);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                    if(value2=='STL'){
                        for(let i=0;i<selectedRows.length;i++){
                            Api.post('weekWorkPackageManagerOperating/empEcoverWorInfoList',{
                                'receiveType':value2,
                                'stlId':selectedRows[i].id,
                                'wwpId':selectedRows[i].wwpId,
                                'executeStatus':'E',
                                'executeRemark':values.executeRemark,
                            }).then(res=>{
                                if(res.errorCode=='0'){
                                    message.success('回收成功！');
                                }else{
                                    message.error('回收失败：'+res.errorMsg);
                                    return false;
                                }
                            })
                        }

                    }
                    if(value2=='DDFC'){
                        for(let i=0;i<selectedRows.length;i++){
                            Api.post('weekWorkPackageManagerOperating/empEcoverWorInfoList',{
                                'receiveType':value2,
                                'deferId':selectedRows[i].id,
                                'executeStatus':'E',
                                'executeRemark':values.executeRemark,
                            }).then(res=>{
                                if(res.errorCode=='0'){
                                    message.success('回收成功！');
                                }else{
                                    message.error('回收失败：'+res.errorMsg);
                                    return false;
                                }
                            })
                        }

                    }
                    if(value2=='NRC'){
                        for(let i=0;i<selectedRows.length;i++){
                            Api.post('weekWorkPackageManagerOperating/empEcoverWorInfoList',{
                                'receiveType':value2,
                                'nrcId':selectedRows[i].id,
                                'executeStatus':'E',
                                'executeRemark':values.executeRemark,
                                'wwpId':selectedRows[i].wwpId,
                            }).then(res=>{
                                if(res.errorCode=='0'){
                                    message.success('回收成功！');
                                }else{
                                    message.error('回收失败：'+res.errorMsg);
                                    return false;
                                }
                            })
                        }

                    }


            }
        });
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
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

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
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="回收说明"
                >
                    {getFieldDecorator('executeRemark',{
                        rules: [{ required: true, message: '回收说明不能为空!' }],
                    })(
                        <Input type="textarea" rows={4} placeholder="" />
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
const DetailsForm = Form.create()(Details);
export default DetailsForm;
