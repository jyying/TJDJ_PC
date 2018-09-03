import React from 'react';
import {Button,Input,Mention, Form} from 'antd';
const { toContentState, getMentions } = Mention;
const FormItem = Form.Item;

export default class ProblemFeedback extends React.Component{
    render() {
        return (
            <div>
                <div className="header">
                    <div>
                        <p>新问题</p>
                        <Input type="textarea" placeholder="请提交反馈的问题！" autosize={{ minRows: 2, maxRows: 10 }} />
                        <Button type="primary">提交</Button>
                    </div>
                </div>
                <div className="content">
                    <p>反馈历史</p>
                </div>
            </div>
        );
    }
}







































