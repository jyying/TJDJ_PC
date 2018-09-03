import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    message,
    Table
} from 'antd';

import Api from '../../../api/request';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
}


class AddUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonLoading:false,
            columns:[
                {
                    title: '姓名',
                    dataIndex: 'name',
                },{
                    title: '信息',
                    dataIndex: 'info',
                },{
                    title: 'E网账号',
                    dataIndex: 'E',
                }
            ],
            selectedRowKeys:[1,2,3],
            selectedRows:[]
        };
    }

 // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
            this.setState({
               buttonLoading:true
            });
            console.log(this.state.selectedRowKeys,this.state.selectedRows)
            // Api.post(InterfaceInfo).then(res=>{
            //     this.setState({
            //         buttonLoading:false
            //     });
            //     if(res.errorCode == 0) {
            //         message.success('添加成功');
            //     }
            // })
    };

    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({ selectedRowKeys,selectedRows });
    };

    render() {
        const {buttonLoading,columns,selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />

                <FormItem>
                    <Button
                        type="primary"
                        size="large"
                        loading={buttonLoading}
                        onClick={this.handleSubmit}
                    >
                        提交
                    </Button>
                </FormItem>
            </div>
        );
    }
}
const UserListForm = Form.create()(AddUserList);
export default UserListForm;
