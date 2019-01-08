import React, { Component } from 'react';
import { List, Breadcrumb, Input, Form, Col } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import FormItem from 'antd/lib/form/FormItem';

import style from '../BasicManagement/Assets.less';
import styleLedger from './static/ledger.less';
import UseLibraryForm from './UseLibraryForm';

@connect(({ useLibrary, loading }) => ({
  useLibrary,
  loading: loading.models.useLibrary
}))
// 资产出库组件
class UseLibrary extends Component {
  state = {
    data: this.props.location.state
  }
  componentWillUnmount() {
    //做收尾工作，清楚定时器等
    const { dispatch } = this.props;
    dispatch({
      type: 'useLibrary/change',
      payload: []
    })
  }
  handelRemove = (index) => {
    const {data} = this.state
    data.splice(index, 1)
    this.setState({data})
  }
  render() {
    const {data} = this.state
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>基础管理</Breadcrumb.Item>
              <Breadcrumb.Item>领用出库</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>领用出库</h2>
          </div>
        </div>
        <List style={{ margin: '20px 0', background: '#fff', padding: '20px' }}>
          <List.Item style={{ position: 'relative' }}>
            <h3>已选物资</h3>
            <Link style={{ position: 'absolute', right: '20px', marginRight: '20px' }} to='/solid-assets-management/assets-ledger'>返回重新选择</Link>
          </List.Item>
          <List.Item>
            <div style={{ width: '100%' }}>
              <p style={{ color: '#999' }}>已选择({data.length})（目录编号>类型>品牌>型号）</p>
              {
                data.map((val, index) => {
                  return (
                    <div key={index} style={{ background: 'rgb(240,240,240)', height: '50px', lineHeight: '50px', width: '100%', marginBottom: '20px' }}>
                      【{val.assetNumber}】{val.assetType} > {val.brand} > {val.model} > {val.serialNumber} > {val.source}
                      <span style={{ float: 'right', marginRight: '20px' }}><a href="JavaScript:;" onClick={(index) => { this.handelRemove(index) }}>移除</a></span>
                    </div>
                  )
                })
              }
            </div>
          </List.Item>
        </List>
        <UseLibraryForm
          data = {this.props.location.state }
        />
      </div>
    );
  }
}

export default UseLibrary;
