import React from 'react';
import { Form, Input, Button,Table,Modal,Icon,Tabs,Row, Col,Select,AutoComplete} from 'antd';
import Updata from './Updata';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
import AirMaterielLock from './AirMaterielLock';
import AirMaterielStock from './AirMaterielStock';
import Paginations from '../../../components/Pagination';
const Option = Select.Option;
const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];
let modalKey = 0;   //  用于重置modal
class WorkCardMateriel extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            visible: false,
            data: [],
            search:false,
            lock:false,
            stock:false,
            searchCriteria:{},
            page:{},
            pageNow:1
        };
        this.columns = [
        {
            title:'工作包号',
            dataIndex:'commandNo',
            key:'commandNo'
        },
        {
            title: '航站',
            dataIndex: 'station',
            key: 'station'
        }, {
            title: '任务号',
            dataIndex: 'taskNo',
            key: 'taskNo'
            }, {
                title: '需求项次号',
                dataIndex: 'itemNo',
                key: 'itemNo'
        }, {
            title: '序号',
            dataIndex: 'seqNo',
            key: 'seqNo'
        }, {
            title: '工卡号',
            dataIndex: 'subTaskNo',
            key: 'subTaskNo'
        }, {
            title: '件号',
            dataIndex: 'pnNo',
            key: 'pnNo'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        },{
            title: '设备类型',
            dataIndex: 'equipmentType',
            key: 'equipmentType'
        },{
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity'
        },{
            title: '是否锁定',
            dataIndex: 'reservation',
            key: 'reservation'
        },{
            title: '是否视情',
            dataIndex: 'onCondition',
            key: 'onCondition'
        },{
            title: '同步时间',
            dataIndex: 'synchroTime',
            key: 'synchroTime',
                render:(text,record) => {
                    const time = this.changetime(record.synchroTime);
                    return <span>{time}</span>
                }
        // },{
        //     title: 'demandState',
        //     dataIndex: 'demandState',
        //     key: 'demandState',
        },{
            title: '操作',
            key: 'action',
            width:80,
            render: (text, record,index) => (
                record.equipmentType == 'AS'||record.equipmentType == 'CH'?<span>
                    <a onClick={()=>this.showModalLock(index)} >航材锁定</a>
                 </span>:
                <span>
                    <a onClick={()=>this.showModalStock(index)}>航材库存</a>
                 </span>
            )
        }];
    }

    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    // 更新页面数据
    update(){
        const value=this.props.WorkCardPN;
        this.setState({
            loading:true
        });
        Api.post('workPackageInfo/findWorkPackageDemandByCondition',{
            'commandNo':value?value.commandNo:'',
            'taskNo':'',
            'subTaskNo':'',
            'pnNo':'',
            'equipmentType':'',
            'demandState':''
        }).then(res => {
            if(res.errorCode == 0) {
                this.setState({
                    data: res ? res.data : [],
                    loading: false,
                    page: res.pageInfo
                });
            }
        });
    }
    componentDidMount(){
        this.update();
    }
    // 分页查询
    onChange = (pageNumber) => {
        Api.post('workPackageInfo/findWorkPackageDemandByCondition',{
            'commandNo':this.state.commandNo,
            'taskNo':this.state.taskNo,
            'subTaskNo':this.state.subTaskNo,
            'pnNo':this.state.pnNo,
            'equipmentType':this.state.equipmentType,
            'demandState':this.state.demandState,
            'pageNow':pageNumber
        }).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    loading:false,
                });
            }
        })
    };
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
            const value=this.props.WorkCardPN;
            Api.post('workPackageInfo/findWorkPackageDemandByCondition',{
                'commandNo':value?value.commandNo:values.commandNo,
                'taskNo':values.taskNo,
                'subTaskNo':values.subTaskNo,
                'pnNo':values.pnNo,
                'equipmentType':values.equipmentType,
                'demandState':values.demandState?values.demandState:'',
                'pageNow':this.state.pageNow
            }).then(res=>{
                this.setState({
                    data: res ? res.data : [],
                    loading: false,
                    page: res.pageInfo,
                    commandNo:value?value.commandNo:values.commandNo,
                    taskNo:values.taskNo,
                    subTaskNo:values.subTaskNo,
                    pnNo:values.pnNo,
                    equipmentType:values.equipmentType,
                    demandState:values.demandState?values.demandState:'',
                    pageNow:this.state.pageNow
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

    // 航材锁定的Modal
    showModalLock = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        //console.log('information',information);
        // if(information[0].equipmentType == 'AS'){
            this.setState({
                lock: true,
                information:information
            });
        // }else {
        //     message.error('非航材，没有航材信息！');
        // }

    };
    //关闭航材锁定的弹窗
    handleCancelLock = (e) => {
        // this.update();
        this.setState({
            lock: false
        });
        modalKey++;
    };

    // 显示航材信息的Modal
    showModalStock = (index) => {
        const { data } = this.state;
        const information=[];
        information.push(data[index]);
        // console.log('information',information);
        this.setState({
            stock: true,
            information:information
        });
    };
    //关闭航材信息的弹窗
    handleCancelStock = (e) => {
        // this.update();
        this.setState({
            stock: false
        });
        modalKey++;
    };

    render(){
        const value=this.props.WorkCardPN;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        };
        const columns = this.columns;
        const { data,page } = this.state;
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
                            <Col span={8} key={1} style={{display:value?'none':'block'}}>
                                <FormItem {...formItemLayout} label={'工作包号'}>
                                    {getFieldDecorator('commandNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2}>
                                <FormItem {...formItemLayout} label={'任务号'}>
                                    {getFieldDecorator('taskNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3}>
                                <FormItem {...formItemLayout} label={'工卡号'}>
                                    {getFieldDecorator('subTaskNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={'件号'}>
                                    {getFieldDecorator('pnNo')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5}>
                                <FormItem {...formItemLayout} label={'设备类型'}>
                                    {getFieldDecorator('equipmentType')(
                                        <Select allowClear={true}>
                                            <Option value="AS">AS</Option>
                                            <Option value="CH">CH</Option>
                                            <Option value="TS" >TS</Option>
                                            <Option value="TO" >TO</Option>
                                            <Option value="GS" >GS</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={6} style={{display:'none'}}>
                                <FormItem {...formItemLayout} label={'需求状态'}>
                                    {getFieldDecorator('demandState')(
                                        <Input />
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
                    <div style={{width:'100%',}}>
                        <Modal
                            title="航材锁定信息"
                            visible={this.state.lock}
                            onCancel={this.handleCancelLock}
                            maskClosable={false}
                            footer={null}
                            key={`key${modalKey}lock`}
                            width='80%'
                        >
                            <AirMaterielLock data={this.state.information} onCancel={this.handleCancelLock}/>
                        </Modal>
                        <Modal
                            title="航材库存信息"
                            visible={this.state.stock}
                            onCancel={this.handleCancelStock}
                            maskClosable={false}
                            footer={null}
                            key={`key${modalKey}stock`}
                        >
                            <AirMaterielStock data={this.state.information} onCancel={this.handleCancelStock}/>
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
const WorkCardAirMateriel = Form.create()(WorkCardMateriel);
export default WorkCardAirMateriel;

