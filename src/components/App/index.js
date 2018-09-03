/**
 * Created by admin on 2017/7/7.
 */
import './index.css'
import React from 'react';
import Header from '../Header';

import {connect} from 'react-redux';

import { Layout, Breadcrumb,Tabs, Button,Menu, Icon } from 'antd';
import AirplaneInformation from '../../containers/GuaranteeResourceManage/AirplaneInformation';
import StaffAttendanceManage from '../../containers/GuaranteeResourceManage/StaffAttendanceManage';
import PersonnelBaseInformation from '../../containers/GuaranteeResourceManage/PersonnelBaseInformation';
import UserManage from '../../containers/SystemManage/UserManage';
import UserRoleManage from '../../containers/SystemManage/UserRoleManage';
import MenuManage from '../../containers/SystemManage/MenuManage';
import StopSiteManage from '../../containers/GuaranteeResourceManage/StopSiteManage';
import Home from '../../containers/Home';
import DataDictionaryManage from '../../containers/SystemManage/DataDictionaryManage';
import InterfaceManage from '../../containers/SystemManage/InterfaceManage';
import WorkPackage from '../../containers/GuaranteeResourceManage/WorkPackage';
import WorkArrangement from '../../containers/GuaranteeResourceManage/WorkArrangement';
import AircraftModelInformation from '../../containers/GuaranteeResourceManage/AircraftModelInformation';
import DDFCSearch from '../../containers/DdFcNrcManage/DDFCSearch';
import NRCEQUIPMENTSearch from '../../containers/DdFcNrcManage/NRCSearch/NRCEQUIPMENTSearch';
import NRCSearch from '../../containers/DdFcNrcManage/NRCSearch';
import WorkPackageMould from '../../containers/GuaranteeResourceManage/WorkPackageMould';
import BattlelineEmployeeArrange from '../../containers/GuaranteeResourceManage/BattlelineEmployeeArrange';
import workPackageSubTaskArrDetail from '../../containers/GuaranteeResourceManage/workPackageSubTaskArrDetail';
import SubTaskExperience from '../../containers/GuaranteeResourceManage/SubTaskExperience';
import AirplanePass from '../../containers/GuaranteeResourceManage/AirplanePass';
import TaskRiskManage from '../../containers/GuaranteeResourceManage/TaskRiskManage';
// import TastRetrieve from '../../containers/GuaranteeResourceManage/TastRetrieve';
// 经理角色
import ManagerJob from '../../containers/GuaranteeResourceManage/ManagerJob';
import ScanDistribute from '../../containers/GuaranteeResourceManage/ScanDistribute';
//  工卡管理
import Task from '../../containers/WorkCardManage/Task';
import WorkCard from '../../containers/WorkCardManage/WorkCard';
import WorkCardAirMateriel from '../../containers/WorkCardManage/WorkCardAirMateriel';
import WorkCardPN from '../../containers/WorkCardManage/WorkCardPN';
import WorkCardTool from '../../containers/WorkCardManage/WorkCardTool';
import WorldCarList from '../../containers/WorkCardManage/WorldCarList';
import TaskNoManage from '../../containers/GuaranteeResourceManage/TaskNoManage';
import ProduceScheduleManage from '../../containers/GuaranteeResourceManage/ProduceScheduleManage';
import EmpTaskReceiveRecord from '../../containers/GuaranteeResourceManage/EmpTaskReceiveRecord';
import MorrowToolPlan from '../../containers/GuaranteeResourceManage/MorrowToolPlan';
import ProduceEnsureGather from '../../containers/GuaranteeResourceManage/ProduceEnsureGather';
import ProjectChangeList from '../../containers/GuaranteeResourceManage/ProjectChangeList';
import DutyConnectList from '../../containers/GuaranteeResourceManage/DutyConnectList';
import DayStatement from '../../containers/GuaranteeResourceManage/DayStatement';
import MtDailyReport from '../../containers/GuaranteeResourceManage/MtDailyReport';
import SkillHelp from '../../containers/GuaranteeResourceManage/SkillHelp';
import WorkPackageTaskManage from '../../containers/GuaranteeResourceManage/WorkPackageTaskManage';
import TaskArrange from '../../containers/GuaranteeResourceManage/TaskArrange';
import Api from '../../api/request';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const {Content,Footer } = Layout;

const menu = 'loadMenu';

const components = {
    // JobList:JobList,
    // EquipmentManage:EquipmentManage,
    // CheckTaskManage:CheckTaskManage,
    // CheckManage:CheckManage,
    ProjectChangeList:ProjectChangeList,
    DutyConnectList:DutyConnectList,
    DayStatement:DayStatement,
    MtDailyReport:MtDailyReport,
    SkillHelp:SkillHelp,
    WorkPackageTaskManage:WorkPackageTaskManage,
    TaskArrange:TaskArrange,
    /*w*/
    UserRoleManage:UserRoleManage,
    AirplaneInformation:AirplaneInformation,
    WorkCard:WorkCard,
    WorkCardAirMateriel:WorkCardAirMateriel,

    /*d*/
    UserManage:UserManage,
    StaffAttendanceManage:StaffAttendanceManage,
    PersonnelBaseInformation:PersonnelBaseInformation,
    ManagerJob:ManagerJob,
    WorkCardPN:WorkCardPN,
    WorkCardTool:WorkCardTool,
    TaskNoManage:TaskNoManage,
    ProduceScheduleManage:ProduceScheduleManage,
    EmpTaskReceiveRecord:EmpTaskReceiveRecord,
    MorrowToolPlan:MorrowToolPlan,
    WorkPackageMould:WorkPackageMould,
    BattlelineEmployeeArrange:BattlelineEmployeeArrange,
    TaskRiskManage:TaskRiskManage,
    workPackageSubTaskArrDetail:workPackageSubTaskArrDetail,
    AirplanePass:AirplanePass,
    SubTaskExperience:SubTaskExperience,

    // TastRetrieve:TastRetrieve,
    ScanDistribute:ScanDistribute,
    /*h_girl*/
    AircraftModelInformation:AircraftModelInformation,
    StopSiteManage:StopSiteManage,
    DataDictionaryManage:DataDictionaryManage,
    DDFCSearch:DDFCSearch,//DDFC管理
    NRCEQUIPMENTSearch:NRCEQUIPMENTSearch,
    NRCSearch:NRCSearch,//NRC管理
    /*y*/
    MenuManage:MenuManage,
    InterfaceManage:InterfaceManage,
    WorkPackage:WorkPackage,
    WorkArrangement:WorkArrangement,
    Task:Task,
    /*h_boy*/
    WorldCarList:WorldCarList,
    ProduceEnsureGather:ProduceEnsureGather,
};

function component(props){
    const SpecificStory = components[props];
    return <SpecificStory />;
}

//const findAllMenu = 'menu/findAllMenu';
/*
 newTabIndex 作为tab计数的key值
 panes tabs默认展示
 */
// let panes = [
//     {
//         key: 'HTMPM1'
//     }
// ];

let data = [
	{
		menuName:'一级菜单',
		id:1,
		children:[
			{
				menuUrl:'InterfaceManage',
				menuName:'子菜单'
			}
		]
	},
	{menuName:'菜单',id:2}
];

class App extends React.Component{

    constructor(props) {
        super(props);
        this.newTabIndex = 2;
        const panes = [
            {
                title: '首页',
                content: <DataDictionaryManage />,
                key: 'HTMPM1'
            }
        ];
        this.state = {
            theme:'dark',
            mode:'inline',
            data:data,
            menuLoad:'',
            activeKey: panes[0].key,
            panes

        }
    }

    onSelect = (s) => {
        let dom = s.domEvent.target;
        if(dom.tagName == 'LI') {
            dom = dom.children[0];
            //console.log(dom.children[0],dom.childNodes,dom.getElementsByTagName('DIV'));
        }
        const domUrl = dom.dataset.url;
        const domHtml = dom.innerHTML;
        let repeat = false;
        //console.log(dom,domUrl,<CheckTaskManage />,components[domUrl],component(domUrl));
        const panes = this.state.panes;
        //  去重
        panes.forEach(title=>{
            if(title.title === domHtml) {
                this.setState({ activeKey:title.key });
                repeat = true
            }
        });
        if(!repeat){
            const activeKey = `HTMPM${this.newTabIndex++}`;
            panes.push({ title: domHtml, content: component(domUrl), key: activeKey });
            this.setState({ panes, activeKey });
        }
    };

    onChange = (activeKey) => {
        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: !this.state.collapsed ? 'vertical' : 'inline',
        });
    };

    //  选中目录时
    onTitleClick = (key) => {
        const keys = key.key;

        if(this.state.menuLoad != keys) {

        	return;

            Api.post(menu,{menuType:'2',menuChannel:'P',parentId:keys})
                .then(res => {
                    if(res.errorCode == 0) {
                        let data = this.state.data;
                        data.forEach(obj => {
                            if(obj.id == keys){
                                obj.children = res.data;
                            }
                        });
                        this.setState({
                            data:data,
                            menuLoad:keys
                        });
                    }
                })
        }
    };

    componentWillMount() {
        let keys = 0;
        //  一级
        Api.post(menu,{menuType:'1',menuChannel:'P'})
            .then(res => {
                if(res.errorCode == 0) {
                    keys = res.data[0].id;
                    this.setState({
                        data:res.data
                    });
                }
            })
    };
    componentWillUnmount(){

    }
    render() {
        const {data} = this.state;
        const {loginState} = this.props;
        let num = 0;
        return (
            <Layout
                className="App"
            >
                    <Sider
                        width={260}
                        style={{background:'fff',zIndex: '998'}}
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}
                    >
                        <div className="logo index" onClick={this.toggle}>

                        </div>
                        <Menu
                            style={{ maxHeight: '100%', borderRight: 0}}
                            type="editable-card"
                            mode={this.state.mode}
                            theme={this.state.theme}
                            onChange={this.onChange}
                            onEdit={this.onEdit}
                            onClick={(s)=> this.onSelect(s)}
                            className="modify"
                        >

                            {
                                data.map((s) => {
                                    return (
                                        <SubMenu
                                            key={s.id}
                                            title={<span><Icon type="mail" /><span>{s.menuName}</span></span>}
                                            onTitleClick={(key) => this.onTitleClick(key)}
                                        >
                                            {
                                                s.children?s.children.map((n)=>{
                                                        return(
                                                            <Menu.Item key={num++}>
                                                                <div data-url={n.menuUrl}>{n.menuName}</div>
                                                            </Menu.Item>
                                                        )
                                                    }
                                                ):null
                                            }
                                        </SubMenu>
                                    )
                                })
                            }
                        </Menu>
                    </Sider>

                    <Layout
                        style={{overflow: 'auto'}}
                    >
                        <Header {...this.props.history} loginState = {loginState} />
                        <Content>
                            <Tabs
                                hideAdd
                                onChange={this.onChange}
                                activeKey={this.state.activeKey}
                                type="editable-card"
                                onEdit={this.onEdit}
                            >
                                {
                                    this.state.panes.map(pane =>
                                        (
                                            <TabPane tab={pane.title} key={pane.key}>
                                                {pane.content}
                                            </TabPane>
                                        )
                                    )
                                }
                            </Tabs>
                        </Content>
                        <Footer
                            style={{ textAlign: 'center',lineHeight: '5px',padding: '15px 50px',background:'transparent'}}
                        >
                            ©2017海南瑞建高科技有限責任公司
                        </Footer>
                    </Layout>

            </Layout>
        )
    };
}
function defaultState (state) {
    return ({
        loginState:state.loginState
    })
}
App = connect(defaultState)(App);
export default App;
