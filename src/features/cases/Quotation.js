import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Tabs, Table } from 'antd';

import QuotationInfo from './QuotationInfo';
import CollapseTable from './CollapseTable';
import CONSTANTS from './constants';
import * as actions from './redux/actions';

const TabPane = Tabs.TabPane;

export class Quotation extends PureComponent {
  static propTypes = {
    cases: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { actions, match } = this.props;
    const { id } = match.params;

    if (!id) {
    } else {
      actions.fetchQuotation({ id });
    }
  }

  componentWillUnmount() {
    const { clearQuotation } = this.props.actions;
    // 清除redux内保存的数据，防止下次进来报价单页面时出现缓存数据
    clearQuotation();
  }

  renderTabHeader(key, title, price) {
    return (
      <div className="quotation-tab-header" key={key}>
        <div className="quotation-tab-header-title">{title}</div>
        <div>
          总价：<span className="red-color">{price}</span>
        </div>
      </div>
    );
  }

  render() {
    const { fetchQuotationError, quotation } = this.props.cases;

    const general = quotation.general || {};

    return (
      <div className="cases-quotation">
        <div className="cases-quotation-block">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/cases/library">返回</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>报价单预览</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        { fetchQuotationError ? <div>报价单信息获取失败，请稍后重试!</div> : <div className="cases-quotation-body">
          <QuotationInfo {...general} />
          <div className="cases-quotation-detail">
            <Tabs className="cases-quotation-detail-tab" tabBarStyle={{ background: '#ffffff', marginBottom: '0px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
              {
                CONSTANTS.TYPES.map(tabKey => {
                  const data = quotation[tabKey] || {};
                  const { rooms = [], outline = [] } = data;

                  return (
                    <TabPane
                      key={tabKey}
                      tab={this.renderTabHeader(tabKey, CONSTANTS[tabKey], general[tabKey])}
                    >
                      <div className="cases-quotation-outline">
                        <Table
                          rowClassName="cases-collapse-table-line"
                          dataSource={outline}
                          columns={CONSTANTS.generalColumn}
                          pagination={false}
                        />
                      </div>
                      <div className="quotation-detail-title">{CONSTANTS[tabKey]}花费详单</div>
                      <Tabs className="cases-quotation-detail-sub-tab">
                        {
                          rooms.map((room, index) => <TabPane tab={room.room_name} key={index}>
                            {
                              /* 每项都是一个可收起展开的tab */
                              CONSTANTS.DETAIL.map(item => {
                                return !!room[item] ? <CollapseTable
                                  type={item}
                                  total={room.room_total_price || ''}
                                  excess={room.excess_total_price || ''}
                                  columns={CONSTANTS[`${item}Column`]}
                                  data={room[item]}
                                /> : null
                              })
                            }
                          </TabPane>)
                        }
                      </Tabs>
                    </TabPane>
                  );
                })
              }
            </Tabs>
          </div>
        </div> }
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
)(Quotation);
