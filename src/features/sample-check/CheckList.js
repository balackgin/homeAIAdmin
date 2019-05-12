import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Tabs, Popover, Icon } from 'antd';
import * as actions from './redux/actions';
import { timeFormatter } from '../common/utils/';

const { TabPane } = Tabs;
const statusMap = {
  UNCHECKED: '未审核',
  REFUSED: '未通过'
}

export class CheckList extends Component {
  static propTypes = {
    sampleCheck: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { fetchSampleCheckList } = this.props.actions;
    const { curPage, curType } = this.props.sampleCheck;
    fetchSampleCheckList(curPage[curType], curType);
  }

  handleTabChange = (key) => {
    const { fetchSampleCheckList } = this.props.actions;
    const { curPage } = this.props.sampleCheck;
    fetchSampleCheckList(curPage[key], key);
  }

  handlePaginationChange = (page) => {
    const { fetchSampleCheckList } = this.props.actions;
    const { curType } = this.props.sampleCheck;
    fetchSampleCheckList(page, curType);
  }

  getTableColumns = () => {
    const columns = [{
      title: '投稿标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '投稿人',
      dataIndex: 'author',
      key: 'author'
    }, {
      title: '时间',
      dataIndex: 'lastOpTime',
      key: 'lastOpTime',
      render: (text) => timeFormatter(text)
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (record.status === 'REFUSED') {
          return (
            <p>
              {statusMap[text]}
              <Popover content={`拒绝原因：${record.refuseReason}`}>
                <Icon style={{color: '#f5a623'}} type="warning"></Icon>
              </Popover>
            </p>
          );
        } else {
          return (<p>{statusMap[text]}</p>);
        }
      }
    }, {
      title: '操作',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      render: (_, record) => {
        if (record.status === 'REFUSED') {
          return (<Link to={`/operator/preview/${record.id}`}>查看</Link>)
        }
        return (<Link to={`/sample-check/check/${record.id}`}>去审核</Link>)
      }
    }];
    return columns;
  }

  getTableDataSource = () => {
    const { sampleCheckList } = this.props.sampleCheck;
    return sampleCheckList.map(sampleItem => {
      return {
        ...sampleItem,
      }
    });
  }

  render() {
    const { totalCount, curPage, statusCount, curType } = this.props.sampleCheck;
    const columns = this.getTableColumns();
    const dataSource = this.getTableDataSource();
    const pagination = {
      total: totalCount,
      size: 10,
      onChange: this.handlePaginationChange,
      showQuickJumper: true,
      current: curPage[curType]
    }

    return (
      <div className="card-body">
        <Tabs onChange={this.handleTabChange} activeKey={curType}>
          {
            Object.keys(statusMap).map(status => <TabPane tab={`${statusMap[status]}(${statusCount[status]})`} key={status} />)
          }
        </Tabs>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={pagination}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    sampleCheck: state.sampleCheck,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckList);
