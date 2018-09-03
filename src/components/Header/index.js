/**
 * Created by dengyou on 2017/6/29.
 */
import './index.css';
import React from 'react';
import { Layout,Icon,Popconfirm ,message} from 'antd';

import Api from '../../api/request';
import TimeConversion from '../../utils/TimeConversion';

const { Header} = Layout;
const loginOut = 'loginOut';
const empLoginOut = 'empLoginOut';
let time;

class commonHeader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            date : ''
        };
    }


    componentDidMount() {
        //console.log(TimeConversion.dateChine());
        let timeDom = document.getElementById('time');
        time = setInterval(_=>{
            timeDom.innerHTML = TimeConversion.dateChine();
        },1000)
    };

    componentWillUnmount(){
        clearInterval(time);
    }

    confirm = () =>{
        let Cancellation = loginOut;
        // if(localStorage.identity) {
        //     Cancellation = empLoginOut;
        // }
        Api.post(Cancellation)
            .then(res => {
                if(res.errorCode == 0) {
                    //console.log(this.props);
                    sessionStorage.clear('Landing');
                    this.props.replace('/login');
                } else {
                    message.error(res.errorMsg);
                }
            })
    };

    render() {
        const {loginState} = this.props;
        const infos = loginState.data;
        return (
            <div className="comp_header">
                <Header>
                    <div
                        className="positionA header_logo"
                    >
                        <h1>海技（天津）定检管理系统</h1>
                        <p id="time">2017年12月27 18:06:24 星期二</p>
                    </div>
                    <div className="positionA userAction">
                        <div className="userInfo">
                            <span className="icon icon-_user"></span>
                            <span>欢迎 </span>
                            <span className="name">{localStorage.userName}</span>
                            <span>！</span>
                        </div>
                        <div className="out">
                            <Popconfirm title="是否注销登陆?" onConfirm={this.confirm} onCancel={this.cancel} okText="确定" cancelText="取消">
                                <Icon type="poweroff" style={{fontSize:20,color:'#333'}}/>

                            <span className="text">退出</span>
                            </Popconfirm>
                        </div>
                    </div>
                </Header>
            </div>
        )
    };

}
export default commonHeader;