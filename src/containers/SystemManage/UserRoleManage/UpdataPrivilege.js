
import React from 'react';
import { Row, Col ,Select ,Table,Button,message} from 'antd';
import Api from '../../../api/request';

const columns = [{
    title: '权限',
    dataIndex: 'methodName'
}];


class UpdatePrivilege extends React.Component {
    constructor(props){
        super(props);

    }
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        data:[]
    };
    componentDidMount(){
        this.initial();
    }

    initial(){
        const value = this.props.data.roleId;
        //console.log(value);
        Api.post('roleInterfaceAuthority/findInterfaceAuthorityByRoleId',{'roleId':value})
            .then(res => {
                //console.log(res.data);
                let newSelectedRowKeys = [];
                const data = res.data;
                const data0 = res.data[0];
                const data1 = res.data[1];
                //标记返回为1的id，使其被选中
                for(let i = 0;i < data1.length;i++){
                    newSelectedRowKeys.push(data1[i].id)
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
    };

    onSelectChange = (selectedRowKeys) => {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
    save = () => {
        const roleId = this.props.data.roleId;
        const interfaceIds = this.state.selectedRowKeys;
        Api.post('roleInterfaceAuthority/saveRoleInterfaceAuthority',{'roleId':roleId,'interfaceIds':interfaceIds})
        .then(res => {
            //console.log(res);
            if(res.errorCode=='0'){
                message.success('保存成功！');
            }else{
                message.error('保存失败！');
            }
        })
    };
    render() {
        const {onCancel} = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { data } = this.state;
        return (
            <div>
                <Row style={{marginBottom:'15px'}}>
                    <Col span={12}>角色名称：{this.props.data.roleName}</Col>
                    <Col span={12}>
                        {/*<Button type="primary" onClick={onCancel}>关闭</Button>*/}
                        <Button type="primary" onClick={this.save}>保存</Button>
                    </Col>
                </Row>

                <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={data} bordered size="middle"/>
            </div>
        );
    }
}
export default UpdatePrivilege;
