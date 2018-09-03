import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';


// 文件更新
class AddList extends React.Component {
    state = {
        subTask:[],
        confirmDirty:false,
        data:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                Api.post('workHandover/addOrUpdate',{
                    seqNo:values.seqNo,
                    handoverInfo:values.handoverInfo,
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

    componentDidMount(){

    }

    checkConfirm = (rule, value, callback) => {
        const reg=new RegExp("^[0-9]*[1-9][0-9]*$");
        if (!reg.test(value)) {
            callback('只能输入数字!');
        } else {
            callback();
        }
    };

    render() {
        const {data} = this.state;
        // console.log('data',data);
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
                        label="序号"
                        hasFeedback
                    >
                        {getFieldDecorator('seqNo',{
                            rules: [{ required: true, message: '序号不能为空!' }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input  placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="交接事项"
                    >
                        {getFieldDecorator('handoverInfo',{
                            rules: [{ required: true, message: '交接事项不能为空!' }],
                        })(
                            <Input type="textarea" rows={4} placeholder="" />
                        )}
                    </FormItem>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="状态"*/}
                        {/*style={{display:'none'}}*/}
                    {/*>*/}
                        {/*{getFieldDecorator('state',{*/}
                            {/*rules: [{required: true, message: '请选择状态!',}],*/}
                        {/*})(*/}
                            {/*<Select>*/}
                                {/*<Option value="T">有效</Option>*/}
                                {/*<Option value="F">无效</Option>*/}
                            {/*</Select>*/}
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
const  AddLists = Form.create()(AddList);
export default AddLists;
