import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { MENU_CONFIG_DESIGNER, MENU_CONFIG_PD, MENU_CONFIG_OPERATOR} from './menus/';

const MENU_CONFIG = {
  "designer": MENU_CONFIG_DESIGNER,
  "pd": MENU_CONFIG_PD,
  "operator": MENU_CONFIG_OPERATOR
}

const { SubMenu } = Menu;
const { Sider } = Layout;

export default class SideMenu extends PureComponent {
  static propTypes = {
    role: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
  };

  state = {
    openKeys: null,
    selectedKeys: null
  }

  handleOpenChange = openKeys => {
    this.setState({ openKeys });
  };


  renderMenus(menuConfig) {
    const openKeys = [];
    const selectedKeys = [];
    const pathname = this.props.pathname;

    // support menu and submenus only
    const menus = menuConfig.map(({ key, selected,
      icon, title, path, subMenus, disabled}) => {
      if(subMenus) {
        // all submenus opened
        openKeys.push(key);
        const subMenusArr = subMenus.map((menuItem, idx) => {
          const subkey = key+'-'+idx;
          if (menuItem.path === pathname) {
            selectedKeys.push(subkey);
          }

          return (
            <Menu.Item key={subkey} disabled={menuItem.disabled === true}>
              <Link to={menuItem.path}> {menuItem.title} </Link>
            </Menu.Item>
          )
        });

        return (
          <SubMenu
            key={key}
            title={
              <span>
                <Icon type={icon} />
                <span> {title} </span>
              </span>
            }
          >
            {subMenusArr}
          </SubMenu>
        );
      } else {
        // no submenus
        if (path === pathname) {
          selectedKeys.push(key);
        }
        return (
          <Menu.Item key = { key } disabled = { disabled === true } >
            < Link to={path} > <Icon type={icon} /> {title} </Link>
          </Menu.Item >
        );
      }
    });

    return (
      <Sider style={{background: "white"}}>
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          openKeys={this.state.openKeys ? this.state.openKeys: openKeys}
          onOpenChange={this.handleOpenChange}
        >
          {menus}
        </Menu>
      </Sider>
    );
  }

  render() {
    const { role, pathname} = this.props;
    if (['/signup', '/settings'].indexOf(pathname) >= 0) {
      return null;
    }
    if (pathname.indexOf('/cases/edit') >= 0) {
      return null;
    }

    const menuConfig = MENU_CONFIG[role];
    if (menuConfig) {
      return this.renderMenus(menuConfig);
    }
    return null;
  }
}
