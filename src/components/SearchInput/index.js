/**
 * Created by dengyou on 2017/7/4.
 */
// import './index.css';
import React from 'react';
import { Row, Col,Button,Form,Input} from 'antd';
const FormItem = Form.Item;

class SearchInput extends React.Component{
    constructor(){
        super();
        this.state={

        };
    }
    // Form-搜索
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    // Form-清除
    handleReset = () => {
        this.props.form.resetFields();
    }
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const children = [];
        for (let i = 0; i < 1; i++) {
            children.push(
                <Col  key={i} style={{  }}>
                    <FormItem {...formItemLayout} label={`搜索`}>
                        {getFieldDecorator(`value`)(
                            <Input placeholder="placeholder" />
                        )}
                    </FormItem>
                </Col>
            );
        }
        return children;
    }

    componentDidMount() {

    };

    render() {
        return (
            <div>
                <Row  type="flex" align="middle" className="content_header" justify="start"
                >
                    <Col span={16}>
                        <Form
                            className="ant-advanced-search-form"
                            onSubmit={this.handleSearch}
                        >
                            <Row type="flex" justify="start" align="middle">
                                <Col span={16}>
                                    {this.getFields()}
                                </Col>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    <Button type="primary" htmlType="submit">Search</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                        Clear
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    };

}
const SearchInputs = Form.create()(SearchInput);
export default SearchInputs;