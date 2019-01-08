import React, { Component } from 'react';
import { List, Breadcrumb, Table, Input, Form, Select, Row, Col, DatePicker } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';

import style from '../BasicManagement/Assets.less';
import styleLedger from './static/ledger.less';
import FormItem from 'antd/lib/form/FormItem';
//领用出库表单
class DetailForm extends React.Component {
  state = {
    disabled: true,
    data: this.props.data
  }
  // 公司资产
  companyShow = () => {
    const dateFormat = 'YYYY-MM-DD';
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const data = this.state.data
    return <div>
      <Col span={8}>
        <Form.Item
          label="原值"
        >
          {getFieldDecorator('originalValue', {
            initialValue: data.originalValue
          })(
            <Input placeholder='请输入原有价值' addonAfter='元' disabled/>
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="采购时间"
        >
          {getFieldDecorator('purchaseTime', {
            initialValue: data.purchaseTime ? moment(data.purchaseTime, dateFormat) : null
          })(
            <DatePicker  style={{ width: '100%' }} disabled/>
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="供应商"
        >
          {getFieldDecorator('supplier', {
            initialValue: data.supplier
          })(
            <Input placeholder='请输入供应商' disabled/>
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="启用日期"
        >
          {getFieldDecorator('activateDate', {
            initialValue: data.activateDate ? moment(data.activateDate, dateFormat) : null
          })(
            <DatePicker placeholder="请选择启用日期" style={{ width: '100%' }} disabled/>
          )}
        </Form.Item>
      </Col>
    </div>
  }
  // 租赁资产
  leaseAssetsShow = () => {
    const dateFormat = 'YYYY-MM-DD';
    const { form } = this.props;
    const { getFieldDecorator, getFieldProps } = form;
    const Option = Select.Option;
    const data = this.state.data
    return <div>
      <Col span={5}>
        <Form.Item
          label="租金"
        >
          <span>
            {getFieldDecorator('rent', {
              initialValue: data.rent
            })(
              <Input
                type="text"
                style={{ marginRight: '3%' }}
                disabled
              />)}
          </span>
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          label='单位'
        >
          <span>
            {getFieldDecorator('rentUnit', {
              initialValue: data.rentUnit
            })(
              <Select disabled>
                <Option value="元/天">元/天</Option>
                <Option value="元/月">元/月</Option>
                <Option value="元/季">元/季</Option>
                <Option value="元/年">元/年</Option>
              </Select>
            )}
          </span>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="租赁开始时间"
        >
          {getFieldDecorator('rentStartTime', {
            initialValue: data.rentStartTime ? moment(data.rentStartTime, dateFormat) : null
          })(
            <DatePicker placeholder="请选择租赁开始时间" style={{ width: '100%' }} disabled/>
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="租赁结束时间"
        >
          {getFieldDecorator('rentEndTime', {
            initialValue: data.rentEndTime ? moment(data.rentEndTime, dateFormat) : null
          })(
            <DatePicker style={{ width: '100%' }} disabled/>
          )}
        </Form.Item>
      </Col>
      <Col span={8} >
        <Form.Item
          label="供应商"
        >
          {getFieldDecorator('supplier', {
            initialValue: data.supplier
          })(
            <Input placeholder='请输入供应商' disabled/>
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="启用日期"
        >
          {getFieldDecorator('activateDate', {
            initialValue: data.activateDate ? moment(data.activateDate, dateFormat) : null
          })(
            <DatePicker placeholder="请选择启用日期" style={{ width: '100%' }} disabled/>
          )}
        </Form.Item>
      </Col>
    </div>
  }
  // 领用信息
  retrievalShow = () => {
    const dateFormat = 'YYYY-MM-DD';
    const data = this.state.data
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { TextArea } = Input;
    return <div>
      <Row style={{ marginLeft: '10px' }} >
        <Col span={7}>
          <Form.Item
            label="领用审批编号"
          >
            {getFieldDecorator('approvalNumber', {
              initialValue: data.approvalNumber
            })(
              <Input placeholder='请输入' disabled/>
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="流转类型"
          >
            {getFieldDecorator('transferType', {
              initialValue: data.transferType
            })(
              <Select placeholder="资产发放/资产借用" disabled>
                <Select.Option value="资产发放">资产发放</Select.Option>
                <Select.Option value="资产借用">资产借用</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="领用时间"
          >
            {getFieldDecorator('acceptTime', {
              initialValue: data.acceptTime ? moment(data.acceptTime, dateFormat) : null
            })(
              <DatePicker style={{ width: '100%' }} disabled/>
            )}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            label="领用人姓名"
          >
            {getFieldDecorator('acceptUser', {
              initialValue: data.acceptUser
            })(
              <Input placeholder='领用人姓名' disabled/>
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="所在部门"
          >
            {getFieldDecorator('department', {
              initialValue: data.department
            })(
              <Input placeholder='根据领用人显示' disabled />
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="入职岗位"
          >
            {getFieldDecorator('station', {
              initialValue: data.station
            })(
              <Input placeholder='根据领用人显示' disabled />
            )}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            label="借用归还时间"
          >
            {getFieldDecorator('returnTime', {
              initialValue: data.returnTime ? moment(data.returnTime, dateFormat) : null
            })(
              <DatePicker style={{ width: '100%' }} disabled />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginLeft: '10px' }} >
        <Col span={12}>
          <FormItem label="备注">
            {getFieldDecorator('acceptRecordRemark', {
              initialValue: data.acceptRecordRemark
            })(<TextArea rows={5} disabled/>)}
          </FormItem>
        </Col>
      </Row>
    </div>
  }
  // 附配件
  enclosureShow = () => {
    const data = this.state.data
    const columns = [{
      title: '附（配）件',
      dataIndex: 'enclosure',
      width: 300
    }, {
      title: '数量',
      dataIndex: 'number',
      width: 300
    }, {
      title: '',
      dataIndex: 'null',
    }];

    let enclosure =data.enclosure ? data.enclosure.split(/\s*;\s*/):[]
    enclosure.forEach((val,index)=>{
      if(!val){
        enclosure.splice(index,1)
      }
    })
    let dataSource= enclosure.map((val,index)=>{
      let obj = {}
      let arr = []
      if(val){
        arr = val.split(/\s+/)
      }
      if(!arr[1]){
        obj.key = index
        obj.enclosure = '无新增附配件'
        return obj;
      }
      obj.key = index
      obj.enclosure = arr[0]
      obj.number = arr[1]
      return obj
    })
    // 附配件分页
    const pagination = {
      defaultPageSize: 20
    }
    return (
      <div>
        <Table
          rowKey={dataSource.key}
          columns={columns}
          dataSource={dataSource}
          style={{ padding: '20px' }}
          pagination={pagination}
          className={styleLedger.ledgerTable}
        />
      </div>
    )
  }
  render() {
    const data = this.state.data
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator, getFieldProps, getFieldValue } = form;
    const state = this.state;
    const Option = Select.Option;
    // 序列号板块
    const serialNumber = [
      <Form.Item
        label="序列号"
        key={'serialNumber'}
        style={{ width: '100%' }}
      >
        {getFieldDecorator('serialNumber', {
          initialValue: data.serialNumber
        })(
          <Input style={{ height: '50px' }} disabled/>
        )}
      </Form.Item>
    ]
    // 基本信息板块
    const basicInfo = [
      <div style={{ width: '100%' }} key={'basicInfo'}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="来源"
            >
              {getFieldDecorator('source', {
                initialValue: data.source
              })(
                <Select disabled>
                  <Option value="公司资产">公司资产</Option>
                  <Option value="租赁资产">租赁资产</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          {
            form.getFieldValue('source') === '公司资产' ? this.companyShow() : this.leaseAssetsShow()
          }
        </Row>
      </div>
    ]
    // 领用信息模块
    const retrievalInfo = [
      <div style={{ width: '100%' }} key={'retrievalInfo'}>
        <Row gutter={24}>
          {
            this.retrievalShow()
          }
        </Row>
      </div>
    ]
    // 附配件
    const enclosureInfo = [
      <div style={{ width: '100%' }} key ={'enclosureInfo'}>
        <Row gutter={24}>
          {
            this.enclosureShow()
          }
        </Row>
      </div>
    ]
    return (
      <Form onSubmit={this.handelSubmit}>
        {
          function () {
            const lists = [{ header: '序列号', dataSource: serialNumber }, { header: '基本信息', dataSource: basicInfo }, { header: '领用信息', dataSource: retrievalInfo }, { header: '附（配）件', dataSource: enclosureInfo }]
            let child = []
            for (let i = 0; i < lists.length; i++) {
              child.push(
                <div key={lists[i].header}>
                  <List
                    size='large'
                    header={<h3>{lists[i].header}</h3>}
                    dataSource={lists[i].dataSource}
                    style={{ margin: '20px 0', background: '#fff', padding: '20px' }}
                    renderItem={(item) => (
                      <List.Item key={item.key}>
                        {item}
                      </List.Item>
                    )}
                  />
                </div>
              )
            }
            return child
          }()
        }
      </Form>
    )
  }
}
const WrappedDetailForm = Form.create()(DetailForm);

@connect(({ assetEditing,useLibrary, loading }) => ({
  assetEditing,
  useLibrary,
  loading: loading.models.assetEditing
}))
// 资产编辑组件
class AssetsDetail extends Component {
  render() {
    const data = this.props.location.state
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>基础管理</Breadcrumb.Item>
              <Breadcrumb.Item>详情</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>固资详情</h2>
          </div>
        </div>
        <List style={{ margin: '20px 0', background: '#fff', padding: '20px' }}>
          <List.Item style={{ position: 'relative' }}>
            <h3>已选物资</h3>
            <Link style={{ position: 'absolute', right: '20px', marginRight: '20px' }} to='/solid-assets-management/assets-ledger'>返回重新选择</Link>
          </List.Item>
          <List.Item>
            <div style={{ width: '100%' }}>
              <div style={{ background: 'rgb(240,240,240)', height: '50px', lineHeight: '50px', width: '100%', margin: '20px 0' }}>
                【{data.assetNumber}】{data.assetType} > {data.brand} > {data.model} > {data.serialNumber} > {data.source}
              </div>
            </div>
          </List.Item>
        </List>
        <WrappedDetailForm data={data} dispatch={this.props.dispatch} useLibrary={this.props.useLibrary}/>
      </div>
    );
  }
}

export default AssetsDetail;
