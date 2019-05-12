import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Tabs, Table, Button, Row, Col, Input } from 'antd';
import styled from 'styled-components';
import {
  fetchProjectList
} from './redux/actions';
import { timeFormatter } from '../common/utils/';

const { TabPane } = Tabs;
const { Search } = Input;

const statusMap = {
  total: '全部项目',
  WAITING_RESPONSE: '待响应',
  WAITING_DESIGN: '待设计',
  WAITING_CONFIRM: '待确认',
  CONFIRMED:'已确认',
  SIGNED:'已签单'
}

const StyledRow = styled.div`
  display: flex;
  flex-direction: column;
`;

export class List extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    const { fetchProjectList } = this.props.actions;
    const { curTab, curPage, keyword } = this.props.project;
    fetchProjectList(curTab, curPage, keyword);
  }

  handleSearch = (keyword) => {
    const { fetchProjectList } = this.props.actions;
    const { curTab, curPage } = this.props.project;
    fetchProjectList(curTab, curPage, keyword);
  }

  handleTabsChange = (tab) => {
    const { fetchProjectList } = this.props.actions;
    const { curPage, keyword } = this.props.project;
    fetchProjectList(tab, curPage, keyword);
  }

  handlePaginationChange = (page) => {
    const { fetchProjectList } = this.props.actions;
    const { curTab, keyword } = this.props.project;
    fetchProjectList(curTab, page, keyword);
  }

  getTableColumns = () => {
    const columns = [
      {
        title: '客户',
        dataIndex: 'userNick',
        key: 'userNick',
      },  {
        title: '户型',
        dataIndex: 'houseLayout',
        key: 'houseLayout',
        render: (text, record) => (
          <StyledRow>
            <span>{record.houseAddress}</span>
            <span>{record.houseLayout}</span>
            <img src={record.houseImage} alt=""/>
          </StyledRow>
        )
      }, {
        title: '指派时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: text => timeFormatter(text),
        sorter: (a, b) => a - b
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: text => timeFormatter(text),
        sorter: (a, b) => a - b
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => statusMap[text]
      }, {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => (
          <StyledRow>
            <Link to={`/project/detail/${record.id}`}>
              <Button type="default">查看详情</Button>
            </Link>
            <Link to={``}>
              <Button type="primary">联系客户</Button>
            </Link>
          </StyledRow>
        )
      }
    ];
    return columns;
  }

  renderSearch = () => {
    return (
      <Card>
        <Col span={8}>
          <Search
            placeholder="input search text"
            enterButton="搜索"
            onSearch={this.handleSearch}
          />
        </Col>
      </Card>
    );
  }

  renderTabs = () => {
    const { statusTotalCount, totalCount, curTab } = this.props.project;
    const count = {
      ...statusTotalCount,
      total: totalCount
    }
    const tabList = Object.keys(statusMap).map(key => {
      return {
        tab: `${statusMap[key]}(${count[key] || 0})`,
        key
      };
    });

    return (
      <Tabs
        onChange={this.handleTabsChange}
        activeKey={curTab}
      >
        {
          tabList.map(tabItem => (
              <TabPane
                tab={tabItem.tab}
                key={tabItem.key}
              />
            ))
        }
      </Tabs>
    );
  }

  renderTable = () => {
    const { totalCount , fetchProjectListPending } = this.props.project;
    const { projectList, curPage } = this.props.project;

    const columns = this.getTableColumns();
    return (
      <Table
        loading={fetchProjectListPending}
        dataSource={projectList}
        rowKey="id"
        columns={columns}
        pagination={{
          total: totalCount,
          size: 10,
          onChange: this.handlePaginationChange,
          showQuickJumper: true,
          current: curPage
        }}
      />
    );
  }

  render() {
    return (
      <Fragment>
        <Row>
          {this.renderSearch()}
        </Row>
        <Row>
          <Card>
            {this.renderTabs()}
            {this.renderTable()}
          </Card>
        </Row>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    project: state.project
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      fetchProjectList
    }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);