import './index.css';
import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    message,
    Row,Col
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import Api from '../../../api/request';

const InterfaceInfo = 'interfaceInfo/addOrUpdateInterfaceInfo';


class UpdateUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonLoading:false
        }
    }
 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    buttonLoading:true
                });
                Api.post(InterfaceInfo,values).then(res=>{
                    this.setState({
                        buttonLoading:false
                    });
                    if(res){
                        message.success('更新成功！');
                        this.props.form.resetFields();
                        sessionStorage.interface = true;
                    }
                });
            }
        });
    };

    componentDidMount(){

    }

    render() {

        return (
            <div className="details">
                <Row>
                    <Col span={4}>创建时间</Col>
                    <Col span={20}>时间</Col>
                </Row>
                <Row>
                    <Col span={4}>执行人</Col>
                    <Col span={20}>张三，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四，李四，张三，李四，张三，李四</Col>
                </Row>
                <Row>
                    <Col span={4}>任务标题</Col>
                    <Col span={20}>标题</Col>
                </Row>
            </div>
        );
    }
}
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
