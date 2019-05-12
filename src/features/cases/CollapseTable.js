import React, { PureComponent } from 'react';
import { Table, Icon } from 'antd';

import CONSTANTS from './constants';

export default class CollapseTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      unfold: true,
    };
  }

  foldPanel = () => {
    this.setState({
      unfold: false,
    });
  }

  unfoldPanel = () => {
    this.setState({
      unfold: true,
    });
  }

  render() {
    const { unfold } = this.state;
    const { columns, data = {}, type = '', excess } = this.props;
    const { inside = [], outside = [] } = data;
    const title = CONSTANTS[type];

    columns.forEach(column => {
      if (column.key === 'image') {
        column.render = (text) => {
          return <img alt="" className="cases-collapse-table-image" src={text} />
        };
      }
    });

    return (
      <div key={type} className="cases-collapse-table">
        <div className="cases-collapse-table-header">
          <div>{title}</div>
          {
            unfold ?
            <Icon className="cases-collapse-table-header-arrow" type="down" onClick={this.foldPanel} /> :
            <Icon className="cases-collapse-table-header-arrow" type="up" onClick={this.unfoldPanel} />
          }
        </div>
        {
          unfold && <div className="cases-collapse-table-body">
            {
              inside.length > 0 && <div className="cases-collapse-table-block">
                <div className="cases-collapse-table-title">
                  套餐内{title}
                  <span className="cases-collapse-table-sub-title">
                    超量部分另行付费
                    {
                      !!excess && <span> | 已超量：<span className="red-color">{excess}</span>元</span>
                    }
                  </span>
                </div>
                <Table rowClassName="cases-collapse-table-line" dataSource={inside} columns={columns} pagination={false} />
              </div>
            }
            {
              outside.length > 0 && <div className="cases-collapse-table-block">
                <div className="cases-collapse-table-title">套餐外{title}</div>
                <Table rowClassName="cases-collapse-table-line" dataSource={outside} columns={columns} pagination={false} />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}
