import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { fetchCityCodes } from '../home/redux/actions';
import { Row, Col, Button, Icon, Breadcrumb } from 'antd';
import { UserForm } from '../settings';
import styled from 'styled-components';
import history from '../../common/history';
import getAvatarUrl from '../common/utils/avatar';

const StyleMessage = styled.div.attrs({
  className: 'message'
})`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px 0 60px 0;
  background: #fafafa;
`;
const PersonContainer=  styled.div`
  display: flex;
  width: ${props => props.conWidth || '100%'};
  min-height: ${props => props.conHeight || ''};
  padding: ${props => props.conPadding || '0'};
`;
const PersonalImg = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 8px;
`;
const StyleInfo = styled.div`
  display: flex;
  margin-left: 20px;
  min-height: 36px;
  line-height: 36px;
  font-size: 14px;
`;
const StyleTitle = styled.div`
  margin-right: 35px;
  min-width: 72px;
`
const PersonalRow = styled(Row)`
  width: 100%;
  min-height: 164px;
  padding-top: 33px;
  border-right: 1px solid #ececec;
`;
const PersonalCol = styled(Col)`
  text-align: center;
  font-size: 14px;
  height: 18px;
  line-height: 18px;
  color: ${props => props.colcolor || '#000'};
  margin-top: ${props => props.top || '0'};
`;
const PersonalMessage = styled.div`
  display: flex;
  width: 440px;
  flex-direction: column;
  padding: 90px 0 0 30px;
`
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

export class Homepage extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleGoBack = () => {
    history.goBack();
  }

  editHandle = () => {
    this.props.actions.changeToEditStatus();
  }

  componentDidMount() {
    const { cityCodes } = this.props;
    const { fetchCityCodes } = this.props.actions;
    
    if (cityCodes.length === 0) {
      fetchCityCodes()
    }
  }

  defaultCitys = () => {
    const { cityCodes = [] } = this.props;
    const districtCodes  = this.props.userInfo.cityCodes || [];
    if(cityCodes.length === 0 || districtCodes.length === 0) return [];
    const flatCityCodes = cityCodes.reduce((accumulator, currentValue) => {
      return [...accumulator, ...currentValue.cities];
    }, []);
    const selected = flatCityCodes.filter(city => districtCodes.includes(city.id)).map(city => city.name);
    return selected;
  }

  renderPersonalInfo = () => {
    const {
      minPrice = 0,
      maxPrice = 0,
      styles = [],
      avatar,
      nick = ''
    } = this.props.userInfo;
    const selectStyles = styles.map(item => (stylesMap[item]));
    const initCitys = this.defaultCitys();

    return (
      <div className="message-show">
        <PersonContainer conWidth="173px" conPadding="55px 0">
          <PersonalRow>
            <PersonalImg src={getAvatarUrl(avatar)} alt="头像"/>
            <PersonalCol offset={2} span={20} colcolor="#4a4a4a">{nick}</PersonalCol>
            <PersonalCol offset={2} span={20} colcolor="#9b9b9b" top="6px">设计师</PersonalCol>
          </PersonalRow>
        </PersonContainer>
        <Button type="default" className="edit-btn" onClick={this.editHandle} size="small"><Icon type="form" />修改信息</Button>
        <PersonalMessage>
          <StyleInfo className="msg-list">
            <StyleTitle>设计价格</StyleTitle>
            <div>{minPrice} - {maxPrice}元/m²</div>
          </StyleInfo>
          <StyleInfo className="msg-list" type="flex">
            <StyleTitle>设计风格</StyleTitle>
            <div>
              {
                selectStyles.map((item,index) => (
                  <span key={index} className="style-list">{item}</span>
                ))
              }
            </div>
          </StyleInfo>
          <StyleInfo className="msg-list" type="flex">
            <StyleTitle>常驻地区</StyleTitle>
            <div>
              {
                initCitys.map((item,index) => (
                  <span key={index} className="style-list">{item}</span>
                ))
              }
            </div>
          </StyleInfo>
        </PersonalMessage>
      </div>
    )
  }

  render() {
    const { editStatus} = this.props.settings;
    const {
      styles,
      cityCodes: districtCodes
    } = this.props.userInfo;
    const { changeToEditStatus, saveUserInfo } = this.props.actions;
    const mapObject = { initStyles: styles, stylesMap, districtCodes };

    return (
      <div className="personal-homepage">
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item onClick={this.handleGoBack}>返回</Breadcrumb.Item>
          <Breadcrumb.Item >个人中心</Breadcrumb.Item>
        </Breadcrumb>
        <StyleMessage>
          <PersonContainer className="personal-message" conWidth="640px" conHeight="258px">
            <div className="personal-edit">
            {
              editStatus
              ?
              <UserForm
                editHandleClick={changeToEditStatus}
                saveUserInfo={saveUserInfo}
                settings={this.props.settings}
                userInfo={this.props.userInfo}
                cityCodes={this.props.cityCodes}
                mapObject={mapObject}
                actions={this.props.actions}
              />
              :
              this.renderPersonalInfo()
            }
            </div>
          </PersonContainer>
        </StyleMessage>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    settings: state.settings,
    cityCodes: state.home.cityCodes,
    userInfo: state.home.userInfo
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, fetchCityCodes }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Homepage);
