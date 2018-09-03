import React from 'react';
import { Form, Input, DatePicker ,Cascader, Select, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';
const { RangePicker } = DatePicker;
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


const amState = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];

class AddAttendance extends React.Component {
    constructor(props) {
        super(props);
       this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
           battleLine:[],
           dataSource: [],
           amType:[],
           vis:false,
        };

    }

 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        // console.log('a',this.props.value);
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('values',values);
            if (!err) {
                    // Api.post('employeeInfo/findEmployeeByCondition').then(res=>{
                    //     const start = values.empName.indexOf('(');
                    //     const end = values.empName.lastIndexOf(')');
                    //     const value = values.empName.slice(start+1, end);
                        // console.log('Received values of form: ', value);
                        // for(let i=0;i<res.data.length;i++){
                        //     if(value==res.data[i].empNo){
                                // console.log('Received values of form: ', res.data[i].empNo);
                                Api.post('attendance/addOrUpdateAttendance',{
                                    'empId': this.props.value.id,
                                    'amType':values.amType,
                                    'startTime':values.startTime[0].format('YYYY-MM-DD '),
                                    'endTime':values.startTime[1].format('YYYY-MM-DD'),
                                    'amState':values.amState[0],
                                    'workLocation':values.workLocation?values.workLocation:'',
                                }).then(res=>{
                                    // console.log(res);
                                    if(res.errorCode=='0'){
                                        message.success('添加成功！');
                                    }else {
                                        message.error('添加失败！');
                                    }
                                })
                            // }
                        // }
                    // });

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



   handleChange(value) {
    // console.log(`selected ${value}`);
}

  handleBlur() {
    // console.log('blur');
}

//    handleFocus() {
//     console.log('focus');
//        this.props.form.validateFields(['subTaskId'],(err, values) => {
//            console.log('subTaskId',values);
//        });
// }


// 新增员工排班类型选择
componentDidMount(){
    const amType=[];
    //
    Api.post('dataDict/findDataDictByCode',{'dictCode':'EMPLOYEE_HOLIDAY_TYPE'}).then(res=>{
        // console.log('res',res);
        this.setState({
            amType:res?res.data:[]
        });
    });


    Api.post('employeeInfo/findEmployeeByCondition').then(res=>{
        // console.log('cccc',res);
        const dataSource=[];
        for(let i=0;i<res.data.length;i++){
            dataSource.push(res.data[i].empName+'('+res.data[i].empNo+')');
            // console.log('searchdata',searchdata);
            this.setState({
                dataSource:dataSource
            });
        }
    });
    }

    //选择显示
    handleSelect = (value,options)=> {
        if(value=='FD6552C839A3625BCF76BF2C1E15A4DF176EF13181EB0B342A50009A44706D49'||value=='F4721DE281FC779270F543AEAC63696CCC81DD218A1FB825C9334A362F2BC5B4'||value=='B4ADF64AF7A47524027F818615871245E8DFBB0EA5A63382F29B0C37F0839773'){
            this.setState({
                vis:false
            });
        }else{
            this.setState({
                vis:true
            })
        }
    };

// 新增姓名-》ID选择 searchdata.push(res.data[i].empName+'('+res.data[i].empNo+')');
//     handleSearch = (value) => {
//         Api.post('employeeInfo/findEmployeeByCondition').then(res=>{
//             // console.log('cccc',res);
//             const searchdata=[];
//             for(let i=0;i<res.data.length;i++){
//                searchdata.push(res.data[i].empName+'('+res.data[i].empNo+')');
//                // console.log('searchdata',searchdata);
//                 this.setState({
//                     dataSource: !value ? [] : searchdata
//                 });
//             }
//         });
//     };


    render() {
        const {onCancel} = this.props;
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult,dataSource,amType,vis} = this.state;
        const battleLine=this.state.battleLine;
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

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="请假类型"
                    hasFeedback
                >
                    {getFieldDecorator('amType',{
                        rules: [{
                            required: true, message: '请选择请假类型!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Select onSelect={this.handleSelect}>
                            {
                                amType.map((s,v)=>
                                    <Option key={v} value={s.id}>{s.dictName}</Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="开始-结束（时间）"
                    hasFeedback
                >
                    {getFieldDecorator('startTime', {
                        rules: [{
                            required: true, message: '请选择开始结束时间!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <RangePicker onChange={this.onChange}  format="YYYY-MM-DD"  placeholder={['', '']}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="状态"
                    hasFeedback
                >
                    {getFieldDecorator('amState',{
                        initialValue: ['T'],
                        rules: [{
                            required: true, message: '请选择状态!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Cascader options={amState} onChange={this.onChange}/>
                    )}
                </FormItem>

                   <FormItem
                        {...formItemLayout}
                        label="工作地点"
                        hasFeedback
                    >
                        {getFieldDecorator('workLocation',{
                            rules: [{
                                required: true, message: '请输入工作地点!',
                            }, {
                                validator: this.checkConfirm,
                            }],
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
const AddAttendanceForm = Form.create()(AddAttendance);
export default AddAttendanceForm;
