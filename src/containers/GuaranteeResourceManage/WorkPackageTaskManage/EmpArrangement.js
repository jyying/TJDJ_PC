import React from 'react';
import {

} from 'antd';

import Api from '../../../api/request';


class EmpArrangement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };

    }



    componentWillMount () {
        const value=this.props.Emp;
        // console.log(this.changetime(value.executeTime));
        Api.post('weekWorkPackageEmployee/findEmpByWwpaIdOrWorkday',{
            'wwpWdType':'P',
            'wwpaId':value.id,
        }).then(res=>{
            // console.log(res.data);
            const empdata2=[];
            // console.log('res',res.data);
            for(let i=0;i<res.data.length;i++){
                empdata2.push(res.data[i].empName);
            }
            this.setState({
                empdata2:empdata2
            });

        });
        Api.post('weekWorkPackageEmployee/findEmpByWwpaIdOrWorkday',{
            'wwpWdType':'D',
            'arrangeDate':this.changetime(value.executeTime),
        }).then(res=>{
            // console.log(res.data);
            const empdata3=[];
            // console.log('res',res.data);
            for(let i=0;i<res.data.length;i++){
                empdata3.push(res.data[i].empName);
            }
            this.setState({
                empdata3:empdata3
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



    render(){

        return(
            <div>
                <div className="content">
                   <div>
                       <span>工作包人员安排：</span><span>{this.state.empdata2}</span>
                   </div>
                    <div>
                        <span>工作日计划人员安排：</span><span>{this.state.empdata3}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default EmpArrangement;


