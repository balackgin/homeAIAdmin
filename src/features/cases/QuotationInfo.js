import React, { Component } from 'react';

export default class QuotationInfo extends Component {
  render() {
    const { total, perMeter, customer = {}, location = {} } = this.props;

    return (
      <div className="cases-quotation-info cases-quotation-block">
        <div className="cases-quotation-info-block">
          <div>合同总价</div>
          <div className="red-color total-price">{ total || '-' }</div>
          <div>平米单价</div>
          <div className="per-meter-price">{ perMeter || '-' }</div>
        </div>
        <div className="cases-quotation-info-block">
          <div className="cases-quotation-info-block-title">客户信息</div>
          <div className="cases-quotation-info-block-line">名称：{ customer.name || '-' }</div>
          <div className="cases-quotation-info-block-line">户型：{ customer.phone || '-' }</div>
          <div className="cases-quotation-info-block-line">面积：{ customer.location || '-' }</div>
        </div>
        <div className="cases-quotation-info-block">
          <div className="cases-quotation-info-block-title">小区信息</div>
          <div className="cases-quotation-info-block-line">名称：{ location.title || '-' }</div>
          <div className="cases-quotation-info-block-line">户型：{ location.houseType || '-' }</div>
          <div className="cases-quotation-info-block-line">面积：{ location.area || '-' }</div>
        </div>
      </div>
    );
  }
}
