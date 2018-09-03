import React,{Component} from 'react';
import {Upload, message, Button, Icon,Modal} from 'antd';


const testAddress = '';
//  提交前
function beforeUpload(file) {
    console.log(file.type)
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

class UploadDefault extends Component {
    constructor(){
        super();
        this.state = {
            action: testAddress,
            onChange(info) {
                console.log(info);
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        }
    }
    render(){
        return (
            <Upload {...this.state}>
                <Button>
                    <Icon type="upload" /> Click to Upload
                </Button>
            </Upload>
        )
    }
}

class UploadImg extends Component {
    constructor(){
        super();
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }],
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="//"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

class UploadThumbUrl extends Component {
    constructor(){
        super();
        this.state = {
            action:'//',
            name:'xxx',
            listType: 'picture',
            fileList:[
                {
                    uid: -1,
                    name: 'xxx.png',
                    status: 'done',
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                },
                {
                    uid: -2,
                    name: 'yyy.png',
                    status: 'done',
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                }
            ]
        }
    }
    render(){
        return (
            <Upload {...this.state}>
                <Button>
                    <Icon type="upload" /> 上传带有缩略图
                </Button>
            </Upload>
        )
    }
}

export {UploadDefault,UploadImg,UploadThumbUrl};