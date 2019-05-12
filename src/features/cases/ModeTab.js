import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Button, Checkbox } from 'antd';

export default class ModeTab extends Component {
  static propTypes = {
    mode: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    // dollhouse: 1, panoMode: 2, editMode: 3
    this.state = {
      visible: false,
      checked: !!localStorage.getItem('__homeAI_case_cover_edit_tips__'),
    };
  }

  changeCurrentWorldMode = (mode) => {
    const interactionMode =  this.props.world.admin.getEntityManager().getEntityDataByName('cameraControlEnt').getComponent('interactionStyle').interactionMode;

    if (interactionMode === 1) {
      alert('当前模式不支持裁剪和打标签，请进入全景图模式后再操作。');
      return;
    }

    const { hasCover } = this.props;
    const { checked } = this.state;

    // 切换到起始点模式，且当前已经有封面图时需要弹框提示
    if (mode === 1 && hasCover) {
      if (checked) {
        this.props.changeCurrentWorldMode && this.props.changeCurrentWorldMode(mode);
      } else {
        this.setState({
          visible: true,
        });
      }
    } else {
      this.props.changeCurrentWorldMode && this.props.changeCurrentWorldMode(mode);
    }
  }

  /**
   * 确认截图，保存起始点封面或者保存导览图操作
   */
  confirmCapture = () => {
    const { mode } = this.props;

    if (mode === 1) {
      this.props.saveCover && this.props.saveCover();
    } else if (mode === 2) {
      this.props.saveGuideMap && this.props.saveGuideMap();
    }
  }

  /**
   * 弹框取消时，就不进入起始点模式
   * 弹框确认时，进入起始点模式
   */
  handleOk = () => {
    this.setState({
      visible: false,
    }, () => {
      this.props.changeCurrentWorldMode && this.props.changeCurrentWorldMode(1);
    });
  }

  handleCancel = () => {
    localStorage.setItem('__homeAI_case_cover_edit_tips__', false);
    this.setState({
      visible: false,
      checked: false,
    });
  }

  handleNeverMindCheckbox = (e) => {
    const { checked } = e.target;
    
    localStorage.setItem('__homeAI_case_cover_edit_tips__', checked);
    this.setState({
      checked,
    });
  }

  render() {
    const { visible, checked } = this.state;
    const { mode } = this.props;
    const icons = ['camera', 'environment', 'tags'];
    const modes = ['起始点', '导览图', '打标（敬请期待）'];
    // const neverMind = localStorage.getItem('__homeAI_case_cover_edit_tips__');

    return (
      <div className="cases-mode-tab">
        {
          mode === 0 && modes.map((item, index) => index !== 2 ? <div
            key={index}
            className="cases-edit-operation-block"
            onClick={() => { this.changeCurrentWorldMode(index + 1); }}>
            <Icon type={icons[index]} className="cases-edit-operation-icon" />
            {item}
          </div> : <div
            key={index}
            className="cases-edit-operation-block cases-edit-operation-block-disabled"
          >
            <Icon type={icons[index]} className="cases-edit-operation-icon" />
            {item}
          </div>)
        }
        {
          mode !== 0 && <div className="cases-edit-operations">
            <div className="cases-edit-operation-block" onClick={() => { this.changeCurrentWorldMode(0); }}>
              <Icon type="close" className="cases-edit-operation-icon" style={{ color: '#F5A623', fontWeight: 'bold' }} />取消
            </div>
            {
              mode !== 3 && <div className="cases-edit-operation-block" onClick={this.confirmCapture}>
                <Icon type="check" className="cases-edit-operation-icon" style={{ color: '#2ECA9C', fontWeight: 'bold' }} />
                确定选取
              </div>
            }
          </div>
        }
        <Modal
          title="重新选取起始点"
          visible={visible}
          bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          footer={[
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Checkbox checked={checked} onChange={this.handleNeverMindCheckbox}>不再提示</Checkbox>
              <div>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button type="primary" onClick={this.handleOk}>确定</Button>
              </div>
            </div>
          ]}
        >
          <Icon type="exclamation-circle" style={{ color: '#FAD95E', fontSize: '40px' }} />
          <div>您已选取了起始点，确定重新选取吗？</div>
        </Modal>
      </div>
    );
  }
}
