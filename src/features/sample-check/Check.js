import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input } from 'antd';
import history from '../../common/history';
import * as actions from './redux/actions';

const { TextArea } = Input;

export class Check extends Component {
  static propTypes = {
    sampleCheck: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    modalVisible: false,
    reason: ''
  }

  handleBackClick = () => {
    history.goBack();
  }

  handleDoSampleAction = (action) => {
    const { doSampleAction } = this.props.actions;
    const { id } = this.props.match.params;
    doSampleAction(id, action);
  }

  handleValue = e => {
    this.setState({
      reason: e.target.value
    })
  }

  toggleRefuseModal = () => {
    const { doSampleAction } = this.props.actions;
    const { id } = this.props.match.params;
    const { reason } = this.state;
    doSampleAction(id, 'refuse', reason);
    this.showModal();
  }

  showModal = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible
    })
  }

  render() {
    const { id } = this.props.match.params;
    const { modalVisible } = this.state;

    return (
      <div className="sample-check">
        <div className="sample-check-button-group">
          <Button style={{marginBottom: '16px'}} type="primary" onClick={() => {this.handleDoSampleAction('online')}}>通过并发布</Button>
          <Button style={{marginBottom: '16px'}} type="default" onClick={() => this.handleDoSampleAction('pass')}>通过</Button>
          <Button style={{marginBottom: '65px'}} type="danger" onClick={this.showModal}>不通过</Button>
          <Button  className="back-btn" onClick={this.handleBackClick}>返回</Button>
        </div>
        <iframe
          title="preview"
          className="preview"
          src={`/detail-template.html?preview=true&id=${id}`}
          frameBorder="0"
        />
        <Modal
          visible={modalVisible}
          onOk={this.toggleRefuseModal}
          onCancel={this.showModal}
          title="案例详情"
          okText="确定"
          cancelText="取消"
          >
          <div>请填写不通过理由：</div>
          <TextArea row={6} onChange={this.handleValue}/>
        </Modal>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    sampleCheck: state.sampleCheck,
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
)(Form.create()(Check));
