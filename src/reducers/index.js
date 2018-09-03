/**
 * Created by admin on 2017/7/6.
 */
import {combineReducers} from 'redux';

import * as login from './login';

const assign = Object.assign({},login);

const reducers = combineReducers(assign);

export default reducers;