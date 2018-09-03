import './index.css'
import React from 'react';
import {
    Form,
    Input,
    Button,
    Table,
    Icon,
    DatePicker,
    Select,
    message,
} from 'antd';
import {  Row, Col} from 'antd';
import Api from '../../../api/request';
import { Tabs } from 'antd';
import moment from 'moment';
// import Pagination from '../../../components/Pagination';
let modalKey = 1;
const h=document.body.clientHeight;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


// 生产线人员安排查询
class BattlelineEmployeeArrange extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tableLoading:true,
            tableLoad:true,
            tableLoad1:true,
            datas:[],
            Selected:'',
            Selected1:'',
            value:[],
            empAdjustments:''
        };

        this.columns = [{
            title: '机号',
            dataIndex: 'airplaneRegNo',
            key: 'airplaneRegNo',
            width: 87,
        }, {
            title: '维修工作',
            dataIndex: 'workInfo',
            key: 'workInfo',
            width: 200,
            className:'table_workInfo',
            render:(text,record) => {
                return <div title={record.workInfo}>{record.workInfo}</div>
            }
        }, {
            title: '指令号',
            dataIndex: 'commandNo',
            key: 'commandNo',
            width: 87,
        },{
            title: '执行开始日期',
            dataIndex: 'executeStartTime',
            key: 'executeStartTime',
            render:(text,record) => {
                const time = this.changetime(record.executeStartTime);
                return <span>{time}</span>
            },
            width: 60,
        }, {
            title: '执行结束日期',
            dataIndex: 'executeEndTime',
            key: 'executeEndTime',
            render:(text,record) => {
                const time = this.changetime(record.executeEndTime);
                return <span>{time}</span>
            },
            width: 90,
        },{
            title: '进场时间',
            dataIndex: 'goInAirportTime',
            key: 'goInAirportTime',
            width: 90,
        }, {
            title: '机位',
            dataIndex: 'standName',
            key: 'standName',
            width: 90,
        }, {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
            width: 90,
        }, {
            title: '生产线经理',
            dataIndex: 'empMNames',
            key: 'empMNames',
            width: 91,
        }, {
            title: '跟线员',
            dataIndex: 'empENames',
            key: 'empENames',
            width: 91,
        },{
            title: '总工时',
            dataIndex: 'totalWorkingHours',
            key: 'totalWorkingHours',
            width: 91,
        },{
            title: '试车员',
            dataIndex: 'testpilotManName',
            key: 'testpilotManName',
            width: 91,
        },{
            title: '观察员',
            dataIndex: 'observerManName',
            key: 'observerManName',
            width: 91,
        }];

    }


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
        this.props.form.validateFields(['executeDate'],(err, values) => {
            if(values.executeDate!=null){
                Api.post('battlelineEmployeeArrange/findWeekWorkPackageByWwpa',{
                    'executeDate':values.executeDate.format('YYYY-MM-DD'),
                }).then(res=>{
                    // console.log(res.data);
                    this.setState({
                        tableLoading:false,
                        data:res.data!=null? res.data.tjRcWeekWorkPackageListReturn:[],
                        datas:res.data!=null? res.data.workDayArrEmpListMap:{},
                    });
                })
            }else {
                this.setState({
                    tableLoading:false,
                    data:[],
                });
                message.warning('未选择任何时间')
            }


        });

    };
// 多条件查询
    handleSearch = (e) => {
        e.preventDefault();
      this.update();
    };

    // 人员调整
    InputSave = (e,record) => {
        this.props.form.validateFields([e.id+'empAdjustments'],(err, values) => {
            console.log('values',values[e.id+'empAdjustments']);
            if(values[e.id+'empAdjustments']!=null){
                Api.post('battlelineEmployeeArrange/updateWwpArrangeEmpAdjustments',{
                    'wwpaId':e.wwpaId,
                    'empAdjustments':values[e.id+'empAdjustments'],
                }).then(res=>{
                    if(res.errorCode == 0) {
                        message.success('保存成功！');
                        this.update();
                        this.setState({
                            empAdjustments:values.empAdjustments,
                        });
                    }else {
                        message.error('！！！保存失败');
                    }
                })
            }else {
                message.warning('你未输入任何内容');
            }


        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    Dates=()=>{
        let now = new Date().getTime();
        let tomorrow = new Date(Number(now) + 24 * 3600 * 1000);
        let year = tomorrow.getFullYear();
        let month = tomorrow.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = tomorrow.getDate();
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day;
    };


    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const formItemLayout1 = {
            labelCol: { span: 3},
            wrapperCol: { span: 21 },
        };
        const columns = this.columns;
        const {data ,tableLoading,datas} = this.state;
        const dateFormat = 'YYYY-MM-DD';
        let a = Object.entries(datas);
        modalKey++;
        return(
            <div>
                <div className="header work-package">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="多条件查询" key="1"></TabPane>
                    </Tabs>

                    <Form

                        onSubmit={this.handleSearch}
                    >
                        <Row gutter={40}>
                            <Col span={8} key={1}>
                                <FormItem {...formItemLayout} label={`工作日时间`}>
                                    {getFieldDecorator(`executeDate`,{
                                        initialValue:moment(this.Dates(), dateFormat),
                                    })(
                                        <DatePicker placeholder=""/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={5} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit"><Icon type="search" style={{color: '#fff' }} />查询</Button>
                            </Col>
                        </Row>
                        {/*<Row>*/}
                            {/*<Col span={24} style={{ textAlign: 'right' }}>*/}
                                {/*<Button type="primary" htmlType="submit">查询</Button>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                    </Form>
                </div>
                <div className="content">

                         <Table rowKey='id'
                                  loading={tableLoading}
                                  columns={columns}
                                  dataSource={data?data:''}
                                  pagination={false}
                                  expandedRowRender={record =>
                                      <div>
                                      <p style={{textAlign:'left',}}><span style={{marginRight:'10px',fontWeight:800}}>人员安排：</span>
                                          {
                                      record.wwpWwpaEmpList.map((s,v)=>
                                          <span key={v} style={{marginRight:'10px',color:s.empArrColor=='YELLOW'?'#fda101':s.empArrColor}}>{s.empName}</span>
                                      )
                                  }
                                  </p>
                                       <Form>
                                           <Row gutter={40} className='BattleLine' >
                                               <Col span={18} key={2}>
                                                   <FormItem {...formItemLayout1} label={`人员调整:`} className='empAdjustments'>
                                                       {getFieldDecorator(`${record.id}empAdjustments`,{
                                                           initialValue:record.empAdjustments,
                                                       })(
                                                           <Input placeholder="" />
                                                       )}
                                                   </FormItem>
                                               </Col>
                                               <Col span={2} key={3}>
                                                   {/*<Button  onClick={this.handleReset}>*/}
                                                       {/*重置*/}
                                                   {/*</Button>*/}
                                                   <Button type="primary" htmlType="submit" onClick={()=>this.InputSave(record)}>保存</Button>
                                               </Col>
                                           </Row>
                                       </Form>
                                   </div>
                                  }
                                  footer={ () =>
                                      <div>
                                          <div>
                                              {
                                                  a.map((s,v)=>
                                                      <div key={v} style={{marginBottom:'10px'}}>
                                                          <span style={{marginRight:'10px',fontWeight:800,display:s?'inline-block':'none'}}>{s[0]}:</span>
                                                          {
                                                              s[1].map((n,m)=>
                                                              <span key={m} style={{marginRight:'10px'}}>
                                                                  <span  style={{color:n.empArrColor=='YELLOW'?'#fda101':n.empArrColor}}>{n.empName}</span>
                                                                  <span style={{display:n.remark!=null?'inline-block':'none'}}>({n.remark})</span>
                                                              </span>

                                                              )
                                                          }
                                                      </div>
                                                  )
                                              }
                                          </div>
                                          <div style={{marginTop:'20px',borderTop:'1px dashed'}}>说明：&nbsp;&nbsp;&nbsp;&nbsp;黑色为技术员，蓝色为机械员，黄色为PTR</div>
                                      </div>
                                  }
                                  bordered
                                size="middle"
                                scroll={{ x: 1300,y:h>900?450:350 }}
                                className='table'
                        />


                </div>
            </div>
        )
    }
}
const BattlelineEmployeeArranges = Form.create()(BattlelineEmployeeArrange);
export default BattlelineEmployeeArranges;


