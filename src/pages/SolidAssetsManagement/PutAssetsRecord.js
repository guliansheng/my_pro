import React, { PureComponent } from 'react';
import { Breadcrumb, Table, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment'

import style from '../BasicManagement/Assets.less';
import PutAssetsRecordSearchForm from './PutAssetsRecordSearchForm'
import styleLedger from './static/ledger.less';

const FormItem = Form.Item;
@connect(({ queryPutRecord,queryType,loading}) => ({
  queryPutRecord,
  queryType,
  loading: loading.models.queryPutRecord,
}))
// 资产目录组件
class PutAssetsRecord extends PureComponent {
  scroll = { x: 2600 }
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: 'left',
      width: 80,
      render: (val, record, index) => <span>{(this.props.queryPutRecord.data.current - 1) *10 + index + 1}</span>
    },
    {
      title: '资产编号',
      dataIndex: 'assetNumber'
    },
    {
      title: '类型',
      dataIndex: 'assetType'
    },
    {
      title: '品牌',
      dataIndex: 'brand'
    },
    {
      title: '型号',
      dataIndex: 'model'
    },
    {
      title: '设备序列号',
      dataIndex: 'serialNumber',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '来源',
      dataIndex: 'source'
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '采购或租赁时间',
      dataIndex: 'assetPurchaseOrRentTime',
      render: (val) => val ? val : '-'
    },
    {
      title: '租用到期时间',
      dataIndex: 'rentEndTime',
      render: val => val ? val : '-'
    },
    {
      title: '租金/原值',
      dataIndex: 'price',
      render: (val) => val ? val : '-'
    },
    {
      title: '启用日期',
      dataIndex: 'activateDate',
      render: (val) => val ? val : '-'
    },
    {
      title: '操作人',
      dataIndex: 'manager',
      fixed: 'right',
      width: 140
    },
    {
      title: '操作时间',
      dataIndex: 'gmtCreate',
      fixed: 'right',
      width: 240
    }
  ]

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryPutRecord/fetch'
    });
  }
  //分页回调
  pageChange (page){
    const { dispatch } = this.props;
    // console.log(this.form)
    const operateTime = this.form.props.form.getFieldValue('operateTime') || ''
    let formData = this.form.props.form.getFieldsValue()
    let pageNo = {pageNo: page}
    formData = {...formData,...pageNo,operateTimeBetween: operateTime?moment(operateTime[0]).format() : null, operateTimeAnd: operateTime?moment(operateTime[1]).format() : null }
    dispatch({
      type: 'queryPutRecord/search',
      payload: formData
    });
  }
  render() {
    let { data, visible} = this.props.queryPutRecord
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
              <Breadcrumb.Item>入库记录</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>入库记录</h2>
          </div>
        </div>
        <div className={style.assetTypeList}>
          <div className={style.tool}>
            <PutAssetsRecordSearchForm  wrappedComponentRef={(form) => this.form = form}/>
          </div>
          <Table
            rowKey ={'assetNumber'}
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

export default PutAssetsRecord;
