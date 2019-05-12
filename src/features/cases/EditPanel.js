import React, { Component } from 'react';
import { Button, Modal, Icon, Input, InputNumber } from 'antd';

export default class EditPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      showItemSelectedModal: false,
      // 标签名称需要从data数组中获取
      title: this.getTagTitle(props.data, props.mesh.tagId), // 标签名称
      tagLine: props.mesh.lineLength, // 标签法线长度
      // itemId: {}, // 标签关联的商品ID，730不做商品相关
    };
  }

  componentWillReceiveProps(nextProps) {
    const { mesh } = this.props;
    const { mesh: nextMesh, data: nextData } = nextProps;

    if (mesh.tagId !== nextMesh.tagId) {
      this.setState({
        visible: false,
        showItemSelectedModal: false,
        title: this.getTagTitle(nextData, nextMesh.tagId), // 标签名称
        tagLine: nextMesh.lineLength, // 标签法线长度
        // itemId: {}, // 标签关联的商品ID
      });
    }
  }

  getTagTitle(tagList = [], tagId) {
    let title = '';
    tagList.forEach(tag => {
      if (tag.tagId === tagId) {
        title = tag.description;
      }
    });

    return title;
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  /**
   * 弹框确认删除标签
   */
  handleOkAndRemoveTag = () => {
    const { tagId } = this.props.mesh;

    const config = tagId !== "-1" ? { tid: tagId } : null;
    this.props.closeEditPanel && this.props.closeEditPanel(true, config);
  }

  cancelItemSelectedModal = () => {
    this.setState({
      showItemSelectedModal: false,
    });
  }

  showItemSelectedModal = () => {
    this.setState({
      showItemSelectedModal: true,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  addTag = () => {
    const { mesh } = this.props;
    const { title, tagLine } = this.state;

    // 有tagId的情况下，”保存“的操作等同于修改标签
    // 需要将当前标签删除后重新新增一个标签
    if (mesh.tagId !== "-1") {
      this.handleOkAndRemoveTag();
    }
    this.props.closeEditPanel && this.props.closeEditPanel(false, {
      position: mesh.position.toArray(),
      quaternion: mesh.quaternion.toArray(),
      tagIcon: mesh.iconUrl,
      description: title,
      color: mesh.lineColor.getHex(),
      tickness: mesh.lineWidth,
      length: tagLine,
    });
  }

  cancelTag = () => {
    this.props.closeEditPanel && this.props.closeEditPanel(false);
  }

  changeTagTitle = (e) => {
    const { mesh } = this.props;
    const { value } = e.target;

    this.setState({
      title: value,
    }, () => {
      mesh.description = value;
    });
  }

  changeTagLineLength = (val) => {
    const { mesh } = this.props;

    this.setState({
      tagLine: val,
    }, () => {
      mesh.lineLength = val;
    });
  } 

  render() {
    const { visible, showItemSelectedModal, title, tagLine } = this.state;
    const { mesh } = this.props;
    const isNewTag = mesh.entId === -1;

    return (
      <div className="cases-edit-panel">
        <div className="cases-edit-panel-header">编辑标签</div>
        <div className="cases-edit-panel-body">
          <div className="cases-edit-panel-item">
          <div className="cases-edit-panel-title">标题</div>
            <Input className="cases-edit-panel-input" value={title} onChange={this.changeTagTitle} />
          </div>
          <div className="cases-edit-panel-item">
            <div className="cases-edit-panel-title">法线长度</div>
            <InputNumber className="cases-edit-panel-input" min={0.1} max={1} step={0.1} value={tagLine} onChange={this.changeTagLineLength} />
          </div>
          {/* <div className="cases-edit-panel-item">
            <div className="cases-edit-panel-title">绑定商品</div>
            <Button onClick={this.showItemSelectedModal}>绑定商品</Button>
          </div>      */}
        </div>
        <div className="cases-edit-panel-body-btn-groups">
            <Button onClick={this.showModal}>删除标签</Button>
            <div>
              { !isNewTag && <Button onClick={this.cancelTag} className="cases-edit-panel-cancel-btn">取消</Button> }
              <Button type="primary" disabled={!title} onClick={this.addTag}>保存</Button>
            </div>
          </div>           
        <Modal
          title="删除标签"
          visible={visible}
          onOk={this.handleOkAndRemoveTag}
          onCancel={this.handleCancel}
          bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon type="exclamation-circle" style={{ color: '#FAD95E', fontSize: '40px' }} />
          <div>删除后不可恢复，确定删除该标签吗？</div>
        </Modal>
        <Modal
          title="选择商品"
          footer={null}
          visible={showItemSelectedModal}
          onCancel={this.cancelItemSelectedModal}
        >
        </Modal>
      </div>
    );
  }
}
