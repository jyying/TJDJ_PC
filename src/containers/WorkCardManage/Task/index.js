
import React,{Component} from 'react';
import { Form, Input, Button,Table,Modal,Icon,Select,message,Tabs,Row, Col} from 'antd';

import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';

import UpdateContainer from './update';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
let modalKey = 0;


// url
const task = 'workPackageInfo/findTaskByCondition';

class Task extends Component {
    constructor(){
        super();
        this.state = {
            data: [],
            tableLoading:false,
            searchCriteria:{},
            page:{},
            pageNow:1,
            update:false,
            updateInfo:{}
        };
        this.columns = [
            {
                title: 'Task号',
                dataIndex: 'taskNo',
                key: 'taskNo',
            },{
                title: '依据',
                dataIndex: 'baseline',
                key: 'baseline',
            },{
                title: 'task类型',
                dataIndex: 'taskType',
                key: 'taskType',
            },{
                title: '首检',
                dataIndex: 'threshold',
                key: 'threshold',
            },{
                title: '重复检',
                dataIndex: 'interv',
                key: 'interv',
            },{
                title: '中文标题',
                dataIndex: 'titleCn',
                key: 'titleCn',
            },{
                title: '英文标题',
                dataIndex: 'titleEn',
                key: 'titleEn',
            },{
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
            },{
                title: '工作类别',
                dataIndex: 'taskNature',
                key: 'taskNature',
            },{
                title: '版本',
                dataIndex: 'revision',
                key: 'revision',
            // },{
            //     title: '状态',
            //     dataIndex: 'taskState',
            //     key: 'taskState',
            //     render:(text,record) => {
            //         const state = record.taskState;
            //         if(state == 'T'){
            //             return <span>有效</span>
            //         }else if(state == 'F'){
            //             return <span>无效</span>
            //         }
            //     }
            // }, {
            //     title: '操作',
            //     key: 'action',
            //     width:50,
            //     render: (text, record,index) =>(
            //         <span>
            //             <a onClick={()=>this.showModal(text, record,index)}>更新</a>
            //         </span>
            //     )
            //     ,
            }
        ];
    }


    update(){
        this.props.form.validateFields((err, values) => {
            //console.log(values);
            this.setState({
                tableLoading:true
            });
            Api.post(task,{
                taskType:'',
                taskNo:'',
                taskState:''
            }).then(res=>{
                console.log(res);
                // if(res.errorCode == 0) {
                    this.setState({
                        data: res ? res.data : [],
                        tableLoading: false,
                        page: res.pageInfo,
                    });
                // }
            })
        });
    }
    componentDidMount(){
        this.update();
    }

// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //console.log(values);
            this.setState({
                tableLoading:true
            });
            console.log(values);
            Api.post(task,values).then(res=>{
                //console.log(res);
                // if(res.errorCode == 0) {
                    this.setState({
                        data: res ? res.data : [],
                        tableLoading: false,
                        page: res.pageInfo,
                        searchCriteria: values
                    });
                // }
            })
        });
    };

// 分页查询
    onChange = (pageNumber) => {
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        Api.post(task,values).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    tableLoading:false,
                    pageNow:pageNumber
                });
            // }
        })
    };
//  展示更新窗口
    showModal = (text, record,index) => {
        this.setState({
            update: true,
            updateInfo:record
        });
    };
    closeModal = _ => {
        this.setState({
            update: false
        });
        if(sessionStorage.Task) {
            this.update();
            sessionStorage.clear('Task');
        }
        modalKey++;
    };
//清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };

    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const { data ,tableLoading,page,pageNow,update,updateInfo} = this.state;
        return (
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            {/*<Col span={6} key={1} >*/}
                                {/*<FormItem {...formItemLayout} label={`Task类型`}>*/}
                                    {/*{getFieldDecorator(`taskType`,{*/}
                                    {/*})(*/}
                                        {/*<Input />*/}
                                    {/*)}*/}
                                {/*</FormItem>*/}
                            {/*</Col>*/}
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`Task号`}>
                                    {getFieldDecorator(`taskNo`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem
                                    {...formItemLayout}
                                    label="Task状态"
                                >
                                    {getFieldDecorator('taskState',{
                                    })(
                                        <Select >
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6} key={4} style={{display:'none'}}>
                                <FormItem {...formItemLayout} label={`页码`}>
                                    {getFieldDecorator(`pageNow`,{
                                        initialValue:pageNow,
                                    })(
                                        <input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className="content">
                    <Modal
                        title="更新Task信息"
                        visible={update}
                        onCancel={this.closeModal}
                        maskClosable={false}
                        footer={null}
                        key={`key${modalKey}`}
                    >
                        <UpdateContainer data={updateInfo} onCancel={this.closeModal}/>
                    </Modal>
                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false} bordered size="middle"/>

                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>

            </div>
        )
    }
}

const TaskForm = Form.create()(Task);
export default TaskForm;