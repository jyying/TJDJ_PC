/**
 * Created by admin on 2017/7/12.
 */

import fetch from 'isomorphic-fetch';
import {message} from 'antd';

//const URL = 'http://localhost:8080/';
const URL = 'http://192.168.130.208:8080/';

function checkStatus (res){
    if (res.status >= 200 && res.status < 300) {
        return res;
    }
    const error = new Error(res.statusText);
    error.res = res;
    throw error;
}

function checkCode (res){
    if (res.errorCode == -1) {
        message.warning('系统错误');
    } else if(res.errorCode == -2) {
        message.error('无权限访问');
    }
}

function timeout(promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error("timeout"));
        }, 30000000);
        promise.then(resolve, reject);
    })
}

function get (url){
    let request = new Request(URL+url,{
        method:'GET'
    });
    return timeout(fetch(request))
        .then(res => {
            checkStatus(res);
            return res.json()
        })
        .then(json => {

            checkCode(json);
            return json
        })
        .catch(error => {

            message.warning('服务器请求超时');
            return error;
        });
}

function post(url,postData,dispatch) {
    let formData = new FormData();

    for (let v in postData) {
        formData.append(v,postData[v]);
    }
    let request = new Request(URL+url,{
        method:'POST',
        body:formData
    });

    return timeout(fetch(request))
        .then(res => {
            console.log(res);
            checkStatus(res);
            return res.json();
        })
        .then(json => {
            checkCode(json);
            return json
        })
        .catch(error => {

            message.warning('服务器请求超时');
            return error;
        });
}


function put (url,putData){
    let request = new Request(URL+url,{
        method:'PUT',
        body:putData
    });

    return fetch(request)
        .then(res => {
            checkStatus(res);
            return res.json()
        })
        .then(json => {

            checkCode(json);
            return json
        })
        .catch(error => {

            message.warning('服务器请求超时');
            return error;
        });
}

export {get,post,put}