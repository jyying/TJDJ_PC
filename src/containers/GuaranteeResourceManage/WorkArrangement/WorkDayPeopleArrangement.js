import React from 'react';
import { Form, Input, Tabs , Table, Icon, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
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

class WorkDayPeopleArrangement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            data: [],
            loading:false,
            page:{},
            selectedRowKeys: [],
            wwpWdArrType:[],
            Line:[],
            airPlaneModels:[],
            orderNo:{}
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                render: (text, record,index) => (
                    <div>
                       <span>{index+1}</span>
                    </div>
                ),
            },
            {
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
            key: 'empLevelCode',
        }, {
            title: '分线',
            dataIndex: 'empBattleLineName',
            key: 'empBattleLineName',
        }, {
            title: '专业',
            dataIndex: 'empSpecialty',
            key: 'empSpecialty',
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width:'240px',
            render: (text, record) => (
                <div>
                    {this.props.form.getFieldDecorator(record.id, {
                        initialValue:record.remark
                    })(
                        <Input />
                    )}
                </div>
            ),
        }];

    };

    Dates=()=>{
        let now = new Date().getTime();
        let tomorrow = new Date(Number(now) + 24 * 3600 * 1000);
        let year = tomorrow.getFullYear();
        let month = tomorrow.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = tomorrow.getDate();
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day;
    };

// 查询符合条件的员工【用于工作日人员安排、或安排其他分线人员】
    Submit = (e) => {
        e.preventDefault();
        this.setState({
            loading:true,
        });
        const value=this.props.dateTime;
      // 如果日期没选，默认的是次日
        this.props.form.validateFieldsAndScroll(['battleLine','empName'],(err, values) => {
            if (!err) {

                Api.post('weekWorkPackageEmployee/findEmpForWorkaDayOrOtherEmp',{
                    'workStartTime':value!=undefined ?value.format('YYYY-MM-DD'):this.Dates(),
                    'workEndTime':value!=undefined?value.format('YYYY-MM-DD'):this.Dates(),
                    'battleLine':values.battleLine?values.battleLine:'',
                    'empName':values.empName?values.empName:'',
                }).then(res=>{
                    console.log(res);
                    // 被选中员工
                    let newSelectedRowKeys = [];
                    if(res.data){
                        for(let i=0;i<res.data.length;i++){
                            if(res.data[i].checked=='T'){
                                newSelectedRowKeys.push(res.data[i].id);
                            }
                        }
                        this.setState({
                            data:res?res.data:[],
                            page:res.pageInfo,
                            loading:false,
                            selectedRowKeys:newSelectedRowKeys
                        })
                    }

                })
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

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

//
    componentDidMount(){
        const wwpWdArrType =[];
        Api.post('weekWorkPackageEmployee/findWorkDayEmpArrType').then(res=>{
            for (let i=0;i<res.data.length;i++){
                wwpWdArrType.push({
                    value: res.data[i].id,
                    label: res.data[i].dictName,
                });
            }
            this.setState({
                wwpWdArrType:wwpWdArrType
            });
        });

        // 获取分线信息
        Api.post('weekWorkPackage/findBattleLine')
            .then(res => {
                if(res.errorCode == 0) {
                    //console.log(res.data);
                    this.setState({
                        Line:res.data
                    })
                }
            });

        // 获取飞机机型信息
        Api.post('air/findAllAirPlaneModel')
            .then(res => {
                if(res.errorCode == 0) {
                    this.setState({
                        airPlaneModels:res.data
                    })
                }
            });
    }

   onChange=(value)=>{
    // console.log(value);
};

// 监听人员是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
 // 工作包日计划一线员工安排
    save = () => {
        const remarks=[];
        const empManagerIds = this.state.selectedRowKeys;
        console.log(empManagerIds);
        const value=this.props.dateTime;
        let idText = [];
        this.props.form.validateFieldsAndScroll(empManagerIds,(err,values) => {
            idText = values;
            for (let k in values){
                // console.log(k+' : '+values[k]);
                remarks.push(values[k])
            }
            // console.log('remarks',remarks);
            const newremarks=remarks.join("|||");
            // console.log('newremarks',newremarks);
            // return;
            this.props.form.validateFieldsAndScroll(['battleLine','empName','wwpWdArrType','airPlaneModelId'],(err, values) => {
                if (!err) {
                    //    人员类型
                    if(empManagerIds.length>0){
                        Api.post('weekWorkPackageEmployee/wwpEmpSchedulingByDay',{
                            'arrangeDate':value?value.format('YYYY-MM-DD'):'',
                            'pdState':'T',
                            'battleLine':values.battleLine,
                            'employeeIds':empManagerIds,
                            'remarks':newremarks,
                            'wwpWdArrTypeId':values.wwpWdArrType,
                            'airPlaneModelId':values.airPlaneModelId,
                        }).then(res=>{
                            if(res.errorCode=='0'){
                                message.success('安排成功！');
                            }else{
                                message.error('安排失败！');
                            }
                        })
                    }else {
                        message.warning('未选择人员');
                    }

                }
            });
        });

    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const wwpWdArrType =this.state.wwpWdArrType;
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
        const formItemLayout1 = {
            labelCol: { span: 10},
            wrapperCol: { span: 14 },
        };
        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="输入查询条件" key="1"></TabPane>
                    </Tabs>
                        <Form onSubmit={this.Submit}>
                            <Row gutter={40}>
                                {/*<Col span={8} key={1} >*/}
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
                                <Col span={8} key={1} >
                                    <FormItem
                                    {...formItemLayout}
                                    label="分线"

                                    >
                                    {getFieldDecorator('battleLine', {
                                    })(
                                        <Select
                                            allowClear={true}
                                        >
                                            {
                                                this.state.Line.map((s,v)=>
                                                    <Option
                                                        key={v}
                                                        value={s.id}
                                                    >{s.dictName}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={8} key={2} >
                                <FormItem
                                {...formItemLayout}
                                label="员工姓名"
                                hasFeedback
                                help="多个姓名查询使用空格分隔"
                                >
                                {getFieldDecorator('empName', {
                                })(
                                <Input />
                                )}
                                </FormItem>
                                </Col>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                        重置
                                    </Button>
                                    <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>

                                </Col>
                            </Row>
                            {/*<Row>*/}
                                {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                    {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>*/}
                                        {/*重置*/}
                                    {/*</Button>*/}
                                    {/*<Button type="primary" htmlType="submit">查询</Button>*/}

                                {/*</Col>*/}
                            {/*</Row>*/}
                        </Form>
                </div>
                <div className="content" >
                    <Form onSubmit={this.Submit}>
                    <Row  type="flex" justify="start">

                        <Col span={8} key={4}>
                            <FormItem {...formItemLayout} label={`其他人员安排类型`}>
                                {getFieldDecorator(`wwpWdArrType`,{
                                    rules: [{ required: true, message: '其他人员安排类型不能为空!' }],
                                })(
                                    <Select  allowClear={true}>
                                        {
                                            wwpWdArrType.map((s,v)=>
                                                <Option key={v} value={s.value}>{s.label}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} key={5} >
                            <FormItem
                                {...formItemLayout} label="机型"
                            >
                                {getFieldDecorator('airPlaneModelId', {
                                    rules: [{ required: true, message: '机型不能为空!' }],
                                })(
                                    <Select
                                        allowClear={true}
                                    >
                                        {
                                            this.state.airPlaneModels.map((s,v)=>
                                                <Option
                                                    key={v}
                                                    value={s.id}
                                                >{s.airPlaneModel}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/*<Col span={6} key={3} >*/}
                            {/*<FormItem*/}
                                {/*{...formItemLayout}*/}
                                {/*label="备注"*/}
                                {/*hasFeedback*/}
                            {/*>*/}
                                {/*{getFieldDecorator('remarks', {*/}
                                {/*})(*/}
                                    {/*<Input />*/}
                                {/*)}*/}
                            {/*</FormItem>*/}
                        {/*</Col>*/}
                            <Col span={8} style={{marginBottom:'10px'}}>
                                <Button type="primary" onClick={this.save}>增加</Button>
                            </Col>

                    </Row>
                    </Form>
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} rowSelection={rowSelection} bordered size="middle" />
                    <Pagination
                        {...page}
                        onChange={this.onChangePage}
                    />
                </div>
            </div>
        );
    }
}
const WorkDayPeopleArrangementForm = Form.create()(WorkDayPeopleArrangement);
export default WorkDayPeopleArrangementForm;
