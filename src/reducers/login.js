/**
 * Created by admin on 2017/7/12.
 */

import {
    RECEIVE_DATA,
    REQUEST_DATA,
    ERROR_DATA,
    GET_IMAGE_CODE,
    IMAGE_LODING
} from '../actions/login';


export const loginState = (
    state={
        isFetching:false,
        firstLanding:null,
        data:null,
        getImageCode:false,
        tokenType:'',
        userAccount:'',
        userName:''
    },
    action) => {
    switch (action.type) {
        case REQUEST_DATA:
            return Object.assign({},state,{
                isFetching:true
            });
        case RECEIVE_DATA:
            return Object.assign({},state,{
                isFetching:false
            },action);
        case ERROR_DATA:
            return Object.assign({},state,{
                isFetching:false,
                firstLanding:true
            },action);
        case IMAGE_LODING:
            return Object.assign({},state,{
                getImageCode:true
            });
        case GET_IMAGE_CODE:
            return Object.assign({},state,{
                getImageCode:false
            },action);
        default:
            return state;
    }
};