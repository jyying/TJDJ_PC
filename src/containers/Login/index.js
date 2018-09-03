/**
 * Created by dengyou on 2017/7/5.
 */
import './index.css'
import React from 'react'
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Row,Col,
    Modal,
    message,
    Select
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const login = 'login';
const empLogin = 'empLogin';
let URL = '';
let Android=AndroidUrl;
let Ios=IosUrl;
import {connect} from 'react-redux';

import {loginFetch,loginCode} from '../../actions/login';

class Login extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            visible:false,
            hover:false
        }
    }

    componentDidMount(){
        //console.log(URL);
        this.getAddress = () => {
            localStorage.Address = document.getElementById('address').value;
            message.success('修改成功,请刷新页面',5);
            this.setState({visible:false})
        };
        // document.getElementById('uc-2vm').onmousemove(function() {
        //         console.log('aaa');
        // });
    }
    handleMouseOver=(e)=>{
        this.setState({hover:true})
    };
    handleMouseOut=(e)=>{
        this.setState({hover:false})
    };
    componentWillUnmount(){

    }

    onChange = value => {
        if(value == 'G') {
            URL = login;
            localStorage.clear('identity');
        } else if(value == 'P') {
            URL = empLogin;
            localStorage.identity = 'P';
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log(values);
                // if(localStorage.identity) {
                //     let empValues = {};
                //     empValues.empLoginAccount= values.userAccount;
                //     empValues.empPwd = values.userPwd;
                //     values.userImageCode?empValues.userImageCode = values.userImageCode:null;
                //     console.log(empValues);
                //
                //     values = empValues;
                // }
                const history  = this.props.history;
                URL = login;
                this.props.dispatch(loginFetch(values,history,URL));
            }
        });
    };

    render() {
        //sessionStorage.Landing?sessionStorage.clear('Landing'):null;
        const { getFieldDecorator } = this.props.form;
        const {login,dispatch} = this.props;
        const {visible,hover} = this.state;
        return (
            <div className="bg">
                <div className="loginContainer">
                    <div className="logo">

                    </div>
                    <div className="loginInput">
                        <Form
                            onSubmit={this.handleSubmit}
                            className="login-form"
                            style={{width:'306px',margin:'0 auto'}}
                        >
                            <FormItem className="input">
                                <span className="icon icon-user"></span>
                                {getFieldDecorator('userAccount', {
                                    initialValue:localStorage.account?localStorage.account:'',
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                        placeholder="用户名"
                                    />
                                )}
                            </FormItem>
                            <FormItem className="input">
                                <span className="icon icon-password"></span>
                                {getFieldDecorator('userPwd', {
                                    initialValue:localStorage.possword?localStorage.possword:'',
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )}
                            </FormItem>
                            {/*{*/}
                                {/*login.firstLanding?*/}
                                    {/*<FormItem*/}
                                        {/*className="input"*/}
                                    {/*>*/}
                                        {/*<Row gutter={16}>*/}
                                            {/*<Col span={12}>*/}
                                                {/*{getFieldDecorator('userImageCode', {*/}
                                                    {/*rules: [{ required: true, message: '请输入验证码' }],*/}
                                                {/*})(*/}
                                                    {/*<Input />*/}
                                                {/*)}*/}
                                            {/*</Col>*/}
                                            {/*<Col span={8}>*/}
                                                {/*<img*/}
                                                    {/*src={`data:image/png;base64,${login.data}`}*/}
                                                    {/*alt="图片"*/}
                                                    {/*onClick={()=>dispatch(loginCode())}*/}
                                                    {/*className={login.getImageCode?'img-allow':'img-normal'}*/}
                                                {/*/>*/}
                                            {/*</Col>*/}
                                        {/*</Row>*/}
                                    {/*</FormItem>:null*/}
                            {/*}*/}
                            <FormItem
                                style={{marginTop:'4px'}}
                                className="input remember"
                            >
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: localStorage.account?true:false,
                                })(
                                    <Checkbox
                                        className='remember'
                                    >记住账号</Checkbox>
                                )}

                            </FormItem>
                            <FormItem>
                                <Button
                                    className="btn-login"
                                    size="large"
                                    icon="login"
                                    loading={login.isFetching}
                                    htmlType='submit'
                                >登录</Button>
                            </FormItem>
                        </Form>
                    </div>

                    <div
                        className="address"
                        onClick={()=>this.setState({visible:true})}
                    >

                    </div>

                    <Modal
                        title="更改请求地址"
                        visible={visible}
                        onCancel={()=>this.setState({visible:false})}
                        onOk={()=>this.getAddress()}

                    >
                        <Form>
                            <FormItem>
                                <Input
                                    prefix={<Icon type="smile-o" style={{ fontSize: 13 }} />}
                                    id="address"
                                />
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
                {/*App下载*/}
                <div className="go-top" id="go-top" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                    <a href="javascript:;" className="uc-2vm"></a>
                    <div className="uc-2vm-pop dn" style={{display:hover?'block':'none'}}>
                        <h2 className="title-2wm">Android下载</h2>
                        <div className="logo-2wm-box">
                            <img src={Android} alt="" width="240" height="240" />
                        </div>
                        <h2 className="title-2wm">Ios下载</h2>
                        <div className="logo-2wm-box">
                            <img src={Ios} alt="" width="240" height="240" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function defaultState (state) {
    return ({
        login:state.loginState
    })
}

const LoginForm = Form.create()(Login);
const LoginConnect = connect(defaultState)(LoginForm);
export default LoginConnect;
