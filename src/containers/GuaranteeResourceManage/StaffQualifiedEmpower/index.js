
import React from 'react';
import { Form, Input, Button,Table,Modal,DatePicker,Cascader,Pagination,message  } from 'antd';
import {  Row, Col} from 'antd';
import UpdateList from './UpdateList';
import AddUserList from './AddUserList';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
// moment.locale('zh-cn');



const residences = [{
    value: 'F',
    label: 'F',
}, {
    value: 'T',
    label: 'T',
}, {
    value: 'D',
    label: 'D',
}];

// 用户管理
class UserManagement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: []
        };
        this.columns = [{
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '员工姓名',
            dataIndex: 'empName',
            key: 'empName',
        }, {
            title: '飞机型号',
            dataIndex: 'airplaneModelName',
            key: 'airplaneModelName',
        }, {
            title: '员工水平值',
            dataIndex: 'empLevelValue',
            key: 'empLevelValue',
        }, {
            title: '飞机区域值',
            dataIndex: 'airplaneAreaValue',
            key: 'airplaneAreaValue',
        }, {
            title: '身份验证状态',
            dataIndex: 'authState',
            key: 'authState',
        },{
            title: '创建人',
            dataIndex: 'createName',
            key: 'createName',
        }, {
            title: '更新人',
            dataIndex: 'updateName',
            key: 'updateName',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record,index) => (
                <span>
                    <a  onClick={()=>this.showModal(index)}>更新</a>
                    <Modal
                        title="更新"
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        maskClosable={false}
                        footer={null}
                        className='showModal'
                    >
                   <UpdateList data={this.state.information}/>
                     </Modal>
                 </span>
            ),
        }];
        this.state={
            data:[]
        };
    }
// 更新用户的Modal
    showModal = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        // console.log('information',information);
        this.setState({
            visible: true,
            information:information
        });

    };
// 新增用户的Modal
    showModalAdd = () => {
        this.setState({
            update: true,
        });
    };
    // 更新页面数据
    // update(){
    //     Api.post('employeeAuth/addOrUpdateEmployeeAuth').then(res=>{
    //         // console.log(res);
    //         this.setState({
    //             data:res? res.data:[],
    //             currentPage:parseInt(res.pageInfo.currentPage),
    //             totalPageSize:parseInt(res.pageInfo.totalPageSize),
    //             totalSize:parseInt(res.pageInfo.totalSize)
    //         })
    //     })
    // }
    // componentDidMount(){
    //     this.update();
    // }
    handleCancel = (e) => {
        // this.update();
        // location.reload();
        this.setState({
            visible: false,
        });
    };
    handleCancelAdd = (e) => {
        // console.log(e);
        // this.update();
        this.setState({
            update:false
        });
    };
// ID查询
//     handleSubmitID = (e) => {
//         e.preventDefault();
//         this.props.form.validateFields(['userId'],(err, values) => {
//             console.log('userId: ', values.userId);
//             Api.post('user/findUserInfoById',{'userId':values.userId}).then(res=>{
//                 // console.log(res.data);
//                 let datas =res? [res.data]:[];
//                 this.setState({
//                     data: datas,
//                     currentPage:1,
//                     totalPageSize:1,
//                     totalSize:1
//                 });
//             })
//         });
//     };
// 验证用户账号
//     checkUserAccount = (e) => {
//         e.preventDefault();
//         this.props.form.validateFields(['checkUser'],(err, values) => {
//             Api.post('user/checkUserAccount',{'userAccount':values.checkUser}).then(res=>{
//                 // console.log(res.data);
//                 if(res.errorCode=='0'){
//                     message.success('账号可用！');
//                 }else{
//                     message.error('账号为不可用账号！');
//                 }
//             })
//         });
//     };
// 多条件查询
//     onChangeTime=(date, dateString)=>{
//         // console.log(date, dateString);
//     };
//     handleSearch = (e) => {
//         e.preventDefault();
//         this.props.form.validateFields(['userAccount','userName','updateTime','userState'],(err, values) => {
//             console.log('Received values of form: ', values);
//             Api.post('user/findUserByCondition',{
//                 'userAccount':values.userAccount,
//                 'userName':values.userName,
//                 'updateTime':values.updateTime,
//                 'userState':values.userState[0]
//             }).then(res=>{
//                 console.log(res);
//                 this.setState({
//                     data:res? res.data:[]
//                 });
//             })
//         });
//     };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
    };
// 分页查询
    onChange = (pageNumber) => {
        console.log('Page: ', pageNumber);
        Api.post('user/findUserByCondition',{'pageNow':pageNumber}).then(res=>{
            this.setState({
                data:res? res.data:[],
                currentPage:parseInt(res.pageInfo.currentPage),
            });
        })

    };
    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data } = this.state;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="根据员工ID查询" key="1">
                            <Form
                                className="ant-advanced-search-form"
                                 // onSubmit={this.handleSubmitID}
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1} >
                                        <FormItem {...formItemLayout} label={`员工ID`}>
                                            {getFieldDecorator(`employeeInfoId`,{
                                                initialValue: [],
                                            })(
                                                <Input placeholder="placeholder" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="submit">Search</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>
                        <TabPane tab="根据机型ID查询" key="2">
                            <Form
                                className="ant-advanced-search-form"
                                // onSubmit={this.handleSubmitID}
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1} >
                                        <FormItem {...formItemLayout} label={`机型ID`}>
                                            {getFieldDecorator(`airplaneModelId`,{
                                                initialValue: [],
                                            })(
                                                <Input placeholder="placeholder" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="submit">Search</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>
                        <TabPane tab="根据权限ID查询" key="3">
                            <Form
                                className="ant-advanced-search-form"
                                // onSubmit={this.handleSubmitID}
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1} >
                                        <FormItem {...formItemLayout} label={`权限ID`}>
                                            {getFieldDecorator(`employeeAuthId`,{
                                                initialValue: [],
                                            })(
                                                <Input placeholder="placeholder" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="submit">Search</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>
                    </Tabs>

                </div>
                <div className="content">
                    <div style={{width:'100%',height:'60px'}}>
                        {/*<Col span={10} >*/}
                            {/*<Form layout="inline" onSubmit={this.handleSubmitID}>*/}

                                {/*<FormItem {...formItemLayout} label={`用户ID:`}>*/}
                                    {/*{getFieldDecorator(`userId`,{*/}
                                        {/*rules: [{ required: true, message: 'ID不能为空!' }],*/}
                                    {/*})(*/}
                                        {/*<Input placeholder="placeholder" style={{width:'200px'}}/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}

                                {/*<FormItem>*/}
                                    {/*<Button*/}
                                        {/*type="primary"*/}
                                        {/*htmlType="submit"*/}
                                    {/*>*/}
                                        {/*查找*/}
                                    {/*</Button>*/}
                                {/*</FormItem>*/}
                            {/*</Form>*/}
                        {/*</Col>*/}
                        {/*<Col span={10} >*/}
                            {/*<Form layout="inline" onSubmit={this.checkUserAccount}>*/}

                                {/*<FormItem {...formItemLayout} label={`验证用户:`}>*/}
                                    {/*{getFieldDecorator(`checkUser`)(*/}
                                        {/*<Input placeholder="用户账号" style={{width:'200px'}}/>*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}

                                {/*<FormItem>*/}
                                    {/*<Button*/}
                                        {/*type="primary"*/}
                                        {/*htmlType="submit"*/}
                                    {/*>*/}
                                        {/*验证*/}
                                    {/*</Button>*/}
                                {/*</FormItem>*/}
                            {/*</Form>*/}
                        {/*</Col>*/}
                        <Button className="editable-add-btn" type="primary" onClick={this.showModalAdd}>增加</Button>
                        <Modal
                            title="新增用户"
                            visible={this.state.update}
                            onCancel={this.handleCancelAdd}
                            maskClosable={false}
                            footer={null}
                            key={this.state.count}
                        >
                            <AddUserList/>
                        </Modal>
                    </div>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey='id'/>
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}/>
                </div>
            </div>
        )
    }
}
const UserManagements = Form.create()(UserManagement);
export default UserManagements;


