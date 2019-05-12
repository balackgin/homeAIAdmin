import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

export default class List extends Component {
  static propTypes = {
    totalCount: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired
  };

  render() {
    const {
      totalCount,
      columns,
      dataSource,
      pagination,
      loading
    } = this.props;

    return (
      <div className="card-body">
        <div className="card-title">{`全部项目(${totalCount})`}</div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={pagination}
        />
      </div>
    );
  }
}
