/**
 * Created by dengyou on 2017/7/7.
 */

// import './index.css';
import React from 'react';
import { Table, Input, Button, Icon ,Row ,Col,Tree} from 'antd';

// menue
const TreeNode = Tree.TreeNode;

class Menue extends React.Component {
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    }
    render() {
        return (
            <Tree
                checkable
                defaultExpandedKeys={['parent1', 'parent2']}
                defaultSelectedKeys={['parent1', 'parent2']}
                defaultCheckedKeys={['parent1', 'parent2']}
                onSelect={this.onSelect}
                onCheck={this.onCheck}
            >
                    <TreeNode title="定检任务管理" key="parent1" >
                        <TreeNode title="定检任务管理" key="0"  />
                        <TreeNode title="DD、FC和NRC信息" key="1" />
                        <TreeNode title="NRC模板" key="2" />
                        <TreeNode title="非DD、FC等故障信息" key="3" />
                        <TreeNode title="排故建议单、定检故障处理" key="4" />
                        <TreeNode title="其他任务的导入" key="5" />
                    </TreeNode>
                    <TreeNode title="保障资源管理" key="parent2">
                        <TreeNode title="飞机信息" key="6" />
                        <TreeNode title="人员信息管理" key="7" />
                        <TreeNode title="人员角色授权管理" key="8" />
                        <TreeNode title="人员分线信息管理" key="9" />
                        <TreeNode title="人员技术级别管理" key="10" />
                        <TreeNode title="人员资质授权管理" key="11" />
                        <TreeNode title="人员考勤管理" key="12" />
                        <TreeNode title="人员经验" key="13" />
                        <TreeNode title="停场机位管理" key="14" />
                        <TreeNode title="件号管理" key="15" />
                        <TreeNode title="工具、航材、设备管理" key="16" />
                        <TreeNode title="大项工作清单" key="17" />
                        <TreeNode title="工卡管理" key="18" />
                    </TreeNode>
                <TreeNode title="工作下发" key="parent3">
                    <TreeNode title="工卡安排" key="19" />
                    <TreeNode title="人员安排" key="20" />
                </TreeNode>
                <TreeNode title="定检执行与控制" key="parent4">
                    <TreeNode title="定检开工前的生产准备" key="21" />
                    <TreeNode title="次日航材工具准备" key="22" />
                    <TreeNode title="定检进度监控" key="23" />
                    <TreeNode title="生产进度管理" key="24" />
                    <TreeNode title="工作执行与关闭" key="25" />
                </TreeNode>
                <TreeNode title="放行出厂" key="parent5">
                    <TreeNode title="飞机出场放行" key="26" />
                    <TreeNode title="定检出厂报告" key="27" />
                </TreeNode>
                <TreeNode title="统计反馈" key="parent6">
                    <TreeNode title="人员工时统计" key="28" />
                    <TreeNode title="考勤统计" key="29" />
                    <TreeNode title="航材使用情况统计" key="30" />
                    <TreeNode title="问题反馈" key="31" />
                    <TreeNode title="预留表单的接入口" key="32" />
                </TreeNode>
                <TreeNode title="系统管理" key="parent7">
                    <TreeNode title="用户管理" key="33" />
                    <TreeNode title="用户角色管理" key="34" />
                    <TreeNode title="菜单管理" key="35" />
                    <TreeNode title="用户角色菜单权限管理" key="36" />
                </TreeNode>
            </Tree>
        );
    }
}




const data = [{
    key: '1',
    name: 'John Brown',
    description: <Menue/>
}, {
    key: '2',
    name: 'Joe Black',
    description: <Menue/>
}, {
    key: '3',
    name: 'Jim Green',
    description: <Menue/>
}, {
    key: '4',
    name: 'Jim Red',
    description: <Menue/>
}];
class RolePrivilegeManagement extends React.Component {
    state = {
        filterDropdownVisible: false,
        data,
        searchText: '',
        filtered: false,
    };
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            data: data.map((record) => {
                const match = record.name.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.name.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }
    render() {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="Search name"
                        value={this.state.searchText}
                        onChange={this.onInputChange}
                        onPressEnter={this.onSearch}
                    />
                    <Button type="primary" onClick={this.onSearch}>Search</Button>
                </div>
            ),
            filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                }, () => this.searchInput.focus());
            },
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span><a href="#">设置</a></span>
            ),
        }];

        return (
            <div className="bg">
                <div className="content">
                <Table columns={columns} dataSource={this.state.data} size='middle'  expandedRowRender={record => <div>{record.description}</div>}/>
            </div>
            </div>
        );
    }
}

export default RolePrivilegeManagement;