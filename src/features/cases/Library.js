import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Pagination, Button, Icon } from 'antd';

import Card from './Card';
import * as actions from './redux/actions';

const noop = () => {};

export class Library extends Component {
  static propTypes = {
    cases: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { current } = this.props.cases;
    const { fetchCases = noop } = this.props.actions;

    fetchCases({ current });
  }

  changePage = (page) => {
    const { fetchCases = noop } = this.props.actions;

    fetchCases({ current: Math.max(1, page) });
  }

  deleteCase = (caseId) => {
    const { deleteCase = noop } = this.props.actions;
    
    deleteCase({
      caseId,
      cb: () => { this.changePage(1); },
    });
  }

  render() {
    const { cases = {} } = this.props;
    const { current = 1, total = 0, pageSize, list = [] } = cases;

    return (
      <div className="case-library">
        <div className="case-library-header">
          {/* 跳转按钮，跳转到homestyler */}
          <Button type="primary" size="small" target="_blank" href="/designer/case/create">
            <Icon type="plus" />
            新建方案
          </Button>
        </div>
        <div className="table-body">
          <div className="case-library-body-title">全部方案（{total}）</div>
          <div className="case-library-body-list">
            {
              list.map((item, index) => <Card deleteCase={this.deleteCase} key={index} {...item} />)
            }
          </div>
          <Pagination
            className="case-library-body-pagination"
            showQuickJumper
            current={current}
            total={total}
            pageSize={pageSize}
            onChange={this.changePage}
          />
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    cases: state.cases,
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
)(Library);
