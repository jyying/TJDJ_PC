/**
 * Created by dengyou on 2017/6/29.
 */
// import './index.css';
import React from 'react';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;


const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = [];
class AddCheckbox extends React.Component {
    state = {
        checkedList: defaultCheckedList,
        indeterminate: true,
        checkAll: false,
    };
    render() {
        return (
            <div>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        Check all
                    </Checkbox>
                </div>
                <br />
                <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </div>
        );
    }
    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
        });
        console.log(checkedList);
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });

    }
}
export default AddCheckbox ;