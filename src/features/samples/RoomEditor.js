import React, { Component, Fragment } from 'react';
import { Steps, Form, Input, Button, message } from 'antd';
import { SceneGoJuranEditWorld, loadSGM } from '@ali/scenego3dsdk/build/indexHomeAI.bundle.js';
import styled from 'styled-components';
import { getCDNimage } from '../common/utils/';


const { Step } = Steps;
const { TextArea } = Input;

const StyledPicSelector = styled.div`
  width: 110px;
  height: 80px;
  border-radius: 2px;
  border-width: 1px;
  border-color: ${props => props.selected ? '#2e7dfb' : '#dedede'};
  border-style: solid;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default class RoomEditor extends Component {
  static propTypes = {

  };

  state = {
    roomPicList: [null, null, null],
    curPic: 0
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.curStep !== nextProps.curStep) {
      if (nextProps.curStep === 0) {
        this.initialHome();
      }
    }
  }

  componentDidMount = () => {
    const { roomInfo: { imageList } = {} } = this.props;
    if (imageList) {
      this.setState({roomPicList: imageList});
    }
    this.initialHome();
  }

  initialHome = () => {
    setTimeout(() => {
      const { width, height } = this.dom.getBoundingClientRect();
      this.maskWidth = (width - (height * 750 / 1336)) / 2;

      this.world = new SceneGoJuranEditWorld(
        { parentDom: this.dom, win: window, width, height },
        { isPerspective: true, fov: 70, near: 0.1, far: 500 },
        { antialias: false }
      );

      this.renderScene();
    }, 1000);
  }

  renderScene = () => {
    const { id, scenegoToken, pano, fetchCaseRenderData } = this.props;

    fetchCaseRenderData({
      caseId: id,
    }, (resp) => {
      const sgmList = resp.index.sgm;
      Promise.all(sgmList.map(asgm => loadSGM(`https://ossgw.alicdn.com/${resp.index.textureModelPath}${asgm.sgm}`, '')))
      .then(res => {
        resp.index.textureModelPath = `https://ossgw.alicdn.com/${resp.index.textureModelPath}`;
        resp.index.texturePanoPath = `${resp.index.textureModelPath}jr/${scenegoToken}/pano/`;

        // 该场景需要禁止用户在场景中进行漫游，因此panolist需要进行裁剪，只保留当前点
        const panos = [];
        resp.index.panoList.forEach(panoItem => {
          panoItem.enabled = panoItem.enabled ? 'true' : 'false';
          if (panoItem.id === pano) {
            panos.push(panoItem);
          }
        });
        resp.index.panoList = panos;

        return this.world.initSceneGoWorld({
          srcFrom: '',
          srcType: 'juran',
          modelTexLevel: '',
          download: false,
          shading: false,
          infoData: {
            index: resp.index,
            tags: resp.tags,
            sgm: res,
            deviceParam: {
              "fpsLimit":0,
              "aggressiveLoad":false,
              "preLoadNum":3,
              "maxLoadedNum":15,
              "dollHouseTexLv":"lv1/",
              "pixelRatio":2
            },
            biz: resp.biz || {
              startLocation: {}
            },
            startLocation: { locationId: pano, eyeRay: { quaternion: [0, 0, 0, 1] } }
          }
        });
      }).then(() => {
        this.world.flyToStartPanorama();
      });
    });
  }

  choosePic = (index) => {
    this.setState({
      curPic: index
    });
  }

  renderPicList = () => {
    const { roomPicList, curPic } = this.state;
    return roomPicList.map((roomPic, index) => {
      return (
        <StyledPicSelector selected={index === curPic} onClick={() => this.choosePic(index)}>
          {
            roomPic ? (
              <img className="small-room-pic" src={`${getCDNimage(roomPic, 108)}`} alt="room"/>
            ) : `图${index + 1}`
          }
        </StyledPicSelector>
      );
    })
  }

  renderCurStepContent = () => {
    const { curStep, getFieldDecorator, roomInfo: { description } = {} } = this.props;

    if (curStep === 0) {
      return (
        <Fragment>
          <div className="room-scene" ref={dom => this.dom = dom}/>
          <div className="pic-list">
            {this.renderPicList()}
          </div>
          <Button type="primary" className="save-img-btn" onClick={this.saveRoomImage}>截图</Button>
        </Fragment>
      );
    } else if (curStep === 1) {
      return (
        <Fragment>
          <Form.Item label="封面图">
            <div className="pic-list">
              {this.renderPicList()}
            </div>
          </Form.Item>
          <Form.Item label="房间描述">
          {
            getFieldDecorator('description', {
              initialValue: description || '',
              rules: [{
                max: 200, message: '超出最长限制'
              }]
            })(<TextArea placeholder="请输入房间描述"/>)
          }
          </Form.Item>
        </Fragment>
      );
    }
  }

  saveRoomImage = () => {
    const { curPic } = this.state;
    if (curPic < 0) {
      return;
    }
    this.world.captureScreen().then(result => {
      const { uploadImage } = this.props;
      const { coverImageUrl } = result;
      const { roomPicList, curPic } = this.state;
      uploadImage({data: coverImageUrl}, (url) => {
        let newRoomPicList = [...roomPicList];
        newRoomPicList[curPic] = url;
        const nextIndex = newRoomPicList.findIndex(roomPic => roomPic === null)
        this.setState({
          roomPicList: newRoomPicList,
          curPic: nextIndex
        })
      })
      // 调用图片上传接口，请求成功后保存为封面图
    });
  }

  handleAddRoomConfirm = () => {
    const { handleAddRoom, getFieldValue, validateFields, name } = this.props;
    const { roomPicList } = this.state;
    validateFields(['description'], (err, values) => {
      if (!err) {
        const roomInfo = {
          name,
          description: getFieldValue('description'),
          imageList: roomPicList
        };
        handleAddRoom(roomInfo);
      }
    })
  }

  handleNextStep = () => {
    const { roomPicList } = this.state;
    const { setStep } = this.props;
    if (roomPicList.filter(pic => pic).length === 0) {
      message.warning('请截取房间图片');
    } else {
      setStep(1);
    }
  }

  renderActionButton = () => {
    const { curStep, setStep } = this.props;
    if (curStep === 0) {
      return (
        <Button onClick={this.handleNextStep}>下一步</Button>
      );
    } else {
      return (
        <Fragment>
          <Button style={{marginRight: '25px'}} onClick={() => setStep(0)}>上一步</Button>
          <Button onClick={this.handleAddRoomConfirm}>确认</Button>
        </Fragment>
      );
    }
  }

  render() {
    const { curStep, name } = this.props;

    return (
      <Fragment>
        <div className="samples-room-editor">
          <div className="steps">
            <p className="room-title">编辑房间: {name}</p>
            <Steps direction="vertical" size="small" current={curStep}>
              <Step title="选择视角" description="移动图片选择合适的起始视角请确认3张图片都已选择完毕" />
              <Step title="添加房间描述" description="请简述房间设计亮点" />
              <Step title="完成" />
            </Steps>
          </div>
          <div className="scene">
            {this.renderCurStepContent()}
          </div>
        </div>
        <div className="actions">{this.renderActionButton()}</div>
      </Fragment>
    );
  }
}
