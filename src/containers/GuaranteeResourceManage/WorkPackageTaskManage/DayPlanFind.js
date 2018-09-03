
import React from 'react';
import {
    Form,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    message,
} from 'antd';

import Api from '../../../api/request';
import { Tabs } from 'antd';
import Pagination from '../../../components/Pagination/index';
import EmpArrangement from './EmpArrangement';
const {RangePicker} = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

let modalKey = 0;   //  用于重置modal

// 工作包管理
 class DayPlan extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            EmpArrangementVisible:false,
            data: [],
            tableLoading:true,
            updateState:false,
            page:{},
            pageNow:1,
            loading: false,
            FirstEmp:[],
            Emp:false
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
            title: 'checkState',
            dataIndex: 'checkState',
            key: 'checkState',
        },{
            title: 'checkByName',
            dataIndex: 'checkByName',
            key: 'checkByName',
        },{
            title: 'checkTime',
            dataIndex: 'checkTime',
            key: 'checkTime',
            render:(text,record) => {
                const time =record.checkTime!=null? this.changetime(record.checkTime):'';
                return <span>{time}</span>
            }
        },{
            title: 'wwpWorkInfo',
            dataIndex: 'wwpWorkInfo',
            key: 'wwpWorkInfo'
        }, {
            title: 'wwpCommandNo',
            dataIndex: 'wwpCommandNo',
            key: 'wwpCommandNo',
        },
            {
            title: '操作',
            key: 'action',
            render: (text, record,index) => {
                return (
                    <span className="action">
                           <a onClick={()=>this.EmpArrangement(record)}>人员安排查看</a>
                     </span>
                )
            },
        }
        ]
    }

// 人员安排查看
    EmpArrangement = (record) => {
        // console.log(record.wwpId);
        let Emp = false;
        if(record.id) {
            Emp = record;
        }
        this.setState({
            Emp:Emp,
            EmpArrangementVisible: true
        });
    };
    EmpArrangementCancel = () => {
        this.setState({
            EmpArrangementVisible:false
        });

    };

componentWillMount () {
const value=this.props.DayPlans;
     // console.log(value.id);
    Api.post('weekWorkPackageEmployee/findWwpaBywwpId',{
        'wwpId':value.id,
    }).then(res=>{
    // console.log(res.data);
        this.setState({
            data:res? res.data:[],
            page:res.pageInfo,
            tableLoading:false
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




// 生产线经理查询所属他的工作包日计划
    handleSearch = (e) => {
        e.preventDefault();
        // this.update();
        this.props.form.validateFields(['executeTime'],(err, values) => {
               // console.log(values.executeTime);
            Api.post('weekWorkPackageEmployee/findWwpaByWorkDay',{
                'pageNow':this.state.pageNow,
                'executeStartTime':values.executeTime?values.executeTime[0].format('YYYY-MM-DD'):'',
                'executeEndTime':values.executeTime?values.executeTime[1].format('YYYY-MM-DD'):'',
            }).then(res=>{
                this.setState({
                    data:res? res.data:[],
                    page:res.pageInfo
                });
            })
        });
    };
// 清除多条件查询内容
    handleReset = () => {
        this.props.form.resetFields();
    };


// 分页查询
   onChange = (pageNumber) => {
        // console.log('Page: ', pageNumber);
       this.props.form.validateFields(['executeTime'],(err, values) => {
           // console.log('Received values of form: ', values.executeTime.format('YYYY-MM-DD'));
           Api.post('weekWorkPackageEmployee/findWwpaByEmpManager',{
               'pageNow':pageNumber,
               'executeEndTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
               'executeStartTime':values.executeTime?values.executeTime.format('YYYY-MM-DD'):'',
           }).then(res=>{
               this.setState({
                   data:res? res.data:[],
                   page:res.pageInfo
               });
           })
       });
    };



    render(){
        const columns = this.columns;
        const { data ,tableLoading,page,pageNow,EmpArrangementVisible} = this.state;
        modalKey++;
        return(
            <div>
                <div className="content">
                    <Modal
                        title="人员安排"
                        visible={EmpArrangementVisible}
                        onCancel={this.EmpArrangementCancel}
                        onOk={this.handleOk}
                        maskClosable={false}
                        footer={null}
                        key={`${modalKey}key5`}
                        width="50%"
                    >
                        <EmpArrangement  Emp={this.state.Emp}/>
                    </Modal>

                    <Table rowKey='id' loading={tableLoading} columns={columns} dataSource={data} pagination={false}/>
                    <Pagination
                        {...page}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}
const DayPlans = Form.create()(DayPlan);
export default DayPlans;


