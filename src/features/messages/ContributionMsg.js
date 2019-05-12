import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from './redux/actions';
import { timeFormatter } from '../common/utils/';
import { Popover, Icon } from 'antd';
import { List } from './';

const messageTpl = (type, title) => {
  const tpl = {
    PASS: `您的投稿“${title}”审核已通过，等待发布中`,
    ONLINE: `您的投稿“${title}”已发布`,
    REFUSE: `您的投稿“${title}”审核未通过`,
  }
  return tpl[type];
}

export class ContributionMsg extends Component {
  static propTypes = {
    messages: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { fetchMessageList } = this.props.actions;
    const { contributionCurPage } = this.props.messages;
    fetchMessageList('contribution', contributionCurPage);
  }

  handlePaginationChange = (page) => {
    const { fetchMessageList } = this.props.actions;
    fetchMessageList('contribution', page)
  }

  getTableColumns = () => {
    const columns = [{
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => <div>{text}{record.message ? (<Popover content={record.message}>
    <Icon className="warning-icon" type="warning" /></Popover>) : ''}</div>
    }, {
      title: '时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => <Link to={`/samples/preview/${record.sampleId}`}>预览</Link>
    }];
    return columns;
  }

  getTableDataSource = () => {
    const { messageList } = this.props.messages;
    return messageList.map(messageItem => {
      const { sampleTitle, gmtModified, event } = messageItem;
      return {
        ...messageItem,
        content: messageTpl(event, sampleTitle),
        gmtModified: timeFormatter(gmtModified)
      }
    });
  }

  render() {
    const { totalCount, contributionCurPage, fetchMessageListPending } = this.props.messages;
    const columns = this.getTableColumns();
    const dataSource = this.getTableDataSource();
    const pagination = {
      total: totalCount,
      size: 10,
      onChange: this.handlePaginationChange,
      showQuickJumper: true,
      current: contributionCurPage
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
)(ContributionMsg);
