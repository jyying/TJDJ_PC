import React from 'react';
import { Row, Col ,message ,Table,Button} from 'antd';
import Api from '../../../api/request';

const columns = [{
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
}];


class FindUserRole extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,
            data:[]
        };
    }

    componentDidMount(){
        const value = this.props.data.userId;
        Api.post('userRoleRelate/findUserRoleByUserId',{'userId':value})
        .then(res => {
            let newSelectedRowKeys = [];
            const data = res.data;
            const data0 = res.data[0];
            const data1 = res.data[1];
            //标记返回为1的id，使其被选中
            for(let i = 0;i < data1.length;i++){
                newSelectedRowKeys.push(data1[i].roleId);
            }
            for(let i in data){
                if(i == 1){
                    this.setState({ selectedRowKeys:newSelectedRowKeys });
                }else{
                    this.setState({ selectedRowKeys:'' });
                }
            }
            //使返回为0和1的两个数组合并
            for(let i = 0;i < data0.length;i++){
                data1.push(data0[i])
            }
            this.setState({
                data:data1
            });

        })
    }

    onSelectChange = (selectedRowKeys) => {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
    save = () => {
        const userId = this.props.data.userId;
        const roleIds = this.state.selectedRowKeys;
        Api.post('userRoleRelate/saveOrUpdateUserRole',{'userId':userId,'roleIds':roleIds})
        .then(res => {
            if(res.errorCode=='0'){
                message.success('更新成功！');
            }else{
                message.error('更新失败！');

            }
        })
    };
    render() {
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { data } = this.state;
        return (
            <div>
                <Row>
                    <Col span={12}>用户名称：{this.props.data.userName1}</Col>
                    <Col span={12} style={{marginBottom:'10px'}}>
                        <Button type="primary" onClick={this.save}>保存</Button>
                    </Col>
                </Row>

                <Table rowKey="roleId" rowSelection={rowSelection} columns={columns} dataSource={data} />
            </div>
        );
    }
}
export default FindUserRole;
