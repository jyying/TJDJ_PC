
import React from 'react';
import {
    Form,
    Table,
    Row,
    Col,Button,message
} from 'antd';

import Api from '../../../api/request';
import Pagination from '../../../components/Pagination/index';



let modalKey = 0;   //  用于重置modal



 class TaskDayPlanFind extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tableLoading:true,
            updateState:false,
            page:{},
            pageNow:1,
            loading: false,
            selectedRowKeys: [],
        };
        this.columns = [{
            title: 'executeTime',
            dataIndex: 'executeTime',
            key: 'executeTime',
            render:(text,record) => {
                const time = this.changetime(record.executeTime);
                return <span>{time}</span>
            }
        }, {
            title: 'empArrangeState',
            dataIndex: 'empArrangeState',
            key: 'empArrangeState',
        },{
            title: 'wwpWorkInfo',
            dataIndex: 'wwpWorkInfo',
            key: 'wwpWorkInfo'
        },{
            title: 'wwpCommandNo',
            dataIndex: 'wwpCommandNo',
            key: 'wwpCommandNo'
        }
        ]
    }

// 工卡安排02工作包查询所属工作日计划
componentWillMount () {
    const value=this.props.wwpdata;//工作包ID
    const  valueStlId=this.props.TaskDayPlans;
     // console.log(valueStlId);
    Api.post('weekWorkPackageTask/findWwpaBywwpId',{
        'wwpId':value.id,
    }).then(res=>{
    // console.log(res.data);
    //     已被安排的工作日
        let newSelectedRowKeys = [];
        for(let i=0;i<res.data.length;i++){
            if(res.data[i].executeTime==valueStlId.executeTime){
                newSelectedRowKeys.push(res.data[i].id);
            }
        }
        this.setState({
            data:res? res.data:[],
            page:res.pageInfo,
            tableLoading:false,
            selectedRowKeys:newSelectedRowKeys
        });

        })
}
//将后台返回的时间戳转化为标准的时间格式
     changetime = (time) => {
         const date = new Date(time);
         const Y = date.getFullYear() + '-';
         const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
         const D = date.getDate();
         return Y+M+D
     };


// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
    };


// 分页查询'pageNow':pageNumber,
   onChange = (pageNumber) => {
       const value=this.props.wwpdata;//工作包ID
       Api.post('weekWorkPackageTask/findWwpaBywwpId',{
           'wwpId':value.id,
           'pageNow':pageNumber,
       }).then(res=>{
           // 已被安排的工作日
           // let newSelectedRowKeys = [];
           // for(let i=0;i<res.data.length;i++){
           //     if(res.data[i].checkState=='T'){
           //         newSelectedRowKeys.push(res.data[i].id);
           //     }
           // }
           this.setState({
               data:res? res.data:[],
               page:res.pageInfo,
               tableLoading:false,
               // selectedRowKeys:newSelectedRowKeys
           });

       })
    };

    // 监听工作日是否被选中
    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys});
    };

    // 工卡保存
    save = () => {
        const value=this.props.wwpdata;//工作包ID
        const  valueStlId=this.props.TaskDayPlans;//工卡ID
        // console.log(valueStlId.stlId);
        //  console.log(value.id);
        const empManagerIds = this.state.selectedRowKeys;
        // console.log('empManagerIds',empManagerIds);
        this.props.form.validateFieldsAndScroll((err, values) => {
            //    人员类型
            Api.post('weekWorkPackageTask/saveSubTaskListArrange',{'wwpId':value.id,
                'wwpaId':empManagerIds,
                'stlIds':valueStlId.stlId,
            }).then(res=>{
                // console.log(res);
                if(res.errorCode=='0'){
                    message.success('保存成功！');

                }else{
                    message.error('保存失败！');
                }
            })

        });
    };


    render(){
        const {  selectedRowKeys } = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,

        };
        const count = this.state.expand ? 10 : 6;
        const columns = this.columns;
        const { data ,tableLoading,page,pageNow} = this.state;
        modalKey++;
        return(
            <div>
                <div className="content">
                    <Row  type="flex" justify="end">
                        <Col span={6} style={{marginBottom:'10px'}}>
                            <Button type="primary" onClick={this.save}>保存</Button>
                        </Col>
                    </Row>

                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false} rowSelection={rowSelection}/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const TaskDayPlanFinds = Form.create()(TaskDayPlanFind);
export default TaskDayPlanFinds;


