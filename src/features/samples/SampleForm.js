import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Breadcrumb,
  Card,
  Form,
  Input,
  Upload,
  Modal,
  Icon,
  Button,
  Select,
  message
} from 'antd';

import history from '../../common/history';
import * as actions from './redux/actions';
import { CaseLib, RoomEditor } from './';
import { getCDNimage } from '../common/utils/';
import storage from '../common/utils/storage';

const { TextArea } = Input;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 8
  }
}
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

export class SampleForm extends Component {
  static propTypes = {
    samples: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    previewVisible: false,
    previewImage: '',
    cover: [],
    detailImage: [],
    modalVisible: false,
    modalType: '',
    roomIdx: null
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    const { fetchSampleDetail, saveRoomList } = this.props.actions;
    const { setFieldsValue } = this.props.form;
    if (id !== 'new') {
      fetchSampleDetail(id, res => {
        const {
          title,
          highlight,
          styleList,
          roomList,
          coverList
        } = res.sampleData;
        setFieldsValue({
          title,
          highlight,
          styleList
        });
        coverList.cover && this.setState({
          cover: [{
            uid: -1,
            status: 'done',
            name: 'cover',
            url: getCDNimage(coverList.cover, 400)
          }],
        })
        coverList.detailImage && this.setState({
          detailImage: [{
            uid: -1,
            status: 'done',
            name: 'detailImage',
            url: getCDNimage(coverList.detailImage, 400)
          }]
        });
        saveRoomList(roomList);
      });
    }

    this.props.form.validateFields();
  }

  componentWillUnmount() {
    const { clearSampleForm } = this.props.actions;
    clearSampleForm();
    storage.removeItem('previewData');
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handlePostSampleAction = (actionType) => {
    const { postSampleAction } = this.props.actions;
    const { id } = this.props.match.params;
    const { getFieldValue } = this.props.form;
    const { curSampleId } = this.props.samples;
    let sampleInfo = {
      title: getFieldValue('title'),
      highlight: getFieldValue('highlight'),
      styleList: getFieldValue('styleList')
    };
    if (id !== 'new') {
      sampleInfo.id = id;
    } else {
      if (curSampleId) {
        sampleInfo.id = curSampleId;
      }
    }
    postSampleAction(sampleInfo, actionType);
  }

  handlePreviewSample = () => {
    const { getFieldValue } = this.props.form;
    const { previewSample } = this.props.actions;
    const formData = {
      highlight: getFieldValue('highlight'),
      styleList: getFieldValue('styleList'),
      title: getFieldValue('title'),
    };
    const previewPage = window.open();
    previewSample(formData, previewPage);
  }

  handleCheckCase = (caseId, caseInfo) => {
    if (caseId) {
      const { curCase: { id } } = this.props.samples;
      const { saveCase, saveRoomList } = this.props.actions;
      if (id !== caseId) {
        saveRoomList([]);
      }
      saveCase(caseInfo);
    }
    this.handleCloseModal();
  }

  handleShowModal = (value) => {
    if (value === 'case') {
      this.setState({
        modalType: 'case',
        modalVisible: true
      });
    } else {
      this.setState({
        modalType: 'room',
        modalVisible: true,
        roomIdx: value
      });
    }
  }

  handleCloseModal= () => {
    const { setStep } = this.props.actions;
    setStep(0);
    this.setState({modalVisible: false});
  }

  beforeUpload = (file, type) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大不超过 2MB!');
      return isLt2M;
    }
    const { uploadImage } = this.props.actions;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    uploadImage({data: file, type});
    reader.onloadend = () => {
      const imgList = [
        {
          uid: file.uid,
          name: file.name,
          status: file.status,
          type: file.type,
          url: reader.result
        }
      ];
      this.setState({
        [type]: imgList
      })
    }
    return false;
  }

  handleRemoveImage = (_, type) => {
    this.setState({
      [type]: []
    })
  }

  renderBasicForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { cover, detailImage, previewImage, previewVisible } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const props = {
      onPreview: this.handlePreview,
      accept: "image/*",
      listType: "picture-card"
    };

    return (
      <Card title="基础信息" bordered={false}>
        <Form.Item label="标题" {...formLayout}>
          {
            getFieldDecorator('title', {
              rules: [{
                required: true, message: '请输入标题'
              }, {
                max: 200, message: '超出最长限制'
              }],
            })(<Input placeholder="请输入标题"/>)
          }
        </Form.Item>
        <Form.Item label="上传封面图"  labelCol={{span: 4}} wrapperCol={{span: 12}}>
          <Upload
            fileList={cover}
            beforeUpload={file => this.beforeUpload(file, 'cover')}
            onRemove={file => this.handleRemoveImage(file, 'cover')}
            {...props}
          >
            {cover.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="上传详情页首图"  labelCol={{span: 4}} wrapperCol={{span: 12}}>
          <Upload
            fileList={detailImage}
            beforeUpload={file => this.beforeUpload(file, 'detailImage')}
            onRemove={file => this.handleRemoveImage(file, 'detailImage')}
            {...props}
          >
            {detailImage.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="方案风格"
          {...formLayout}
        >
        {getFieldDecorator('styleList', {
          rules: [{
            required: true,
            message: '请选择方案风格'
          }]
        })(
          <Select
            mode="multiple"
            placeholder="请选择方案风格"
            filterOption={(inputValue, option) => {
              return !option.props.children.indexOf(inputValue);
            }}
          >
          {
            Object.keys(stylesMap).map((stylesItem) => (
              <Option key={stylesItem} value={stylesItem} >{stylesMap[stylesItem]}</Option>
            ))
          }
          </Select>
        )}
        </Form.Item>
        <Form.Item label="全屋方案描述" {...formLayout}>
          {
            getFieldDecorator('highlight', {
              rules: [{
                required: true, message: '请输入全屋方案描述'
              }, {
                max: 200, message: '超出最长限制'
              }],
            })(<TextArea placeholder="请输入全屋方案描述"/>)
          }
        </Form.Item>
        <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible: false})}>
          <img alt="cover" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    );
  }

  handleAddRoom = (roomInfo) => {
    const { saveRoomList, setStep } = this.props.actions;
    const { roomList } = this.props.samples;
    const { roomIdx } = this.state;
    setStep(0);
    const roomIndex = roomList.findIndex(room => room.roomIdx === roomIdx);
    if (roomIndex > -1) {
      const newRoomList = [...roomList];
      newRoomList[roomIndex] = { ...roomInfo, roomIdx };
      saveRoomList(newRoomList);
    } else {
      saveRoomList([...roomList, {...roomInfo, roomIdx}])
    }
    this.handleCloseModal();
  }

  handleDeleteRoom = (roomIdx, e) => {
    e.stopPropagation();
    const { saveRoomList } = this.props.actions;
    const { roomList } = this.props.samples;
    saveRoomList(roomList.filter(roomItem => roomItem.roomIdx !== roomIdx));
  }

  handleEditRoom = (roomIdx) => {
    this.setState({
      modalType: 'room',
      modalVisible: true,
      roomIdx
    });
  }

  renderSceneForm = () => {
    const { curCase, roomList } = this.props.samples;
    const rooms = curCase.birdsEyeView && curCase.birdsEyeView.link;
    const {
      houseInfo: {
        address,
        roomCount,
        hallCount,
        washroomCount,
        area
      } = {}
    } = curCase;
    return (
      <Card title="3D全景漫游" bordered={false}>
        <Form.Item label="选择方案" {...formLayout}>
          <Button onClick={() => this.handleShowModal('case')}>选择方案</Button>
        </Form.Item>
        {
          curCase.id ? (
            <Form.Item label="已选择的方案" {...formLayout}>
              <div className="selected-case-card">
                <img className="case-pic" src={`${getCDNimage(curCase.cover, 213)}`} alt=""/>
                <p className="description">
                  地址：{address}<br/>
                  户型：{`${roomCount}室${hallCount}厅${washroomCount}卫`}&nbsp;{area}平米
                </p>
                <span className="address"></span>
                <span className="layout"></span>
              </div>
            </Form.Item>
          ) : null
        }
        <Form.Item label="编辑房间信息" {...formLayout}>
        {
          curCase.id ? <Select
            placeholder="请选择房间"
            notFoundContent="请先关联方案"
            filterOption={false}
            onSelect={this.handleShowModal}
          >
            {
              rooms && rooms.map((room) => {
                return (
                  <Option
                    key={room.roomIdx}
                    value={room.roomIdx}
                    disabled={roomList.map(roomItem => roomItem.roomIdx).includes(room.roomIdx)}
                  >
                    {room.name}
                  </Option>
                );
              })
            }
          </Select> : <span className="hint-text">请先关联方案</span>
        }
        </Form.Item>
        {
          curCase.id && <Form.Item label="已添加的房间" labelCol={{span: 4}} wrapperCol={{span: 20}} >
            <div className="added-rooms">
              {
                roomList.map(room => {
                  if (room) {
                    return (
                      <div className="room-card" onClick={() => this.handleEditRoom(room.roomIdx)}>
                        <Icon onClick={(e) => this.handleDeleteRoom(room.roomIdx, e)} className="delete-icon" type="delete" />
                        <img
                          className="room-pic"
                          alt="room-pic"
                          src={getCDNimage(room.imageList.filter(img => img)[0], 224)}
                        />
                        <p className="name">{room.name}</p>
                        <p className="description">
                          {room.description}
                        </p>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })
              }
            </div>
          </Form.Item>
        }
      </Card>
    );
  }
  renderModalContent = () => {
    const { caseList, count, curStep, curCase: { scenegoToken, id, birdsEyeView }, roomList } = this.props.samples;
    const { getFieldDecorator, getFieldValue, validateFields } = this.props.form;
    const { modalType, roomIdx } = this.state;
    const { fetchCaseRenderData, setStep, uploadImage, fetchCaseList } = this.props.actions;
    if (modalType === 'case') {
      return (
        <CaseLib
          caseList={caseList}
          count={count}
          checkedCaseId={id}
          handleConfirm={this.handleCheckCase}
          fetchCaseList={fetchCaseList}
        />
      );
    } else if (modalType === 'room') {
      const { pano, name } = birdsEyeView.link.find(linkItem => linkItem.roomIdx === roomIdx);
      return (
        <RoomEditor
          getFieldDecorator={getFieldDecorator}
          validateFields={validateFields}
          roomInfo={roomList.find(room => room.roomIdx === roomIdx)}
          getFieldValue={getFieldValue}
          id={id}
          pano={pano}
          name={name}
          scenegoToken={scenegoToken}
          curStep={curStep}
          fetchCaseRenderData={fetchCaseRenderData}
          setStep={setStep}
          handleAddRoom={this.handleAddRoom}
          uploadImage={uploadImage}
        />
      );
    }
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { modalVisible, modalType } = this.state;
    const { getFieldsError } = this.props.form;

    return (
      <Fragment>
        <div className="sample-form-breadcrumb">
          <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={() => history.goBack()}>返回</Breadcrumb.Item>
            <Breadcrumb.Item>编辑案例</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card title="编辑案例" bordered={false}>
          <Form hideRequiredMark={true}>
            {this.renderBasicForm()}
            {this.renderSceneForm()}
          </Form>
          <div className="sample-form-bottom-button-group">
            <div className="ant-col-4 ant-form-item-label sample-form-bottom-button-group-blank" />
            <Button
              className="sample-form-preview-button"
              onClick={this.handlePreviewSample}
            >
              预览
            </Button>
            <Button
              className="sample-form-save-button"
              onClick={() => this.handlePostSampleAction('save')}
              disabled={this.hasErrors(getFieldsError())}
            >
              保存
            </Button>
            <Button
              onClick={() => this.handlePostSampleAction('both')}
              disabled={this.hasErrors(getFieldsError())}
            >
              保存并投稿
            </Button>
          </div>
        </Card>
        <Modal
          title={modalType === 'case' ? '添加方案' : '添加房间'}
          width={780}
          bodyStyle={{width: '780px'}}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          destroyOnClose={true}
          footer={null}
        >
          {this.renderModalContent()}
        </Modal>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    samples: state.samples,
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
)(Form.create()(SampleForm));
