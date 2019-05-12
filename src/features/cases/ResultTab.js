import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import { getCDNimage } from '../common/utils/';


export default class ResultTab extends Component {
  static propTypes = {
    mode: PropTypes.number.isRequired,
    cover: PropTypes.string,
    guideMap: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentTab: props.mode === 0 ? 0 : props.mode - 1,
      activeIndex: -1,
      activeInputVal: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mode } = this.props;
    const { mode: nextMode } = nextProps;

    if (mode !== nextMode) {
      this.setState({
        currentTab: nextMode === 0 ? 0 : nextMode - 1,
      });
    }
  }

  changeCurrentTab = (mode) => {
    this.setState({
      currentTab: mode === 0 ? 0 : mode - 1,
    });
  }

  /**
   * 激活导览图名字修改
   */
  activeModifyTitle = (index) => {
    const { guideMap } = this.props;

    this.setState({
      activeIndex: index,
      activeInputVal: guideMap[index].title,
    });
  }

  disableModifyTitle = (e) => {
    const { guideMap, startLocation, updateGuideMap } = this.props;
    const { value } = e.target;

    const currentActiveIndex = this.state.activeIndex;
    guideMap[currentActiveIndex].title = value;
    // 更新导览图
    updateGuideMap(guideMap, startLocation);

    this.setState({
      activeIndex: -1,
      activeInputVal: '',
    });
  }

  deleteGuideMap = (index) => {
    const { guideMap, startLocation, updateGuideMap } = this.props;
    guideMap.splice(index, 1);

    updateGuideMap(guideMap, startLocation);
  }

  changeGuideMapTitle = (e) => {
    const { value } = e.target;

    this.setState({
      activeInputVal: value,
    });
  }

  showTagEditPanel = (tagId) => {
    this.props.showTagEditPanel && this.props.showTagEditPanel(tagId);
  }

  render() {
    const { currentTab, activeIndex, activeInputVal } = this.state;
    const { startLocation, guideMap, tags } = this.props;
    // const titles = ['起始点', '导览图', '标签'];
    const titles = ['起始点', '导览图'];

    return (
      <div className="cases-edit-body-result">
        <div className="cases-edit-result-header">
          {
            titles.map((item, index) => <div
              key={index}
              onClick={() => { this.changeCurrentTab(index + 1); }}
              className={ currentTab === index ?
                'cases-edit-result-header-item selected' :
                'cases-edit-result-header-item' }
            >
              {item}
            </div>)
          }
        </div>
        <div className="cases-edit-result-body">
          {
            currentTab === 0 && <div className="cases-edit-result-cover">
              <div className="cases-edit-result-cover-container" style={{ backgroundImage: `url(${getCDNimage(startLocation.coverImageUrl, 400)})` }}>
                { !startLocation.eyeRay && <span>暂无起始点封面</span> }
              </div>
              <div>起始点封面</div>
            </div>
          }
          {
            currentTab === 1 && guideMap.map((item, index) => <div
              key={index}
              className="cases-edit-result-body-item"
            >
              <div className="cases-edit-result-body-img" style={{ backgroundImage: `url(${getCDNimage(item.coverImageUrl, 110)})` }}>
                <div className="cases-edit-result-body-delete" onClick={() => { this.deleteGuideMap(index); }}>
                  <Icon className="case-card-info-icon" type="delete" />
                </div>
              </div>
              {
                activeIndex === index ? <Input className="cases-edit-result-body-input" size="small" value={activeInputVal} onPressEnter={this.disableModifyTitle} onChange={this.changeGuideMapTitle} /> :
                <div className="cases-edit-result-body-title" onClick={() => { this.activeModifyTitle(index); }}>{item.title}</div>
              }
            </div>)
          }
          {
            currentTab === 2 && tags.map((tag, index) => <div
              key={index}
              className="cases-edit-result-body-item cases-edit-result-body-tag"
              onClick={() => { this.showTagEditPanel(tag.tagId); }}
            >
              <div className="cases-edit-result-body-img" style={{ backgroundImage: `url(${tag.tagIcon})` }} />
              <div className="cases-edit-result-body-title">{tag.description}</div>
            </div>)
          }
        </div>
      </div>
    );
  }
}
