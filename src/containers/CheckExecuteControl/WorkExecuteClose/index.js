import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker, Upload, message } from 'antd';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;


const title = () =>{
    return '工卡基本信息'
};
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '区域',
        dataIndex: 'area',
        key: 'area'
    },
    {
        title: '工具',
        dataIndex: 'tool',
        key: 'tool'
    },
    {
        title: '航材',
        dataIndex: 'material',
        key: 'material'
    },
    {
        title: '版本信息',
        dataIndex: 'version',
        key: 'version'
    },
    {
        title: '故障',
        dataIndex: 'trouble',
        key: 'trouble'
    },
    {
        title: '文件',
        dataIndex: 'file',
        key: 'file',
        render: () => {
            return (
                <Upload {...props}>
                    <Button>
                        <Icon type="upload" /> 上传文件
                    </Button>
                </Upload>
            );
        }
    }
];

const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const data = [
    {
        key:'1',
        name:'工卡一',
        area:'机翼',
        tool:'工具一',
        material:'航材一',
        version:'版本一',
        trouble:'问题一'
    },
    {
        key:'2',
        name:'工卡一',
        area:'机翼',
        tool:'工具一',
        material:'航材一',
        version:'版本一',
        trouble:'问题一'
    }
];
function onChange(date, dateString) {
    console.log(date, dateString);
}
export default class WorkExecuteClose extends React.Component{
    render(){
        return (
            <div>
                <div className="header">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="工卡名"
                        >
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                查找
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="content">
                    <Row style={{margin:'10px auto'}}>
                        <Col span={12}>
                            时间：<DatePicker onChange={onChange} size="small"/>
                        </Col>
                        <Col span={12}>
                            <Button type="primary">下载</Button>
                            <Button type="primary">查询</Button>
                        </Col>
                    </Row>
                    <Table columns={columns} dataSource={data} bordered size="small" title={title}/>
                </div>
            </div>
        );
    }
}





