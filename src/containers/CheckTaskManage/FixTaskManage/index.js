/**
 * Created by dengyou on 2017/6/30.
 */
import './index.css';
import React from 'react';
import { Row, Col, Upload, message, Button, Icon ,Form,Input, Table,Popconfirm,Modal} from 'antd';
const FormItem = Form.Item;
import AddCheckbox from './Checkbox';
import { Link } from 'react-router-dom';



class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render() {
        const { value, editable } = this.state;
        return (
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        );
    }
}

//文件上传
const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
// 指派人员选择
// function showConfirm() {
//     confirm({
//         title: '添加指派人员',
//         content: <AddCheckbox/>,
//         onOk() {
//             return new Promise((resolve, reject) => {
//                 // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
//             }).catch(() => console.log('Oops errors!'));
//         },
//         onCancel() {},
//     });
// }

// 全选
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        // disabled: record.name === 'Joe Black',    // Column configuration not to be checked
    }),
};
class CheckTaskManage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            indeterminate: true,
            checkAll: false,
            visible: false
        };
//表格数据方法
        this.columns = [{
            title: '包名',
            dataIndex: 'name',
            width: '10%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'name', text),
        }, {
            title: '类型',
            dataIndex: 'age',
            width: '10%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'age', text),
        }, {
            title: '指派',
            dataIndex: 'address',
            width: '20%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'address', text),
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const { editable } = this.state.data[index].name;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                  <a onClick={() => this.editDone(index, 'save')}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                                :
                                <span>
                  <a onClick={() => this.edit(index)}>编辑</a>
                </span>
                        }
                    </div>
                );
            },
        },{
            title: '操作',
            dataIndex: 'action',
            // width: '40%',
            render: (text, record,index) => (
                <span>
                  <a href="#" onClick={this.showModal}>指派</a>
                     <Modal
                         title="指派人员"
                         visible={this.state.visible}
                         onOk={this.handleOk}
                         onCancel={this.handleCancel}
                         className="modal"
                     >
                 <AddCheckbox/>
                </Modal>
                  <span className="ant-divider" />
                     <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
                          <a href="#">Delete</a>
                      </Popconfirm>
                  <span className="ant-divider" />
                  <Link to='' className="ant-dropdown-link">
                   查看 <Icon type="down" />
                  </Link>
    </span>
            ),
        }];
        this.state = {
            data: [{
                key: '0',
                name: {
                    editable: false,
                    value: 'Edward King 0',
                },
                age: {
                    editable: false,
                    value: '32',
                },
                address: {
                    value: '',
                },
            },{
                key: '2',
                name: {
                    editable: false,
                    value: 'Edward King 1',
                },
                age: {
                    editable: false,
                    value: '32',
                },
                address: {
                    value: '',
                },
            }],
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    //删除
    onDelete = (index) => {
        // console.log('aaa')
        const dataSource = [...this.state.data];
        dataSource.splice(index, 1);
        this.setState({ dataSource });
    }
    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<EditableCell
            editable={editable}
            value={text}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
        />);
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }
    edit(index) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone(index, type) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }
        });
        this.setState({ data }, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
        });
    }
// Form-搜索
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
 // Form-清除
    handleReset = () => {
        this.props.form.resetFields();
    }
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const children = [];
        for (let i = 0; i < 1; i++) {
            children.push(
                <Col  key={i} style={{  }}>
                    <FormItem {...formItemLayout} label={`搜索`}>
                        {getFieldDecorator(`value`)(
                            <Input placeholder="placeholder" />
                        )}
                    </FormItem>
                </Col>
            );
        }
        return children;
    }

    componentDidMount() {

    };


    render() {
        const { data } = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;
        return (
            <div >
                <Row  type="flex" align="middle" className="content_header">
                    <Col span={4} style={{paddingLeft:'10px'}}>
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 周计划导入
                            </Button>
                        </Upload>

                    </Col>
                    <Col span={18}>
                        <Form
                            className="ant-advanced-search-form"
                            onSubmit={this.handleSearch}
                        >
                            <Row type="flex" justify="start" align="middle">
                                <Col span={16}>
                                   {this.getFields()}
                                </Col>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                        <Button type="primary" htmlType="submit">Search</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            Clear
                                        </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row className='content'>
                    <Table bordered dataSource={dataSource} columns={columns} rowSelection={rowSelection} size="middle"/>
                </Row>
            </div>
        )
    };

}
const FixChecks = Form.create()(CheckTaskManage);
export default FixChecks;