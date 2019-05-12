import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Popover } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { timeFormatter, getCDNimage } from '../common/utils/';


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

const StyledCtnr = styled.div`
  position: relative;
  width: 224px;
  height: 247px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fafafa;
  border: ${props => props.selected ? '1px solid #2e7dfb' : '1px solid #dedede'};
  &:hover {
    border: 1px solid #2E7DFB;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .3);
    transition: all .3s;
  }
`;

const StyledCtnrInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 224px;
  height: 247px;
`;

const StyledTitle = styled.p`
  font-size: 14px;
  color: #4a4a4a;
  line-height: 18px;
  width: 194px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
`;

const StyledDesc = styled.p`
  font-size: 13px;
  color: #9b9b9b;
  line-height: 24px;
  height: 48px;
`;

export default class Card extends Component {
  static propTypes = {
    area: PropTypes.number,
    cover: PropTypes.string,
    time: PropTypes.number,
    id: PropTypes.number,
    title: PropTypes.string,
    roomCount: PropTypes.number,
    gmtModified: PropTypes.number,
    styleList: PropTypes.array,
    selected: PropTypes.bool,
  };

  state = {
    hovered: false
  }

  handlePostSampleClick = () => {
    const { id, handlePost } = this.props;
    handlePost(id);
  }

  handleDeleteSampleClick = () => {
    const { id, handleDelete } = this.props;
    handleDelete(id);
  }

  renderHoverActions = () => {
    const { id, hoverDisabled = false } = this.props;
    const { hovered } = this.state;

    if (hovered && !hoverDisabled) {
      return (
        <StyledCtnrInner>
          <Link className="preview" to={`/samples/preview/${id}`}><Button>预览</Button></Link>
          <div className="actions">
            <Popover placement="bottom" content="编辑">
              <Link to={`/samples/sample-form/${id}`} className="case-card-info-icon">
                <Icon className="icon" type="edit" />
              </Link>
            </Popover>
            <Popover placement="bottom" content="投稿"><Icon className="icon" type="mail" onClick={this.handlePostSampleClick} /></Popover>
            <Popover placement="bottom" content="删除"><Icon className="icon" type="delete" onClick={this.handleDeleteSampleClick} /></Popover>
          </div>
        </StyledCtnrInner>
      );
    }
    return null;
  }

  render() {
    const {
      title,
      roomCount,
      area,
      cover,
      gmtModified,
      styleList,
      selected
    } = this.props;

    return (
      <StyledCtnr
        selected={selected}
        className="card-ctnr"
        onMouseEnter={() => this.setState({hovered: true})}
        onMouseLeave={() => this.setState({hovered: false})}
      >
        <div className="cover" style={{backgroundImage: `url(${getCDNimage(cover, 224)})`}}></div>
        <div className="card-info">
          <StyledDesc>
            {
              title ? (
                <StyledTitle>{title}</StyledTitle>
              ) : null
            }
            {
              area ? (
                <p className="styles">{roomCount}居室&nbsp;{area}平米&nbsp;{styleList && styleList.map(style => `${stylesMap[style]} `)}</p>
              ) : null
            }
            {
              gmtModified ? (
                <p className="styles">{timeFormatter(gmtModified)}</p>
              ) : null
            }
          </StyledDesc>
        </div>
        {this.renderHoverActions()}
      </StyledCtnr>
    );
  }
}
