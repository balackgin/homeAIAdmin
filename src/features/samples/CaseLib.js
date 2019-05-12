import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Checkbox, Button, Icon } from 'antd';

import { Card } from '../cases/';

export default class CaseLib extends Component {
  static propTypes = {
    caseList: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired
  };

  state = {
    checkedCase: null,
    curPage: 1,
    caseInfo: {}
  }

  componentDidMount = () => {
    const { fetchCaseList } = this.props;
    fetchCaseList(1);
  }

  handleCheck = (id) => {
    const { checkedCase } = this.state;
    const { caseList } = this.props;
    if (checkedCase === id) {
      this.setState({
        checkedCase: null,
        caseInfo: {}
      });
    } else {
      const caseInfo = caseList.find(caseItem => caseItem.id === id);
      this.setState({
        checkedCase: id,
        caseInfo
      });
    }
  }

  handleConfirmCase = () => {
    const { handleConfirm } = this.props;
    const { checkedCase, caseInfo } = this.state;
    handleConfirm(checkedCase, caseInfo);
  }

  handleCasePageChange = (page) => {
    const { fetchCaseList } = this.props;
    this.setState({curPage: page});
    fetchCaseList(page);
  }

  render() {
    const { caseList = [], count } = this.props;
    const { checkedCase, curPage } = this.state;

    return (
      <div className="case-lib">
        <Button className="new-case-btn" type="primary" target="_blank" href="/designer/case/create">
          <Icon type="plus" />
          新建方案
        </Button>
        <div className="samples-case-lib">
          {
            caseList.map(caseItem => {
              const selected = caseItem.id === checkedCase;
              return (
                <div
                  key={caseItem.id}
                  className="card-select-ctnr"
                  onClick={() => this.handleCheck(caseItem.id)}
                >
                  {
                    selected ? (
                      <Checkbox
                        className="case-checkbox"
                        value={caseItem.id}
                        checked={selected}
                      />
                    ) : null
                  }
                  <Card
                    {...caseItem}
                    disableHover={true}
                  />
                </div>
              );
            })
          }
          {
            caseList.length === 0 && <div className="hint-text">暂无方案</div>
          }
        </div>
        {
          caseList.length > 0 && <Pagination
            className="case-lib-pagination"
            total={count}
            current={curPage}
            pageSize={6}
            onChange={this.handleCasePageChange}
          />
        }
        {
          caseList.length > 0 && <Button type="primary" className="case-confirm" onClick={this.handleConfirmCase}>确认</Button>
        }
      </div>
    );
  }
}
