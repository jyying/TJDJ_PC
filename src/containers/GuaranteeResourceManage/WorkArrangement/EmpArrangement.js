import './index.css';
import React from 'react';
import {
    Table,Popconfirm,message,Input,Button,Icon
} from 'antd';

import Api from '../../../api/request';


class EmpArrangement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading:true,
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
        };

    }


    // 员工删除
    confirm=(e)=> {
        const value=this.props.Emp;
        Api.post('weekWorkPackageEmployee/wwpEmpSchedulingByWwp',{
            'wwpId':value.wwpId,
            'wwpaId':value.id,
            'pdState':'D',
            'workType':'',
            'employeeIds':e.id,
            'remark':e.remark
        }).then(res=>{
            // console.log(res);
            if(res.errorCode=='0'){
                message.success('删除成功！');
        this.componentWillMount();
            }else{
                message.error('删除失败！');
            }
        })
    };

    cancel=(e)=> {

    };

    componentWillMount () {
        const value=this.props.Emp;
        // console.log('cc',value);
        Api.post('weekWorkPackageEmployee/findEmpByWwpaIdOrWorkday',{
            'wwpWdType':'P',
            'wwpaId':value.id,
        }).then(res=>{
            // const empdata2=[];
            // // console.log('res',res.data);
            // for(let i=0;i<res.data.length;i++){
            //     empdata2.push(res.data[i].empName);
            // }
            this.setState({
                data:res? res.data:[],
                loading:false,
                // empdata2:empdata2
            });

        });
        // Api.post('weekWorkPackageEmployee/findEmpByWwpaIdOrWorkday',{
        //     'wwpWdType':'D',
        //     'arrangeDate':this.changetime(value.executeTime),
        // }).then(res=>{
        //     // console.log(res.data);
        //     const empdata3=[];
        //     // console.log('res',res.data);
        //     for(let i=0;i<res.data.length;i++){
        //         empdata3.push(res.data[i].empName);
        //     }
        //     this.setState({
        //         empdata3:empdata3
        //     });
        //
        // })
    }
//将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D =(date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D
    };

    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    };
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            data: this.state.data.map((record) => {
                const match = record.empName.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.empName.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    };


    render(){
      const  columns = [ {
            title: '序号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (text, record,index) => (
                <div>
                    <span>{index+1}</span>
                </div>
            ),
        },
            {
                title: '姓名',
                dataIndex: 'empName',
                key: 'empName',
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="Search name"
                            value={this.state.searchText}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" onClick={this.onSearch}><Icon type="search" style={{color: '#fff' }} />查询</Button>
                    </div>
                ),
                filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.filterDropdownVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        filterDropdownVisible: visible,
                    }, () => this.searchInput.focus());
                },
            }, {
                title: 'E账号',
                dataIndex: 'empEaccount',
                key: 'empEaccount',
            }, {
                title: '部门',
                dataIndex: 'empDepartment',
                key: 'empDepartment',
            }, {
                title: '分线',
                dataIndex: 'empBattleLineName',
                key: 'empBattleLineName',
            }, {
                title: '专业',
                dataIndex: 'empSpecialty',
                key: 'empSpecialty',
                // }, {
                //     title: '备注',
                //     dataIndex: 'remark',
                //     key: 'remark',
            }, {
                title: '操作',
                key: 'action',
                render: (text, record,index) => (
                    <span >
                        <Popconfirm title="确认要删除此条信息吗?" onConfirm={()=>this.confirm(record)} onCancel={this.cancel} okText="确认" cancelText="取消"><a style={{color:'#e60012'}}>删除</a></Popconfirm>
                   </span>
                ),

            }];
        // const columns = this.columns;
        const { data } = this.state;
        return(
            <div>
                <div className="content">
                   {/*<div>*/}
                       {/*<span>工作包人员安排：</span><span>{this.state.empdata2}</span>*/}
                   {/*</div>*/}
                    {/*<div>*/}
                        {/*<span>工作日计划人员安排：</span><span>{this.state.empdata3}</span>*/}
                    {/*</div>*/}
                    <Table  columns={columns} dataSource={data} pagination={false} rowKey='id' loading={this.state.loading} bordered size="middle"/>
                </div>
            </div>
        )
    }
}

export default EmpArrangement;


