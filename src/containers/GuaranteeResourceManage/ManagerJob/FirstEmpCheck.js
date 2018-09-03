import React from 'react';
import { Form, Input, Tabs , Table, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const AutoCompleteOption = AutoComplete.Option;
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const workType = [{
    value: 'D',
    label: '白班',
}, {
    value: 'N',
    label: '晚班',
}];
const allotType = [{
    value: 'PD',
    label: '一线员工',
    children: [{
        value: 'P',
        label: '工作包',
    },{
        value: 'D',
        label: '工作日',
    }],
}];



class FirstEmpCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            data: [],
            loading:false,
            page:{},
            selectedRowKeys: [],
        };
        this.columns = [{
            title: '姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: 'E账号',
            dataIndex: 'empEaccount',
            key: 'empEaccount',
        }, {
            title: '部门',
            dataIndex: 'empDepartment',
            key: 'empDepartment',
        }, {
            title: '分线',
            dataIndex: 'empBattleLineName',
            key: 'empBattleLineName',
        }, {
            title: '专业',
            dataIndex: 'empSpecialty',
            key: 'empSpecialty',
        }];
    };


// 生产线经理根据工作包查询符合条件的一线员工列表提交
    FirstEmpWorkDaySubmit = (e) => {
        e.preventDefault();
        const value=this.props.FirstEmp;
        // console.log('value',value);
        const workStartTime=this.changetime(value.executeTime);
        const workEndTime=this.changetime(value.executeTime);
        // console.log(workStartTime,value.wwpId,value.id);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Api.post('weekWorkPackageEmployee/findEmpByWwpBattleLine',{'wwpId':value.wwpId,
                    'workStartTime':workStartTime,
                    'workEndTime':workEndTime,
                    'workType':values.workType[0],
                    'allotType':values.allotType[0],
                    'wwpEmpType':'',
                    'wwpWdType':values.allotType[1],
                    'empName':values.empName,
                    'wwpaId':value.id
                }).then(res=>{
                    // console.log(res);
                    // 被选中员工
                    let newSelectedRowKeys = [];
                    if(res.data){
                        for(let i=0;i<res.data.length;i++){
                            if(res.data[i].checked=='T'){
                                newSelectedRowKeys.push(res.data[i].id);
                            }
                        }
                        this.setState({
                            data:res? res.data:[],
                            page:res.pageInfo,
                            loading:false,
                            selectedRowKeys:newSelectedRowKeys
                        })
                    }

                })
            }
        });
    };

//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
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

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

//生产线经理一线员工工作安排【查询符合条件的员工】
    componentDidMount(){
        // const value=this.props.FirstEmp;
        const value1=this.props.wwpdata;
        // console.log('dddd',value1);
        Api.post('weekWorkPackageManagerOperating/findWwpaStlEmpListByEmpManager',{
            'wwpaId':value1.id,
            'subTaskListId':'',
        }).then(res=>{
            console.log('可选人员',res);
            // 被选中员工
            let newSelectedRowKeys = [];
            if(res.data){
                for(let i=0;i<res.data.length;i++){
                    if(res.data[i].checked=='T'){
                        newSelectedRowKeys.push(res.data[i].id);
                    }
                }
                this.setState({
                    data:res? res.data:[],
                    page:res.pageInfo,
                    loading:false,
                    selectedRowKeys:newSelectedRowKeys
                })
            }

        })
    }

   onChange=(value)=>{
    // console.log(value);
};
//
// // 分页查询'pageNow':pageNumber
//     onChangePage = (pageNumber) => {
//         const value=this.props.FirstEmp;
//         console.log('value',value);
//         const workStartTime=this.changetime(value.executeTime);
//         const workEndTime=this.changetime(value.executeTime);
//         // console.log(workStartTime);
//         this.props.form.validateFieldsAndScroll((err, values) => {
//             if (!err) {
//                 console.log('Received values of form: ', values);
//                 Api.post('weekWorkPackageEmployee/findEmpByWwpBattleLine',{'wwpId':value.wwpId,
//                     'workStartTime':workStartTime,
//                     'workEndTime':workEndTime,
//                     'workType':values.workType[0],
//                     'allotType':values.allotType[0],
//                     'wwpEmpType':'',
//                     'wwpWdType':values.allotType[1],
//                     'empName':values.empName,
//                     'pageNow':pageNumber
//                 }).then(res=>{
//                     // console.log(res);
//                     // 被选中员工
//                     let newSelectedRowKeys = [];
//                     for(let i=0;i<res.data.length;i++){
//                         if(res.data[i].checked=='T'){
//                             newSelectedRowKeys.push(res.data[i].id);
//                         }
//                     }
//                     this.setState({
//                         data:res? res.data:[],
//                         page:res.pageInfo,
//                         loading:false,
//                         selectedRowKeys:newSelectedRowKeys
//                     })
//                 })
//             }
//         });
//     };
// 监听人员是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
 // 生产线经理一线员工工卡安排【指派具体工卡清单】
    save = () => {
        const empManagerIds = this.state.selectedRowKeys;
        // console.log('empManagerIds',empManagerIds);
        const value1=this.props.wwpdata;
        const value2=this.props.wwpSelect;
       // console.log('value2',value1,value2);
       const stlIds=[];
      if(value2){
          for(let i=0;i<value2.length;i++){
              stlIds.push(value2[i].stlId);
          }
          if(empManagerIds.length>0){
              Api.post('weekWorkPackageManagerOperating/wwpaSubTaskListSchedulingByEmpManager',{
                  'empIds':empManagerIds,
                  'stlIds':stlIds,
                  'wwpId':value1.wwpId,
                  'wwpaId':value1.id,
                  'receiveState':'A',
              }).then(res=>{
                  // console.log('安排人员',res);
                  if(res.errorCode=='0'){
                      message.success('安排成功！');
                  }else{
                      message.error('安排失败！');
                  }
              })
          }else {
              message.warning('你未选择任何人员')
          }

      }
            // console.log(values);
            //    人员类型
        // if(empManagerIds.length>0){
        //     Api.post('weekWorkPackageManagerOperating/wwpaSubTaskListSchedulingByEmpManager',{
        //         'empIds':empManagerIds,
        //         'stlIds':value2,
        //         'wwpId':value1.wwpId,
        //         'wwpaId':value1.id,
        //         'receiveState':'A',
        //     }).then(res=>{
        //         // console.log('安排人员',res);
        //         if(res.errorCode=='0'){
        //             message.success('安排成功！');
        //         }else{
        //             message.error('安排失败！');
        //         }
        //     })
        // }else {
        //     message.warning('你未选择任何人员')
        // }

    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        this.WorkDaySubmit();
    };

    render() {
        const columns = this.columns;
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const {page}=this.state;
        const { data } = this.state;
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

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div>
                {/*<div className="header">*/}
                    {/*<Tabs defaultActiveKey="1" >*/}
                        {/*<TabPane tab="输入查询条件" key="1"></TabPane>*/}
                    {/*</Tabs>*/}
                        {/*<Form onSubmit={this.FirstEmpWorkDaySubmit}>*/}
                            {/*<Row gutter={40}>*/}
                                {/*<Col span={8} key={4} >*/}
                                        {/*<FormItem*/}
                                            {/*{...formItemLayout}*/}
                                            {/*label="排班类型"*/}

                                        {/*>*/}
                                            {/*{getFieldDecorator('workType', {*/}
                                                {/*initialValue: ['D'],*/}
                                                {/*rules: [{*/}
                                                    {/*required: true, message: '请选择排班类型!',*/}
                                                {/*}, {*/}
                                                    {/*validator: this.checkConfirm,*/}
                                                {/*}],*/}
                                            {/*})(*/}
                                                {/*<Cascader options={workType} style={{ width: 110 }}/>*/}
                                            {/*)}*/}
                                        {/*</FormItem>*/}
                                {/*</Col>*/}
                                {/*<Col span={8} key={5} >*/}
                                        {/*<FormItem*/}
                                        {/*{...formItemLayout}*/}
                                        {/*label="分配类型"*/}

                                    {/*>*/}
                                        {/*{getFieldDecorator('allotType', {*/}
                                            {/*initialValue: ['PD','P'],*/}
                                            {/*rules: [{*/}
                                                {/*required: true, message: '请选择分配类型!',*/}
                                            {/*}, {*/}
                                                {/*validator: this.checkConfirm,*/}
                                            {/*}],*/}
                                        {/*})(*/}
                                            {/*<Cascader options={allotType} onChange={this.onChange} showSearch placeholder="" />*/}
                                        {/*)}*/}
                                    {/*</FormItem>*/}
                                {/*</Col>*/}
                                {/*<Col span={8} key={1} >*/}
                                {/*<FormItem*/}
                                {/*{...formItemLayout}*/}
                                {/*label="备注"*/}
                                {/*hasFeedback*/}
                                {/*>*/}
                                {/*{getFieldDecorator('remark', {*/}
                                {/*})(*/}
                                {/*<Input />*/}
                                {/*)}*/}
                                {/*</FormItem>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}
                            {/*<Row>*/}
                                {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                    {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>*/}
                                        {/*重置*/}
                                    {/*</Button>*/}
                                    {/*<Button type="primary" htmlType="submit">查询</Button>*/}

                                {/*</Col>*/}
                            {/*</Row>*/}
                        {/*</Form>*/}
                {/*</div>*/}
                <div className="content" >
                    <Row  type="flex" justify="end">
                            <Col span={6} style={{marginBottom:'10px'}}>
                                <Button type="primary" onClick={this.save}>保存</Button>
                            </Col>
                    </Row>
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} rowSelection={rowSelection} bordered size="small"/>
                    <Pagination
                        {...page}
                        onChange={this.onChangePage}
                    />
                </div>
            </div>
        );
    }
}
const FirstEmpCheckForm = Form.create()(FirstEmpCheck);
export default FirstEmpCheckForm;
