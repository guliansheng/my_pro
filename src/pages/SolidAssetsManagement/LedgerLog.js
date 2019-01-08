import React, { PureComponent } from 'react';
import { Breadcrumb, Table, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment'

import style from '../BasicManagement/Assets.less';
import LedgerLogSearchForm from './LedgerLogSearchForm'
import styleLedger from './static/ledger.less';

const FormItem = Form.Item;

@connect(({ queryLog}) => ({
  queryLog
}))
// 资产目录组件
class LedgerLog extends PureComponent {
  scroll = { x: 2400 }
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: 'left',
      width: 80,
      render: (val, record, index) => <span>{(this.props.queryLog.data.current - 1) *10 + index + 1}</span>
    },
    {
      title: '操作资产编号',
      dataIndex: 'assetFixedCode'
    },
    {
      title: '管理模块',
      dataIndex: 'manageModule',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '修改前',
      dataIndex: 'before',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '修改后',
      dataIndex: 'after',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '操作时间',
      dataIndex: 'gmtModified',
      fixed: 'right',
      width: 200
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      fixed: 'right',
      width: 100
    }
  ]

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryLog/fetch'
    });
  }
  //分页回调
  pageChange (page){
    const formatDate = 'YYYY-MM-DD HH:mm:ss'
    const { dispatch } = this.props;
    const operateTime = this.form.props.form.getFieldValue('operateTime') || ''
    let formData = this.form.props.form.getFieldsValue()
    let pageNo = {pageNo: page}
    formData = {...formData,...pageNo,start: operateTime ? moment(operateTime[0]).format(formatDate) : null, end: operateTime ? moment(operateTime[1]).format(formatDate) : null }
    dispatch({
      type: 'queryLog/search',
      payload: formData
    });
  }
  render() {
    let { data } = this.props.queryLog;
    let {dispatch} = this.props
    // 分页器设置
    const pagination = {
      onChange: this.pageChange.bind(this),
      current: data.current,
      pageSize: data.size,
      total: data.total,
      showQuickJumper: true,
      showTotal: (total, range) => `共${total}条记录 第${range[0]}-${range[1]}条 `,
    };
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>固资管理</Breadcrumb.Item>
              <Breadcrumb.Item>台账日志</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>台账日志</h2>
          </div>
        </div>
        <div className={style.assetTypeList}>
          <div className={style.tool}>
            <LedgerLogSearchForm  wrappedComponentRef={(form) => this.form = form} />
          </div>
          <Table
            rowKey ={'logId'}
            bordered
            pagination={pagination}
            columns={this.columns}
            dataSource={data.records}
            scroll={this.scroll}
            style={{ padding: '20px', boxSizing: 'border-box' }}
            className={styleLedger.ledgerTable}
          />
        </div>
      </div>
    );
  }
}

export default LedgerLog;
