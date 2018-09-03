import React from 'react';
import { Form, Input, Button,Table,Pagination,Select,Icon} from 'antd';
import {  Row, Col} from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;

let modalKey = 0;//  用于重置modal
// DDFC查询
class NRCEQUIPMENTSearch extends React.Component{
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            update:false,
            data: [],
            confirmDirty: false,
            autoCompleteResult: [],
            vis:'none',
            options:[],
            datas: [],
            names:'',
            searchCriteria:{},
            page:{},
            pageNow:1,
            loading:true,
            nrcId:''
        };

        this.columns = [
             {
                title: '件号',
                dataIndex: 'pnNo',
                key: 'pnNo',

            }, {
                title: '描述',
                dataIndex: 'description',
                key: 'description',

            }, {
                title: '设备类型',
                dataIndex: 'equipmentType',
                key: 'equipmentType',

            }, {
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',

            // }, {
            //     title: '状态',
            //     dataIndex: 'equipmentState',
            //     key: 'equipmentState',
            //     render:(text,record) => {
            //         const state = record.equipmentState;
            //         if(state == 'T'){
            //             return <span>有效</span>
            //         }else if(state == 'F'){
            //             return <span>无效</span>
            //         }else if(state == 'D'){
            //             return <span>删除</span>
            //         }
            //     }

            }, {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render:(text,record,index) => {
                    const time = this.changetime(record.updateTime);
                    return <span>{time}</span>
                }

            }];
    }


// 更新页面数据
    update(){
        const value=this.props.NRCEQUIPMENTSearchData;
        Api.post('deferInfo/findNRCEquipmentByCondition',{
            'nrcId':value.id,
            // 'pnNo':'',
            // 'equipmentType':'',
            // 'equipmentState':'',
            'pageNow':this.state.pageNow
        }).then(res=>{
            this.setState({
                data: res.data,
                currentPage:parseInt(res.pageInfo.currentPage),
                totalSize:parseInt(res.pageInfo.totalSize),
                loading:false,
            })
        })
    }
    componentDidMount(){
        this.update();
    }
//多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        const value=this.props.NRCEQUIPMENTSearchData;
        this.props.form.validateFields((err, values) => {
            Api.post('deferInfo/findNRCEquipmentByCondition',{
                'nrcId':value.id,
                'pnNo':values.pnNo,
                'equipmentType':values.equipmentType,
                'equipmentState':'T',
                'pageNow':this.state.pageNow
            }).then(res=>{
                this.setState({
                    data: res.data,
                    loading:false,
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalSize:parseInt(res.pageInfo.totalSize),
                    nrcId:value.nrcId,
                    pnNo:values.pnNo,
                    equipmentType:values.equipmentType,
                    equipmentState:'T',
                    pageNow:this.state.pageNow
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        this.handleSearch();
    };
//分页查询
    onChange = (pageNumber) => {
        Api.post('deferInfo/findNRCEquipmentByCondition',{
            'pageNow':pageNumber,
            'nrcId':this.state.nrcId,
            'pnNo':this.state.pnNo,
            'equipmentType':this.state.equipmentType,
            'equipmentState':'T',
        }).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    loading:false,
                    currentPage:parseInt(res.pageInfo.currentPage),
                    totalSize:parseInt(res.pageInfo.totalSize),
                });
            }
        })
    };


    render(){
        modalKey++;
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const { data,page } = this.state;
        return(
            <div>
                <div className="header">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1">
                            <Form
                                className="ant-advanced-search-form"
                                onSubmit={this.handleSearch}
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1} className="update-time-input">
                                        <FormItem
                                            {...formItemLayout}
                                            label="件号："
                                        >
                                            {getFieldDecorator('pnNo')(
                                                <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2} >
                                        <FormItem
                                            {...formItemLayout}
                                            label="设备类型"
                                        >
                                            {getFieldDecorator('equipmentType')(
                                               <Input/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    {/*<Col span={8} key={3} >*/}
                                        {/*<FormItem*/}
                                            {/*{...formItemLayout}*/}
                                            {/*label="状态："*/}
                                        {/*>*/}
                                            {/*{getFieldDecorator('equipmentState')(*/}
                                                {/*<Select>*/}
                                                    {/*<Option value="T">有效</Option>*/}
                                                    {/*<Option value="F">无效</Option>*/}
                                                    {/*<Option value="">删除</Option>*/}
                                                {/*</Select>*/}
                                            {/*)}*/}
                                        {/*</FormItem>*/}
                                    {/*</Col>*/}
                                    <Col span={8} style={{ textAlign: 'right' }}>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />
                                            重置
                                        </Button>
                                        <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                                    </Col>
                                </Row>
                                {/*<Row>*/}
                                    {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                        {/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset} className='btn_reload'><Icon type="reload" style={{color: '#108ee9' }} />*/}
                                            {/*重置*/}
                                        {/*</Button>*/}
                                        {/*<Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>*/}
                                    {/*</Col>*/}
                                {/*</Row>*/}
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
                <div className="content">
                    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle"/>
                    <Pagination showQuickJumper defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条`}/>
                </div>
            </div>
        )
    }
}
const NRCEQUIPMENTSearchs = Form.create()(NRCEQUIPMENTSearch);
export default NRCEQUIPMENTSearchs;


