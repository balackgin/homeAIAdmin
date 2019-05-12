import React, { PureComponent } from 'react';
import { Icon, Modal, Button, Popover } from 'antd';
import { Link } from 'react-router-dom';
import { timeFormatter, getCDNimage } from '../common/utils/';

export default class Card extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  deleteCase = () => {
    this.setState({ visible: true });
  }

  handleOk = () => {
    const { id } = this.props;

    this.setState({ visible: false });
    this.props.deleteCase && this.props.deleteCase(id);
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    const { id, scenegoToken, gmtModified, cover, houseInfo = {}, disableHover } = this.props;
    const { name, area, roomCount, washroomCount, hallCount } = houseInfo;
    const dates = timeFormatter(gmtModified).split(' ');

    return (
      <div className="case-card">
        <Modal
          title="确定删除？"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          确定删除当前案例么？
        </Modal>
        <div className="case-card-img" style={{ backgroundImage: `url(${getCDNimage(cover, 400)})` }}>
          {
            disableHover === true ? null : (
              <Button className="case-card-preview-btn" target="_blank" href={`/designer/case/edit/${id}`}>
                预览
              </Button>
            )
          }
        </div>
        <div className="case-card-info">
          <Popover content={name}>
            <div className="case-card-info-title">{name}</div>
          </Popover>
          <div className="case-card-info-desc">
            {roomCount}室{hallCount}厅{washroomCount}卫 {area}㎡
          </div>
          <div className="case-card-info-time">{dates[0]}<br/>{dates[1]}</div>
          {
            disableHover === true ? null : (
              <div className="case-card-info-operations">
                {/* <Icon className="case-card-info-icon" type="reload" onClick={this.handleSync} /> */}
                <Popover content="编辑" placement="bottom">
                  <Link to={`/cases/edit/${id}/${scenegoToken}`} className="case-card-info-icon">
                    <Icon className="case-card-info-icon" type="edit" />
                  </Link>
                </Popover>
                {/* TODO: 报价单按钮置灰 */}
                {/* <Popover content="查看报价单" placement="bottom">
                  <Link to={`/cases/quotation/${id}`} className="case-card-info-icon">
                    <Icon type="pay-circle-o" />
                  </Link>
                </Popover> */}
                <Popover content="删除" placement="bottom">
                  <Icon className="case-card-info-icon" type="delete" onClick={this.deleteCase} />
                </Popover>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
