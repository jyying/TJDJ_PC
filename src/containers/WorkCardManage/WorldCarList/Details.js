import './details.css';
import React from 'react';
import { Form, Input,Table,  Select } from 'antd';
import Api from '../../../api/request';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class DetailsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            data: [],
        };

    }

    // 详情显示
    details(){
        Api.post('workPackageInfo/findSubTaskListById',{
            'stlId':this.props.data[0].id,
        }).then(res => {
            this.setState({
                data: res.data,
                loading:false
            });
        });
    }

      action(state){
          if(state == 'T'){
              return <span>有效</span>
          }else if(state == 'F'){
              return <span>无效</span>
          }else if(state == 'D'){
              return <span>删除</span>
          }else if(state=='S'){
              return <span>开始</span>
          }else if(state=='E'){
              return <span>结束</span>
          }else if(state=='F'){
              return <span>失败</span>
          }
}

    componentWillMount(){
        this.details()
    }

    componentDidMount(){

    }

    //将后台返回的时间戳转化为标准的时间格式
    changetime = (time) => {
        const date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        const D = date.getDate();
        return Y+M+D
    };

    render() {
        const {data} = this.state;
        return (
                <div  style={{padding:'8px'}}>
                    <table className="infos">
                        <tbody>
                        <tr>
                            <th >seqNo</th>
                            <td>{data.seqNo}</td>
                        </tr>
                        <tr>
                            <th>itemNo</th>
                            <td>{data.itemNo}</td>
                        </tr>
                        <tr>
                            <th>taskId</th>
                            <td>{data.taskId}</td>
                        </tr>
                        <tr>
                            <th>taskNo</th>
                            <td>{data.taskNo}</td>
                        </tr>
                        <tr>
                            <th>subTaskId</th>
                            <td>{data.subTaskId}</td>
                        </tr>
                        <tr>
                            <th>subTaskNo</th>
                            <td>{data.subTaskNo}</td>
                        </tr>
                        <tr>
                        <th>revision</th>
                        <td>{data.revision}</td>
                    </tr>
                        <tr>
                            <th>mcdRev</th>
                            <td>{data.mcdRev}</td>
                        </tr>
                        <tr>
                            <th>skill</th>
                            <td>{data.skill}</td>
                        </tr>
                        <tr>
                        <th>workArea</th>
                        <td>{data.workArea}</td>
                    </tr>
                        <tr>
                            <th>content</th>
                            <td>{data.content}</td>
                        </tr>
                        <tr>
                            <th>threshold</th>
                            <td>{data.threshold}</td>
                        </tr>  <tr>
                        <th>manHours</th>
                        <td>{data.manHours}</td>
                    </tr>
                        <tr>
                            <th>taskType</th>
                            <td>{data.taskType}</td>
                        </tr>
                        <tr>
                            <th>remark</th>
                            <td>{data.remark}</td>
                        </tr>
                        <tr>
                            <th>actualHour</th>
                            <td>{data.actualHour}</td>
                        </tr>
                        <tr>
                            <th>synchroTime</th>
                            <td>{this.changetime(data.synchroTime)}</td>
                        </tr>
                        <tr>
                            <th>listState</th>
                            <td>{this.action(data.listState)}</td>
                        </tr>
                        <tr>
                            <th>updateBy</th>
                            <td>{data.updateBy}</td>
                        </tr>
                        <tr>
                            <th>updateName</th>
                            <td>{data.updateName}</td>
                        </tr>
                        <tr>
                            <th>updateTime</th>
                            <td>{this.changetime(data.updateTime)}</td>
                        </tr>
                        <tr>
                            <th>executeBy</th>
                            <td>{data.executeBy}</td>
                        </tr>
                        <tr>
                            <th>executeStartTime</th>
                            <td>{this.changetime(data.executeStartTime)}</td>
                        </tr>
                        <tr>
                            <th>executeEndTime</th>
                            <td>{this.changetime(data.executeEndTime)}</td>
                        </tr>
                        <tr>
                            <th>executeStatus</th>
                            <td>{this.action(data.executeStatus)}</td>
                        </tr>
                        <tr>
                            <th>executeRemark</th>
                            <td>{data.executeRemark}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
        )
    }

}

const Details = Form.create()(DetailsList);
export default Details;
