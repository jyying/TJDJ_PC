/**
 * Created by Thinkpad on 2017/6/2.
 */
import './index.css'
import './index.js';
import React,{Component} from 'react';
import WorkPackage from '../../containers/GuaranteeResourceManage/WorkPackage';
const h=document.body.clientHeight;
class Home extends Component {
    constructor(){
        super();
    }
    render(){
        const loginState=this.props.loginState;
        console.log('loginState',loginState);
        return (
            <div className="content">
                <div className="index_bg" style={{height:h-265}}>
                    <div className="welcome">欢迎进入海技（天津）定检管理系统！</div>
                </div>

            </div>
        )
    }
}

export default Home;