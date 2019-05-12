import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Card, Checkbox } from 'antd';
import styled from 'styled-components';
import { timeFormatter, getCDNimage } from '../common/utils/';
const { Meta } = Card;

const stylesMap = {
  JP: '日式',
  SCANDINAVIAN: '北欧',
  KR: '韩式',
  MASHUP: '混搭',
  EUR: '欧式',
  CN: '中式',
  NEOCLASSICAL: '新古典',
  SE_ASIA: '东南亚',
  AM: '美式',
  PASTORAL: '田园',
  MODERN: '现代',
  MED: '地中海',
  OTHER: '其他'
};

const StyleSpan = styled.span`
  position: absolute;
  height: 21px;
  top: 10px;
  left: 0;
  padding: 0 5px;
  color: #fff;
  line-height: 21px;
  font-size: 12px;
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  text-align: center;
  background-color: ${props => props.backColor || '#4a4a4a'};
`;
const BrowseButton = styled.a`
  position: absolute;
  width: 76px;
  height: 24px;
  line-height: 24px;
  left: 50%;
  top: 63px;
  color: #2E7DFB;
  text-align: center;
  font-size: 12px;
  margin-left: -38px;
  border-radius: 12px;
  background: rgba(255,255,255,.7);
  transition: all 0.3s;
`
const CardTitle = styled.h1`
  height: 22px;
  font-size: 14px;
  line-height: 22px;
  margin: -4px 0 3px 0;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
`
const CommStyle = styled.p`
  position: absolute;
  display: flex;
  font-size: 18px;
  line-height: 18px;
  left: ${props => props.selfLeft};
  top: ${props => props.selfTop};
  right: ${props => props.selfRight};
  bottom: ${props => props.selfBottom};
  >:nth-child(n) {
    margin-left: 4px;
  }
`
const CardSpan = styled.span`
  margin-right: 5px;
  color: ${props => props.color || '#9b9b9b'};
  font-size: 14px;
`;
const ModifyTime = styled.div`
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #9b9b9b;
`;
const HoverSelect = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  border: 2px solid #2E7DFB;
  top: 0;
  left: 0;
`
const OperationBox = styled(Checkbox)`
  position: absolute;
  right: 4px;
  top: 4px;
`;
const HouseStyle = styled.p`
  height: 25px;
  line-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-bottom: 5px;
`;

export default class Cards extends Component {
  static propTypes = {
    statusMap: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    recordItem: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverStatus: false,
      clickStatus: false
    }
  }

  renderStatus = () => { // 渲染状态
    const { cardMap = {}, statusMap = {} } = this.props;
    const { status } = this.props.recordItem;
    const { bgColor } = cardMap[status] || {};
    return (
      <StyleSpan backColor={bgColor}>{statusMap[status]}</StyleSpan>
    )
  }

  mouseEnterStyle = (e) => { // 鼠标进入
    const { hoverStatus } = this.state;
    if(hoverStatus) {
      return ;
    }
    e.preventDefault()
    this.setState((state)=>(
      {
        hoverStatus: true
      }
    ))
  }
 
  targetStatus = e => { // 点击勾选 730buyong
    const { clickStatus } = this.state;
    const { checked, value } = e.target;
    const { samplesId } = this.props.operator;
    
    this.props.actions.changeOpList({checked, samplesId, sampleId: value});
    this.setState(()=>(
      {
        clickStatus: !clickStatus
      }
    ))
  }

  mouseOutStyle = e => { // 
    e.preventDefault()
    this.setState((state)=>(
      {
        hoverStatus: false
      }
    ))
  }

  renderComments = () => {
    const { status, likeCount, commentCount , browseCount } = this.props.recordItem;

    if (status === 'ONLINE' || status === 'OFFLINE') {
      return (
        <CommStyle selfLeft="14px" selfTop="133px">
          <CardSpan color="#009ad6">
            <Icon type="eye" />&nbsp;
            {browseCount}
          </CardSpan>
          <CardSpan color="#009ad6">
            <Icon type="profile" />&nbsp;
            {commentCount}
          </CardSpan>
          <CardSpan color="#009ad6">
            <Icon type="heart" />&nbsp;
            {likeCount}
          </CardSpan>
        </CommStyle>
      )
    }
  }

  renderOperate = () => {
    const { status, message, id } = this.props.recordItem;
    const { cardMap = {} } = this.props;
    const { typeArr = [] } = cardMap[status] || {};
    return (
      <CommStyle selfBottom="10px" selfRight="10px">
        {
          typeArr.map((item, index)=> (
            <Popover placement="bottomRight" content={item.reviewMsg || message} trigger="hover" key={index}>
              {
                item.hasLink
                ? 
                <a href={item.hasLink + id}><Icon type={item.iconType} style={{color: item.color || '#4a4a4a'}}/></a>
                :
                item.iconType && <Icon type={item.iconType} style={{color: item.color || '#4a4a4a'}} dataid={id} onClick={item.onClick}/>
              }
            </Popover>
          ))
        }
      </CommStyle>
    )
  }

  renderHoverSelect() {
    const { clickStatus, hoverStatus } = this.state;
    const { id } = this.props.recordItem;
    if (clickStatus || hoverStatus) {
      return (
        <HoverSelect>
          <OperationBox checked={this.state.clickStatus} value={id} onClick={this.targetStatus}/>
        </HoverSelect>
      )
    }
    return null;
  }

  render() {
    let { 
      cover,
      title,
      roomCount = null,
      userNick = null,
      area = 0,
      styleList = [],
      gmtModified = 0,
      status,
      styles = [],
      lastOpTime,
      id
    } = this.props.recordItem;
    const { cardMap = {}, showStatus = true, checkBox = false } = this.props;
    const { browseText = '' } = cardMap[status] || {};
    const { hoverStatus } = this.state;

    if(styles.length === 0) styles = styleList;
    if(!gmtModified) gmtModified = lastOpTime;
    return (
      <Card
        hoverable="true"
        className={this.props.className}
        style={{width: 216, height: 247}}
        bodyStyle={{padding: 15}}
        cover={<img alt="example" style={{height: 158}} src={`${getCDNimage(cover, 400)}`} />}
        onMouseEnter={this.mouseEnterStyle}
        onMouseLeave={this.mouseOutStyle}
      >
        {
          showStatus && this.renderStatus() // 状态显示
        }
        {
          hoverStatus  && this.renderOperate() // 显示hover操作
        }
        {
          checkBox && this.renderHoverSelect() // 显示hover操作
        }
        {
          // this.renderComments() // 评论显示 830
        }
        <Meta title={<CardTitle title={title}>{title}</CardTitle>} />
          { hoverStatus && <BrowseButton href={`#/operator/preview/${id}`}>{browseText || '预览'}</BrowseButton> }
          <HouseStyle>
            {userNick && <CardSpan>{userNick} |</CardSpan>}
            <CardSpan>{roomCount}居室</CardSpan>
            <CardSpan>{area}㎡</CardSpan>
            {
              styles && styles.map((style, index) => <CardSpan key={index}>{stylesMap[style]}</CardSpan>)
            }
          </HouseStyle>
          <ModifyTime>{timeFormatter(gmtModified)}</ModifyTime>
      </Card>
    );
  }
}