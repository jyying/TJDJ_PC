/**
 * Created by admin on 2017/7/6.
 */
import {REQUEST_DATA,RECEIVE_DATA} from '../actions';

//
export const test = (state = '测试',action) => {
    switch (action.type) {
        case 'CLICK':
            return '点击';
        default:
            return state
    }
};

export const fetchRequest = (
    state={
        isFetching:false,
        data:[]
    },action) => {
    switch (action.type) {
        case REQUEST_DATA:
            return Object.assign({},state,{
                isFetching:true
            });
        case RECEIVE_DATA:
            return Object.assign({},state,{
                isFetching:false
            },action);
        default:
            return state;
    }
};