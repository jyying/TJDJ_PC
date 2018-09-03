import './index.css'
import React from 'react';
import {Form, Input, Button, Table, Popconfirm, Icon, message,Tabs,Modal} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import Pagination from '../../../components/Pagination';
import AddList from './AddList';
import UpdateList from './UpdateList';
import Handling from './Handling';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import { DatePicker } from 'antd';
import moment from 'moment';

// 可编辑表格
class EditableCell extends React.Component {
    state = {
        value: this.props.value,
        editable: true,
    };
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    };
    check = () => {
        console.log('record',this.props.record);
        const records=this.props.record;
        this.setState({ editable: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
        console.log('check',this.state.value);
        // if(this.state.value!=null){
        //     Api.post('weekWorkPackageEmployee/saveOrUpdateGoInAirPortTime',{
        //         'goInAirPortTime':this.state.value,
        //         'wwpaId':records.id,
        //     }).then(res=>{
        //         console.log(res);
        //         if(res.errorCode=='0'){
        //             message.success('保存成功！');
        //         }else{
        //             message.error('保存失败！');
        //         }
        //     })
        // }

    };
    edit = () => {
        this.setState({ editable: true });
    };
    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input
                                value={value}
                                onChange={this.handleChange}
                                onPressEnter={this.check}
                                type="textarea"
                                rows={1}
                            />
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}


// 值班交接表
class DutyConnectList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            tableLoading:false,
            tableLoad:true,
            tableLoad1:true,
            page:{},
            count: 1,
            selectedRowKeys: [],
            pageNow:1,
            update:false,
            timeData:'',
            dUpdate:false,
            handlingDate:false,
            visible:false,
            visible1:false,
        };

        this.columns = [{
            title: '序号',
            dataIndex: 'seqNo',
            // render:(text,record,index) => (
            //     <div>
            //         <span>{index+1}</span>
            //     </div>
            // )
        }, {
            title: '交接事项',
            dataIndex: 'handoverInfo',
            width: '10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.handoverInfo}>{record.handoverInfo}</div>
            }
        },{
            title: '记录人',
            dataIndex: 'createName',
            // render: (text, record) => (
            //     <EditableCell
            //         value={record.c}
            //         onChange={this.onCellChange(record.key, 'c')}
            //     />
            // ),
        },{
            title: '记录日期',
            dataIndex: 'createTime',
            render:(text,record) => {
                const time = this.changetime(record.createTime);
                return <span>{time}</span>
            }
            // render: (text, record) => (
            //     <EditableCell
            //         value={record.d}
            //         onChange={this.onCellChange(record.key, 'd')}
            //     />
            // ),
        }, {
            title: '处理过程及结果',
            dataIndex: 'processResult',
            width: '10%',
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.processResult}>{record.processResult}</div>
            }
        },{
            title: '经手控制员',
            dataIndex: 'processByName',
            // render: (text, record) => (
            //     <EditableCell
            //         value={record.f}
            //         onChange={this.onCellChange(record.key, 'f')}
            //     />
            // ),
        },{
            title: '处理日期',
            dataIndex: 'processTime',
            render:(text,record) => {
                const time = record.processTime!==null?this.changetime(record.processTime):'';
                return <span>{time}</span>
            }
            // render: (text, record) => (
            //     <EditableCell
            //         value={record.g}
            //         onChange={this.onCellChange(record.key, 'g')}
            //     />
            // ),
        }, {
            title: '操作',
            render: (text, record,index) => (
                <span>
                    <a  onClick={()=>this.handling(record)}>处理</a>
                    <span className="ant-divider" />
                    <a  onClick={()=>this.UpdateDate(record)}>修改</a>
                    <span className="ant-divider" />
                    <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.delete(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'red'}}>删除</a></Popconfirm>
                 </span>
            ),
        }];
    }

    // 删除
    delete=(e)=> {
        console.log('e',e);
        Api.post('workHandover/addOrUpdate',{
            whoId:e.id,
            seqNo:e.seqNo,
            handoverInfo:e.handoverInfo,
            state:'D',
        }).then(res => {
            console.log('res',res);
            if(res.errorCode == 0) {
                message.success('删除成功！');
                this.update();
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel=(e)=> {

    };
    // 处理过程及结果
    handling = (record) => {
        let handlingDate = false;
        if(record.id) {
            handlingDate = record;
        }
        this.setState({
            visible1: true,
            handlingDate:handlingDate
        });

    };
    handlingCancel = () => {
        this.update();
        this.setState({
            visible1: false,
        });
    };


    // 表格数据修改
    UpdateDate = (record) => {
        let dUpdate = false;
        if(record.id) {
            dUpdate = record;
        }
        this.setState({
            visible: true,
            dUpdate:dUpdate
        });

    };
    handleCancel = () => {
        this.update();
        this.setState({
            visible: false,
        });
    };
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    componentDidMount () {
        this.update();

    }

    // 更新页面数据
    update(){
        this.setState({
            tableLoading:true,
        });
        this.props.form.validateFields((err, values) => {
            Api.post('workHandover/findWorkHandoverByCondition',{
                'handOverDate':values.handOverDate.format('YYYY-MM-DD'),
                'pageNow':this.state.pageNow,
            }).then(res=>{
                this.setState({
                    tableLoading:false,
                    dataSource:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });


    };

    handleReset = () => {
        this.props.form.resetFields();
    };


    callback=(key)=> {
    console.log(key);
};
 // 表格数据提交
    SaveDate=(e)=>{

        console.log('e',e);
        // e.preventDefault();
        // this.props.form.validateFields((err, values) => {
        //     console.log(values);
        // })
    };
    onCellChange = (key, dataIndex) => {
        return (value) => {
            const dataSource = [...this.state.dataSource];
            const target = dataSource.find(item => item.key === key);
            if (target) {
                target[dataIndex] = value;
                this.setState({ dataSource });

            }
            console.log('dataSource',dataSource);
        };
    };
    // 新增交接事项
    handleAdd = () => {
        // const { count, dataSource } = this.state;
        // const newData = {
        //     key: count,
        //     b: ``,
        //     c: ``,
        //     d: ``,
        //     e: ``,
        //     f: ``,
        //     g: ``,
        // };
        // this.setState({
        //     dataSource: [...dataSource, newData],
        //     count: count + 1,
        // });
        this.setState({
            update: true,
        });
    };
    handleCancelAdd = () => {
        // console.log(e);
        this.update();
        this.setState({
            update:false
        });
    };
    onOk=(value)=>{
        const timeData=value.format('YYYY-MM-DD');
        Api.post('workHandover/findWorkHandoverByCondition',{
            'handOverDate':timeData,
            'pageNow':this.state.pageNow,
        }).then(res=>{
            this.setState({
                tableLoading:false,
                timeData:timeData,
                dataSource:res? res.data:[],
                page:res.pageInfo,
            });

        })
    };
// 分页查询
    onChange1 = (pageNumber) => {
        console.log('Page: ', pageNumber,this.state.timeData);
        this.props.form.validateFields((err, values) => {
            Api.post('workHandover/findWorkHandoverByCondition',{
                'handOverDate':this.state.timeData,
                'pageNow':pageNumber
            }).then(res=>{
                this.setState({
                    dataSource:res? res.data:[],
                    page:res.pageInfo,
                });
            })
        });
    };
    onChange=(date, dateString)=>{
       //  const time=e.format('YYYY-MM-DD');
       // console.log(time);
    };
    // 选中行
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };

    render(){
        const {  selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const columns = this.columns;
        const {dataSource ,visible,visible1,tableLoading,page,dUpdate,handlingDate} = this.state;
        modalKey++;
        const dateFormat = 'YYYY-MM-DD';
        const d = new Date();
        return(
                <div className="content" >

                    <div style={{float: 'left'}}>
                        {/*<Button  className="editable-add-btn btn_reload" onClick={this.SaveDate} ><Icon type="save" style={{color: '#108ee9' }} />保存</Button>*/}
                        <Button className="editable-add-btn btn_reload" onClick={this.handleAdd} style={{marginRight:'10px' }}><Icon type="plus" style={{color: '#108ee9' }} />新增</Button>

                    </div>
                    <Modal
                        title="新建"
                        visible={this.state.update}
                        onCancel={this.handleCancelAdd}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}a`}
                    >
                        <AddList onCancel={this.handleCancelAdd}/>
                    </Modal>
                    <Modal
                        title="修改"
                        visible={visible}
                        onCancel={this.handleCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}b`}
                    >
                        <UpdateList dUpdate={dUpdate} onCancel={this.handleCancel}/>
                    </Modal>
                    <Modal
                        title="处理"
                        visible={visible1}
                        onCancel={this.handlingCancel}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}c`}
                    >
                        <Handling handlingDate={handlingDate} onCancel={this.handlingCancel}/>
                    </Modal>
                    <Table bordered dataSource={dataSource} columns={columns} style={{clear:'both'}} loading={tableLoading} rowKey='id' pagination={false} size="middle" className='table'
                           title={() => <div className="dataPicker">
                               {getFieldDecorator(`handOverDate`,{
                                   rules: [{ required: true, message: '日期不能为空!' }],
                                   initialValue:moment(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(), dateFormat),
                               })(
                                   <DatePicker onChange={this.onChange} onOk={this.onOk} format="YYYY-MM-DD" showTime/>
                               )}
                               {/*<DatePicker onChange={this.onChange} onOk={this.onOk} format="YYYY-MM-DD" showTime/>*/}
                           </div>}
                    />
                    <Pagination
                        {...page}
                        onChange={this.onChange1}
                    />
                </div>

        )
    }
}
const DutyConnectLists = Form.create()(DutyConnectList);
export default DutyConnectLists;


