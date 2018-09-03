import React from 'react';
import { Form, Input, Button,Table,Modal,Icon,Select,Pagination,Tabs,Row, Col,message,AutoComplete} from 'antd';
import Updata from './Updata';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import Paginations from '../../../components/Pagination';
const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];
let modalKey = 0;   //  用于重置modal
class WorkCards extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            visible: false,
            data: [],
            search:false,
            searchCriteria:{},
            page:{},
            pageNow:1,
            confirmDirty:false,
            data1:''
        };
        this.columns = [{
            title: '工卡号',
            dataIndex: 'subTaskNo',
            key: 'subTaskNo'
        }, {
            title: '厂家工卡＆修订日期',
            dataIndex: 'mcdRev',
            key: 'mcdRev'
        }, {
            title: '英文标题',
            dataIndex: 'titleCn',
            key: 'titleCn',
            width:'20%'
        }, {
            title: '中文标题',
            dataIndex: 'titleEn',
            key: 'titleEn',
            width:'20%'
        }, {
            title: '工卡版本号',
            dataIndex: 'jcRev',
            key: 'jcRev'
        }, {
            title: '工作区域',
            dataIndex: 'workArea',
            key: 'workArea'
        },{
            title: '工种',
            dataIndex: 'skill',
            key: 'skill'
        },{
            title: '标准工时（单位小时）',
            dataIndex: 'standardHour',
            key: 'standardHour'
        // },{
        //     title: '工卡状态',
        //     dataIndex: 'subTaskState',
        //     key: 'subTaskState',
        //     render:(text,record,index) => {
        //         const state = record.subTaskState;
        //         if(state == 'T'){
        //             return <span>有效</span>
        //         }else if(state == 'F'){
        //             return <span>无效</span>
        //         }else if(state == 'D'){
        //             return <span>删除</span>
        //         }
        //     }
        },
        //     {
        //     title: '操作',
        //     key: 'action',
        //     width:80,
        //     render: (text, record,index) => (
        //         <span>
        //             <a onClick={()=>this.showModal(index)} style={{marginRight:'10px'}}>修改</a>
        //          </span>
        //     )
        // }
        ];
    }

    // 更新页面数据
    update(){
        this.setState({
            loading:true
        });
        Api.post('workPackageInfo/findSubTaskByCondition',{
            'subTaskNo':'',
            'subTaskState':''
        }).then(res => {
            console.log('res',res);
            // if(res.errorCode == 0) {
                this.setState({
                    data: res ? res.data : [],
                    loading: false,
                    page: res.pageInfo,
                });
            // }
        });
    }
    componentDidMount(){
        this.update();
    }

    //多条件查询
    handleSearch = (e) => {
        this.setState({
            search:true
        });
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                loading:true
            });
            Api.post('workPackageInfo/findSubTaskByCondition',{
                'subTaskNo':values.subTaskNo,
                'subTaskState':values.subTaskState?values.subTaskState[0]:''
            }).then(res=>{
                this.setState({
                    data: res ? res.data : [],
                    loading: false,
                    page: res.pageInfo,
                    searchCriteria: values
                });
            });
            // console.log(values)
        });
    };
    //清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };

    // 分页查询
    onChange = (pageNumber) => {
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        Api.post('workPackageInfo/findSubTaskByCondition',values).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    loading:false,
                    pageNow:pageNumber
                });
            // }
        })
    };


    //弹窗
    // 显示更新用户的Modal
    showModal = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        // console.log('information',information);
        this.setState({
            visible: true,
            information:information
        });
        this.update();
    };
    //关闭更新的弹窗
    handleCancel = (e) => {
        this.update();
        this.setState({
            visible: false,
        });
        modalKey++;
    };
    // 工卡号验证
    checkSubTask = (rule, value, callback) => {
        const form = this.props.form;
        if (value &&  value !== this.state.data1.subTaskNo) {
            callback(this.state.data1.errorMsg);
        } else {
            callback();
        }
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        Api.post('workPackageInfo/checkSubTask',{subTaskNo:value}).then(res=>{
            // console.log('cccc',res);
            if(res.errorCode==0){
                this.setState({
                    confirmDirty: this.state.confirmDirty|| !!value ,
                    data1:res
                });
            }else {
                this.props.form.resetFields(['subTaskId']);
                this.setState({
                    data1:res
                });
            }

        });

    };


    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const columns = this.columns;
        const { data,page,data1 } = this.state;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>
                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={10}>
                            <Col span={8} key={1}>
                                <FormItem {...formItemLayout} label={'工卡号'}  help={data1.errorMsg=='success'?null:data1.errorMsg}>
                                    {getFieldDecorator('subTaskNo',{
                                        rules: [{
                                            validator: this.checkSubTask,
                                        }
                                        ],
                                    })(
                                        <Input onBlur={this.handleConfirmBlur}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2}>
                                <FormItem {...formItemLayout} label={'工卡状态'}>
                                    {getFieldDecorator('subTaskState')(
                                        <Select >
                                            <Option value="T">有效</Option>
                                            <Option value="F">无效</Option>
                                            <Option value="" >全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>

                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="content">
                    <div style={{width:'100%'}}>
                        <Modal
                            title="更新工卡信息"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            key={`key${modalKey}`}
                        >
                            <Updata data={this.state.information} onCancel={this.handleCancel}/>
                        </Modal>
                    </div>
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle"/>
                    <Paginations
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const WorkCard = Form.create()(WorkCards);
export default WorkCard;

