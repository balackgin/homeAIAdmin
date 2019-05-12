import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Card } from '../operator';
import { Pagination, Input, Tabs, Spin, Modal } from 'antd';
import styled from 'styled-components';
const { Search } = Input;;
const { TabPane } = Tabs;
const { confirm } = Modal

const statusMap = {
  total: '全部案例',
  RECALLED: '已撤回',
  UNCHECKED: '待审核',
  REFUSED: '未通过',
  CHECKED:'待发布',
  ONLINE:'已发布',
  OFFLINE: '已下线',
};

const StyleContirbutions = styled.div`
  display: flex;
  background: ${props => props.bgColor || '#fff'};
  padding: ${props => props.pad || '0 0 24px 0'};
  flex-direction: ${props => props.direction || 'column'};
`;
const StyleCardlist = styled.div`
  display: block;
  box-sizing: border-box;
  margin: 0 auto 15px;
  background: #fff;
  border-radius: 6px;
  padding: 15px 30px;
  transition: all linear .3s;
  >span {
    width: 360px;
  }
`;
const StylePagination = styled(Pagination)`
  text-align: right;
`;
const NoData = styled.div`
  width: 100%;
  padding: 15px;
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
`;

export class Records extends Component {
  static propTypes = {
    contribution: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  
  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    const { clearContribution } = this.props.actions;

    clearContribution();
  }

  /**
   * 撤回投稿
   */
  deleteCase = (e) => {
    const sampleId = e.target.getAttribute('dataid') || null;
    const { recallContribution } = this.props.actions;
    const { recallContributionPending } = this.props.contribution;

    confirm({
      title: '确定要撤回这个案例吗？',
      onOk: () => {
        recallContribution(sampleId, () => {
          this.fetchData();
        });
      },
      visiable: recallContributionPending,
      onCancel: () => {},
    })
  }

  /**
   * 翻页行为，保持当前的搜索和tab状态
   */
  changeCurrentPage = (page) => {
    const { currentPage, currentTab, keyword } = this.props.contribution;

    if (page !== currentPage) {
      this.fetchData({
        currentPage: page,
        currentTab,
        keyword
      })
    }
  }

  /**
   * 切换当前tab，清空搜索关键词并跳转至第1页，重新请求数据
   */
  changeCurrentTab = (tab) => {
    const { currentTab } = this.props.contribution;

    if (tab !== currentTab) {
      this.fetchData({
        currentPage: 1,
        currentTab: tab,
        keyword: '',
      });
    }
  }

  /**
   * 修改当前的搜索关键词
   */
  changeSearchKeyword = e => {
    const { changeSearchKeyword } = this.props.actions;
    const { value } = e.target;
    
    changeSearchKeyword(value);
  }
  /**
   * 触发搜索，搜索情况下会触发当前页至第1页，保持当前tab
   */
  triggerSearch = () => {
    const { currentTab, keyword } = this.props.contribution;

    // 没有搜索关键词的情况下默认跳到第一个tab
    this.fetchData({
      currentPage: 1,
      currentTab: !keyword ? 'total' : currentTab,
      keyword,
    });
  }

  /**
   * 统一出口获取当前数据
   */
  fetchData = (params = {}) => {
    const { contribution, actions } = this.props;
    const { fetchRecordList } = actions;
    const fetchParams = {
      page: params.currentPage || contribution.currentPage,
      status: params.currentTab || contribution.currentTab,
      currentTab: params.currentTab || contribution.currentTab,
      keyword: params.currentPage ? params.keyword : contribution.keyword,
      size: contribution.pageSize,
    };

    // 请求当前关键词下的所有状态的投稿数量
    fetchRecordList(fetchParams);
  }
  
  render() {
    const {
      fetchRecordListPending,
      sampleList,
      pageSize,
      totalCount,
      statusTotalCount,
      currentPage,
      currentTab,
      keyword,
    } = this.props.contribution;

    const cardMap = {
      total: {
        bgColor: null,
        browseText: '预览',
        typeArr: []
      },
      RECALLED: {
        bgColor: null,
        browseText: '预览',
        typeArr: [
          {
            iconType: 'form',
            hasLink: '#/samples/sample-form/',
            reviewMsg: '编辑',
            color: '#4a4a4a'
          }
        ]
      },
      UNCHECKED: {
        bgColor: null,
        browseText: '预览',
        typeArr: [
          {
            iconType: 'enter',
            hasLink: '',
            reviewMsg: '撤回',
            onClick: this.deleteCase,
            color: '#4a4a4a'
          }
        ]
      },
      REFUSED: {
        bgColor: '#F5A623',
        browseText: '预览',
        typeArr: [
          {
            iconType: 'exclamation-circle-o',
            hasLink: '',
            color: '#F5A623',
            reviewMsg: null
          },
          {
            iconType: 'form',
            hasLink: '#/samples/sample-form/',
            reviewMsg: '编辑',
            color: '#4a4a4a'
          }
        ]
      },
      CHECKED: {
        bgColor: '#50E2E3',
        browseText: '预览',
        typeArr: []
      },
      ONLINE: {
        bgColor: '#22A689',
        browseText: '预览',
        typeArr: []
      },
      OFFLINE:  {
        bgColor: null,
        browseText: '预览',
        typeArr: [
          {
            iconType: 'form',
            hasLink: '#/samples/sample-form/',
            reviewMsg: '编辑',
            color: '#4a4a4a'
          }
        ]
      }
    }

    return (
      <Spin spinning={fetchRecordListPending}>
        <StyleContirbutions bgColor="#fafafa" className="contributions">
          <StyleCardlist className="contributions-title">
            <Search value={keyword} placeholder="输入案例名称搜索" enterButton="搜索" onChange={this.changeSearchKeyword} onSearch={this.triggerSearch}/>
          </StyleCardlist>
          <StyleCardlist className="contributions-container">
            <Tabs activeKey={currentTab} onChange={this.changeCurrentTab}>
              {
                Object.keys(statusMap).map((status) => <TabPane tab={`${statusMap[status]}(${statusTotalCount[status] || 0})`} key={status} />)
              }
            </Tabs>
            <div className="card-list">
            {
              sampleList.length !== 0 ? sampleList.map((item,index) => {
                // 容错
                // item.reviewMsg = item.message;
                return (<Card 
                  className="style-set"
                  recordItem={item}
                  key={index}
                  statusMap={statusMap}
                  actions={this.props.actions}
                  cardMap={cardMap}
                  deleteCase={this.deleteCase}
                />);
              }) : <NoData>暂无数据</NoData>
            }
            </div>
            {
              sampleList.length > 0 && <StylePagination
                showQuickJumper
                current={currentPage}
                pageSize={pageSize}
                total={totalCount}
                onChange={this.changeCurrentPage}
              />
            }
          </StyleCardlist>
        </StyleContirbutions>
      </Spin>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    contribution: state.contribution,
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
)(Records);
