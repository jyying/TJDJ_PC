import React from 'react';
import {Form, Table    } from 'antd';
import Api from '../../../api/request';
import Paginations from '../../../components/Pagination';




class AirMaterielLocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            data: [],
            searchCriteria:{},
            page:{},
            pageNow:1
        };
        this.columns = [
            {
                title:'序号',
                dataIndex:'seqno',
                key:'seqno'
            },
            {
                title: '件号',
                dataIndex: 'pn',
                key: 'pn'
            }, {
                title: '批次号',
                dataIndex: 'bn',
                key: 'bn'
            }, {
                title: '库房',
                dataIndex: 'stock',
                key: 'stock'
            }, {
                title: '架位',
                dataIndex: 'location',
                key: 'location'
            }, {
                title: '锁定数',
                dataIndex: 'reserved_qty',
                key: 'reserved_qty'
            }, {
                title: '发料数',
                dataIndex: 'issued_qty',
                key: 'issued_qty'
            }, {
                title: '退料数',
                dataIndex: 'returned_qty',
                key: 'returned_qty'
            }, {
                title: '所有者',
                dataIndex: 'owner',
                key: 'owner'
            }];
    }
    componentDidMount(){
        this.setState({
            loading:true
        });
        console.log(this.props.data[0]);
        Api.post('workPackageInfo/findLockInformation',{
            'orderId':this.props.data[0].orderId,
            'pnNo':this.props.data[0].pnNo,
            'equipmentType':this.props.data[0].equipmentType,
            'itemNo':this.props.data[0].itemNo
        }).then(res => {
            // if(res.errorCode == 0) {
                this.setState({
                    data: res ? res.data : [],
                    loading: false,
                    page: res.pageInfo
                });
            // }
            //console.log(res.data[0].pn);
        });
    }

    // 分页查询
    onChange = (pageNumber) => {
        let values = this.state.searchCriteria;
        values.pageNow = pageNumber;
        console.log(values);
        Api.post('workPackageInfo/findLockInformation',values).then(res=>{
            if(res.errorCode == 0) {
                this.setState({
                    data: res.data,
                    loading:false,
                    pageNow:pageNumber
                });
            }
        })
    };


    render() {
        const columns = this.columns;
        const {data,page}=this.state;

        return (
            <div>
                <Table columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle"/>
                <Paginations
                    {...page}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}
const AirMaterielLock = Form.create()(AirMaterielLocks);
export default AirMaterielLock;
