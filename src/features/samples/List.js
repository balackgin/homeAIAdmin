import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon, Pagination, Input, Modal } from 'antd';
import { Link } from 'react-router-dom';

import * as actions from './redux/actions';
import { Card } from './';

const { Search } = Input;

export class List extends Component {
  static propTypes = {
    samples: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { fetchSampleList } = this.props.actions;
    const { curPage, keyword } = this.props.samples;
    fetchSampleList(curPage, keyword);
  }

  handlePaginationChange = (page) => {
    const { fetchSampleList } = this.props.actions;
    const { keyword } = this.props.samples;
    fetchSampleList(page, keyword);
  }

  handleSearch = (keyword) => {
    const { fetchSampleList } = this.props.actions;
    fetchSampleList(1, keyword);
  }

  handlePostClick = (id) => {
    const { postSampleAction } = this.props.actions;
    Modal.confirm({
      title: '投稿',
      content: '确认投稿吗？',
      onOk() {
        postSampleAction(id, 'post');
      },
      onCancel() {},
    });
  }

  handleDeleteClick = (id) => {
    const { postSampleAction } = this.props.actions;
    Modal.confirm({
      title: '删除',
      content: '确认删除吗？',
      onOk() {
        postSampleAction(id, 'delete');
      },
      onCancel() {},
    });
  }

  render() {
    const { totalCount, sampleList, curPage, keyword } = this.props.samples;

    return (
      <Fragment>
        <div className="header">
          <Search
            className="search"
            placeholder="输入案例名称搜索"
            enterButton="搜索"
            defaultValue={keyword}
            onSearch={this.handleSearch}
          />
          <Link to="/samples/sample-form/new">
            <Button
              type="primary"
              size="small"
              target="_blank"
              className="search-button"
            >
              <Icon type="plus" />
              新建案例
            </Button>
          </Link>
        </div>
        <div className="table-body">
          <div className="list-title">全部案例（{totalCount}）</div>
          <div className="card-ctnr">
            {
              sampleList.map((sampleItem, index) => {
                const {
                  id,
                  styleList,
                  title,
                  roomCount,
                  area,
                  gmtModified,
                  cover
                } = sampleItem;
                return (
                  <div className="sample-list-card">
                    <Card
                      key={id}
                      id={id}
                      handlePost={this.handlePostClick}
                      handleDelete={this.handleDeleteClick}
                      roomCount={roomCount}
                      area={area}
                      title={title}
                      styleList={styleList}
                      gmtModified={gmtModified}
                      cover={cover}
                    />
                  </div>
                );
              })
            }
          </div>
          <Pagination
            className="pagination"
            showQuickJumper
            total={totalCount}
            pageSize={8}
            current={curPage}
            onChange={this.handlePaginationChange}
          />
        </div>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    samples: state.samples,
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
)(List);
