/**
 * Created by Thinkpad on 2017/6/23.
 */
import React from 'react';
import {
    HashRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

import Login from './containers/Login';
import App from './components/App';

import CheckTaskManage from './containers/CheckTaskManage/FixTaskManage';
import DDInformation from './containers/CheckTaskManage/DDinformation';
import NRCTemplet from './containers/CheckTaskManage/NRCTemplet';
import NoDDFCFault from './containers/CheckTaskManage/NoDDFCFault';
import FaultDispose from './containers/CheckTaskManage/FaultDispose';
import JobUpload from './containers/CheckTaskManage/JobUpload';

import AirplaneInformation from './containers/GuaranteeResourceManage/AirplaneInformation';

import StaffAttendanceManage from './containers/GuaranteeResourceManage/StaffAttendanceManage';
import StaffQualifiedEmpower from './containers/GuaranteeResourceManage/StaffQualifiedEmpower';
import StaffSkillLevel from './containers/GuaranteeResourceManage/StaffSkillLevel';
import StaffRoleEmpower from './containers/GuaranteeResourceManage/StaffRoleEmpower';
import StaffJobInformation from './containers/GuaranteeResourceManage/StaffJobInformation';
import RolePrivilegeManage from './containers/SystemManage/RolePrivilegeManage';

import PersonnelBaseInformation from './containers/GuaranteeResourceManage/PersonnelBaseInformation';
import WorkHourStatistics from './containers/StatisticalFeedback/WorkHourStatistics';
import AirMaterialStatistics from './containers/StatisticalFeedback/AirMaterialStatistics';
import AttendanceRecord from './containers/StatisticalFeedback/AttendanceRecord';
import ProblemFeedback from './containers/StatisticalFeedback/ProblemFeedback';
import CheckReleaseReport from './containers/ReleaseFactory/CheckReleaseReport';
import PlaneExitRelease from './containers/ReleaseFactory/PlaneExitRelease';
import CheckProducePrepare from './containers/CheckExecuteControl/CheckProducePrepare';

import CheckProgressMonitoring from './containers/CheckExecuteControl/CheckProgressMonitoring';
import MorrowMaterialPrepare from './containers/CheckExecuteControl/MorrowMaterialPrepare';
import ProduceProgressManage from './containers/CheckExecuteControl/ProduceProgressManage';
import WorkExecuteClose from './containers/CheckExecuteControl/WorkExecuteClose';
import CardManage from './containers/WorkIssued/CardManage';
import PersonManage from './containers/WorkIssued/PersonManage';
import UserManage from './containers/SystemManage/UserManage';
import UserRoleManage from './containers/SystemManage/UserRoleManage';
import MenuManage from './containers/SystemManage/MenuManage';
import ExperienceInPersonnel from './containers/GuaranteeResourceManage/ExperienceInPersonnel';
import StopSiteManage from './containers/GuaranteeResourceManage/StopSiteManage';
import PackageNumberManage from './containers/GuaranteeResourceManage/PackageNumberManage';

import JobList from './containers/GuaranteeResourceManage/JobList';
import EquipmentManage from './containers/GuaranteeResourceManage/EquipmentManage';

import CheckManage from './containers/GuaranteeResourceManage/CheckManage';
import DataDictionaryManage from './containers/SystemManage/DataDictionaryManage';

const isLoggedIn = (props) => {

		if (!sessionStorage.Landing && props.pathname != '/login') {
            return false;
        };

        return true;
};

const Apps = (location)=> (
    <App {...location}>

        <Route exact path='/check_task_manage' component={CheckTaskManage}/>
        <Route exact path='/dd_information' component={DDInformation}/>
        <Route exact path='/nrc_templet' component={NRCTemplet}/>
        <Route exact path='/no_ddfc_fault' component={NoDDFCFault}/>
        <Route exact path='/fault_dispose' component={FaultDispose}/>
        <Route exact path='/job_upload' component={JobUpload}/>
        <Route exact path='/airplane_information' component={AirplaneInformation}/>
        <Route exact path='/staff_attendance_manage' component={StaffAttendanceManage}/>
        <Route exact path='/staff_qualified_empower' component={StaffQualifiedEmpower}/>
        <Route exact path='/staff_skill_level' component={StaffSkillLevel}/>
        <Route exact path='/staff_role_empower' component={StaffRoleEmpower}/>
        <Route exact path='/staff_job_information' component={StaffJobInformation}/>
        <Route exact path='/role_privilege_manage' component={RolePrivilegeManage}/>
        <Route exact path='/personnel_base_information' component={PersonnelBaseInformation}/>
        <Route exact path='/work_hour_statistics' component={WorkHourStatistics}/>
        <Route exact path='/air_material_statistics' component={AirMaterialStatistics}/>
        <Route exact path='/attendance_record' component={AttendanceRecord}/>
        <Route exact path='/problem_feedback' component={ProblemFeedback}/>
        <Route exact path='/check_release_report' component={CheckReleaseReport}/>
        <Route exact path='/plane_exit_release' component={PlaneExitRelease}/>
        <Route exact path='/check_produce_prepare' component={CheckProducePrepare}/>
        <Route exact path='/check_progress_monitoring'component={CheckProgressMonitoring}/>
        <Route exact path='/morrow_material_prepare' component={MorrowMaterialPrepare}/>
        <Route exact path='/produce_progress_manage' component={ProduceProgressManage}/>
        <Route exact path='/work_execute_close' component={WorkExecuteClose}/>
        <Route exact path='/card_manage' component={CardManage}/>
        <Route exact path='/person_manage' component={PersonManage}/>
        <Route exact path='/user_manage' component={UserManage}/>
        <Route exact path='/user_role_manage' component={UserRoleManage}/>
        <Route exact path='/menu_manage' component={MenuManage}/>
        <Route exact path='/experience_in_personnel' component={ExperienceInPersonnel}/>
        <Route exact path='/stop_site_manage' component={StopSiteManage}/>
        <Route exact path='/package_number_manage' component={PackageNumberManage}/>

        <Route exact path='/job_list' component={JobList}/>
        <Route exact path='/equipment_manage' component={EquipmentManage}/>
        <Route exact path='/check_manage' component={CheckManage}/>
        <Route exact path='/data_dictionary_manage' component={DataDictionaryManage}/>

        {/*<Redirect to="check_task_manage"/>*/}
    </App>
);

const routes = (
    <div>
        <Switch>
            <Route exact path="/login" component={Login}/>
            <Route path="/" render={(props)=>(
                isLoggedIn(props)?(<Apps {...props}/>):(<Redirect to="/login"/>)
            )}/>
        </Switch>
    </div>
);

export default routes;