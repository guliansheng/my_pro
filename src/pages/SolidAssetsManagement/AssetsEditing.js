import React, { Component } from 'react';
import { List, Breadcrumb, Table, Button, Input, Form, Select, Row, Col, DatePicker, message } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';

import style from '../BasicManagement/Assets.less';
import styleLedger from './static/ledger.less';
import FormItem from 'antd/lib/form/FormItem';
//领用出库表单
class EditingForm extends React.Component {
  state = {
    disabled: true,
    data: this.props.data
  }
  // 表单提交
  handelSubmit = (event) => {
    event.preventDefault();
    const formatDate = 'YYYY-MM-DD'
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('必填项未填写')
        return;
      }
      const submit = ()=>{
        values.purchaseTime = values.purchaseTime ? moment(values.purchaseTime).format(formatDate) : null;
        values.activateDate = values.activateDate ? moment(values.activateDate).format(formatDate) : null;
        values.rentStartTime = values.rentStartTime ? moment(values.rentStartTime).format(formatDate) : null;
        values.rentEndTime = values.rentEndTime ? moment(values.rentEndTime).format(formatDate) : null;
        values.acceptTime = values.acceptTime ? moment(values.acceptTime).format(formatDate) : null;
        values.returnTime = values.returnTime ? moment(values.returnTime).format(formatDate) : null;
        const assetId = { fixedAssetId: this.props.data.assetId }
        values = { ...values, ...assetId, remark: values.acceptRecordRemark }
        const { dispatch } = this.props
        dispatch({
          type: 'assetEditing/inset',
          payload: values
        })
      }
      if(values.rentStartTime){
        if(values.rentStartTime._d.getTime() <= (values.rentEndTime?values.rentEndTime._d.getTime():values.rentStartTime._d.getTime())){
          submit()
          return;
        }else{
          message.error('租赁结束时间不能早于租赁开始时间')
          return;
        }
      }
      submit()
    });
  }
  // 流转类型切换
  selectChange = (val) => {
    val !== '资产借用' ? this.state.disabled = true : this.state.disabled = false
  }

  handelBlur = (e) => {
    const { dispatch } = this.props
    dispatch({
      type: 'useLibrary/getUser',
      payload: e.target.value
    }).then(() => {
      this.props.form.setFieldsValue({
        department: this.props.useLibrary.name.department,
        station: this.props.useLibrary.name.station
      })
    })
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
            rules: [{ required: true, pattern: /^\d{1,9}(\.{0}|\.{1}\d{1,2})?$/, message: '请输入数字（可保留两位小数）' }],
            initialValue: data.originalValue
          })(
            <Input placeholder='请输入原有价值' addonAfter='元' />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="采购时间"
        >
          {getFieldDecorator('purchaseTime', {
            rules: [{ required: true }],
            initialValue: data.purchaseTime ? moment(data.purchaseTime, dateFormat) : null
          })(
            <DatePicker placeholder="请选择采购时间" style={{ width: '100%' }} />
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
            <Input placeholder='请输入供应商' />
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
            <DatePicker placeholder="请选择启用日期" style={{ width: '100%' }} />
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
              rules: [{pattern: /^\d{1,9}(\.{0}|\.{1}\d{1,2})?$/, message: '请输入数字（可保留两位小数）' }],
              initialValue: data.rent
            })(
              <Input
                type="text"
                style={{ marginRight: '3%' }}
                placeholder='请输入租金金额'
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
              <Select>
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
            rules: [{ required: true }],
            initialValue: data.rentStartTime ? moment(data.rentStartTime, dateFormat) : null
          })(
            <DatePicker placeholder="请选择租赁开始时间" style={{ width: '100%' }} />
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
            <DatePicker placeholder="请选择租赁结束时间" style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="供应商"
        >
          {getFieldDecorator('supplier', {
            rules: [{ required: true }],
            initialValue: data.supplier
          })(
            <Input placeholder='请输入供应商' />
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
            <DatePicker placeholder="请选择启用日期" style={{ width: '100%' }} />
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
              <Input placeholder='请输入' />
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="流转类型"
          >
            {getFieldDecorator('transferType', {
              rules: [{ required: true }],
              initialValue: data.transferType
            })(
              <Select placeholder="资产发放/资产借用">
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
              rules: [{ required: true }],
              initialValue: data.acceptTime ? moment(data.acceptTime, dateFormat) : null
            })(
              <DatePicker placeholder="请选择领用时间" style={{ width: '100%' }} />
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
              <Input placeholder='领用人' onBlur={this.handelBlur} />
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
              <DatePicker placeholder="请选择领用时间" style={{ width: '100%' }} disabled={form.getFieldValue('transferType') !== '资产借用'} />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginLeft: '10px' }} >
        <Col span={12}>
          <FormItem label="备注">
            {getFieldDecorator('acceptRecordRemark', {
              rules: [{ max: 300, required: false, message: '最多输入300个字符' }],
              initialValue: data.acceptRecordRemark
            })(<TextArea placeholder="最多输入300个字符" rows={5} />)}
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
    let enclosure = data.enclosure ? data.enclosure.split(/\s*;\s*/) : []
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
        obj.key = index
        obj.enclosure = arr[0]
        obj.number = arr[1]
        return obj
    })
    const pagination = {
      defaultPageSize: 20
    }
    return (
      <div>
        <Table
          key={dataSource.key}
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
          rules: [{ required: true, message: '序列号未填写' }],
          initialValue: data.serialNumber
        })(
          <Input style={{ height: '50px' }} placeholder='请输入固资序列号、SN、识别码；可以直接使用扫码枪扫码录入；多台同供应商同型号同价值设备可以同时添加；请以英文逗号（，）分隔；' />
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
                rules: [{ required: true }],
                initialValue: data.source
              })(
                <Select>
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
      <div style={{ width: '100%' }} key={'enclosureInfo'}>
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
        <div style={{ height: '50px', background: '#fff', lineHeight: '50px' }}>
          <div style={{ float: 'right', marginRight: '20px' }}>
            <Button style={{ marginRight: '20px' }}><a href='/solid-assets-management/assets-ledger'>取消</a></Button>
            <Button type="primary" htmlType="submit">提交</Button>
          </div>
        </div>
      </Form>
    )
  }
}
const WrappedEditingForm = Form.create()(EditingForm);

@connect(({ assetEditing, useLibrary, loading }) => ({
  assetEditing,
  useLibrary,
  loading: loading.models.assetEditing
}))
// 资产编辑组件
class AssetsEditing extends Component {
  render() {
    const data = this.props.location.state
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>基础管理</Breadcrumb.Item>
              <Breadcrumb.Item>编辑</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>固资编辑</h2>
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
        <WrappedEditingForm data={data} dispatch={this.props.dispatch} useLibrary={this.props.useLibrary} />
      </div>
    );
  }
}

export default AssetsEditing;
