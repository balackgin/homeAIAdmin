import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Col, Row, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { fetchProjectDtl } from './redux/actions';
import { timeFormatter } from '../common/utils/';
import styled from 'styled-components';

const { Meta } = Card;

const StyledImg = styled.img`
  width: 216px;
  height: 158px;
`;

const StyledTag = styled.p`
  position: absolute;
  top: 0;
  left: 0;
`;

const StyledTitle = styled.p`
  border-left: 3px solid #2e7dfb;
  padding-left: 8px;
`;

const statusMap = {
  WAITING_RESPONSE: '待响应',
  WAITING_DESIGN: '待设计',
  WAITING_CONFIRM: '待确认',
  CONFIRMED:'已确认',
  SIGNED:'已签单'
}
const genderMap = {
  '男': '先生',
  '女': '女士'
}

export class Detail extends Component {
  static propTypes = {
    projectDetail: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    const { fetchProjectDtl } = this.props.actions;
    fetchProjectDtl(id);
  }

  renderCasePackage = () => {
    const { cases } = this.props.projectDetail;
    if (cases) {
      return (
        <Card title="方案包">
          {
            cases.map((caseItem => (
              <Col span={8} key={caseItem.id}>
                <Card
                  hoverable={true}
                  cover={
                    <StyledImg src={caseItem.cover} />
                  }
                >
                  <Meta
                    title={caseItem.name}
                    description={timeFormatter(caseItem.updateTime)}
                  />
                  {caseItem.checked ? (<StyledTag>已确认</StyledTag>) : null}
                </Card>
              </Col>
            )))
          }
        </Card>
      );
    }
  }

  renderProject = () => {
    const {
      status,
      designDemand,
      customerInfo: {
        name,
        gender,
        phone,
        wwid
      } = {},
      houseInfo: {
        address,
        area,
        houseStatus,
        budget,
        layout,
        image
      } = {},
      sample: {
        samplePic,
        sampleName,
        designer,
        layout: houseLayout,
        styles
      } = {}
    } = this.props.projectDetail;
    return (
      <Card title={`项目状态：${statusMap[status]}`}>
        <Row>
          <Col span={8}>
            <div>
              <StyledTitle>客户信息</StyledTitle>
              <p><span>姓名：</span><span>{`${name} ${genderMap[gender]}`}</span></p>
              <p><span>电话：</span><span>{phone}</span></p>
              <p><span>旺旺：</span><span>{wwid}</span></p>
            </div>
            <div>
              <StyledTitle>设计需求</StyledTitle>
              <p>{designDemand}</p>
            </div>
          </Col>
          <Col span={16}>
            <div>
              <StyledTitle>房屋信息</StyledTitle>
              <p><span>小区：</span><span>{address}</span></p>
              <p><span>面积：</span><span>{area}</span></p>
              <p><span>户型：</span>{layout}</p>
              <p><span>房屋状态：</span>{houseStatus}</p>
              <p><span>装修预算：</span><span>{budget}</span></p>
              <p><span>户型图：</span><img src={image} alt=""/></p>
            </div>
          </Col>
        </Row>
        <Row>
          <div>
            <StyledTitle>参考案例</StyledTitle>
            <div>
              <img src={samplePic} alt=""/>
              <div>
                <p>{sampleName}</p>
                <p><span>设计师：</span>{designer}</p>
                <p><span>户型：</span>{houseLayout}</p>
                <p>
                  <span>风格：</span>
                  {
                    styles && styles.map(styleItem => <span key={styleItem}>{styleItem}</span>)
                  }
                </p>
              </div>
            </div>
          </div>
        </Row>
      </Card>
    );
  }

  renderCustomerReview = () => {
    const {
      customerReview: {
        content,
        ratings
      } = {}
    } = this.props.projectDetail;
    return (
      <Card
        title="客户评价"
        extra={<Rate value={ratings} disabled />}
      >
        <p>{content}</p>
      </Card>
    );
  }

  renderContract = () => {
    return (
      <Card title="装修合同">
        <Link to="">
          查看合同
        </Link>
      </Card>
    );
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Col span={24}>
            {this.renderCasePackage()}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {this.renderProject()}
          </Col>
        </Row>
        <Row>
          <Col span={15}>
            {this.renderCustomerReview()}
          </Col>
          <Col span={9}>
            {this.renderContract()}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    projectDetail: state.project.projectDetail,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchProjectDtl }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detail);
