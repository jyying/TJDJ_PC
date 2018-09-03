/**
 * Created by 王某 on 2017/8/21.
 */
import React from 'react';
import { Form, Table, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message,DatePicker  } from 'antd';
const FormItem = Form.Item;
import Api from '../../../api/request';


const residences = [{
    value: 'T',
    label: '有效',
}, {
    value: 'F',
    label: '无效',
}];

class AirMaterielStocks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            confirmDirty: false,
            autoCompleteResult: [],
            airplaneCtaDate:'',
            airplaneDeliveryDate:'',
            loading:true,
        };
        this.columns = [
            {
                title:'件号',
                dataIndex:'pn',
                key:'pn'
            },
            {
                title:'序号',
                dataIndex:'sn',
                key:'sn'
            },
            {
                title: '库房',
                dataIndex: 'stock',
                key: 'stock'
            }, {
                title: '架位',
                dataIndex: 'location',
                key: 'location'
            }, {
                title: '数量',
                dataIndex: 'qty',
                key: 'qty'
            }, {
                title: '所有者',
                dataIndex: 'owner',
                key: 'owner'
            }];
    }
    // state = {
    //     confirmDirty: false,
    //     autoCompleteResult: [],
    //     airplaneCtaDate:'',
    //     airplaneDeliveryDate:''
    // };
    // handleConfirmBlur = (e) => {
    //     const value = e.target.value;
    //     this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // };
    //
    // checkConfirm = (rule, value, callback) => {
    //     const form = this.props.form;
    //     if (value && this.state.confirmDirty) {
    //         form.validateFields(['confirm'], { force: true });
    //     }
    //     callback();
    // };
    //
    // handleWebsiteChange = (value) => {
    //     let autoCompleteResult;
    //     if (!value) {
    //         autoCompleteResult = [];
    //     } else {
    //         autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    //     }
    //     this.setState({ autoCompleteResult });
    // };

    componentDidMount(){
        // console.log(this.props.data[0]);
        Api.post('workPackageInfo/findInventoryInformation',{
            'pnNo':this.props.data[0].pnNo
        }).then(res => {
            //console.log(res)
            this.setState({
                data:res?res.data:[],
                loading: false,
            });
        });
    }

    render() {
        const columns = this.columns;
        const {data}=this.state;
        const { getFieldDecorator } = this.props.form;
        const {onCancel} = this.props;
        // const formItemLayout = {
        //     labelCol: {
        //         xs: { span: 24 },
        //         sm: { span: 6 },
        //     },
        //     wrapperCol: {
        //         xs: { span: 24 },
        //         sm: { span: 14 },
        //     },
        // }
        // const tailFormItemLayout = {
        //     wrapperCol: {
        //         xs: {
        //             span: 24,
        //             offset: 0,
        //         },
        //         sm: {
        //             span: 14,
        //             offset: 0,
        //         },
        //     },
        // };

        return (
            <div>
                <Table rowKey='sn' columns={columns} dataSource={data} pagination={false} loading={this.state.loading} bordered size="middle"/>
            </div>
        );
    }
}
const AirMaterielStock = Form.create()(AirMaterielStocks);
export default AirMaterielStock;
