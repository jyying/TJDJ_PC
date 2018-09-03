import React from 'react';
import { Form, Input, Spin, Select, Button, message,Upload,Icon,notification} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Api from '../../../api/request';

const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}];


// 文件更新
class UpdateDocument extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        docTypeId:[],
        fileList: [],
        uploading: false,
        loadings:false,
    };
    // 列表提交
    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     const data=this.props.DetailsDatas;
    //     this.props.form.validateFields(['docTypeId','docName','remark','docState'],(err, values) => {
    //         // console.log('values',values);
    //         Api.post('document/updateDocument',{docId:data.id,docTypeId:values.docTypeId,docName:values.docName,docState:values.docState[0],docUrl:data.docUrl,remark:values.remark})
    //             .then(res => {
    //                 // console.log('更新后',res);
    //                 if(res.errorCode == 0) {
    //                     notification.open({
    //                         message: '更新成功',
    //                         description: res.data,
    //                     });
    //                 } else if(res.errorCode == 1) {
    //                     notification.open({
    //                         message: '更新失败',
    //                         description: res.data,
    //                     });
    //                 }
    //             })
    //
    //     });
    // };

    componentDidMount(){
// 获取文档类型列表
        const docTypeId=[];
        Api.post('document/findDocumentTypeList').then(res=>{
            // console.log('bbb',res);
            for (let i=0;i<res.data.length;i++){
                docTypeId.push({
                    value: res.data[i].id,
                    label: res.data[i].dictName,
                });
            }
            this.setState({
                docTypeId:docTypeId
            });
        });

        // const data=this.props.DetailsDatas;

    }
    handleUpload = () => {

        const { fileList } = this.state;
        // console.log('obj',fileList[0]);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
            loadings:true
        });
        //
        if(fileList.length!=0){
            Api.put('fileUpload/fileUploadCommonPost',{fileName:fileList[0]})
                .then(res => {
                    // console.log('go',res);
                    if(res.errorCode == 0) {
                        this.props.form.validateFields(['docTypeId','docName','docState','remark'],(err, values) => {
                            // console.log('values',values);
                            const data=this.props.DetailsDatas;
                            Api.post('document/updateDocument',{docId:data.id,docTypeId:values.docTypeId,docName:values.docName,docState:values.docState,docUrl:res.data,remark:values.remark})
                                .then(res => {
                                    // console.log('导入后',res);
                                    if(res.errorCode == 0) {
                                        notification.open({
                                            message: '上传成功',
                                            description: res.data,
                                        });
                                        this.setState({
                                            uploading: false,
                                            loadings:false
                                        });
                                    } else{
                                        this.setState({
                                            uploading: false,
                                            loadings:false
                                        });
                                        notification.open({
                                            message: '上传失败',
                                            description: res.data,
                                        });
                                    }
                                })

                        });

                    } else {
                        message.error('文件上传服务器失败');
                    }
                });
        }else {
            const data=this.props.DetailsDatas;
            this.props.form.validateFields(['docTypeId','docName','docState','remark'],(err, values) => {
                // console.log('values',values);
                Api.post('document/updateDocument',{docId:data.id,docTypeId:values.docTypeId,docName:values.docName,docState:values.docState,docUrl:data.docUrl,remark:values.remark})
                    .then(res => {
                        // console.log('更新后',res);
                        if(res.errorCode == 0) {
                            this.setState({
                                loadings:false,
                                uploading: false
                            });
                           message.success('更新成功！');
                        } else if(res.errorCode == 1) {
                            this.setState({
                                uploading: false,
                                loadings:false
                            });
                           message.error('!!!更新失败');
                        }
                    })

            });
        }


    };

    render() {
        const {onCancel} = this.props;
        const docTypeId =this.state.docTypeId;
        const data=this.props.DetailsDatas;
        // console.log('data',data);
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
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 0,
                },
            },
        };
        const { uploading } = this.state;
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
        return (
            <div>
                <Spin spinning={this.state.loadings} delay={500} >
                <Form >
                    <FormItem {...formItemLayout} label={`文档类型`}>
                        {getFieldDecorator(`docTypeId`,{
                            initialValue: data.docTypeId,
                            rules: [{ required: true, message: '文档类型不能为空!' }],
                        })(
                            <Select initialValue={data.docTypeId}>
                                {
                                    docTypeId.map((s,v)=>
                                        <Option key={v} value={s.value}>{s.label}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`文档名称`}>
                        {getFieldDecorator(`docName`,{
                            initialValue: data.docName,
                            rules: [{ required: true, message: '文档名称不能为空!' }],
                        })(
                            <Input placeholder="文件上传/更新时必输" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="文档状态"
                    >
                        {getFieldDecorator('docState',{
                            initialValue:data.docState,
                        })(
                            <Select>
                                <Option value="T">有效</Option>
                                <Option value="F">无效</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={`文档备注`}>
                        {getFieldDecorator(`remark`,{
                            initialValue: data.remark,
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem style={{ marginTop: 16,height:'90px'}} {...formItemLayout} label={`文件上传`}>
                        <Upload {...props}>
                            <Button  className='btn_reload' style={{marginLeft:'0px !important',padding:'3px 107px'}}>
                                <Icon type="upload" /> 选择文件
                            </Button>
                        </Upload>
                        <Button
                            className="upload-demo-start"
                            type="primary"
                            onClick={this.handleUpload}
                            // disabled={this.state.fileList.length === 0}
                            loading={uploading}
                            style={{position:'absolute',left:'50px'}}
                        >
                            {uploading ? '上传中' : '确定' }
                        </Button>
                        <Button  onClick={onCancel} className="upload-demo-start" style={{position:'absolute',left:'130px'}}>取消</Button>
                    </FormItem>
                    {/*<FormItem {...tailFormItemLayout}>*/}
                        {/*<Button type="primary" htmlType="submit" size="large" style={{display:this.state.fileList.length === 0?'block':'none'}}>提交</Button>*/}
                    {/*</FormItem>*/}
                </Form>
                </Spin>
           </div>
        );
    }
}
const  UpdateDocuments = Form.create()(UpdateDocument);
export default UpdateDocuments;
