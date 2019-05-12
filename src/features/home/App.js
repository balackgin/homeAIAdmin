import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider, message, Spin, Layout, Modal } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';

import * as actions from './redux/actions';
import { ErrorBoundary } from '../common';
import { SideMenu, Header } from './';
import storage from '../common/utils/storage';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router.
  You should adjust it according to the requirement of your app.
*/

const {Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledPageContent = styled(Content)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 24px;
  background-color: #fafafa;
`;

class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.errors.length > this.props.app.errors.length) {
      message.error(nextProps.app.errors.slice(-1)[0]);
    }

    if (nextProps.app.messages.length > this.props.app.messages.length) {
      const msg = nextProps.app.messages.slice(-1)[0];
      if (msg.type === 'success') {
        message.success(msg.data);
      }
      if (msg.type === 'warning') {
        message.warning(msg.data);
      }
      if (msg.type === 'error') {
        message.error(msg.data);
      }
    }
  }

  componentDidMount = () => {
    // get user info before anything could show
    const { user: { role } } = this.props;
    if (role === 'designer') {
      this.props.actions.fetchUserInfo();
    }

    storage.removeItem('cityCodes');
  }

  renderBindPhoneDialog () {
    const {needBindPhone, bindPhoneMsg} = this.props.home;
    const {cancelBindPhoneDialog} = this.props.actions;
    if (!needBindPhone) {
      return null;
    }

    // parse bindPhoneMsg
    const onJumpToBind = () => {
      console.log('onJumpToBind');
    }


    return (
      <Modal
        title="请去绑定手机"
        visible={true}
        onCancel = {cancelBindPhoneDialog}
        onOk = {onJumpToBind}
      >
        <p>bindPhoneMsg: {bindPhoneMsg}</p>
      </Modal>);
  }

  render() {
    const {app: {spin}, user, location} = this.props;

    return (
      <LocaleProvider locale={zhCN}>
        <StyledLayout>
          <Layout.Header style={{background: "#444444"}}>
            <Header pathname={location.pathname} />
          </Layout.Header>
          <Layout>
            <SideMenu role={user.role} pathname={location.pathname}/>
            <StyledPageContent>
              <ErrorBoundary>
                <Spin size="large" wrapperClassName="spin-ctnr" spinning={spin === true}>
                  {this.props.children}
                </Spin>
                {this.renderBindPhoneDialog()}
              </ErrorBoundary>
            </StyledPageContent>
          </Layout>
        </StyledLayout>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return _.pick(state, [
    'app', 'user', 'home'
  ]);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
