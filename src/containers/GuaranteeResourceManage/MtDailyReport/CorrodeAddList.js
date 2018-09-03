import React from 'react';
import { Form, Input,Select, Button,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';
import { DatePicker,Icon,Upload,Popconfirm,Modal,notification} from 'antd';



// const imgList=[];
// const imgList1=[];
// 腐蚀问题
class CorrodeAddList extends React.Component {
    state = {
        subTask:[],
        confirmDirty: false,
        autoCompleteResult: [],
        previewVisible: false,
        previewImage: '',
        fileList:[],
        imgLists:''
    };
    // 列表提交
    handleSubmit = (e) => {
        e.preventDefault();
        const value=this.props.CorrodeAdd;
        // const conrrosionPicUrl=this.state.imgLists;
        // const ammPicUrl=this.state.imgLists1;
        this.props.form.validateFields((err, values) => {
            // const stringDate=values.stringDate?values.stringDate.format('YYYY-MM-DD'):'';
            const deadlineDate=values.deadlineDate?values.deadlineDate.format('YYYY-MM-DD'):'';
            if(!err){
                Api.post('mtDailyReport/cc/addOrUpdate',{
                    mtDrId:value[0].id,
                    snSeq:values.snSeq,
                    conrrosionLocation:values.conrrosionLocation,
                    // conrrosionPicUrl:conrrosionPicUrl,
                    // submissionTime:submissionTime,
                    conrrosionPicRemark:values.conrrosionPicRemark,
                    // ammPicUrl:ammPicUrl,
                    ammPicRemark:values.ammPicRemark,
                    repairProject:values.repairProject,
                    materialNeed:values.materialNeed,
                    structureTimeNode:values.structureTimeNode,
                    machineTimeNode:values.machineTimeNode,
                    overview:values.overview,
                    rowColor:values.rowColor,
                    state:'T',
                }).then(res => {
                    // imgList.length=0;
                    // imgList1.length=0;
                        // console.log('工卡清单',res);
                    if(res.errorCode == 0) {
                        message.success('新增成功！');
                    } else if(res.errorCode == 1) {
                        message.error('！！！新增失败');
                    }
                    });
            }

        });
    };

    componentDidMount(){

    }
//图片上传
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        console.log('file',file);
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => {
        // console.log('上传',fileList);
        this.setState({ fileList });
    };
    checkConfirm = (rule, value, callback) => {
        const reg=new RegExp("^[0-9]*[1-9][0-9]*$");
        if (!reg.test(value)) {
            callback('只能输入数字!');
        } else {
            callback();
        }
    };

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
        // 图片上传
        const { previewVisible, previewImage, fileList } = this.state;

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="序号"
                        hasFeedback
                    >
                        {getFieldDecorator('snSeq',{

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
                               {/*/!*<Popconfirm title="确认要删除此张图片吗?" onConfirm={()=>this.deleteImg(s)} onCancel={this.cancel} okText="确认" cancelText="取消"><i  style={{position:'absolute',right:0}}><Icon type="close"  /></i></Popconfirm>*!/*/}

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
                        label="腐蚀照片说明"
                    >
                        {getFieldDecorator('conrrosionPicRemark',{

                            // rules: [{ required: true, message: '照片说明不能为空!' }],
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

                            // rules: [{ required: true, message: '手册截图说明不能为空!' }],
                        })(
                            <Input  placeholder=""/>

                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="修理方案"
                    >
                        {getFieldDecorator('repairProject',{

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
                            rules: [{required: true, message: '请选择本行数据颜色!',}],
                        })(
                            <Select>
                                <Option value="red">红色字体</Option>
                                <Option value="black">黑色字体</Option>
                                <Option value="pink">黑色字体+底纹</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...tailFormItemLayout}>
                        <Button  onClick={onCancel} className='btn_reload'>取消</Button>
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
           </div>
        );
    }
}
const  CorrodeAddLists = Form.create()(CorrodeAddList);
export default CorrodeAddLists;
