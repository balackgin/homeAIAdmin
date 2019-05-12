import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import styled from 'styled-components';
import { Card } from '../operator';
import { Pagination, Select, Spin, Modal, Input } from 'antd';
const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

const statusMap = {
  ONLINE:'已发布',
  CHECKED: '待发布',
  OFFLINE: '已下线'
};

const StyleContirbutions = styled.div`
  display: flex;
  background: ${props => props.bgColor || '#fff'};
  padding: ${props => props.pad || '0 0 24px 0'};
  flex-direction: ${props => props.direction || 'column'};
`;
const StyleCardlist = styled.div`
  background: #fff;
  border-radius: 6px;
  padding: 20px 30px;
  margin: 0 auto;
  transition: all linear .3s;
  >span {
    width: 320px;
  }
`;
const CardList = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
const StylePagination = styled(Pagination)`
  text-align: right;
`;
const SearchKeyword = styled(Search)`
  height: 32px !important;
  width: 360px !important;
  margin-top: 3px !important;
`;
const NoData = styled.div`
  width: 100%;
  padding: 15px;
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
`;

export class OperatCases extends Component {
  static propTypes = {
    operator: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.getOperations = this.props.actions.getOperations;
  }
  
  componentDidMount() { // 获取数据
    const { page, centerStatus, keyword, size } = this.props.operator;
    this.getOperations({ page, centerStatus, keyword, size });
  }

  changePage = (page) => { // 分页请求
    const { keyword, size, status } = this.props.operator;
    this.getOperations({page, size, status, keyword});
  }

  operateCases = (e, action) => { // 删除案例操作
    const sampleId = e.target.getAttribute('dataid') || null;
    const { operateCases } = this.props.actions;
    const { deleteCasesPending } = this.props.operator;

    const titleMap = {
      online: '确定要发布案例吗？',
      offline: '确定要下线案例吗？',
      delete: '确定要删除案例吗？',
    };

    confirm({
      title: titleMap[action],
      onOk() {
        operateCases({ action, sampleId });
      },
      visiable: deleteCasesPending,
      onCancel() {},
    })
  }

  searchValue = (value) => { // 搜索案例
    const { status } = this.props.operator;
    this.props.actions.getOperations({keyword: value || '', page: 1, size: 12, status});
  }

  changeKeywrd = e => {
    const { saveKeyword } = this.props.actions;
    const keyword = e.target.value
    saveKeyword(keyword)
  }

  tabType = value => { // 根据状态请求数据
    const { keyword = '' } = this.props.operator;
    this.getOperations({status: value, page: 1, size: 12, keyword});
  }

  tabList = () => { // tab标题

    return Object.keys(statusMap).map((status) => {
      return {
        tab: statusMap[status],
        key: status
      }
    })
  }
  
  render() {
    const { page, getOperationsPending, operations, totalCount } = this.props.operator;
    const tabArr = this.tabList();
    const deafultTabList = Object.keys(statusMap);
    const cardMap = {
      CHECKED: {
        bgColor: '#91D5FF',
        browseText: '预览',
        typeArr: [{
          iconType: 'cloud-upload',
          color: '#4a4a4a',
          reviewMsg: '上架',
          // hasLink: '#/operator/preview/'
          onClick: e => { this.operateCases(e, 'online'); }
        }, {
          iconType: 'delete',
          color: '#4a4a4a',
          reviewMsg: '删除',
          onClick: e => { this.operateCases(e, 'delete'); }
        }]
      },
      ONLINE: {
        bgColor: '#22A689',
        browseText: '预览',
        typeArr: [{
          iconType: 'file-excel',
          color: '#4a4a4a',
          reviewMsg: '下架',
          onClick: e => { this.operateCases(e, 'offline'); }
        }]
      },
      
      OFFLINE:  {
        bgColor: null,
        typeArr: [{
          iconType: 'delete',
          color: '#4a4a4a',
          reviewMsg: '删除',
          onClick: e => { this.operateCases(e, 'delete'); }
        }]
      }
    }

    return (
      <Spin spinning={getOperationsPending}>
        <StyleContirbutions bgColor="#fafafa" className="operator-operat-cases">
          <div className="operator-search-form">
            <SearchKeyword placeholder="输入关键字搜索" onSearch={this.searchValue} enterButton="搜索"/>
            <div className="selector">
              <span>状态：</span>
              <Select className="sign-list" onChange={this.tabType} mode="multiple" defaultValue={deafultTabList}>
              {
                tabArr.map(item => (
                  <Option key={item.key} dataid={item.key}>{item.tab}</Option>
                ))
              }
              </Select>
            </div>
          </div>
          <StyleCardlist className="operate-card-list">
            <div className="operate-card-list-title">全部案例（{totalCount}）</div>
            <CardList>
            {
              operations.length !== 0 ? operations.map((item,index) =>(
                <Card
                  className="card-item"
                  recordItem={item}
                  key={index}
                  statusMap={statusMap}
                  actions={this.props.actions}
                  cardMap={cardMap}
                />
              ))
              : <NoData>暂无数据</NoData>
            }
            </CardList>
            <StylePagination showQuickJumper total={totalCount} defaultCurrent={1} current={page} pageSize={12} onChange={this.changePage} />
          </StyleCardlist>
        </StyleContirbutions>
      </Spin>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    operator: state.operator,
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
)(OperatCases);