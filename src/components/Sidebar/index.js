/**
 * Created by dengyou on 2017/6/29.
 */
import './index.css'
import React from 'react';
import { Layout,Menu, Icon  } from 'antd'
import { Link } from 'react-router-dom';

const { Sider} = Layout;
const SubMenu = Menu.SubMenu;


class Sidebar extends React.Component{
    constructor(){
        super();
        this.state={
            mode: 'inline',
            openKey: 'sub1',
            selectedKey: '1',
            theme: 'dark',
            collapsed: false,
        };
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            mode: !this.state.collapsed ? 'vertical' : 'inline',
        });
    }

    handleClick = (e) => {
        // console.log('Clicked: ', e);
        this.setState({
            selectedKey: e.key,
        });
    }
    onOpenChange = v => {
        // console.log(v);
        this.setState({
            openKey: v[v.length - 1]
        })

    };

    componentDidMount() {

    };

    render() {
        //console.log(this.props);
        return (
            <div>
                <Sider width={200} style={{ background: '#fff' }} trigger={null} collapsible collapsed={this.state.collapsed}  onCollapse={this.onCollapse}>
                    <Menu
                        onClick={this.handleClick}
                        style={{ height: '100%', borderRight: 0 }}
                        mode={this.state.mode}
                        selectedKeys={[this.state.selectedKey]}
                        openKeys={[this.state.openKey]}
                        onOpenChange={this.onOpenChange}
                        theme={this.state.theme}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>定检任务管理</span></span>}>
                                <Menu.Item key="1"><Link to='check_task_manage'>定检任务管理</Link></Menu.Item>
                                <Menu.Item key="2"><Link to='dd_information'>DD、FC和NRC信息</Link></Menu.Item>
                                <Menu.Item key="3"><Link to="nrc_templet" >NRC模板</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="no_ddfc_fault" >非DD、FC等故障信息</Link></Menu.Item>
                                <Menu.Item key="5"><Link to="fault_dispose" >排故建议单、定检故障处理</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="job_upload" >其他任务的导入</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="hdd" /><span>保障资源管理</span></span>}>
                            <Menu.Item key="7"><Link to="airplane_information" >飞机信息</Link></Menu.Item>
                            <Menu.Item key="8"><Link to="personnel_base_information" >人员信息管理</Link></Menu.Item>
                            <Menu.Item key="9"><Link to="staff_role_empower" >人员角色授权管理</Link></Menu.Item>
                            <Menu.Item key="10"><Link to="staff_job_information" >人员分线信息管理</Link></Menu.Item>
                            <Menu.Item key="11"><Link to="staff_skill_level" >人员技术级别管理</Link></Menu.Item>
                            <Menu.Item key="12"><Link to="staff_qualified_empower" >人员资质授权管理</Link></Menu.Item>
                            <Menu.Item key="13"><Link to="staff_attendance_manage" >人员考勤管理</Link></Menu.Item>
                            <Menu.Item key="14"><Link to="experience_in_personnel">人员经验</Link></Menu.Item>
                            <Menu.Item key="15"><Link to="stop_site_manage"> 停场机位管理</Link></Menu.Item>
                            <Menu.Item key="16"><Link to="package_number_manage">件号管理</Link></Menu.Item>
                            <Menu.Item key="17">工具、航材、设备管理</Menu.Item>
                            <Menu.Item key="18">大项工作清单</Menu.Item>
                            <Menu.Item key="19"><Link to="package_number_manage">工卡管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="desktop" /><span>工作下发</span></span>}>
                            <Menu.Item key="20"><Link to="card_manage">工卡安排</Link></Menu.Item>
                            <Menu.Item key="21"><Link to="person_manage">人员安排</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="user" /><span>定检执行与控制</span></span>}>
                            <Menu.Item key="22"><Link to="check_produce_prepare">定检开工前的生产准备</Link></Menu.Item>
                            <Menu.Item key="23"><Link to="morrow_material_prepare">次日航材工具准备</Link></Menu.Item>
                            <Menu.Item key="24"><Link to="check_progress_monitoring">定检进度监控</Link></Menu.Item>
                            <Menu.Item key="25"><Link to="produce_progress_manage">生产进度管理</Link></Menu.Item>
                            <Menu.Item key="26"><Link to="work_execute_close">工作执行与关闭</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub5" title={<span><Icon type="select" /><span>放行出厂</span></span>}>
                            <Menu.Item key="27"><Link to="plane_exit_release">飞机出场放行</Link></Menu.Item>
                            <Menu.Item key="28"><Link to="check_release_report">定检出厂报告</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub6" title={<span><Icon type="area-chart" /><span>统计反馈</span></span>}>
                            <Menu.Item key="29"><Link to="work_hour_statistics">人员工时统计</Link></Menu.Item>
                            <Menu.Item key="30"><Link to="attendance_record">考勤统计</Link></Menu.Item>
                            <Menu.Item key="31"><Link to="air_material_statistics">航材使用情况统计</Link></Menu.Item>
                            <Menu.Item key="32"><Link to="problem_feedback">问题反馈</Link></Menu.Item>
                            <Menu.Item key="33">预留表单的接入口</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub7" title={<span><Icon type="setting" /><span>系统管理</span></span>}>
                            <Menu.Item key="34"><Link to="user_manage">用户管理</Link></Menu.Item>
                            <Menu.Item key="35"><Link to="user_role_manage">用户角色管理</Link></Menu.Item>
                            <Menu.Item key="36"><Link to="menu_manage">菜单管理</Link></Menu.Item>
                            <Menu.Item key="37"><Link to="role_privilege_manage">用户角色菜单权限管理</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                    <div className="sider-trigger">
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </div>
                </Sider>
            </div>

        )
    };

}
export default Sidebar;