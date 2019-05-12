import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from 'antd';
import styled from 'styled-components';

import { LoginForm, RegisterForm } from './';
import * as actions from './redux/actions';
import { fetchCityCodes } from '../home/redux/actions';
import { FORM_STAGE } from './redux/constants';

const StyledCardCtnr = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const StyledSignCtnr = styled.div`
  background-color: #ffffff;
  border-radius: 6px;
  padding: 20px 50px 80px 50px;
`;

const StyledTitle = styled.p`
  text-align: center;
  color: #4a4a4a;
  font-size: 24px;
`;

const StyledSubTitle = styled.p`
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 50px;
`;

const StyledDesignerCtnr = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export class SignupPage extends Component {
  static propTypes = {
    signup: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { cityCodes } = this.props;
    const { fetchCityCodes } = this.props.actions;
    if (cityCodes.length === 0) {
      fetchCityCodes();
    }
  }

  onSaveVerifyCode = code => {
    const {
      user: { role },
    } = this.props;
    const { verifyCode } = this.props.actions;
    verifyCode(role, code);
  };

  onSendCode = payload => {
    const { generateVerifyCode } = this.props.actions;
    generateVerifyCode(payload);
  };

  onHandleRegister = payload => {
    const { register } = this.props.actions;
    const info = {
      role: this.props.user.permittedRole,
      ...payload,
      verifyCode: this.props.signup.code,
      type: 'designer',
    };
    register(info);
  };

  renderPhoneForm() {
    return (
      <StyledCardCtnr>
        <StyledSignCtnr>
          <StyledTitle>创建账号</StyledTitle>
          <StyledSubTitle>请输入您的手机号及收到的验证码</StyledSubTitle>
          <LoginForm onSaveVerifyCode={this.onSaveVerifyCode} onSendCode={this.onSendCode} />
        </StyledSignCtnr>
      </StyledCardCtnr>
    );
  }

  renderDetailInfoForm() {
    const { cityCodes, user } = this.props;

    return (
      <StyledCardCtnr>
        <StyledSignCtnr>
          <StyledTitle>创建账号</StyledTitle>
          <StyledSubTitle>最后一步！请补充一些个人信息，帮您分配更合适的任务。</StyledSubTitle>
          <StyledDesignerCtnr>
            <RegisterForm onRegister={this.onHandleRegister} cityCodes={cityCodes} user={user} />
          </StyledDesignerCtnr>
        </StyledSignCtnr>
      </StyledCardCtnr>
    );
  }

  render() {
    const { formStage } = this.props.signup;
    if (FORM_STAGE.PHONE_FORM === formStage) {
      return this.renderPhoneForm();
    }
    if (FORM_STAGE.DETAIL_INFO_FORM === formStage) {
      return this.renderDetailInfoForm();
    }
    return null;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    signup: state.signup,
    user: state.user,
    cityCodes: state.home.cityCodes,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions, fetchCityCodes }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupPage);
