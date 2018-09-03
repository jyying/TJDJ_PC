/**
 * Created by admin on 2017/7/12.
 */

import {requestData} from './index';
import Api from '../api/request';
import {login,getImageCode} from '../api/login';
import {message} from 'antd';

export const REQUEST_DATA = 'LOGIN_REQUEST_DATA';
export const RECEIVE_DATA = 'LOGIN_RECEIVE_DATA';
export const ERROR_DATA = 'LOGIN_ERROR_DATA';
export const GET_IMAGE_CODE = 'LOGIN_IMAGE_CODE';
export const IMAGE_LODING = 'LOGIN_IMAGE_LOAD';

const receiveDate = (type,json) => ({
    type,
    data:json,
    receivedAt:Date.now()
});

function memory(values){
    localStorage.account = values.userAccount;
    localStorage.possword = values.userPwd;
}

function eliminate (){
    localStorage.clear('account');
    localStorage.clear('possword');
}

export const loginFetch = (values,history,url) => dispatch => {

    dispatch(requestData({type:REQUEST_DATA,values}));
    let choice = values.remember;
    delete values.remember;

	//localStorage.userName = res.data.loginUserInfo.userName;
	sessionStorage.Landing = true;
	//localStorage.accessToken = res.data.accessTokenInfo.accessToken;
	history.replace('/');
	return;
    return Api.post(url,values)
        .then(res => {
            if(res.errorCode == 1) {
                dispatch(receiveDate(ERROR_DATA,res.data));
                message.error('用户名密码错误，请重新登录！');
            } else {
                dispatch(receiveDate(RECEIVE_DATA,res.data));
                if (res.errorCode == 0) {

                    choice?memory(values):eliminate();
                    localStorage.userName = res.data.loginUserInfo.userName;
                    sessionStorage.Landing = true;
                    localStorage.accessToken = res.data.accessTokenInfo.accessToken;
                    history.replace('/');
                }
            }
        })
};


export const loginCode = text => dispatch => {
    dispatch({type:IMAGE_LODING});
    return Api.post(getImageCode)
        .then(res => dispatch(receiveDate(GET_IMAGE_CODE,res.data)));
};

