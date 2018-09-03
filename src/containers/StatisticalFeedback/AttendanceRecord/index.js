import React from 'react';
import { Form, Icon, Input, Button,Table, Row, Col,DatePicker,Modal,Select  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const confirm = Modal.confirm;
const data =
        [
            {
                key:'李四',
                num:'1',
                name:'李四',
                day1:'√',
                day2:'√',
                day3:'√',
                day4:'√',
                day5:'√',
                day6:'√',
                day7:'√',
                day8:'√',
                day9:'√',
                day10:'√',
                day11:'√',
                day12:'√',
                day13:'√',
                day14:'√',
                day15:'√',
                day16:'√',
                day17:'√',
                day18:'√',
                day19:'√',
                day20:'√',
                day21:'√',
                day22:'√',
                day23:'√',
                day24:'√',
                day25:'√',
                day26:'√',
                day27:'√',
                day28:'√',
                day29:'√',
                day30:'√'
            },
            {
                key:'张三',
                num:'2',
                name:'张三',
                day1:'√',
                day2:'√',
                day3:'√',
                day4:'√',
                day5:'√',
                day6:'√',
                day7:'√',
                day8:'√',
                day9:'√',
                day10:'√',
                day11:'√',
                day12:'√',
                day13:'√',
                day14:'√',
                day15:'√',
                day16:'√',
                day17:'√',
                day18:'√',
                day19:'√',
                day20:'√',
                day21:'√',
                day22:'√',
                day23:'√',
                day24:'√',
                day25:'√',
                day26:'√',
                day27:'√',
                day28:'√',
                day29:'√',
                day30:'√'
            },
            {
                key:'赵武',
                num:'3',
                name:'赵武',
                day1:'√',
                day2:'√',
                day3:'√',
                day4:'√',
                day5:'√',
                day6:'√',
                day7:'√',
                day8:'√',
                day9:'√',
                day10:'√',
                day11:'√',
                day12:'√',
                day13:'√',
                day14:'√',
                day15:'√',
                day16:'√',
                day17:'√',
                day18:'√',
                day19:'√',
                day20:'√',
                day21:'√',
                day22:'√',
                day23:'√',
                day24:'√',
                day25:'√',
                day26:'√',
                day27:'√',
                day28:'√',
                day29:'√',
                day30:'√'
            },
            {
                key:'赵六',
                num:'4',
                name:'赵六',
                day1:'√',
                day2:'√',
                day3:'√',
                day4:'√',
                day5:'√',
                day6:'√',
                day7:'√',
                day8:'√',
                day9:'√',
                day10:'√',
                day11:'√',
                day12:'√',
                day13:'√',
                day14:'√',
                day15:'√',
                day16:'√',
                day17:'√',
                day18:'√',
                day19:'√',
                day20:'√',
                day21:'√',
                day22:'√',
                day23:'√',
                day24:'√',
                day25:'√',
                day26:'√',
                day27:'√',
                day28:'√',
                day29:'√',
                day30:'√'
            }
        ];

const columns = [
    {
        title: '序号',
        dataIndex: 'num',
        key: 'num'
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '1',
        dataIndex: 'day1',
        key: 'day1'
    },
    {
        title: '2',
        dataIndex: 'day2',
        key: 'day2'
    },
    {
        title: '3',
        dataIndex: 'day3',
        key: 'day3'
    },
    {
        title: '4',
        dataIndex: 'day4',
        key: 'day4'
    },
    {
        title: '5',
        dataIndex: 'day5',
        key: 'day5'
    },
    {
        title: '6',
        dataIndex: 'day6',
        key: 'day6'
    },
    {
        title: '7',
        dataIndex: 'day7',
        key: 'day7'
    },
    {
        title: '8',
        dataIndex: 'day8',
        key: 'day8'
    },
    {
        title: '9',
        dataIndex: 'day9',
        key: 'day9'
    },
    {
        title: '10',
        dataIndex: 'day10',
        key: 'day10'
    },
    {
        title: '11',
        dataIndex: 'day11',
        key: 'day11'
    },
    {
        title: '12',
        dataIndex: 'day12',
        key: 'day12'
    },
    {
        title: '13',
        dataIndex: 'day13',
        key: 'day13'
    },
    {
        title: '14',
        dataIndex: 'day14',
        key: 'day14'
    },
    {
        title: '15',
        dataIndex: 'day15',
        key: 'day15'
    },
    {
        title: '16',
        dataIndex: 'day16',
        key: 'day16'
    },
    {
        title: '17',
        dataIndex: 'day17',
        key: 'day17'
    },
    {
        title: '18',
        dataIndex: 'day18',
        key: 'day18'
    },
    {
        title: '19',
        dataIndex: 'day19',
        key: 'day19'
    },
    {
        title: '20',
        dataIndex: 'day20',
        key: 'day20'
    },
    {
        title: '21',
        dataIndex: 'day21',
        key: 'day21'
    },
    {
        title: '22',
        dataIndex: 'day22',
        key: 'day22'
    },
    {
        title: '23',
        dataIndex: 'day23',
        key: 'day23'
    },
    {
        title: '24',
        dataIndex: 'day24',
        key: 'day24'
    },
    {
        title: '25',
        dataIndex: 'day25',
        key: 'day25'
    },
    {
        title: '26',
        dataIndex: 'day26',
        key: 'day26'
    },
    {
        title: '27',
        dataIndex: 'day27',
        key: 'day27'
    },
    {
        title: '28',
        dataIndex: 'day28',
        key: 'day28'
    },
    {
        title: '29',
        dataIndex: 'day29',
        key: 'day29'
    },
    {
        title: '30',
        dataIndex: 'day30',
        key: 'day30'
    }
];
const title = () =>{
    return '7月份考勤'
};


function onChange(date, dateString) {
    console.log(date, dateString);
}



export default class AttendanceRecord extends React.Component{
    state = {
        filteredInfo: null,
        sortedInfo: null,
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        visible: false,
        newKey:1,
        title:'6月份考勤'
    };

    //模态框
    showModal = () => {
        this.setState({
            visible: true
        });
    };
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false
        });
    };





    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };



    render() {

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;


        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};



        return (
            <div>
                <div className="header">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem
                            label="用户名"
                        >
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />

                        </FormItem>
                        <FormItem
                            label="工号"
                        >
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />

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
                            部门：
                            <Select defaultValue="lucy" style={{ width: 120 }} >
                                <Option value="jack">维修部</Option>
                                <Option value="lucy">工程部</Option>
                                <Option value="Yiminghe">人事部</Option>
                            </Select>
                        </Col>
                        <Col span={12}>
                            <div style={{float:'right'}}>
                                时间：<MonthPicker onChange={onChange} placeholder="Select month"/>
                            </div>
                        </Col>
                    </Row>
                    <Table columns={columns} dataSource={data} bordered size="small" title={title}/>
                </div>
            </div>
        );
    }
}













