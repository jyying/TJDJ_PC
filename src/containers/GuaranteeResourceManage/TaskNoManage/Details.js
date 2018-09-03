import './index.css'
import React from 'react';
import { Form,Select,message,Row,Col,Upload, Icon, Popconfirm,notification} from 'antd';
import Api from '../../../api/request';

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
        const value=this.props.DetailsData;
        Api.post('workPackageInfo/findPictureByPnNo',{'pnNo':value.pnNo,

        }).then(res=>{
            this.setState({
                fileList:res?res.data:[]
            });

        })
    }
    deleteImg=(s)=>{
        console.log('e',s);
        Api.post('workPackageInfo/deletePicture',{'pictureId':s.id,

        }).then(res=>{
            if(res.errorCode=='0'){
                message.success('删除成功！');
                this.componentDidMount();
            }else{
                message.error('删除失败：'+res.errorMsg);
            }

        })
    };
    cancel=(s)=> {

    };
    render() {
        const {DetailsData}=this.props;
        const { previewVisible, previewImage,fileList} = this.state;
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
                            const imgList=[];
                            imgList.push(res.data);
                            // console.log('imgList',imgList);
                            if(res.errorCode == 0) {
                                const value=this.props.DetailsData;
                                // console.log('aaaaaa',value);
                                Api.post('workPackageInfo/saveEquipmentPicture',{pnNo:value.pnNo,picNameList:imgList})
                                    .then(res => {
                                        // console.log('res',res);
                                        if(res.errorCode == 0) {
                                            notification.open({
                                                message: '上传成功',
                                                description: res.data,
                                            });
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
                   <div className="clearfix">
                       {
                           fileList.map((s,v)=><span className="taskImg" key={v}>
                               <a   href={s.pictureUrl}   target="_blank">
                                   <img alt='无法显示' style={{ width: '80%',height:'100%'}} src={s.pictureUrl} />
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

            </div>
        );
    }
}
const UserListForm = Form.create()(UpdateUserList);
export default UserListForm;
