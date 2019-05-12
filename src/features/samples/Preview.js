import React, { Component } from 'react';
import { Button } from 'antd';

import history from '../../common/history';

export default class Preview extends Component {
  handleBackClick = () => {
    history.goBack();
  }

  render() {
    const { id } = this.props.match.params;

    return (
      <div className="preview-ctnr">
        <Button className="back-btn" onClick={this.handleBackClick}>返回</Button>
        <iframe
          title="preview"
          className="preview-page"
          src={`/detail-template.html?preview=true&id=${id}`}
          frameBorder="0"
        />
      </div>
    );
  }
}
