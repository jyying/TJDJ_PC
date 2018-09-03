/**
 * Created by dengyou on 2017/6/30.
 */

import './index.css';
import React from 'react';
import { Upload, Button, Icon } from 'antd';


const props = {
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
            console.log(file, fileList);
        }
    },
    defaultFileList: [{
        uid: 1,
        name: '人员外出AOG',
        status: 'done',
        reponse: 'Server Error 500',  // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
    }, {
        uid: 2,
        name: '人员外出AOG1',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
    }, {
        uid: 3,
        name: '人员外出AOG2',
        status: 'error',
        reponse: 'Server Error 500',  // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
    }],
};
class JobUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }
    render(){
        return (
            <div className="content">
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> 任务导入
                    </Button>
                </Upload>
            </div>
        );
    }
}

export default JobUpload;