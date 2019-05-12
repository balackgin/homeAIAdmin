import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Breadcrumb } from 'antd';
import { SceneGoJuranEditWorld, loadSGM, EditEvent, EventFamily, eventManager, InteractionEvent } from '@ali/scenego3dsdk/build/indexHomeAI.bundle.js';

import ModeTab from './ModeTab';
import ResultTab from './ResultTab';
import EditPanel from './EditPanel';

export class Edit extends Component {
  static propTypes = {
    cases: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentMode: 0, // 0: 无状态 1: 封面图，2:快照模式，3：打标模式
      showEditPanel: false,
      currentTagMesh: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      const { width, height } = this.dom.getBoundingClientRect();

      this.world = new SceneGoJuranEditWorld(
        { parentDom: this.dom, win: window, width, height },
        { isPerspective: true, fov: 70, near: 0.1, far: 500 },
        { antialias: false }
      );

      this.changeMaskWidthOrHeight();
      this.bindEvents();
      this.renderScene();
    }, 1000);
  }

  componentWillUnmount() {
    const { clearEditData } = this.props.actions;

    clearEditData();
  }

  bindEvents = () => {
    eventManager.registerListener(EventFamily.EditEvent, EditEvent.AddTag, (tagMesh) => {
      // 禁掉其他的打标操作
      if (!this.state.showEditPanel) {
        this.setState({
          showEditPanel: true,
          currentTagMesh: tagMesh,
        });
        // 将tag加入场景中
        this.world.scene.add(tagMesh);
      }
    });
    eventManager.registerListener(EventFamily.EditEvent, EditEvent.EditTag, (tagMesh) => {
      if (!this.state.showEditPanel) {
        this.setState({
          showEditPanel: true,
          currentTagMesh: tagMesh,
        });
      }
    });
    window.addEventListener('resize', () => {
      this.changeMaskWidthOrHeight();
      // 状态重置为初始化
      const { currentMode } = this.state;
      if (currentMode === 1 || currentMode === 2) {
        this.setState({
          currentMode: 0,
        });
      }
    });
  }

  changeMaskWidthOrHeight = () => {
    const { width: parentWidth, height: parentHeight } = this.dom.getBoundingClientRect();
    const { width: containerWidth, height: containerHeight } = this.dom.children[0].getBoundingClientRect();
    const standardRatio = 750 / 1336;

    if (containerWidth / containerHeight > standardRatio) {
      // 裁剪宽度
      this.maskWidth = (parentWidth - containerHeight * standardRatio) / 2;
      this.maskHeight = 0;
    } else if (containerWidth / containerHeight < standardRatio) {
      // 裁剪高度
      this.maskWidth = 0;
      this.maskHeight = (parentHeight - containerWidth / standardRatio) / 2;
    } else {
      this.maskWidth = 0;
      this.maskHeight = 0;
    }
  }

  renderScene = () => {
    const { match, actions } = this.props;
    const { id, token } = match.params;

    actions.fetchCaseRenderData({
      caseId: id,
    }, (resp) => {
      const sgmList = resp.index.sgm;
      const startLoc = resp.startLocation;

      Promise.all(sgmList.map(asgm => loadSGM(`https://ossgw.alicdn.com/${resp.index.textureModelPath}${asgm.sgm}`, '')))
      .then(res => {
        resp.index.textureModelPath = `https://ossgw.alicdn.com/${resp.index.textureModelPath}`;
        resp.index.texturePanoPath = `${resp.index.textureModelPath}jr/${token}/pano/`;
        // 根本不想写下面这行代码
        resp.index.panoList.forEach(pano => {
          pano.enabled = pano.enabled ? 'true' : 'false';
        });
        
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
            startLocation: startLoc,
          }
        });
      })
      .then(res => {
        // 只有存在起始点的情况下才需要飞到起始点
        if (startLoc.eyeRay) {
          this.world.flyToStartPanorama();
        }
      });
    });
  }

  clipImageAndSave = (data, cb) => {
    const { dom } = this;
    // 宽高尺寸的获取应该是相对于canvas容器来说的
    const { width: originWidth, height: originHeight } = dom.children[0].getBoundingClientRect();
    const targetHeight = originHeight;
    const targetWidth = originHeight * 750 / 1336;
    const validRatio = targetWidth / originWidth;
    const maskRatio = (1 - validRatio) / 2;

    const img = document.createElement('img');
    img.src = window.URL.createObjectURL(data);
    img.onload = () => {
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 图片的宽高和pixelratio有关系
      const { width: imgWidth, height: imgHeight } = img;

      canvas.width = targetWidth * pixelRatio;
      canvas.height = targetHeight * pixelRatio;

      // 绘制到canvas上
      ctx.drawImage(img, imgWidth * maskRatio, 0, imgWidth * validRatio, imgHeight, 0, 0, canvas.width, imgHeight);
      // 下面一行是测试代码
      // document.getElementsByTagName('body')[0].appendChild(canvas);
      canvas.toBlob(((blob) => {
        cb && cb(blob);
      }));
    };
  }
  /**
   * 新增起始点封面图
   */
  saveCover = () => {
    const { match, actions } = this.props;
    const { id, token } = match.params;
    const { saveCover } = actions;

    this.world.captureScreen().then(result => {
      const { coverImageUrl, eyeRay, locationId } = result;
      this.clipImageAndSave(coverImageUrl, (data) => {
        saveCover({
          id,
          token,
          eyeRay,
          locationId,
          data,
        });
      });
    });
  }
  /**
   * 新增导览图
   */
  saveGuideMap = () => {
    const { match, actions } = this.props;
    const { token } = match.params;
    const { saveGuideMap } = actions;

    this.world.captureScreen().then(result => {
      const { coverImageUrl, eyeRay, locationId } = result;
      this.clipImageAndSave(coverImageUrl, (data) => {
        saveGuideMap({
          data,
          eyeRay,
          locationId,
          token
        });
      });
    });
  }
  /**
   * 对已经导览图的名称进行修改后同步导览图数据
   */
  updateGuideMap = (guides, startLocation) => {
    const { match, actions } = this.props;
    const { token } = match.params;
    const { updateGuideMap } = actions;

    updateGuideMap({
      token,
      guides,
      startLocation,
    });
  }

  closeEditPanel = (isDeleteTag, config) => {
    const { actions, match } = this.props;
    const { addTag, removeTag } = actions;
    const { token } = match.params;
    const { currentTagMesh } = this.state;

    if (isDeleteTag) {
      // 服务端删除成功后再从场景中删除该标签
      if (config) {
        removeTag(config, this.world.scene.remove(currentTagMesh));
      } else {
        this.world.scene.remove(currentTagMesh);
      }
    } else {
      if (config) {
        const params = Object.assign(config, { token });
        // 服务端创建成功后触发创建tag entity的事件
        addTag(params, (tid) => {
          currentTagMesh.tagId = tid;
          eventManager.emit(EventFamily.EditEvent, EditEvent.AddTagEnt, currentTagMesh);
        });
      }
    }

    this.setState({
      showEditPanel: false,
      currentTagMesh: null,
    });
  }

  /**
   * 切换当前的操作模式和world状态
   */
  changeCurrentWorldMode = (mode) => {
    // 切换模式时所有的当前状态都要清空
    this.setState({
      currentMode: mode,
      showEditPanel: false,
      currentTagMesh: null,
    });

    this.world.changeCurrentMode(mode !== 3 ? 2 : 3);
  }

  showTagEditPanel = (tagId) => {
    const entManager = this.world.admin.getEntityManager();
    const tagMesh = entManager.getEntityDataByName(`tagEnt_${tagId}`).getComponent('tag').mesh;
    this.setState({
      showEditPanel: true,
      currentTagMesh: tagMesh,
    });
    eventManager.emit(EventFamily.InteractionEvent, InteractionEvent.FlyToTag, tagId);
  }

  render() {
    const { maskWidth, maskHeight } = this;
    const {  currentMode, showEditPanel, currentTagMesh } = this.state;
    const { startLocation, guideMap, customTags } = this.props.cases;

    return (
      <div className="cases-edit">
        <div className="cases-edit-block">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/cases/library">返回</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>方案编辑</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="cases-edit-body">
          <div className="cases-edit-body-main">
            <ModeTab
              world={this.world}
              mode={currentMode}
              hasCover={!!startLocation.eyeRay}
              changeCurrentWorldMode={this.changeCurrentWorldMode}
              saveCover={this.saveCover}
              saveGuideMap={this.saveGuideMap}
            />
            <div className="cases-edit-player" ref={dom => this.dom = dom}>
              { ((currentMode === 1 || currentMode === 2) && !!maskWidth) && <div className="cases-edit-player-mask-left" style={{ width: maskWidth }} /> }
              { ((currentMode === 1 || currentMode === 2) && !!maskWidth) && <div className="cases-edit-player-mask-right" style={{ width: maskWidth }} /> }
              { ((currentMode === 1 || currentMode === 2) && !!maskHeight) && <div className="cases-edit-player-mask-top" style={{ height: maskHeight }} /> }
              { ((currentMode === 1 || currentMode === 2) && !!maskHeight) && <div className="cases-edit-player-mask-bottom" style={{ height: maskHeight }} /> }
            </div>
          </div>
          <ResultTab
            mode={currentMode}
            startLocation={startLocation}
            guideMap={guideMap}
            tags={customTags}
            updateGuideMap={this.updateGuideMap}
            showTagEditPanel={this.showTagEditPanel}
          />
          { showEditPanel && <EditPanel closeEditPanel={this.closeEditPanel} mesh={currentTagMesh} data={customTags} /> }
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    cases: state.cases,
    user: state.user,
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
)(Edit);
