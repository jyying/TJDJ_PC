import './index.css'
import React from 'react';
import { Form,Select,message,Row,Col,Upload, Icon, Popconfirm,notification} from 'antd';
import Api from '../../../api/request';


const  imgList=[];
const  imgList1=[];
const residences = [{
    value: 'F',
    label: '无效',
}, {
    value: 'T',
    label: '有效',
}, {
    value: 'D',
    label: '删除',
}];

// const imgList=[];
class UpdateUserList extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        previewVisible: false,
        previewImage: '',
        fileList:[],
        fileList1:[],
    };

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

    componentDidMount(){
        const value=this.props.PicData;
        const fileList=[];
        const fileList1=[];
        Api.post('mtDailyReport/cc/findCcById',{
            mdcId:value.id,
        }).then(res=>{
            let str =res.data.conrrosionPicUrl ;
            if(str!==null) {
                const arr = str.split(';');
                for (let i = 0; i < arr.length; i++) {
                    if(arr[i]!==''){
                        fileList.push( arr[i]);
                    }
                }
                this.setState({ fileList:fileList});
            }
            let str1 =res.data.ammPicUrl ;
            if(str1!==null) {
                const arr1 = str1.split(';');
                for (let i = 0; i < arr1.length; i++) {
                    if(arr1[i]!==''){
                        fileList1.push( arr1[i]);
                    }
                }
                this.setState({ fileList1:fileList1});
            }

        });
    }
    deleteImg=(s)=>{
        // console.log('s',s);
        const value=this.props.PicData;
        // const arr = s.split('image/');
        // console.log('arr',arr);
        Api.post('mtDailyReport/cc/addOrUpdatePic',{
            mdcId:value.id,
            conrrosionPicUrl:s,
            state:'D',
        }).then(res => {
                if(res.errorCode == 0) {
                    message.success('删除成功！');
                    this.componentDidMount();
                } else if(res.errorCode == 1) {
                    message.error('！！！删除失败');
                }
            })
    };
    cancel=(s)=> {

    };
    deleteImg1=(m)=>{
        // console.log('s',s);
        const value=this.props.PicData;
        // const arr = s.split('image/');
        // console.log('arr',arr);
        Api.post('mtDailyReport/cc/addOrUpdatePic',{
            mdcId:value.id,
            ammPicUrl:m,
            state:'D',
        }).then(res => {
            if(res.errorCode == 0) {
                message.success('删除成功！');
                this.componentDidMount();
            } else if(res.errorCode == 1) {
                message.error('！！！删除失败');
            }
        })
    };
    cancel1=(s)=> {

    };
    render() {
        const value=this.props.PicData;
        // const {DetailsData}=this.props;
        const { previewVisible, previewImage,fileList,fileList1} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const upload = {
                // action: 'http://192.168.130.208:8080/fileUpload/fileUploadCommonPost',
                // data: (obj) => {
                //     return {fileName:obj}
                // },
                customRequest:(obj) => {
                    Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                        .then(res => {
                            // console.log('上传情况',res);
                            // const imgList=[];
                            imgList.push(res.data);
                            // console.log('imgList',imgList);
                            const imgLists=imgList.join(";");
                            console.log('imgLists',imgLists);
                            if(res.errorCode == 0) {
                                const value=this.props.PicData;
                                // console.log('aaaaaa',value);
                                Api.post('mtDailyReport/cc/addOrUpdatePic',{
                                    mdcId:value.id,
                                    conrrosionPicUrl:imgLists,
                                    state:'A',
                                }).then(res => {
                                        imgList.length=0;
                                        // console.log('res',res);
                                        if(res.errorCode == 0) {
                                            notification.open({
                                                message: '上传成功',
                                                description: res.data,
                                            });
                                            console.log('imgList',imgList);
                                            this.componentDidMount();
                                        } else if(res.errorCode == 1) {
                                            notification.open({
                                                message: '！！！上传失败',
                                                description: res.data,
                                            });
                                        }
                                    })
                            } else {
                                message.error('上传文件失败');
                            }
                        });
                },
                showUploadList:false,
                onChange: (fileList) => {
                    console.log(fileList);
                }
            };
        const upload1 = {
            // action: 'http://192.168.130.208:8080/fileUpload/fileUploadCommonPost',
            // data: (obj) => {
            //     return {fileName:obj}
            // },
            customRequest:(obj) => {
                Api.put('fileUpload/fileUploadCommonPost',{fileName:obj.file})
                    .then(res => {
                        // console.log('上传情况',res);
                        // const imgList=[];
                        imgList1.push(res.data);
                        // console.log('imgList',imgList);
                        const imgLists1=imgList1.join(";");
                        console.log('imgLists',imgLists1);
                        if(res.errorCode == 0) {
                            const value=this.props.PicData;
                            // console.log('aaaaaa',value);
                            Api.post('mtDailyReport/cc/addOrUpdatePic',{
                                mdcId:value.id,
                                ammPicUrl:imgLists1,
                                state:'A',
                            }).then(res => {
                                imgList1.length=0;
                                this.componentDidMount();
                                // console.log('res',res);
                                if(res.errorCode == 0) {
                                    notification.open({
                                        message: '上传成功',
                                        description: res.data,
                                    });
                                    console.log('imgList',imgList1);
                                    this.componentDidMount();
                                } else if(res.errorCode == 1) {
                                    notification.open({
                                        message: '！！！上传失败',
                                        description: res.data,
                                    });
                                }
                            })
                        } else {
                            message.error('上传文件失败');
                        }
                    });
            },
            showUploadList:false,
            onChange: (fileList) => {
                console.log(fileList);
            }
        };
        return (
            <div className="details">
                <p>腐蚀照片：</p>
                   <div className="clearfix">
                       {
                           fileList.map((s,v)=><span className="taskImg" key={v}>
                               <a   href={value.visitPreFix + '/' +s}   target="_blank">
                                   <img alt='无法显示' style={{ width: '80%',height:'100%'}} src={value.visitPreFix + '/' +s} />
                               </a>
                               <Popconfirm title="确认要删除此张图片吗?" onConfirm={()=>this.deleteImg(s)} onCancel={this.cancel} okText="确认" cancelText="取消"><i  style={{position:'absolute',right:0}}><Icon type="close"  /></i></Popconfirm>

                           </span>)
                        }

                        <Upload
                            {...upload}
                            listType="picture-card"
                            multiple={true}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            fileList={fileList}
                        >
                            { uploadButton}
                        </Upload>

                    </div>
                <p>手册截图：</p>
                <div className="clearfix">
                    {
                        fileList1.map((m,n)=><span className="taskImg" key={n}>
                               <a   href={value.visitPreFix + '/' +m}   target="_blank">
                                   <img alt='无法显示' style={{ width: '80%',height:'100%'}} src={value.visitPreFix + '/' +m} />
                               </a>
                               <Popconfirm title="确认要删除此张图片吗?" onConfirm={()=>this.deleteImg1(m)} onCancel={this.cancel1} okText="确认" cancelText="取消"><i  style={{position:'absolute',right:0}}><Icon type="close"  /></i></Popconfirm>

                           </span>)
                    }

                    <Upload
                        {...upload1}
                        listType="picture-card"
                        multiple={true}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                        fileList={fileList1}
                    >
                        { uploadButton}
                    </Upload>

                </div>

            </div>
        );
    }
}
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
