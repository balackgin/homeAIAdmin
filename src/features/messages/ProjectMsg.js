import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { messageTpl } from './constants';
import { timeFormatter } from '../common/utils/';
import { List } from './';

export class ProjectMsg extends Component {
  static propTypes = {
    messages: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { fetchMessageList } = this.props.actions;
    const { projectCurPage } = this.props.messages;
    fetchMessageList('project', projectCurPage);
  }

  handlePaginationChange = (page) => {
    const { fetchMessageList } = this.props.actions;
    fetchMessageList('project', page);
  }

  getTableColumns = () => {
    const columns = [{
      title: '消息内容',
      dataIndex: 'content',
      key: 'content'
    }, {
      title: '时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
    render: (text, record) => (<Link to={`/project/detail/${record.id}`}>查看</Link>)
    }];
    return columns;
  }

  getTableDataSource = () => {
    const { messageList } = this.props.messages;
    return messageList.map(messageItem => {
      const { attributes, modifiedTime, type } = messageItem;
      return {
        ...messageItem,
        content: messageTpl(type, attributes),
        modifiedTime: timeFormatter(modifiedTime)
      }
    });
  }

  render() {
    const { totalCount, projectCurPage, fetchMessageListPending } = this.props.messages;
    const columns = this.getTableColumns();
    const dataSource = this.getTableDataSource();
    const pagination = {
      total: totalCount,
      size: 10,
      onChange: this.handlePaginationChange,
      showQuickJumper: true,
      current: projectCurPage
    }

    return (
      <List
        loading={fetchMessageListPending}
        totalCount={totalCount}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    messages: state.messages,
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
)(ProjectMsg);
