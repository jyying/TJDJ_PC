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
import Details from './Details';
import WorkCardAirMateriel from '../../WorkCardManage/WorkCardAirMateriel';
import NRCSearch from '../../DdFcNrcManage/NRCSearch';
import DDFCSearch from '../../DdFcNrcManage/DDFCSearch';
import WorkPackageMould from '../../GuaranteeResourceManage/WorkPackageMould';
import WorkPlanModal from './WorkPlanModal';
import Establish from './Establish';
import AddWorkPackage from './AddWorkPackage';
import ManageEmpCheck from './ManageEmpCheck';
import Api from '../../../api/request';
import TimeConversions from '../../../utils/TimeConversion';
// import {urlDownload} from '../../../utils/UrlDownLoad';
import { Tabs,Cascader } from 'antd';
import Pagination from '../../../components/Pagination';
import Version from './Version';
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

// 工作包管理
class WorkPackage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            MouldSelectModal:false,
            details:false,
            establish:false,
            managerEmpCheck:false,
            DayPlanVFindisible:false,
            TaskDayPlanVFindisible:false,
            WorkCardPNVisible:false,
            WorkPlansCheck:false,
            data: [],
            tableLoading:true,
            tableLoad:true,
            tableLoad1:true,
            Line:[],
            isUpdate:false,
            DayPlans:false,
            TaskDayPlans:false,
            updateState:false,
            searchCriteria:{},
            page:{},
            page1:{},
            pageNow:1,
            datas:[],
            wwpdata:false,
            empdata:[],
            empdata1:[],
            Selected:'',
            WorkCardPN:false,
            TaskPlanDay:'',
            isFind:false,
            selectedRowKeys: [],
            Selected1:'',
            datas1:[],
            taskListdata:false,
            loadings:false,
            arrangedState:'',
            filtered: false,
            orderId:'',
            tempStlColor:'',
            children:[],
            NRCchecks:false,
            DDFCchecks:false,
            NRCcheckVisible:false,
            DDFCcheckVisible:false,
            hover:'',
            establish1:false,
            options:'',
            children1:'',
            optValue:'',
            version:false,
            versionVisible:false,
            options1:[]
        };

        this.columns = [{
            title: '周数',
            dataIndex: 'weekNo',
            key: 'weekNo',
            width: 50,
            // fixed: 'left'
        }, {
            title: '机型',
            dataIndex: 'airplaneModel',
            key: 'airplaneModel',
            width: 74
        }, {
            title: '机号',
            dataIndex: 'airplaneRegNo',
            key: 'airplaneRegNo',
            width: 74
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
            width: 98
        },{
            title: '状态',
            dataIndex: 'packageStatus',
            key: 'packageStatus',
            width: 74,
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
        // },{
        //     title: '进场时间',
        //     dataIndex: 'goInAirportTime',
        //     key: 'goInAirportTime',
        },{
            title: '停场时间',
            dataIndex: 'airplaneStandDays',
            key: 'airplaneStandDays',
            width: 74
        },{
            title: '机位',
            dataIndex: 'importStandInfo',
            key: 'importStandInfo',
            width: 74
        }, {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
            width: 74
        }, {
            title: '生产线经理',
            dataIndex: 'empMNames',
            key: 'empMNames',
            width: 74
        }, {
            title: '跟线员',
            dataIndex: 'empENames',
            key: 'empENames',
            width: 74
            },{
                title: '总工时',
                dataIndex: 'totalWorkingHours',
                key: 'totalWorkingHours',
            width: 74
            // },{
            //     title: '机械工时',
            //     dataIndex: 'machineHours',
            //     key: 'machineHours',
            // width: 74
            // },{
            //     title: '电气工时',
            //     dataIndex: 'electricHours',
            //     key: 'electricHours',
            // width: 74
            // },{
            //     title: '电子工时',
            //     dataIndex: 'electronHours',
            //     key: 'electronHours',
            // width: 74
            // },{
            //     title: '清洁工时',
            //     dataIndex: 'cleanHours',
            //     key: 'cleanHours',
            // width: 74
            // },{
            //
            //     title: '客舱工时',
            //     dataIndex: 'cabinHours',
            //     key: 'cabinHours',
            // width: 74
            // },{
            //     title: 'NDT工时',
            //     dataIndex: 'ndtHours',
            //     key: 'ndtHours',
            // width: 74
            // },{
            //     title: '金工工时',
            //     dataIndex: 'metalworkingHours',
            //     key: 'metalworkingHours',
            // width: 74
            // },{
            //     title: '漆工工时',
            //     dataIndex: 'lacqueringHours',
            //     key: 'lacqueringHours',
            // width: 74
        },{
            title: '分线',
            dataIndex: 'battleLineName',
            key: 'battleLineName',
            width: '80px',
            render: (text, record,index) => (
                <Select
                    value={record.battleLineName?record.battleLineName:'请分线'}
                    style={{ width:'70px' }}
                    onSelect={(value,option)=>this.changeBattleLine(record,value,option)}

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
            )

        }, {
            title: '操作',
            key: 'action',
            width: '150px',
            render: (text, record,index) => {
                //console.log(text.battleLine);
                return (
                    // record.battleLineName?(
                        <span className="action">
                        {/*<a onClick={()=>this.detailsModal(text, record,index)}>详情</a>*/}
                            <a onClick={()=>this.managerEmpCheck(record)}>生产线经理分配</a>
                             <span className="ant-divider" />
                            <a onClick={()=>this.establish(record)}>修改</a>
                                   <span className="ant-divider" />
                             <a onClick={()=>this.versionRecord(record)}>版本记录</a>
                                   <span className="ant-divider" />
                            <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                            {/*<span className="ant-divider" />*/}
                            {/*<a onClick={()=>this.DayPlanFind(record)}>日计划查询</a>*/}

                            {/*{*/}
                                {/*this.state.hover == record.id ? (*/}
                                    {/*<span className="a">*/}
                                     {/*<span className="ant-divider"/>*/}
                                    {/*<a onClick={() => this.WorkCardPNModel(record)}>设备需求清单</a>*/}
                                    {/*<span className="ant-divider"/>*/}
                                    {/*<a onClick={(e) => this.synchro(e, record, record.orderId)}>工卡同步</a>*/}
                                     {/*<span className="ant-divider"/>*/}
                                     {/*<a onClick={(e) => this.NRCsynchro(e, record, record.orderId)}>NRC同步</a>*/}
                                     {/*<span className="ant-divider"/>*/}
                                     {/*<a onClick={(e) => this.NRCcheck(record)}>NRC查看</a>*/}
                                    {/*<span className="ant-divider"/>*/}
                                     {/*<a onClick={(e) => this.DDFCcheck(record)}>DD/FC查看</a>*/}
                                  {/*</span>*/}
                                {/*) : (*/}
                                    {/*<span>*/}
                                      {/*<span className="ant-divider" />*/}
                                      {/*<a onClick={()=>this.More(record,index)}>更多...</a>*/}
                                  {/*</span>*/}
                                {/*)*/}

                            {/*}*/}

                        </span>
                    // ):(
                    //     <span>
                    //         {/*<span className="warning">请先安排分线</span>*/}
                    //         {/*<span className="ant-divider" />*/}
                    //         {/*<a onClick={()=>this.managerEmpCheck(record)}>生产线经理、跟线员分配</a>*/}
                    //          <span className="ant-divider" />
                    //         <a onClick={()=>this.establish(record)}>修改</a>
                    //         <span className="ant-divider" />
                    //         <a onClick={()=>this.WorkCardPNModel(record)}>设备需求清单</a>
                    //         <span className="ant-divider" />
                    //         <a onClick={(e)=>this.synchro(e,record,record.orderId)}>工卡同步</a>
                    //          <span className="ant-divider" />
                    //         <a onClick={(e)=>this.NRCsynchro(e,record,record.orderId)}>NRC同步</a>
                    //          <span className="ant-divider" />
                    //          <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                    //     </span>
                    // )

                )
            },
        }];

// 工卡明细
        this.expandedRowRender = () => {
            const columns = [
                { title: '序号', dataIndex: 'seqNo', key: 'seqNo',width: '123px'},
                { title: '项号', dataIndex: 'itemNo', key: 'itemNo',width: '123px'},
                { title: '任务号', dataIndex: 'taskNo', key: 'taskNo',width: '159px'},
                { title: '工卡号', dataIndex: 'subTaskNo', key: 'subTaskNo',width: '123px'},
                { title: '版本号', dataIndex: 'revision', key: 'revision',width: '204px'},
                // { title: 'mcdRev', dataIndex: 'mcdRev', key: 'mcdRev',width:'5%' },
                { title: '工种', dataIndex: 'skill', key: 'skill',width: '119px'},
                { title: '区域', dataIndex: 'workArea', key: 'workArea',width: '116px'},
                { title: '工作内容', dataIndex: 'content', key: 'content' ,width:'300px',
                    render:(text,record) => {
                        return <div title={record.content}>{record.content}</div>
                    }},
                { title: '间隔', dataIndex: 'threshold', key: 'threshold',width: '150px'},
                { title: '工时', dataIndex: 'manHours', key: 'manHours',width: '116px'},
                { title: '备注', dataIndex: 'remark', key: 'remark',width: '117px'},
                // { title: '执行日期', dataIndex: 'executeTime', key: 'executeTime', render:(text,record) => {
                //     const time =record.executeTime==null?'': this.changetime(record.executeTime);
                //     return <span>{time}</span>
                // } },
                {
                    title: '状态', dataIndex: 'arranged', key: 'arranged',width: '169px', render: (text, record) => {
                    const state = record.arranged;
                    if (state == 'T') {
                        return <span ><Badge status="success"/>已安排</span>
                    } else if (state == 'F') {
                        return <span ><Badge />未安排</span>
                    }
                },
                    filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Select  style={{ width: 80 }} onChange={this.handleChange} defaultValue="">
                                <Option value=''>全部</Option>
                                <Option value="T">已安排</Option>
                                <Option value="F">未安排</Option>
                            </Select>
                        </div>
                    ),
                    filterIcon: <Icon type="filter" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
                    filterDropdownVisible: this.state.filterDropdownVisible,
                    onFilterDropdownVisibleChange: (visible) => {
                        this.setState({
                            filterDropdownVisible: visible,
                        });
                    },
                }
            ];
            // const state = this.state;
            const {  selectedRowKeys, wwpdata} = this.state;

            const rowSelection = {
                selectedRowKeys,
                onChange: this.onSelectChange,
            };
            const expandedRowRender1=this.expandedRowRender1;

            return (
                <div>
                    <div className="title" >
                        <span>机械工时：</span><span>{wwpdata.machineHours}</span>
                        <span>电气工时：</span><span>{wwpdata.electricHours}</span>
                        <span>电子工时：</span><span>{wwpdata.electronHours}</span>
                        <span>清洁工时：</span><span>{wwpdata.cleanHours}</span>
                        <span>客舱工时：</span><span>{wwpdata.cabinHours}</span>
                        <span>NDT工时：</span><span>{wwpdata.ndtHours}</span>
                        <span>金工工时：</span><span>{wwpdata.metalworkingHours}</span>
                        <span>漆工工时：</span><span>{wwpdata.lacqueringHours}</span>
                        {/*<Button type="primary" onClick={()=>this.MouldSelect()}>模板选择安排</Button>*/}
                        {/*<Button type="primary" onClick={()=>this.WorkPlans()}>工作安排</Button>*/}
                    </div>
                    {/*<Table*/}
                        {/*// rowSelection={rowSelection}*/}
                        {/*// rowKey='stlId'*/}
                        {/*// columns={columns}*/}
                        {/*// dataSource={this.state.datas}*/}
                        {/*// pagination={false}*/}
                        {/*// loading={this.state.tableLoad}*/}
                        {/*title={() =><div className="title" >*/}
                            {/*<span>机械工时：</span><span>{wwpdata.machineHours}</span>*/}
                            {/*<span>电气工时：</span><span>{wwpdata.electricHours}</span>*/}
                            {/*<span>电子工时：</span><span>{wwpdata.electronHours}</span>*/}
                            {/*<span>清洁工时：</span><span>{wwpdata.cleanHours}</span>*/}
                            {/*<span>客舱工时：</span><span>{wwpdata.cabinHours}</span>*/}
                            {/*<span>NDT工时：</span><span>{wwpdata.ndtHours}</span>*/}
                            {/*<span>金工工时：</span><span>{wwpdata.metalworkingHours}</span>*/}
                            {/*<span>漆工工时：</span><span>{wwpdata.lacqueringHours}</span>*/}
                            {/*/!*<Button type="primary" onClick={()=>this.MouldSelect()}>模板选择安排</Button>*!/*/}
                            {/*/!*<Button type="primary" onClick={()=>this.WorkPlans()}>工作安排</Button>*!/*/}
                          {/*</div>*/}
                             {/*}*/}
                        {/*// expandedRowRender={expandedRowRender1}*/}
                        {/*// onExpand={this.onExpand1}*/}
                        {/*// expandedRowKeys={[this.state.Selected1]}*/}
                        {/*bordered*/}
                        {/*size="middle"*/}
                        {/*// rowClassName={(record, index)=>record.tempStlColor}*/}
                        {/*className='taskColor'*/}
                    {/*/>*/}
                    {/*<Pagination*/}
                        {/*{...this.state.page1}*/}
                        {/*onChange={this.onChange1}*/}
                    {/*/>*/}
                </div>
            );
        };

        // 工卡安排
        this.expandedRowRender1 = () => {
            const columns = [
                { title: '执行日期', dataIndex: 'executeTime', key: 'executeTime',width: '316px', render:(text,record) => {
                    const time =record.executeTime==null?'': this.changetime(record.executeTime);
                    return <span>{time}</span>
                } },
                { title: '区域', dataIndex: 'largeAreaName', key: 'largeAreaName',width: '199px'},
                { title: '小区域', dataIndex: 'smallArea', key: 'smallArea',width: '257px'},
                { title: '更新人', dataIndex: 'updateByName', key: 'updateByName',width: '258px'},
                { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime',width: '316px' ,render:(text,record) => {
                    const time =record.updateTime==null?'': this.changetime(record.updateTime);
                    return <span>{time}</span>
                }},
                { title: '区域备注', dataIndex: 'remarkArea', key: 'remarkArea',width: '317px' },
                {
                    title: '操作',
                    key: 'action',width: '200px',
                    render: (text, record,index) => (
                            <span >
                               <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.confirm(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                            </span>
                    ),

                },
            ];

            return (
                <div>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={this.state.datas1}
                        pagination={false}
                        loading={this.state.tableLoad1}
                        bordered
                        size="middle"
                    />
                </div>
            );
        };
    }

    //版本记录
    versionRecord = (record) => {
        let version = false;
        if(record.id) {
            version = record;
        }
        this.setState({
            version:version,
            versionVisible: true
        });
    };
    versionCancel = () => {
        this.setState({
            versionVisible:false
        });

    };

    // 操作菜单
    More=(record)=>{
        // const _this = e.target;
        // _this.innerHTML = 'aaa';
        // _this.className = 'disabled';
        this.setState({
            hover:record.id
        });
    };

// 根据工作包查询工作包下NRC
    NRCcheck = (record) => {
        let NRCchecks = false;
        if(record.id) {
            NRCchecks = record;
        }
        this.setState({
            NRCchecks:NRCchecks,
            NRCcheckVisible: true
        });
    };
    NRCcheckCancel = () => {
        this.setState({
            NRCcheckVisible:false
        });

    };
    // 根据工作包查询工作包下DDFC
    DDFCcheck = (record) => {
        // console.log('工作包id',record);
        let DDFCchecks = false;
        if(record.id) {
            DDFCchecks = record;
        }
        this.setState({
            DDFCchecks:DDFCchecks,
            DDFCcheckVisible: true
        });
    };
    DDFCcheckCancel = () => {
        this.setState({
            DDFCcheckVisible:false
        });

    };

   handleChange=(value)=> {
    // console.log(`selected ${value}`,this.state.Selected);
        if(value==''){
            this.setState({
                filtered: false,
            })
        }
        Api.post('weekWorkPackageTask/findSubTaskListByWwpId',{wwpId:this.state.Selected,wwpaId:'',arrangedState:value,pageNow:1})
            .then(res => {
                // console.log('删选工卡清单',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        page1:res.pageInfo,
                        wwpId:this.state.Selected,
                        wwpaId:'',
                        arrangedState:value,
                        pageNow:this.state.pageNow,
                        filtered: true,
                    });
                }

            });
};

    //  NRC同步
    NRCsynchro = (e,_,) => {
        // console.log('this.state.orderId',this.state.orderId);
        // this.setState({
        //     loadings:true
        // });
        // console.log('record',_);
        // const _this = e.target;
        // _this.innerHTML = 'NRC同步中';
        // _this.className = 'disabled';
        if(_.orderId){
            // message.success('你已同步过，现在继续同步');
            this.setState({
                loadings:true
            });
            const _this = e.target;
            _this.innerHTML = 'NRC同步中';
            _this.className = 'disabled';
            Api.post('dataSync/syncNRC',{wwpId:_.id,commandNo:_.commandNo,orderId:_.orderId})
                .then(res => {
                    // console.log('同步',res);
                    _this.innerHTML = 'NRC同步';
                    _this.className = '';
                    if(res.errorCode == 0) {
                        this.setState({
                            loadings:false
                        });
                        message.success('同步成功');
                        // _.orderId = true;
                    } else if (res.errorCode == 1) {
                        this.setState({
                            loadings:false
                        });
                        message.error('失败:'+res.errorMsg);
                    } else {
                        message.warning('服务器请求超时，请重试');
                    }
                });
        }else {
            this.setState({
                loadings:false
            });
            message.error('!!!请先同步工卡相关信息');
        }

        // console.log(_this,_,index)
    };

// 工作包删除
    delete=(e)=> {
        // console.log('record',record,e);
        const executeStartTime=this.changetime(e.executeStartTime);
        const executeEndTime=this.changetime(e.executeEndTime);
        Api.post('weekWorkPackage/addOrUpdate',{wwpId:e.id,
            weekNo:e.weekNo,
            airplaneModel:e.airplaneModel,
            airplaneRegNo:e.airplaneRegNo,
            workInfo:e.workInfo,
            commandNo:e.commandNo,
            executeStartTime:executeStartTime,
            executeEndTime:executeEndTime,
            airplaneStandDays:e.airplaneStandDays,
            standCode:e.standCode,
            company:e.company,
            totalWorkingHours:e.totalWorkingHours,
            packageState:'D',
        })
            .then(res => {
                if(res.errorCode=='0'){
                    message.success('删除成功！');
                   this.update();
                }else{
                    message.error('删除失败：'+res.errorMsg);
                }

            });
    };


// 工卡计划安排删除
    confirm=(e,record)=> {
            Api.post('weekWorkPackageTask/deleteSubTaskListArrange',{stlaId:e.id,stlId:e.subtasklistId})
                .then(res => {
                    if(res.errorCode=='0'){
                        message.success('删除成功！');
                        const value=this.state.taskListdata;
                        // console.log('go',value);
                        Api.post('weekWorkPackageTask/findSubTaskListArrange',{stlId:value.stlId})
                            .then(res => {
                                // console.log('工卡清单明细',res);
                                if(res.errorCode == 0) {
                                    this.setState({
                                        datas1:res? res.data:[],
                                    });
                                }

                            });
                    }else{
                        message.warning('删除失败：'+res.errorMsg);
                    }

                });
};

    cancel=(e)=> {

    };


// 工卡点击展开项列表
    onExpand1=(expanded,record,index)=>{
        const Selected1 = record.stlId;
        if(!expanded) {
            this.setState({Selected1:''});
            return;
        }

        this.setState({Selected1});
        let taskListdata = false;
        if(Selected1) {
            taskListdata = record;
        }
        Api.post('weekWorkPackageTask/findSubTaskListArrange',{stlId:Selected1})
            .then(res => {
                // console.log('工卡清单明细',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas1:res? res.data:[],
                        tableLoad1:false,
                        taskListdata:taskListdata
                    });
                }

            });

    };
// 工作包模板安排modal
    MouldSelect = (record) => {
        this.setState({
            MouldSelectModal: true
        });
    };
    MouldSelectCancel = () => {
        this.setState({
            MouldSelectModal:false
        });
        Api.post('weekWorkPackageTask/findSubTaskListByWwpId',{wwpId:this.state.Selected,wwpaId:'',arrangedState:'',pageNow:1})
            .then(res => {
                // console.log('工卡清单',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        page1:res.pageInfo,
                        pageNow:this.state.pageNow
                    });
                }

            });
    };

// 工卡安排modal
    WorkPlans = (record) => {
        // let isFind = false;
        // if(record.id) {
        //     isFind = record;
        // }
    if(this.state.selectedRowKeys.length>0){
        this.setState({
            // isFind:isFind,
            WorkPlansCheck: true
        });
    }else {
        message.error('！！！你还未选择任何工卡');
    }

    };
    WorkPlanCancel = () => {
        this.setState({
            WorkPlansCheck:false
        });
        const value=this.state.wwpdata;
        if(value){
            Api.post('weekWorkPackageTask/findSubTaskListByWwpId',{wwpId:value.id,wwpaId:'',arrangedState:'',pageNow:this.state.pageNow})
                .then(res => {
                    // console.log('工卡清单',res);
                    if(res.errorCode == 0) {
                        this.setState({
                            datas:res? res.data:[],
                            tableLoad:false,
                        });
                    }

                });
        }

    };


    // 监听工卡清单是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };


// 分页查询
    onChange1 = (pageNumber) => {
        Api.post('weekWorkPackageTask/findSubTaskListByWwpId',{wwpId:this.state.wwpId,wwpaId:'',arrangedState:this.state.arrangedState!=''?this.state.arrangedState:'', pageNow:pageNumber})
            .then(res => {
                // console.log('res',res);
                if(res.errorCode == 0) {
                    this.setState({
                        datas:res? res.data:[],
                        tableLoad:false,
                        page1:res.pageInfo,
                    });
                }

            });
    };

//将后台返回的时间戳转化为标准的时间格式 getDate
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        // const D = date.getDate();
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    componentWillMount () {
        this.update();
        Api.post('air/findAllAirPlaneModel').then(res => {
            this.setState({
                children: res.data,
            });
        });

        const options=[];
        const date = new Date();
        for(let i=0;i<5;i++){
            options.push({ 'value': date.getFullYear()-i,
                'label': date.getFullYear()-i,isLeaf: false,
               });
        }
        const opt=this.state.optValue;
        // console.log('opt',opt);
        this.setState({
            options: options,
        });

        //周计划导入年份选择
        const options1=[];
        const startYear=date.getFullYear()-10;//起始年份
        const endYear=date.getFullYear()+10;//结束年份
        for(let i=startYear;i<=endYear;i++){
            options1.push(i.toString());
        }
        this.setState({
            options1: options1,
        });
    }
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // console.log('selectedOptions',selectedOptions);
        // load options lazily
        Api.post('weekWorkPackage/getWeekInfoByYearForWwp',{
            year:selectedOptions[0].value
        }).then(res=>{
            setTimeout(() => {
                targetOption.loading = false;
                targetOption.children = res.data;
                this.setState({
                    options: [...this.state.options],
                });
            }, 1000);
        });

    };

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

// // 工卡安排02根据工作包查询所属工作日计划
//     TaskPlan = (record,value,option) => {
//         // console.log(record,value,option,this.state.Selected);
//         Api.post('weekWorkPackageTask/saveSubTaskListArrange',{'wwpId':this.state.Selected,
//             'wwpaId':value,
//             'stlIds':record.stlId,
//         }).then(res=>{
//             // console.log(res);
//             if(res.errorCode=='0'){
//                 message.success('保存成功！');
//
//             }else{
//                 message.error('保存失败！');
//             }
//         })
//
//     };


// 根据工作包查询工作包下工具航材需求信息
    WorkCardPNModel = (record) => {
        // console.log('工作包id',record);
        let WorkCardPN = false;
        if(record.id) {
            WorkCardPN = record;
        }
        this.setState({
            WorkCardPN:WorkCardPN,
            WorkCardPNVisible: true
        });
    };
    WorkCardPNCancel = () => {
        this.setState({
            WorkCardPNVisible:false
        });

    };


//  更新分线
    changeBattleLine = (record,value,option) => {
        // console.log(record,value,option);
        if(record.battleLine && record.battleLineName != option.props.children ) {
            confirm({
                title: '确定修改分线!',
                onOk:()=> {
                    this.battleLineRequest(record,value,option);
                },
                onCancel:()=> {
                    //console.log(record)
                },
            });
        } else if (!record.battleLine) {
            this.battleLineRequest(record,value,option);
        }
    };

    battleLineRequest = (record,value,option) => {
        // console.log(value);
        Api.post('weekWorkPackage/addOrUpdateWwpBattleLine',{wwpId:record.id,battleLine:value})
            .then(res => {
                if(res.errorCode == 0) {
                    message.success('分线成功');
                    record.battleLineName=option.props.children;
                    this.setState({
                        updateState:!this.state.updateState
                    });
                } else if (res.errorCode == 1) {
                    message.error('失败：'+res.errorMsg);
                }
            });
    };


    handleCancel = _ => {
        this.setState({
            details:false
        });
        if(sessionStorage.WorkPackage) {
            this.update();
            sessionStorage.clear('WorkPackage');
        }
    };
//  同步
    synchro = (e,_,index,record,id) => {
        this.setState({
            loadings:true
        });
        // console.log('record',_);
        const _this = e.target;
        _this.innerHTML = '同步中';
        _this.className = 'disabled';
        if(_.orderId){
            message.success('你已同步过，现在继续同步');
            this.setState({
                // loadings:false,
                loadings:true
            });
            Api.post('dataSync/syncSubTaskList',{wwpId:_.id,commandNo:_.commandNo,orderId:_.orderId})
                .then(res => {

                    _this.innerHTML = '工卡同步';
                    _this.className = '';
                    if(res.errorCode == 0) {
                        this.setState({
                            loadings:false,
                        });
                        message.success('同步成功');
                        // _.orderId = true;
                    } else if (res.errorCode == 1) {
                        this.setState({
                            loadings:false
                        });
                        message.error('失败:'+res.errorMsg);
                    } else {
                        message.warning('服务器请求超时，请重试');
                    }
                });
        }else {
            Api.post('dataSync/syncSubTaskList',{wwpId:_.id,commandNo:_.commandNo,orderId:_.orderId})
                .then(res => {
                   _this.innerHTML = '工卡同步';
                    _this.className = '';
                    if(res.errorCode == 0) {
                        this.setState({
                            loadings:false,
                        });
                        message.success('同步成功');
                        // _.orderId = true;
                    } else if (res.errorCode == 1) {
                        this.setState({
                            loadings:false
                        });
                        message.error('失败:'+res.errorMsg);
                    } else {
                        message.warning('服务器请求超时，请重试');
                    }
                });
        }


        //console.log(_this,_,index)
    };
// 经理根据工作包分线查询符合条件的生产线经理modal
    managerEmpCheck = (record) => {
        let isFind = false;
        if(record.id) {
            isFind = record;
        }

        this.setState({
            isFind:isFind,
            managerEmpCheck: true
        });
    };
    managerCancel = () => {
        this.setState({
            managerEmpCheck:false
        });
        this.update();
    };

 // 创建周计划modal
    establish = (record) => {
        let isUpdate = false;
        if(record.id) {
            isUpdate = record;
        }
        this.setState({
            isUpdate:isUpdate,
            establish: true
        });
    };
    establishCancel = () => {
        this.setState({
            establish:false
        });
        this.update();
        if(sessionStorage.WorkPackage) {
            sessionStorage.clear('WorkPackage');
        }
    };

  // 更新页面数据
    update(){
        this.props.form.validateFields(['commandNo','executeTime','pageNow','packageStatus','airplaneModel','airplaneRegNo','weekNo'],(err, values) => {
            const arr =values.weekNo?values.weekNo[1].split('|'):null;
            // console.log('values',values,arr?arr[0]:'');
            const executeStartTime= values.executeTime && values.executeTime.length > 0 ? values.executeTime[0].format('YYYY-MM-DD'):'';
            const executeEndTime= values.executeTime && values.executeTime.length > 0 ? values.executeTime[1].format('YYYY-MM-DD'):'';

            // if(values.executeTime && values.executeTime.length > 0) {
            //     const executeStartTime = TimeConversions.TIME(values.executeTime[0]._d);
            //     const executeEndTime = TimeConversions.TIME(values.executeTime[1]._d);
            //     values.executeStartTime = executeStartTime;
            //     values.executeEndTime = executeEndTime;
            // }
            // delete values.executeTime;

            this.setState({
                tableLoading:true
            });

            Api.post(findByCondition,{
                'commandNo':values.commandNo,
                'executeStartTime':arr?'':executeStartTime,
                'executeEndTime':arr?'':executeEndTime,
                'pageNow':this.state.pageNow,
                'packageStatus':values.packageStatus,
                'airplaneModel':values.airplaneModel,
                'airplaneRegNo':values.airplaneRegNo,
                'weekStartDate':arr?arr[0]:'',
                'weekEndDate':arr?arr[1]:'',
            }).then(res=>{
                // if(res.errorCode == 0) {
                    // console.log(res);
                    this.setState({
                        data: res.data,
                        tableLoading:false,
                        page:res.pageInfo,
                        // currentPage:parseInt(res.pageInfo.currentPage),
                        // totalSize:parseInt(res.pageInfo.totalSize),
                        commandNo:values.commandNo,
                        executeStartTime:executeStartTime,
                        executeEndTime:executeEndTime,
                        packageStatus:values.packageStatus,
                        airplaneModel:values.airplaneModel,
                        airplaneRegNo:values.airplaneRegNo,
                        weekStartDate:arr?arr[0]:'',
                        weekEndDate:arr?arr[1]:'',
                    });
                // }
            })
        });


        // 获取分线信息,放在此，实时更新分线信息
        Api.post(findBattleLine)
            .then(res => {
                if(res.errorCode == 0) {
                    //console.log(res.data);
                    this.setState({
                        Line:res.data
                    })
                }
            });
    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
        this.update();
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
        // this.update();
    };

    change=(expandedRows)=>{
      // console.log(expandedRows);
    };
// 分页查询
    onChange = (pageNumber) => {
        //console.log('Page: ', pageNumber);
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        // this.setState({  //  此处有坑
        //    tableLoading:true
        // });
        Api.post(findByCondition,{
            'commandNo':this.state.commandNo,
            'executeStartTime':this.state.executeStartTime,
            'executeEndTime':this.state.executeEndTime,
            'pageNow':pageNumber,
            'packageStatus':this.state.packageStatus,
            'airplaneModel':this.state.airplaneModel,
            'airplaneRegNo':this.state.airplaneRegNo,
            'weekStartDate':this.state.weekStartDate,
            'weekEndDate':this.state.weekEndDate,
        }).then(res=>{
            // if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    tableLoading:false,
                    page:res.pageInfo,
                    // currentPage:parseInt(res.pageInfo.currentPage),
                    // totalSize:parseInt(res.pageInfo.totalSize),
                });
            // }
        })
    };


//  上传信息通知
//     openNotification = (type,info,obj) => {
//         notification[type]({
//             message: info,
//             description: obj,
//             duration: 0
//         });
//     };

    // 新增工作包
    AddWorkPackage = () => {
        this.setState({
            establish1: true
        });
    };
    AddWorkPackageCancel = () => {
        this.setState({
            establish1:false
        });
        this.update();
    };


    onChange9=(value,selectedOptions)=> {
    // console.log(value,selectedOptions);
        this.setState({
            optValue:value
        });
        if(value.length>0){


        }

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
        const {data , tableLoading,WorkPlansCheck, DayPlanVFindisible, MouldSelectModal,
            details, establish, isUpdate, page,pageNow, Selected, managerEmpCheck,
            WorkCardPNVisible,children,NRCcheckVisible,DDFCcheckVisible,establish1,versionVisible} = this.state;
        const upload = {
                customRequest:(obj) => {
                    this.setState({
                        loadings:true
                    });
                    Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                        .then(res => {

                            if(res.errorCode == 0) {
                                this.props.form.validateFields(['importYearInfo'],(err, values) => {
                                    if(!err){
                                        Api.post('weekWorkPackage/batchImport',{importFileName:res.data,importYearInfo:values.importYearInfo})
                                            .then(res => {
                                                if(res.errorCode == 0) {
                                                    this.setState({
                                                        loadings:false
                                                    });
                                                    this.update();
                                                    notification.open({
                                                        message: '导入成功',
                                                        description: res.data,
                                                    });
                                                } else if(res.errorCode == 1) {
                                                    this.setState({
                                                        loadings:false
                                                    });
                                                    notification.open({
                                                        message: '导入失败',
                                                        description: res.data,
                                                    });
                                                }
                                            })
                                    }else {
                                        message.warning('年份不能为空!');
                                        this.setState({
                                            loadings:false
                                        });
                                    }
                                });

                            } else {
                                this.setState({
                                    loadings:false
                                });
                                message.error('上传文件失败');
                            }
                        });
                },
                showUploadList:false,
                onChange: (fileList) => {
                    console.log(fileList);
                }
            }
        ;
        modalKey++;
        return(
            <div>
                <Spin spinning={this.state.loadings} delay={500} >
                <div className="header work-package">

                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>

                    <div className="work-add">
                        <div style={{display: 'inline-block',position:'relative',top:'-8px',marginRight:'10px'}}>
                            {getFieldDecorator(`importYearInfo`,{
                                rules: [{
                                    required: true, message: '请选择年份!'}],
                                initialValue:new Date().getFullYear(),
                            })(
                                <Select
                                    style={{ width: '80px' }}
                                    allowClear={true}
                                    className='sel'
                                >
                                    {
                                        this.state.options1.map((s,v)=><Option key={v} value={s}>{s}</Option>)
                                    }
                                </Select>
                            )}
                        </div>
                        <div style={{display: 'inline-block'}}>
                            <Upload {...upload}>
                                <Button className='btn_reload' style={{marginRight:'10px'}}>
                                    <Icon type="upload" /> 导入周计划
                                </Button>
                            </Upload>
                        </div>
                        <a href={urlDownload+'uploadTemplate/WORK_PACKAGE_IMPORT_TEMPLATE.xlsx'} target="_blank"><Button className='btn_reload'><Icon type="download" />工作包模板下载</Button></a>
                    </div>

                    <Form
                        className="ant-advanced-search-form"
                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40} id="area">
                            <Col span={8} key={1} >
                                <FormItem {...formItemLayout} label={`指令号`}>
                                    {getFieldDecorator(`commandNo`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={2} >
                                <FormItem {...formItemLayout} label={`机型`}>
                                    {getFieldDecorator(`airplaneModel`,{
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                            allowClear={true}
                                        >
                                            {
                                                children.map((s,v)=><Option key={v} value={s.airPlaneModel}>{s.airPlaneModel}</Option>)
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={6} >
                                <FormItem {...formItemLayout} label={`机号`}>
                                    {getFieldDecorator(`airplaneRegNo`,{
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={3} >
                                <FormItem
                                    {...formItemLayout}
                                    label="状态"
                                >
                                    {getFieldDecorator('packageStatus',{
                                    })(
                                        <Select>
                                            <Option value="S">OPEN</Option>
                                            <Option value="E">ENDW</Option>
                                            <Option value="">全部</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={4}>
                                <FormItem {...formItemLayout} label={`执行时间段`}>
                                    {getFieldDecorator(`executeTime`,{
                                        initialValue:[],
                                    })(
                                        <RangePicker
                                            placeholder=""
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} >
                                <FormItem {...formItemLayout} label={`周数`}>
                                    {getFieldDecorator(`weekNo`,{
                                        // initialValue:[],
                                    })(
                                        <Cascader options={this.state.options} loadData={this.loadData} onChange={this.onChange9} placeholder="" className='cascader_scoll'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} key={5} style={{display:'none'}}>
                                <FormItem {...formItemLayout} label={`页码`}>
                                    {getFieldDecorator(`pageNow`,{
                                        initialValue:pageNow,
                                    })(
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
                    <Row type="flex" justify="start">
                        <Button className="editable-add-btn btn_reload"  onClick={this.AddWorkPackage} ><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>
                    </Row>
                    <div style={{width:'100%'}}>
                        <Modal
                            title="工作包详情"
                            visible={details}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            footer={null}
                            className='showModal'
                            width="80%"
                            key={`${modalKey}key`}
                        >
                            <Details />
                        </Modal>
                        <Modal
                            title="新建"
                            visible={establish1}
                            onCancel={this.AddWorkPackageCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keya`}
                        >
                            <AddWorkPackage  onCancel={this.AddWorkPackageCancel}/>
                        </Modal>
                        <Modal
                            title="修改"
                            visible={establish}
                            onCancel={this.establishCancel}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key2`}
                        >
                            <Establish isUpdate={isUpdate} onCancel={this.establishCancel}/>
                        </Modal>
                        <Modal
                            title="生产线经理分配"
                            visible={managerEmpCheck}
                            onCancel={this.managerCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key3`}
                            width="80%"
                        >
                            <ManageEmpCheck isFind={this.state.isFind}/>
                        </Modal>
                        <Modal
                            title={this.state.WorkCardPN?this.state.WorkCardPN.commandNo:''}
                            visible={WorkCardPNVisible}
                            onCancel={this.WorkCardPNCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key6`}
                            width="90%"
                        >
                            <WorkCardAirMateriel WorkCardPN={this.state.WorkCardPN}/>
                        </Modal>
                        <Modal
                            title={this.state.NRCchecks?this.state.NRCchecks.commandNo:''}
                            visible={NRCcheckVisible}
                            onCancel={this.NRCcheckCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key9`}
                            width="90%"
                        >
                            <NRCSearch NRCchecks={this.state.NRCchecks}/>
                        </Modal>
                        <Modal
                            title={this.state.DDFCchecks?this.state.DDFCchecks.commandNo:''}
                            visible={DDFCcheckVisible}
                            onCancel={this.DDFCcheckCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key10`}
                            width="90%"
                        >
                            <DDFCSearch DDFCchecks={this.state.DDFCchecks}/>
                        </Modal>
                        <Modal
                            title='工卡安排'
                            visible={WorkPlansCheck}
                            onCancel={this.WorkPlanCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key7`}
                        >
                            <WorkPlanModal WorkPlan={this.state.selectedRowKeys} wwpdata={this.state.wwpdata}  onCancel={this.WorkPlanCancel}/>
                        </Modal>
                        <Modal
                            title='工作包模板选择'
                            visible={MouldSelectModal}
                            onCancel={this.MouldSelectCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}key8`}
                            width="90%"
                        >
                            <WorkPackageMould wwpdata={this.state.wwpdata}/>
                        </Modal>
                        <Modal
                            title='工作包版本记录明细'
                            visible={versionVisible}
                            onCancel={this.versionCancel}
                            onOk={this.handleOk}
                            maskClosable={false}
                            footer={null}
                            key={`${modalKey}keyz`}
                            width="90%"
                        >
                            <Version version={this.state.version}/>
                        </Modal>
                    </div>

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
                </Spin>
            </div>
        )
    }
}
const WorkPackages = Form.create()(WorkPackage);
export default WorkPackages;


