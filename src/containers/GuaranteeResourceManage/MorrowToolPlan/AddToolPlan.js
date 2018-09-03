import React from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
import Api from '../../../api/request';


const residences = [{
    value: 'T',
    label: '有',
}, {
    value: 'F',
    label: '无',
}];
const empState = [{
    value: 'T',
    label: '正常',
}, {
    value: 'R',
    label: '离职/调走',
}];


class AddToolPlan extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
           battleLine:[]
        };

    }

 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.Addmaterials;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                if(values.subTaskListRemark!=undefined||values.repairChangeRemark!=undefined||values.workPlanRemark!=undefined||values.ddfcRemark!=undefined||values.highCheckRemark!=undefined
                    ||values.signColorRemark!=undefined||values.consumablesRemark!=undefined||values.subTaskRemark!=undefined||values.euqipmentRemark!=undefined||values.airmaterialRemark!=undefined
                    ||values.toolRemark!=undefined||values.metalWorkingRemark!=undefined||values.ndtRemark!=undefined||values.cleaningTeamRemark!=undefined||values.subTaskStationRemark!=undefined
                    ||values.lineManagerRemark!=undefined){
                    Api.post('weekWorkPackageRecord/saveWwpaRecord',{
                        'wwpId':value.id,
                        'subTaskListRemark':values.subTaskListRemark,
                        'repairChangeRemark':values.repairChangeRemark,
                        'workPlanRemark':values.workPlanRemark,
                        'ddfcRemark':values.ddfcRemark,
                        'highCheckRemark':values.highCheckRemark,
                        'signColorRemark':values.signColorRemark,
                        'consumablesRemark':values.consumablesRemark,
                        'subTaskRemark':values.subTaskRemark,
                        'euqipmentRemark':values.euqipmentRemark,
                        'airmaterialRemark':values.airmaterialRemark,
                        'toolRemark':values.toolRemark,
                        'metalWorkingRemark':values.metalWorkingRemark,
                        'ndtRemark':values.ndtRemark,
                        'cleaningTeamRemark':values.cleaningTeamRemark,
                        'subTaskStationRemark':values.subTaskStationRemark,
                        'lineManagerRemark':values.lineManagerRemark,
                    }).then(res=>{
                        // console.log(res);
                        if(res.errorCode=='0'){
                            message.success('添加成功！');
                        }else {
                            message.error('失败：'+res.errorMsg);
                        }
                    })
                }else {
                    message.warning('您什么都没有输入！');
                }

            }
        });

    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

// 新增员工分线下拉改变
componentDidMount(){
//     const battleLine =[];
//     Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_BATTLE_LINE'}).then(res=>{
//         // console.log(res.data[0].dictName);
//         for (let i=0;i<res.data.length;i++){
//        battleLine.push({
//         value: res.data[i].id,
//         label: res.data[i].dictName,
//     });
// }
//         this.setState({
//             battleLine:battleLine
//         });
//     })
    }

    render() {
        const {onCancel} = this.props;
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        // const battleLine=this.state.battleLine;
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
                <FormItem
                    {...formItemLayout}
                    label="工卡清单"
                    hasFeedback
                >
                    {getFieldDecorator('subTaskListRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="维修项目变更单"
                    hasFeedback
                >
                    {getFieldDecorator('repairChangeRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工作安排"
                    hasFeedback
                >
                    {getFieldDecorator('workPlanRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="DDFC"
                    hasFeedback
                >
                    {getFieldDecorator('ddfcRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="高检流程图"
                    hasFeedback
                >
                    {getFieldDecorator('highCheckRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="挂签颜色"
                    hasFeedback
                >
                    {getFieldDecorator('signColorRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="消耗品"
                    hasFeedback
                >
                    {getFieldDecorator('consumablesRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工卡准备"
                    hasFeedback
                >
                    {getFieldDecorator('subTaskRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="设备情况"
                    hasFeedback
                >
                    {getFieldDecorator('euqipmentRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="航材"
                    hasFeedback
                >
                    {getFieldDecorator('airmaterialRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工具"
                    hasFeedback
                >
                    {getFieldDecorator('toolRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="金工"
                    hasFeedback
                >
                    {getFieldDecorator('metalWorkingRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="NDT"
                    hasFeedback
                >
                    {getFieldDecorator('ndtRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="清洁队"
                    hasFeedback
                >
                    {getFieldDecorator('cleaningTeamRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="工卡站"
                    hasFeedback
                >
                    {getFieldDecorator('subTaskStationRemark', {
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="生产线经理"
                    hasFeedback
                >
                    {getFieldDecorator('lineManagerRemark', {
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
const AddToolPlanForm = Form.create()(AddToolPlan);
export default AddToolPlanForm;
