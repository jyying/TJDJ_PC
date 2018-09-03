/**
 * Created by Thinkpad on 2017/6/2.
 */
import './style/main.css'
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    HashRouter,
    Route,
} from 'react-router-dom';

import routes from './routes';
import { Provider } from 'react-redux';
import Store from './store/configureStore';

ReactDOM.render(
    <HashRouter>
        <Provider store={Store}>
            <Router children={routes}/>
        </Provider>
    </HashRouter>,
    document.getElementById('root')
);
