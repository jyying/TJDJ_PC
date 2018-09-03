import './index.css'
import React,{Component} from 'react';
import {
    Form,
    Input,
    Button,
    Table,
    Modal,
    Popconfirm,
    message,
    Select,
    Spin,Icon
} from 'antd';
import Api from '../../../api/request';

const FormItem = Form.Item;
const Option = Select.Option;

const findAllMenu = 'menu/findAllMenu';
const saveOrUpdateMenu = 'menu/saveOrUpdateMenu';
const deleteMenu = 'menu/deleteMenu';


class UserManagement extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tableLoading:false,
            tableData:[],
            addShow:false,
            modifyShow:false,
            addMenuType:false,
            modifyContainer:{},
            buttonLoading:false,
            modalSpin:true
        };
        this.columns = [{
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '菜单地址',
            dataIndex: 'url',
            key: 'url',
        },{
            title:'操作',
            dataIndex:'',
            key:'delete',
            render:(text,record,index)=>(
                <span>
                    <a onClick={()=>this.modifyID(text, record,index)}>修改</a>
                      <span className="ant-divider" />
                     <Popconfirm
                         title="删除此菜单?"
                         okText="Yes"
                         onConfirm={()=>this.tableDelete(text,record)}
                         cancelText="No"
                     >
                        {
                            record.delete?<a className="disabled">删除中...</a>:
                                <a href="#" style={{color:'#e60012'}}>删除</a>
                        }

                    </Popconfirm>
                </span>
            )
        }];
    };

    componentWillMount(){
        this.update();
    };

    update = _ => {
        this.setState({
            tableLoading: true
        });
        Api.post(findAllMenu).then(res=>{
            this.setState({
                tableData: res.data,
                tableLoading: false,
                buttonLoading:false
            });
        })
        //this.props.dispatch(menuFetch());
    };


    //  清除
    handleReset = () => {
        this.props.form.resetFields();
    };
    //  删除
    tableDelete = (text,record) => {
        const id = {menuId:text.id};
        record.delete = true;
        Api.post(deleteMenu,id)
            .then(res => {
                if(res.errorCode == 0) {
                    message.success('删除成功');
                    this.update();
                }
            });
    };

    addMenu = e => {
        e.preventDefault();
        this.props.form.validateFields(
            ['addMenuName','addMenuUrl','addMenuChannel','addMenuType','addParentId','seqNo'],
            (err, values) => {
                //console.log(values);
                if (!err) {
                    this.setState({
                        buttonLoading:true
                    });
                    const obj = {
                        menuName: values.addMenuName,
                        menuUrl: values.addMenuUrl,
                        menuChannel: values.addMenuChannel,
                        menuType: values.addMenuType,
                        parentId: values.addParentId,
                        seqNo:values.seqNo
                    };
                    //console.log(obj);
                    Api.post(saveOrUpdateMenu,obj)
                        .then(res => {
                            if(res.errorCode == 0) {
                                message.success('添加成功');
                                this.update();
                            }
                        })
                }
                //this.handleReset(['menuID','menuAddress']);
                //this.addCancel();
            });
    };
    //  获取修改的ID
    modifyID = (text, record,index) => {
        this.setState({
            modifyShow:true,
        });
        Api.post('menu/findMenuById',{menuId:record.id})
            .then(res => {
                console.log('res',res);
                    this.setState({
                        modalSpin:false,
                        modifyContainer:res.data
                    })
            })
    };
    //  更新数据
    modifyMenu = e => {
        e.preventDefault();
        this.props.form.validateFields(
            ['modifyMenuId','modifyMenuName','modifyMenuUrl','modifyMenuChannel','modifyMenuType','modifyParentId','seqNo'],
            (err, values) => {
                if (!err) {
                    this.setState({
                        buttonLoading:true
                    });
                    const obj = {
                        menuId:values.modifyMenuId,
                        menuName: values.modifyMenuName,
                        menuUrl: values.modifyMenuUrl,
                        menuChannel: values.modifyMenuChannel,
                        menuType: values.modifyMenuType,
                        parentId:values.modifyParentId,
                        seqNo:values.seqNo
                    };
                    //console.log(obj);
                    Api.post(saveOrUpdateMenu,obj)
                        .then(res => {
                            if(res.errorCode == 0) {
                                message.success('修改成功');
                                this.modifyCancel();
                                this.update();
                            }
                        })
                }
                //this.handleReset(['menuID','menuAddress']);
                //this.addCancel();
            });
    };

    //  显示相应的对话框
    edit = e => {
        //console.log(e.target.dataset.type);
        const type = e.target.dataset.type;
        if (type == 'add') {
            this.setState({
                addShow:true
            });
        } else if (type == 'modify') {
            //console.log(this.state.selectedRows);
            this.setState({
                modifyShow:true
            });
        }
    };

    //  关闭对话框
    addCancel = _ => {
        this.cancel({addShow:false});
        this.update;
    };
    modifyCancel = _ => {
        this.cancel({modifyShow:false});
    };

    modifyReset = _ => {
        this.props.form.resetFields(
            ['modifyMenuId','modifyMenuName','modifyMenuUrl','modifyMenuChannel','modifyMenuType','modifyParentId']
        );
        this.cancel({modalSpin:true,modifyContainer:{}});
    };

    cancel = (obj) => {
        this.setState(obj)
    };


    //  选中表格
    onSelectChange = (selectedRowKeys,selectedRows) => {
        //console.log(selectedRows,this.state.selectedRows);
        //this.setState({ selectedRows });
        this.state.selectedRows = selectedRows;
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const {tableData,
            buttonLoading,
            addShow,
            modifyShow,
            tableLoading,
            addMenuType,
            modalSpin,
            modifyContainer} = this.state;
        // const rowSelection = {
        //     type,
        //     selectedRows,
        //     onChange:this.onSelectChange
        // };
        // console.log(modifyContainer);
        return(
            <div>
                <div className="content">
                    <div style={{width:'100%',height:'40px',textAlign:'left'}}>

                        <Button
                            onClick={this.edit}
                            className="rightsMation btn_reload"
                            data-type="add"
                            style={{float:'left'}}
                        ><Icon type="plus" />
                            新增
                        </Button>
                    </div>
                    <Table loading={tableLoading}
                           columns={this.columns}
                           rowKey='id'
                           dataSource={tableData}
                           bordered size="middle"
                    />

                    <Modal
                        title='新建'
                        visible={addShow}
                        className="modal-menu"
                        onCancel={this.addCancel}
                        footer={null}
                    >
                        <Form
                            onSubmit={this.addMenu}
                        >
                            <FormItem
                                {...formItemLayout}
                                label="菜单名称"
                            >
                                {getFieldDecorator(`addMenuName`,{
                                    rules: [{ required: true, message: '请输入菜单名称!' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="菜单显示渠道"
                            >
                                {getFieldDecorator(`addMenuChannel`,{
                                    initialValue:'P'
                                })(
                                    <Select style={{ width: 120 }}>
                                        <Option value="P">PC端</Option>
                                        <Option value="M">移动端</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="菜单类型"
                            >
                                {getFieldDecorator(`addMenuType`,{
                                    initialValue:'1',
                                    rules: [{ required: true, message: '请选择菜单类型!' }],
                                })(
                                    <Select
                                        onChange={(value)=> {
                                            //console.log(value);
                                            if(value == 2) {
                                                this.setState({
                                                    addMenuType:true
                                                })
                                            } else {
                                                this.setState({
                                                    addMenuType:false
                                                })
                                            }
                                        }}
                                        style={{ width: 120 }}
                                    >
                                        <Option value="1">目录</Option>
                                        <Option value="2">菜单</Option>
                                    </Select>
                                )}
                            </FormItem>
                            {
                                addMenuType?
                                    <div>
                                        <FormItem
                                            {...formItemLayout}
                                            label="访问地址"
                                        >
                                            {getFieldDecorator(`addMenuUrl`)(
                                                <Input />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="所属目录"
                                        >
                                            {getFieldDecorator(`addParentId`,{
                                                rules: [{ required: true, message: '请选择所属目录!' }],
                                            })(
                                                <Select style={{ width: 120 }}>
                                                    {
                                                        tableData.map((s,v)=>
                                                            <Option key={v} value={s.id}>{s.name}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                    :null
                            }
                            <FormItem
                                {...formItemLayout}
                                label="序号"
                            >
                                {getFieldDecorator(`seqNo`,{
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem>
                                <div className="modalButton">
                                    <Button
                                        size="large"
                                        onClick={this.addCancel}
                                    >
                                        取消
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        loading={buttonLoading}
                                    >
                                        确定
                                    </Button>
                                </div>
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal
                        title='修改'
                        visible={modifyShow}
                        className="modal-menu"
                        onCancel={this.modifyCancel}
                        afterClose={this.modifyReset}
                        footer={null}
                        style={{textAlign:"center"}}
                    >

                        <Spin spinning={modalSpin}>
                            <Form
                                onSubmit={this.modifyMenu}
                            >
                                <FormItem
                                    {...formItemLayout}
                                    label="父ID"
                                    style={{display:'none'}}
                                >
                                    {getFieldDecorator(`modifyParentId`,{
                                        initialValue:modifyContainer.parentId,
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="菜单ID"
                                    style={{display:'none'}}
                                >
                                    {getFieldDecorator(`modifyMenuId`,{
                                        initialValue:modifyContainer.id,
                                        rules: [{ required: true, message: '请输入菜单名称!' }],
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="菜单名称"
                                >
                                    {getFieldDecorator(`modifyMenuName`,{
                                        initialValue:modifyContainer.menuName,
                                        rules: [{ required: true, message: '请输入菜单名称!' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="菜单显示渠道"
                                >
                                    {getFieldDecorator(`modifyMenuChannel`,{
                                        initialValue:modifyContainer.menuChannel
                                    })(
                                        <Select style={{ width: 120 }}>
                                            <Option value="P">PC端</Option>
                                            <Option value="M">移动端</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                {
                                    modifyContainer.menuUrl?
                                        <div>
                                            <FormItem
                                                {...formItemLayout}
                                                label="访问地址"
                                            >
                                                {getFieldDecorator(`modifyMenuUrl`,{
                                                    initialValue:modifyContainer.menuUrl,
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...formItemLayout}
                                                label="菜单类型"
                                                style={{display:'none'}}
                                            >
                                                {getFieldDecorator(`modifyMenuType`,{
                                                    initialValue:'2',
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </div>:null

                                }
                                <FormItem
                                    {...formItemLayout}
                                    label="序号"
                                >
                                    {getFieldDecorator(`seqNo`,{
                                        initialValue:modifyContainer.seqNo
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <div className="modalButton">
                                        <Button
                                            size="large"
                                            onClick={this.modifyCancel}
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            loading={buttonLoading}
                                        >
                                            确定
                                        </Button>
                                    </div>
                                </FormItem>
                            </Form>
                        </Spin>
                    </Modal>
                </div>
            </div>
        )
    }
}

UserManagement = Form.create()(UserManagement);
export default UserManagement;

