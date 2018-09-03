
import React,{Component} from 'react';
import {
    Pagination
} from 'antd';


class PaginationContainers extends Component {
    constructor() {
        super();
    }

    render(){
        const {currentPage,totalSize,onChange} = this.props;
        return (
            <div>
                {
                    !totalSize?null:
                        <Pagination
                            showQuickJumper
                            defaultCurrent={currentPage}
                            total={Number(totalSize)}
                            pageSize={10}
                            onChange={onChange}
                            showTotal={total => `合计 ${total} 条`}
                        />
                }
            </div>
        )
    }
}


export default PaginationContainers;