import React, { Component } from 'react';
import { List, Breadcrumb, Button, Input, Form, Select, Row, Col, DatePicker,message } from 'antd';
import Link from 'umi/link';
import moment from 'moment'
import { connect } from 'dva';
import { getFileItem } from 'antd/lib/upload/utils';

import style from './Assets.less';

//基本信息切换表单
class storageForm extends React.Component {
  state = {
    source: '公司资产'
  }
  handelSubmit = (event) => {
    const formatDate = 'YYYY-MM-DD'
    const { info } = this.props;
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err || Object.keys(info).length === 0) {
        return;
      }
      const submit = ()=>{
        values.purchaseTime =values.purchaseTime ? moment(values.purchaseTime).format(formatDate) : null;
        values.activateDate =values.activateDate ? moment(values.activateDate).format(formatDate) : null;
        values.rentStartTime =values.rentStartTime ? moment(values.rentStartTime).format(formatDate) : null;
        values.rentEndTime =values.rentEndTime ? moment(values.rentEndTime).format(formatDate) : null;
        values = { ...values, directoryId: info.directoryId }
        const { dispatch } = this.props;
        dispatch({
          type: 'storage/toStorage',
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
  handleSelectChange = (value) => {
    this.setState({ source: value })
  }
  // 公司资产
  companyShow = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <div key={'companyShow'}>
      <Col span={8}>
        <Form.Item
          label="原值"
        >
          {getFieldDecorator('originalValue', {
            rules: [{ pattern: /^\d{1,9}(\.{0}|\.{1}\d{1,2})?$/, message: '请输入数字（可保留两位小数）' }]
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
            rules: [{ required: true,message: '采购时间未选择' }]
          })(
            <DatePicker placeholder="请选择采购时间" style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="供应商"
        >
          {getFieldDecorator('supplier', {})(
            <Input placeholder='请输入供应商' />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="启用日期"
        >
          {getFieldDecorator('activateDate', {})(
            <DatePicker placeholder="请选择启用日期" style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Col>
    </div>
  }
  // 租赁资产
  leaseAssetsShow = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldProps } = form;
    const Option = Select.Option;
    return <div>
      <Col span={5}>
        <Form.Item
          label="租金"
        >
          <span>
            {getFieldDecorator('rent', {
              rules: [{ pattern: /^\d{1,9}(\.{0}|\.{1}\d{1,2})?$/, message: '请输入数字（可保留两位小数）' }]
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
              initialValue: '元/月'
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
            rules: [{ required: true,message: '租赁时间未选择' }]
          })(
            <DatePicker placeholder="请选择租赁开始时间" style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="租赁结束时间"
        >
          {getFieldDecorator('rentEndTime', {})(
            <DatePicker placeholder="请选择租赁结束时间" style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="供应商"
        >
          {getFieldDecorator('supplier', { rules: [{ required: true }] })(
            <Input placeholder='请输入供应商' />
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="启用日期"
        >
          {getFieldDecorator('enableTime', {})(
            <DatePicker placeholder="请选择启用日期" style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Col>
    </div>
  }
  render() {
    const { info } = this.props;
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator, getFieldProps } = form;
    const state = this.state;
    const Option = Select.Option;
    // 资产目录板块
    const directory = [
      <div style={{ width: '100%' }} key={'directory'}>
        <p style={{ color: '#999', float: 'left' }}>已选择（目录编号>类型>品牌>型号）</p>
        <Link style={{ float: 'right', marginRight: '20px' }} to='/basic-management/assets-directory'>返回重新选择</Link>
        {
          Object.keys(info).length !== 0 ? (<div key={1} style={{ background: 'rgb(240,240,240)', height: '50px', lineHeight: '50px', width: '100%', marginBottom: '20px', marginTop: '40px' }}>
            【{info.directoryNumber}】{info.directoryType}>{info.brand}>{info.model}
          </div>) : (<div key={2}></div>)
        }
      </div>
    ]

    // 序列号板块
    const serialNumber = [
      <Form.Item
        label="序列号"
        key={'serialNumber'}
        style = {{width:'100%'}}

      >
        {getFieldDecorator('serialNumber', {
          rules: [{ required: true,message: '序列号未填写' }]
        })(
          <Input style={{ height: '50px'}} placeholder='请输入固资序列号、SN、识别码；可以直接使用扫码枪扫码录入；多台同供应商同型号同价值设备可以同时添加；请以英文逗号（，）分隔；' />
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
                initialValue: '公司资产'
              })(
                <Select
                  onChange={this.handleSelectChange}
                >
                  <Option key={1} value="公司资产">公司资产</Option>
                  <Option key={2} value="租赁资产">租赁资产</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          {
            this.state.source === '公司资产' ? this.companyShow() : this.leaseAssetsShow()
          }
        </Row>
      </div>
    ]
    return (
      <Form onSubmit={this.handelSubmit}>
        {
          function () {
            const lists = [{ header: '固资目录', dataSource: directory }, { header: '序列号', dataSource: serialNumber }, { header: '基本信息', dataSource: basicInfo }]
            let child = []
            {/* 循环显示表单 */}
            for (let i = 0; i < lists.length; i++) {
              child.push(
                <div key={lists[i].header}>
                  <List
                    size='large'
                    header={<h3>{lists[i].header}</h3>}
                    dataSource={lists[i].dataSource}
                    style={{ margin: '20px 0', background: '#fff', padding: '20px' }}
                    renderItem={(item,index) => (
                      <List.Item key={index}>
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
            <Button style={{ marginRight: '20px' }}><a href='/basic-management/assets-directory'>取消</a></Button>
            <Button type="primary" htmlType="submit">提交</Button>
          </div>
        </div>
      </Form>
    )
  }
}
const WrappedStorageForm = Form.create()(storageForm);

@connect(({ storage, loading }) => ({
  storage,
  loading: loading.models.storage
}))

// 资产入库组件
class AssetsStorage extends Component {
  render() {
    const id = this.props.match.params.id;
    const info = this.props.location.state;
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>基础管理</Breadcrumb.Item>
              <Breadcrumb.Item>资产入库</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>资产入库</h2>
          </div>
        </div>
        <div>
          <WrappedStorageForm info={info} dispatch={this.props.dispatch} />
        </div>
      </div>
    );
  }
}

export default AssetsStorage;