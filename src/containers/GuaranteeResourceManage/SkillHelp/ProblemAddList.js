import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { DatePicker } from 'antd';
import Api from '../../../api/request';


// 问题项
class ProblemAddList extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:'',
        searchdata:[]
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.dUpdateQ;
        const dailyDate=this.props.dailyDate;
        this.props.form.validateFields((err, values) => {
            // const rpDate=values.rpDate?values.rpDate.format('YYYY-MM-DD'):'';
            // const completeTime=values.completeTime?values.completeTime.format('YYYY-MM-DD'):'';
            // const Str=values.rpName;
            // const name=Str.split(",");
            // // console.log(name[0],name[1]);
            if(!err){
                Api.post('technicalSupport/addOrUpdate',{
                    wwpId:value.wwpId,
                    wwpaId:value.id,
                    commandNo:value.wwpCommandNo,
                    dailyDate:dailyDate,
                    tsTitle:values.tsTitle,
                    // tsRemark:values.tsRemark,
                    state:'T',
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('新增成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！新增失败');
                    }
                })
            }

        });
    };

    componentWillMount (){

    }
    render() {
        const {onCancel} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 14,
                    offset: 2,
                }
            },
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="标题"
                    >
                        {getFieldDecorator('tsTitle',{
                            rules: [{ required: true, message: '标题不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={2} />
                        )}
                    </FormItem>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="备注"*/}
                    {/*>*/}
                        {/*{getFieldDecorator('tsRemark',{*/}
                            {/*rules: [{ required: true, message: '备注不能为空!' }],*/}
                        {/*})(*/}
                            {/*<Input  placeholder="" />*/}
                        {/*)}*/}
                    {/*</FormItem>*/}

                    <FormItem {...tailFormItemLayout}>
                        <Button  onClick={onCancel} className='btn_reload'>取消</Button>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  ProblemAddLists = Form.create()(ProblemAddList);
export default ProblemAddLists;
