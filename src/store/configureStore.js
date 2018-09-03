/**
 * Created by Thinkpad on 2017/6/23.
 */
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const middleware = [ thunk ];
let store = createStore(
    reducers,
    applyMiddleware(...middleware)
);
//store.subscribe(()=>console.log(store.getState()));

//console.log(store.getState());



export default store;