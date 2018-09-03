import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 文件更新
class CorrodeUpdateList extends React.Component {
    state = {
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.dUpdate7;
        this.props.form.validateFields((err, values) => {
            const stringDate=values.stringDate?values.stringDate.format('YYYY-MM-DD'):'';
            const deadlineDate=values.deadlineDate?values.deadlineDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/cc/addOrUpdate',{
                    mdcId:value.id,
                    mtDrId:value.mtDrId,
                    snSeq:values.snSeq,
                    conrrosionLocation:values.conrrosionLocation,
                    conrrosionPicRemark:values.conrrosionPicRemark,
                    ammPicRemark:values.ammPicRemark,
                    repairProject:values.repairProject,
                    materialNeed:values.materialNeed,
                    structureTimeNode:values.structureTimeNode,
                    machineTimeNode:values.machineTimeNode,
                    overview:values.overview,
                    rowColor:values.rowColor,
                    state:values.state,
                }).then(res => {
                    if(res.errorCode == 0) {
                        message.success('修改成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！修改失败');
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
        const value=this.props.dUpdate7;
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
                        {getFieldDecorator('snSeq',{
                            initialValue:value.snSeq,
                            rules: [{ required: true, message: '序号不能为空!' }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="腐蚀位置"
                    >
                        {getFieldDecorator('conrrosionLocation',{
                            initialValue:value.conrrosionLocation,
                            rules: [{ required: true, message: '腐蚀位置不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="腐蚀照片"*/}
                    {/*>*/}
                        {/*{getFieldDecorator('conrrosionPicUrl',{*/}

                            {/*rules: [{ required: true, message: '请上传腐蚀照片!' }],*/}
                        {/*})(*/}
                            {/*<div className="clearfix">*/}
                                {/*{*/}
                                    {/*fileList.map((s,v)=><span className="taskImg" key={v}>*/}
                               {/*<a   href={s.pictureUrl}   target="_blank">*/}
                                   {/*<img alt='无法显示' style={{ width: '80%',height:'100%'}} src={s.pictureUrl} />*/}
                               {/*</a>*/}
                               {/*<Popconfirm title="确认要删除此张图片吗?" onConfirm={()=>this.deleteImg(s)} onCancel={this.cancel} okText="确认" cancelText="取消"><i  style={{position:'absolute',right:0}}><Icon type="close"  /></i></Popconfirm>*/}

                           {/*</span>)*/}
                                {/*}*/}

                                {/*<Upload*/}
                                    {/*{...upload}*/}
                                    {/*listType="picture-card"*/}
                                    {/*multiple={true}*/}
                                    {/*onPreview={this.handlePreview}*/}
                                    {/*onChange={this.handleChange}*/}
                                    {/*fileList={fileList}*/}
                                {/*>*/}
                                    {/*{ uploadButton}*/}
                                {/*</Upload>*/}
                            {/*</div>*/}

                        {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem
                        {...formItemLayout}
                        label="照片说明"
                    >
                        {getFieldDecorator('conrrosionPicRemark',{
                            initialValue:value.conrrosionPicRemark,
                            rules: [{ required: true, message: '照片说明不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                        {/*label="手册截图"*/}
                    {/*>*/}
                        {/*{getFieldDecorator('ammPicUrl',{*/}

                            {/*rules: [{ required: true, message: '请上传手册截图!' }],*/}
                        {/*})(*/}
                            {/*<Input  placeholder=""/>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem
                        {...formItemLayout}
                        label="手册截图说明"
                    >
                        {getFieldDecorator('ammPicRemark',{
                            initialValue:value.ammPicRemark,
                            rules: [{ required: true, message: '手册截图说明不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="修理方案"
                    >
                        {getFieldDecorator('repairProject',{
                            initialValue:value.repairProject,
                            rules: [{ required: true, message: '修理方案不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={3}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="航材需求"
                    >
                        {getFieldDecorator('materialNeed',{
                            initialValue:value.materialNeed,
                            rules: [{ required: true, message: '航材需求不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={2}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="结构时间节点"
                    >
                        {getFieldDecorator('structureTimeNode',{
                            initialValue:value.structureTimeNode,
                            rules: [{ required: true, message: '结构时间节点不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="机械时间节点"
                    >
                        {getFieldDecorator('machineTimeNode',{
                            initialValue:value.machineTimeNode,
                            rules: [{ required: true, message: '机械时间节点不能为空!' }],
                        })(
                            <Input  placeholder=""/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="综述"
                    >
                        {getFieldDecorator('overview',{
                            initialValue:value.overview,
                            rules: [{ required: true, message: '综述不能为空!' }],
                        })(
                            <Input  placeholder="" type="textarea" rows={2}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="本行数据颜色"
                    >
                        {getFieldDecorator('rowColor',{
                            initialValue:value.rowColor,
                            rules: [{required: true, message: '请选择本行数据颜色!',}],
                        })(
                            <Select>
                                <Option value="red">红色字体</Option>
                                <Option value="black">黑色字体</Option>
                                <Option value="pink">黑色字体+底纹</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                        {getFieldDecorator('state',{
                            initialValue:value.state,
                            rules: [{required: true, message: '请选择状态!',}],
                        })(
                            <Select>
                                <Option value="T">有效</Option>
                                <Option value="F">无效</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button size="large" onClick={onCancel}>取消</Button>
                        <Button type="primary" htmlType="submit" size="large">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  CorrodeUpdateLists = Form.create()(CorrodeUpdateList);
export default CorrodeUpdateLists;
