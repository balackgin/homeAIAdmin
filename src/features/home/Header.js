import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, Icon, Dropdown, Avatar, message } from 'antd';
import getAvatarUrl from '../common/utils/avatar';

const HeaderStyle = styled.div`
  display: flex;
  width: 160px;
  float: right;
  height: 64px;
  line-height: 64px;
`;
const UserCon = styled.p`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.span`
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 14px;
  height: 32px;
  line-height: 46px;
`;
const UserRole = styled.span`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #9b9b9b;
  height: 32px;
  line-height: 20px;
`;

const roleMap = {
  pd: {
    title: '客户经理',
    disabled: false
  },
  designer: {
    title: '设计师',
    disabled: true,
    link: '/settings'
  },
  operator: {
    title: '运营',
    disabled: false
  }
}

export class Header extends Component {
  static propTypes = {
    // home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  logout = () => {
    const { role} = this.props;
    if (role === 'operator') {
      if (window.g_config.logoutUrl) {
        window.location.href = window.g_config.logoutUrl;
      } else {
        message.warning('没有定义logoutUrl');
      }
    } else {
      this.props.actions.userLoginout();
    }
  }

  render() {
    const { userInfo, role} = this.props;
    const { pathname } = this.props;
    const { disabled = false } =roleMap[role] || {};
    const inSignUp = pathname.indexOf('signup') > -1;
    const menu = (
      <Menu>
        {
          !inSignUp && disabled && [<Menu.Item key="settings">
            <Link to="/settings"><Icon type="user" />个人中心</Link>
          </Menu.Item>,
          <Menu.Divider key="line" />]
        }
        <Menu.Item key="logout" onClick={this.logout}>
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

    const headTitle = role === 'operator' ? ' HomeAI运营平台' : 'HomeAI专家平台';
    return (
      <div>
        <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>   {headTitle}    </Link>
        {role ? (
            <Dropdown overlay={menu}>
              <HeaderStyle>
                <Avatar size="default" style={{margin: '18px 8px 0'}} src={getAvatarUrl(userInfo.avatar)} />
                <UserCon>
                  <UserName>{userInfo.nick}</UserName>
                  <UserRole>{roleMap[role].title}</UserRole>
                </UserCon>
              </HeaderStyle>
            </Dropdown>
          ) : null
        }
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    role: state.user.role,
    userInfo: state.home.userInfo
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
)(Header);
