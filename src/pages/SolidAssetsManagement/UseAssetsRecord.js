import React, { PureComponent } from 'react';
import { Breadcrumb, Table, Form, Row, Col, Modal } from 'antd';
import { connect } from 'dva';

import style from '../BasicManagement/Assets.less';
import UseAssetsRecordSearchForm from './UseAssetsRecordSearchForm'
import styleLedger from './static/ledger.less';

const FormItem = Form.Item;

@connect(({ queryUseRecord, queryType, loading }) => ({
  queryUseRecord,
  queryType,
  loading: loading.models.queryUseRecord,
}))
// 资产目录组件
class UseAssetsRecord extends PureComponent {
  state = {
    visible: false,
    useList: {}
  }
  scroll = { x: 2600 }
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: 'left',
      width: 80,
      render: (val, record, index) => <span>{(this.props.queryUseRecord.data.current - 1) *10 + index + 1}</span>
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
      title: '领用审批编号',
      dataIndex: 'approvalNumber',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '领用人',
      dataIndex: 'acceptUser',
      render: (val) => val ? val : '-'
    },
    {
      title: '岗位',
      dataIndex: 'station',
      render: val => val ? val : '-'
    },
    {
      title: '部门',
      dataIndex: 'department',
      render: (val) => val ? val : '-'
    },
    {
      title: '流转类型',
      dataIndex: 'transferType',
      render: (val) => val ? val : '-'
    },
    {
      title: '领用日期',
      dataIndex: 'acceptTime',
      render: (val) => val ? val : '-'
    },
    {
      title: '归还时间',
      dataIndex: 'returnTime',
      render: (val) => val ? val : '-'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      fixed: 'right',
      width: 160,
      render: (_, result) => <span><a href="javascript:;" onClick={() => { this.handelClick(result) }}>查看附（配）件</a></span>
    }
  ]

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryUseRecord/fetch'
    });
  }

  //查看附配件
  handelClick = (result) => {
    this.setState({
      useList: result,
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  //分页回调
  pageChange(page) {
    const { dispatch } = this.props;
    let formData = this.form.props.form.getFieldsValue()
    let pageNo = { pageNo: page }
    formData = { ...formData, ...pageNo }
    dispatch({
      type: 'queryUseRecord/search',
      payload: formData
    });
  }
  render() {
    let { data, visible } = this.props.queryUseRecord;
    let { dispatch } = this.props
    let useList = this.state.useList
    // 分页器设置
    const pagination = {
      onChange: this.pageChange.bind(this),
      current: data.current,
      pageSize: data.size,
      total: data.total,
      showQuickJumper: true,
      showTotal: (total, range) => `共${total}条记录 第${range[0]}-${range[1]}条 `,
    };
    //附配件表格
    const enclosureColumns = [{
      title: '序号',
      dataIndex: 'index',
      render: (val, record, index) => <span>{index + 1}</span>
    }, {
      title: '附（配）件',
      dataIndex: 'enclosure',
    }, {
      title: '数量',
      dataIndex: 'number',
    }];
    let enclosure = useList.enclosure ? useList.enclosure.split(/\s*;\s*/) : []
    enclosure.forEach((val, index) => {
      if (!val) {
        enclosure.splice(index, 1)
      }
    })
    let dataSource = enclosure.map((val,index) => {
      let obj = {}
      let arr = []
      if (val) {
        arr = val.split(/\s+/)
      }
      if(!arr[1]){
        obj.key = index
        obj.enclosure = '无新增附配件'
        return obj;
      }
      obj.enclosure = arr[0]
      obj.number = arr[1]
      obj.key = index
      return obj
    })
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>固资管理</Breadcrumb.Item>
              <Breadcrumb.Item>领用记录</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>领用记录</h2>
          </div>
        </div>
        <div className={style.assetTypeList}>
          <div className={style.tool}>
            <UseAssetsRecordSearchForm wrappedComponentRef={(form) => this.form = form} />
          </div>
          <Table
            rowKey={'acceptId'}
            bordered
            pagination={pagination}
            columns={this.columns}
            dataSource={data.records}
            scroll={this.scroll}
            style={{ padding: '20px', boxSizing: 'border-box' }}
            className={styleLedger.ledgerTable}
          />
          <Modal
            title="附（配）件 详情"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Table
              key={dataSource.key}
              columns={enclosureColumns}
              dataSource={dataSource}
              style={{ }}
              className={styleLedger.ledgerTable}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default UseAssetsRecord;
