import './index.css'
import React from 'react';
import {
    Form,
    Input,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    message,
    Upload,
    Icon ,
    Spin,
    notification,
    Badge,
    Popconfirm
} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import { Tabs,Cascader } from 'antd';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const h=document.body.clientHeight;

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;

let modalKey = 0;   //  用于重置modal
let urlDownload = UrlDownload;
//  url
const findByCondition = 'weekWorkPackage/findByCondition';
const findBattleLine = 'weekWorkPackage/findBattleLine';
const changeInterfaceState = 'interfaceInfo/changeInterfaceState';
const findInterfaceById = 'interfaceInfo/findInterfaceById';

// 工作包版本记录
class Version extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tableLoading:true,
            page:{},
            pageNow:1,
        };

        this.columns = [{
            title: '周数',
            dataIndex: 'weekNo',
            key: 'weekNo',
        }, {
            title: '机型',
            dataIndex: 'airplaneModel',
            key: 'airplaneModel',
        }, {
            title: '机号',
            dataIndex: 'airplaneRegNo',
            key: 'airplaneRegNo',
        },{
            title: '维修工作',
            dataIndex: 'workInfo',
            key: 'workInfo',
            width: 200,
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workInfo}>{record.workInfo}</div>
            }
        },{
            title: '指令号',
            dataIndex: 'commandNo',
            key: 'commandNo',
        },{
            title: '状态',
            dataIndex: 'packageStatus',
            key: 'packageStatus',
            render:(text,record) => {
                const state = record.packageStatus;
                if(state == 'S'){
                    return <span>OPEN</span>
                }else if(state == 'E'){
                    return <span>ENDW</span>
                }
            }
        },{
            title: '执行开始日期',
            dataIndex: 'executeStartTime',
            key: 'executeStartTime',
            width: 74,
            render:(text,record) => {
                const time = this.changetime(record.executeStartTime);
                return <span>{time}</span>
            }
        }, {
            title: '执行结束日期',
            dataIndex: 'executeEndTime',
            key: 'executeEndTime',
            width: 74,
            render:(text,record) => {
                const time = this.changetime(record.executeEndTime);
                return <span>{time}</span>
            }
        },{
            title: '停场时间',
            dataIndex: 'airplaneStandDays',
            key: 'airplaneStandDays',
        },{
            title: '机位',
            dataIndex: 'importStandInfo',
            key: 'importStandInfo',
        }, {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
        }, {
            title: '生产线经理',
            dataIndex: 'empMNames',
            key: 'empMNames',
        }, {
            title: '跟线员',
            dataIndex: 'empENames',
            key: 'empENames',
            },{
                title: '总工时',
                dataIndex: 'totalWorkingHours',
                key: 'totalWorkingHours',
        },{
            title: '分线',
            dataIndex: 'battleLineName',
            key: 'battleLineName',
        }];

// 工卡明细
        this.expandedRowRender = () => {
            const {  selectedRowKeys, wwpdata} = this.state;
            return (
                <div>
                    <div className="title" >
                        <span>机械工时：</span><span>{wwpdata?wwpdata.machineHours:''}</span>
                        <span>电气工时：</span><span>{wwpdata?wwpdata.electricHours:''}</span>
                        <span>电子工时：</span><span>{wwpdata?wwpdata.electronHours:''}</span>
                        <span>清洁工时：</span><span>{wwpdata?wwpdata.cleanHours:''}</span>
                        <span>客舱工时：</span><span>{wwpdata?wwpdata.cabinHours:''}</span>
                        <span>NDT工时：</span><span>{wwpdata?wwpdata.ndtHours:''}</span>
                        <span>金工工时：</span><span>{wwpdata?wwpdata.metalworkingHours:''}</span>
                        <span>漆工工时：</span><span>{wwpdata?wwpdata.lacqueringHours:''}</span>
                    </div>
                </div>
            );
        };

    }


//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };

    componentWillMount () {
        this.update();
    }

// 点击展开项列表
    onExpand=(expanded,record,index)=>{
        const Selected = record.id;
        if(!expanded) {
            this.setState({Selected:''});
            return;
        }

        this.setState({Selected});
        let wwpdata = false;
        if(Selected) {
            wwpdata = record;
        }
        Api.post('weekWorkPackageTask/findSubTaskListByWwpId',{wwpId:Selected,wwpaId:'',arrangedState:'',pageNow:1})
            .then(res => {
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        wwpdata:wwpdata,
                        page1:res.pageInfo,
                        wwpId:Selected,
                        wwpaId:'',
                        pageNow:this.state.pageNow
                    });
                }

            });

    };

    onRowDoubleClick=(record, index, event)=>{
        const Selected = record.id;
        // if(!expanded) {
        //     this.setState({Selected:''});
        //     return;
        // }

        this.setState({Selected});
        let wwpdata = false;
        if(Selected) {
            wwpdata = record;
        }

        Api.post('weekWorkPackageTask/findSubTaskListByWwpId',{wwpId:Selected,wwpaId:'',arrangedState:'',pageNow:1})
            .then(res => {
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        wwpdata:wwpdata,
                        page1:res.pageInfo,
                        wwpId:Selected,
                        wwpaId:'',
                        pageNow:this.state.pageNow
                    });
                }

            });


    };

  // 更新页面数据
    update(){
            this.setState({
                tableLoading:true
            });
        const value=this.props.version;
            Api.post('weekWorkPackage/findWeekWorkPackageHis',{
                'wwpId':value.id,
            }).then(res=>{
                if(res.errorCode == 0) {
                    this.setState({
                        data: res.data,
                        tableLoading: false,
                        page: res.pageInfo,
                    });
                }else {
                    this.setState({
                        data: [],
                        tableLoading: false,
                        page: res.pageInfo,
                    });
                }
            });

    };


    render(){


        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };

        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const expandedRowRender=this.expandedRowRender;
        const {data , tableLoading, page,Selected,} = this.state;
        modalKey++;
        return(
            <div>

                <div className="content">
                    <Table rowKey='id'
                           loading={tableLoading}
                           columns={columns}
                           dataSource={data}
                           pagination={false}
                            expandedRowRender={expandedRowRender}
                           onExpand={this.onExpand}
                           expandedRowKeys={[Selected]}
                           bordered
                           scroll={{ x: 1550,y:h>900?450:350}}
                           size="middle"
                           className='table'
                           onRowDoubleClick={this.onRowDoubleClick}
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                    {/*<Pagination showQuickJumper showSizeChanger  defaultCurrent={this.state.currentPage} total={this.state.totalSize} onChange={this.onChange}  showTotal={total => `合计 ${total} 条` }*/}
                                {/*onShowSizeChange={this.onShowSizeChange}*/}
                    {/*/>*/}
                </div>
                {/*</Spin>*/}
            </div>
        )
    }
}
const Versions = Form.create()(Version);
export default Versions;


