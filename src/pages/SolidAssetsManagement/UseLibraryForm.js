import React, { Component } from 'react';
import { List, Table, Button, Input, Form, Select, Row, Col, DatePicker, InputNumber,message } from 'antd';
import { connect } from 'dva';
import moment from 'moment'

import style from '../BasicManagement/Assets.less';
import styleLedger from './static/ledger.less';
import FormItem from 'antd/lib/form/FormItem';

//领用出库表单
@connect(({ useLibrary, loading }) => ({
  useLibrary,
  loading: loading.models.useLibrary
}))
class useLibraryForm extends React.Component {
  state = {
    disabled: true,
    enclosureObj: [],
    enclosureNumber: []
  }
  handelSubmit = (event) => {
    event.preventDefault();
    const formatDate = 'YYYY-MM-DD'
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('必填项未填写')
        return;
      }
      values.acceptTime = moment(values.acceptTime).format(formatDate)
      values.returnTime = moment(values.returnTime).format(formatDate)
      let acceptUserId = {acceptUserId: this.props.useLibrary.name.userId}
      const data = this.props.data;
      const {enclosureObj,enclosureNumber} = this.state;
      let str = ''
      for (let i = 0; i < data.length; i++) {
        if(i === data.length-1){
          str += data[i].assetId ;
        }else{
          str += data[i].assetId + ',';
        }
      }
      const select = { selectedAsset: str }
      let enclosureRemark = []
      let enclosureStr = ''
      enclosureObj.forEach((val,index)=>{
        enclosureRemark[index] = {enclosure:val.enclosure,number:enclosureNumber[val.key]?enclosureNumber[val.key]:1}
      })
      enclosureRemark.forEach((val)=>{
        enclosureStr += `${val.enclosure} ${val.number};`
      })
      enclosureStr+= this.props.form.getFieldValue('addEnclosure');
      values = { ...values, ...select,...acceptUserId, enclosure: enclosureStr}
      const { dispatch } = this.props;
      dispatch({
        type: 'useLibrary/submit',
        payload: values
      })
    });
  }
  selectChange = (val) => {
    val !== '资产借用' ? this.state.disabled = true : this.state.disabled = false
  }
  handelBlur = (e) => {
    const {dispatch} = this.props
    dispatch({
      type: 'useLibrary/getUser',
      payload: e.target.value
    }).then(() => {
        this.props.form.setFieldsValue({
        department:this.props.useLibrary.name.department,
        station: this.props.useLibrary.name.station
      })
    })
  }
  // 领用信息
  retrievalShow = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { TextArea } = Input;
    return <div>
      <Row style={{ marginLeft: '10px' }}>
        <Col span={7}>
          <Form.Item
            label="领用审批编号"
          >
            {getFieldDecorator('approvalNumber', {
              rules: [{ required: true }]
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
              rules: [{ required: true }]
            })(
              <Select placeholder="资产发放/资产借用" onChange={(val) => { this.selectChange(val) }}>
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
              rules: [{ required: true }]
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
              rules: [{ required: true }]
            })(
              <Input placeholder='输入用户名'  onBlur = {this.handelBlur}/>
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="所在部门"
          >
            {getFieldDecorator('department', {
              rules: [{ required: true }]
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
              rules: [{ required: true }]
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
            })(
              <DatePicker placeholder="请选择领用时间" style={{ width: '100%' }} disabled={this.state.disabled} />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginLeft: '10px' }}>
        <Col span={12} key={'remark'}>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              rules: [{ max: 300, required: false, message: '最多输入300个字符' }],
            })(<TextArea placeholder="最多输入300个字符" rows={5} />)}
          </FormItem>
        </Col>
      </Row>
    </div>
  }
  // 附配件
  enclosureShow = () => {
    const { form } = this.props;
    const { getFieldDecorator} = form;
    const {enclosureNumber} = this.state;
    function handelChange(value,index){
      enclosureNumber[index] = value
    }
    const columns = [{
      title: '附（配）件',
      dataIndex: 'enclosure',
      width: 300
    }, {
      title: '数量',
      dataIndex: 'number',
      width: 300,
      render: (val,record,index) => (
        <InputNumber className={styleLedger.inputNumber} min={1} defaultValue={1}  onChange={(value)=>{handelChange(value,index)}}/>    
      )
    }, {
      title: '',
      dataIndex: 'null',
    }];
    const data = [{
      key: 0,
      enclosure: '电源延长线',
    },{
      key: 1,
      enclosure: '电源适配线',
    }, {
      key: 2,
      enclosure: '电源线',
    }, {
      key: 3,
      enclosure: '键盘',
    }, {
      key: 4,
      enclosure: '鼠标',
    }, {
      key: 5,
      enclosure: '原包装盒',
    }, {
      key: 6,
      enclosure: '电脑包',
    }, {
      key: 7,
      enclosure: 'HDMI数据线',
    }, {
      key: 8,
      enclosure: 'VGA数据线',
    }, {
      key: 9,
      enclosure: 'SIM手机卡',
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let {enclosureObj} = this.state;
        enclosureObj = selectedRows
        this.setState({enclosureObj})
      }
    };
    const footer = () => (
      <div style={{textAlign:'center'}}>
        <Form.Item>
            {getFieldDecorator('addEnclosure', {
            })(
              <Input placeholder='新增附配件（格式：附配件名称 数量; 说明：附配件名称和数量用空格隔开，以英文分号结尾，可输入多组数据）' style={{height:'40px'}}/>
            )}
          </Form.Item>
      </div>
    )
    
    const pagination = {
      defaultPageSize: 20
    }
    return (
      <div>
        <Table
          key={data.key}
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          style={{ padding: '20px' }}
          pagination={pagination}
          className={styleLedger.ledgerTable}
          footer= {footer}
        />
      </div>
    )
  }
  render() {
    const { info } = this.props;
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator, getFieldProps, getFieldValue } = form;
    const state = this.state;
    const Option = Select.Option;
    // 领用信息模块
    const retrievalInfo = [
      <div style={{ width: '100%' }}>
        <Row gutter={24}>
          {
            this.retrievalShow()
          }
        </Row>
      </div>
    ]
    // 附配件
    const enclosureInfo = [
      <div style={{ width: '100%' }}>
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
            const lists = [{ header: '领用信息', dataSource: retrievalInfo }, { header: '附（配）件', dataSource: enclosureInfo }]
            let child = []
            for (let i = 0; i < lists.length; i++) {
              child.push(
                <div key={lists[i].header}>
                  <List
                    key={lists[i].header}
                    size='large'
                    header={<h3>{lists[i].header}</h3>}
                    dataSource={lists[i].dataSource}
                    style={{ margin: '20px 0', background: '#fff', padding: '20px' }}
                    renderItem={(item) => (
                      <List.Item key={i}>
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
const UseLibraryForm = Form.create()(useLibraryForm);
export default UseLibraryForm;
