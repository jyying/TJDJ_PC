/**
 * Created by Thinkpad on 2017/6/23.
 */
import React from 'react';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';

import StaffQualifiedEmpower from '../GuaranteeResourceManage/StaffQualifiedEmpower';

// const validate = function (next, replace, callback) {
//     const isLoggedIn = !!window.localStorage.getItem('uid')
//     if (!isLoggedIn && next.location.pathname != '/login') {
//         replace('/login')
//     }
//     callback()
// };
const routes = (
    <div>
        <Route exact path="/StaffQualifiedEmpower" component={StaffQualifiedEmpower}></Route>
    </div>
);

export default routes;