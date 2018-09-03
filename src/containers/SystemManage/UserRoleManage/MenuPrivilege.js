import React from 'react';
import { Row, Col ,Select ,Table,Button,message} from 'antd';
import Api from '../../../api/request';

const columns = [
    {
        title: '菜单名',
        dataIndex: 'menuName'
    }];


class MenuPrivilege extends React.Component {
    constructor(props){
        super(props);

    }
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        data:[]
    };
    componentDidMount(){
        const value = this.props.data.roleId;
        Api.post('roleMenuAuthority/findMenuAuthorityByRoleId',{'roleId':value}).then(res => {
            console.log('res',res);
            this.setState({
                data:res.data
            });
            //consol
            //
            // og(this.state.data)
            const data = this.state.data;
            //console.log(data);
            let newSelectedRowKeys = [];
            for (let i =0 ; i < data.length;i++){
                if(data[i].checked == '1'){
                    newSelectedRowKeys.push(data[i].id);
                    this.setState({ selectedRowKeys:newSelectedRowKeys });
                }
                const data2 = data[i].children;
                // console.log(data2);
                for (let j =0 ; j < data2.length;j++){
                    if(data2[j].checked == '1'){
                        newSelectedRowKeys.push(data2[j].id);
                        this.setState({ selectedRowKeys:newSelectedRowKeys });
                    }
                }
            }
        });

    }

     removeByValue=(arr, val)=> {
    for(let i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};


    onSelectChange = (selectedRowKeys) => {
        //判断当二级菜单选中时，一级菜单默认被选中
        // console.log('selectedRowKeys',selectedRowKeys);

        if(selectedRowKeys.length>0){
            // console.log('selectedRowKeys',selectedRowKeys);
            for(let i=0;i<selectedRowKeys.length;i++){//selectedRowKeys[i]
                for(let j=0;j<this.state.data.length;j++){
                    for(let k=0;k<this.state.data[j].children.length;k++){
                        // if(){}
                        if(selectedRowKeys[i]==this.state.data[j].children[k].id){
                            // this.setState({ selectedRowKeys:this.state.data[j].id });
                            selectedRowKeys.push(this.state.data[j].id);
                        }
                        // if(this.state.data[j].children.length==0){
                        //     selectedRowKeys.removeByValue(this.state.data[j].id);
                        // }
                    }
                }
            }
        }
        // if(selectedRowKeys.length>0){
        //
        // }

        //const data = this.state.data;
        //let newSelectedRowKeys = [];
        //for (let i =0 ; i < data.length;i++){
        //    //if(data[i].checked == '1'){
        //    //    newSelectedRowKeys.push(data[i].id);
        //    //    this.setState({ selectedRowKeys:newSelectedRowKeys });
        //    //}
        //    const data2 = data[i].children;
        //    console.log(data2);
        //    for (let j =0 ; j < data2.length;j++){
        //        if(data2[j].checked == '1'){
        //            //newSelectedRowKeys.push(data[i].id);
        //            //console.log(selectedRowKeys);
        //            //this.setState({ selectedRowKeys:newSelectedRowKeys });
        //        }
        //    }
        //}

        //console.log(data);
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };
    save = () => {
        const roleId = this.props.data.roleId;
        const interfaceIds = this.state.selectedRowKeys;
        //console.log(roleId,interfaceIds);
        Api.post('roleMenuAuthority/saveRoleMenuAuthority',{'roleId':roleId,'menuIds':interfaceIds})
            .then(res => {
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
export default MenuPrivilege;
