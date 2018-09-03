/**
 * Created by admin on 2017/7/12.
 */

import fetch from 'isomorphic-fetch';
import {message} from 'antd';

// 需要替换测试地址，暂时的处理方式
let URL = url;
//const URL = 'http://localhost:8080/';
//const URL = 'http://192.168.130.208:9010/regularlycheck/';
//const URL = 'http://192.168.130.208:9010/regularlycheck-0.0.1-SNAPSHOT/';
//const URL = 'http://localhost:8011/';
//const URL = 'http://192.168.130.154:8080/';
// url = 'http://192.168.130.208:8080/'



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
    } else if (res.errorCode == 1) {
        //message.warning(res.errorMsg);
    } else if (res.errorCode == -3) {
        //message.warning(res.errorMsg);
        //if(res.msg == 'need login'){
            message.warning('登陆信息过期');
            window.location.href = '#/login';
        //}
    }
}

function timeout(promise) {
    return new Promise(function(resolve, reject) {
        //  超时控制
        // setTimeout(function() {
        //     reject({timeout:'timeout'});
        // }, 10000);
        promise.then(resolve, reject);
    })
}

function test (url) {
    const reg = new RegExp('login');
    const regCode = new RegExp('getImageCode');

    reg.test(url);
    console.log(url,reg.test(url),regCode.test(url));
}
class _Api {
    constructor(){

        this.get = url=> {

            url = url+'?access_token='+localStorage.accessToken;

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
                    console.log(error,error.timeout);
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
        this.post = (url,postData) =>{
            //console.log(postData);
            if(url.indexOf('login')!=0 && url.indexOf('getImageCode')!=0 && url.indexOf('empLogin') != 0) {
                url = url+'?access_token='+localStorage.accessToken;
            } else if (url.indexOf('loginOut') == 0 || url.indexOf('empLoginOut') == 0) {
                url = url+'?access_token='+localStorage.accessToken;
            }

            let formData = new FormData();

            for (let v in postData) {
                if(!postData[v]) {
                    postData[v] = '';
                }
                formData.append(v,postData[v]);
            }
            let request = new Request(URL+url,{
                method:'POST',
                body:formData,
                //credentials: "include"    //  携带cookie
            });

            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json();
                })
                .then(json => {
                    checkCode(json);
                    return json
                })
                .catch(error => {
                    console.log(error,error.timeout);
                    if(error.timeout == 'timeout') {
                        message.warning('服务器请求超时')
                    }
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
        this.put = (url,putData) => {

            url = url+'?access_token='+localStorage.accessToken;
            let formData = new FormData();
            for (let v in putData) {
                if(!putData[v]) {
                    putData[v] = '';
                }
                formData.append(v,putData[v]);
            }
            let request = new Request(URL+url,{
                method:'POST',  //  暂时使用POST代替PUT请求
                body:formData,
                //credentials: "include"    //  携带cookie
            });

            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json();
                })
                .then(json => {
                    checkCode(json);
                    return json
                })
                .catch(error => {
                    console.log(error,error.timeout);
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
    }
}

const Api = new _Api();

export default Api
