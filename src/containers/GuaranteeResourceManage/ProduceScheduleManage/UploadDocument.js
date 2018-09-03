import './index.css'
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
class UploadDocument extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        docType:[],
        fileList: [],
        uploading: false,
        loadings:false,
    };

    componentDidMount(){
// 获取文档类型列表
        Api.post('document/findDocumentTypeList').then(res=>{
            this.setState({
                docType:res?res.data:[]
            });
        });
    }

    handleUpload = () => {

        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
            loadings:true
        });
        //
        Api.put('fileUpload/fileUploadCommonPost',{fileName:fileList[0]})
            .then(res => {
                // console.log('go',res);
                if(res.errorCode == 0) {
                    this.props.form.validateFields(['docTypeId','docName','remark'],(err, values) => {
                        // console.log('values',values);
                        Api.post('document/saveDocument',{docTypeId:values.docTypeId,docName:values.docName,docUrl:res.data,remark:values.remark})
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

    };

    render() {
        const {docType} =this.state;
        const data=this.props.DetailsDatas;
        // console.log('data',data.docTypeId);
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
        // const upload = {
        //     customRequest:(obj) => {
        //         console.log(obj);
        //         Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
        //             .then(res => {
        //                 console.log('go',res);
        //                 if(res.errorCode == 0) {
        //                     this.props.form.validateFields(['docTypeId','docName','remark'],(err, values) => {
        //                         console.log('values',values);
        //                         Api.post('document/saveDocument',{docTypeId:values.docTypeId,docName:values.docName,docUrl:res.data,remark:values.remark})
        //                             .then(res => {
        //                                 console.log('导入后',res);
        //                                 if(res.errorCode == 0) {
        //                                     notification.open({
        //                                         message: '上传成功',
        //                                         description: res.data,
        //                                     });
        //                                     // this.openNotification('success','上传成功',res.data);
        //                                 } else if(res.errorCode == 1) {
        //                                     // message.error('上传失败');
        //                                     // this.openNotification('error','上传失败',res.data);
        //
        //                                     notification.open({
        //                                         message: '上传失败',
        //                                         description: res.data,
        //                                     });
        //                                 }
        //                             })
        //
        //                     });
        //
        //                 } else {
        //                     message.error('文件上传服务器失败');
        //                 }
        //             });
        //     },
        //     showUploadList:false,
        //     onChange: (fileList) => {
        //         // console.log(fileList);
        //     }
        // };

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
        const {onCancel} = this.props;

        return (
            <div>
                <Spin spinning={this.state.loadings} delay={500} >
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label={`文档类型`}>
                            {getFieldDecorator(`docTypeId`,{
                                rules: [{ required: true, message: '文档类型不能为空!' }],
                            })(
                                <Select>
                                    {
                                        docType.map((s,v)=>
                                            <Option key={v} value={s.id}>{s.dictValue}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={`文档名称`}>
                            {getFieldDecorator(`docName`,{
                                rules: [{ required: true, message: '文档名称不能为空!' }],
                            })(
                                <Input placeholder="" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label={`文档备注`}>
                            {getFieldDecorator(`remark`,{
                                initialValue: [],
                            })(
                                <Input placeholder="" />
                            )}
                        </FormItem>

                        <FormItem style={{ marginTop: 16,height:'90px'}} {...formItemLayout} label={`文件上传`}>

                                <Upload {...props} >
                                    <Button className='btn_reload' style={{marginLeft:'0px !important',padding:'3px 107px'}}>
                                        <Icon type="upload" /> 选择文件
                                    </Button>
                                </Upload>
                                <Button
                                    className="upload-demo-start"
                                    type="primary"
                                    onClick={this.handleUpload}
                                    disabled={this.state.fileList.length === 0}
                                    loading={uploading}
                                    style={{position:'absolute',left:'120px'}}
                                >
                                    {uploading ? '上传中' : '确定' }
                                </Button>
                                <Button  onClick={onCancel} className="upload-demo-start" style={{position:'absolute',left:'30px'}}>取消</Button>

                        </FormItem>
                    </Form>
                </Spin>
           </div>
        );
    }
}
const  UploadDocuments = Form.create()(UploadDocument);
export default UploadDocuments;
