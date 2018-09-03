/**
 * Created by dengyou on 2017/6/30.
 */

// import './index.css';
import React from 'react';
import { Table, Button ,Cascader } from 'antd';


const options = [{
    value: '延期处理',
    label: '延期处理',
}, {
    value: '立即处理',
    label: '立即处理',
}];

function onChange(value) {
    console.log(value);
}
function submit() {

}
const columns = [{
    title: '类型',
    dataIndex: 'type',
}, {
    title: '故障',
    dataIndex: 'fault',
}, {
    title: '提报人',
    dataIndex: 'name',
}, {
    title: '提报时间',
    dataIndex: 'time',
}, {
    title: '处理',
    dataIndex: 'dispose',
    render: () => (
        <Cascader defaultValue={['延期处理']} options={options} onChange={onChange} className="cascader"/>
    ),
}, {
    title: '操作',
    dataIndex: 'action',
    render: () => (
      <Button href="#" className="submit" onClick={submit} style={{float:'initial'}}>提交</Button>
    ),
}];


const data = [];
for (let i = 0; i < 10; i++) {
    data.push({
        key: i,
        type: `A30${i}`,
        fault: 32,
        name: `张三${i}`,
        time: `no. ${i}`,
    });
}

class FaultDispose extends React.Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
    };
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="content">
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={this.start}
                        disabled={!hasSelected}
                        loading={loading}
                        style={{float:'initial'}}
                    >
                        批量处理
                    </Button>
                    <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} size="middle"/>
            </div>
        );
    }
}

export default FaultDispose;