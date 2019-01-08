import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import React ,{ PureComponent } from 'react';
import { connect } from 'dva'
import { callbackify } from 'util';

const FormItem = Form.Item;
@connect(({ queryUseRecord, queryLedger,global }) => ({
  queryUseRecord,
  global,
  queryLedger
}))
class RecordSearchForm extends PureComponent {
  state = {
    expand: false,
    dataType : []
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  handleFocus = () => {
    if(!this.props.queryLedger.allDept.toString()){
      const { dispatch } = this.props
      dispatch({
        type: 'queryLedger/findAllDept'
      })
    }
  }
  handleTypeFocus = ()=>{
    const {dispatch} = this.props
    dispatch({
      type: 'global/fetchType',
      callback: dataType =>{
        this.setState({dataType})
      }
    })
  }
  //数组去重
  unique = (a) => {
    var res = [];
    for (var i = 0, len = a.length; i < len; i++) {
      var item = a[i];
      for (var j = 0, jLen = res.length; j < jLen; j++) {
        if (res[j] === item)
          break;
      }
      if (j === jLen)
        res.push(item);
    }
    return res;
  }
  getFields() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { expand } = this.state;
    const { dataType } = this.state
    let type = dataType ? dataType.map((val) => {
      return val.assetTypeName
    }) : []
    type = this.unique(type)
    return <Row gutter={24}>
      <Col span={8}>
        <FormItem label='资产编号' {...formItemLayout}>
          {getFieldDecorator('assetNumber')(<Input placeholder="请输入" />)}
        </FormItem>
      </Col>
      <Col span={8} >
        <FormItem label="物资类型" {...formItemLayout}>
          {getFieldDecorator('assetType', {
            initialValue: '全部'
          })(
            <Select placeholder="请选择物资类型" onFocus = {this.handleTypeFocus}>
              <Select.Option value="全部">全部</Select.Option>
              {
                type.map((val, index) => (
                  <Select.Option key={index} value={val}>{val}</Select.Option>
                ))
              }
            </Select>
          )}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label='流转类型' {...formItemLayout}>
          {getFieldDecorator('transferType', { initialValue: '全部' })(
            <Select placeholder="请选择">
              <Select.Option value="全部">全部</Select.Option>
              <Select.Option value="资产发放">资产发放</Select.Option>
              <Select.Option value="资产借用">资产借用</Select.Option>
            </Select>)}
        </FormItem>
      </Col>
      <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
        <FormItem label='领用人' {...formItemLayout}>
          {getFieldDecorator('acceptUser')(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
        <FormItem label='所属部门' {...formItemLayout}>
          {getFieldDecorator('department')(
            <Select mode="tags" placeholder="请输入" onFocus={this.handleFocus}>
              {
                this.props.queryLedger.allDept.map((val, index) => (
                  <Select.Option key={index} value={val}>{val}</Select.Option>)
                )
              }
            </Select>
          )}
        </FormItem>
      </Col>
    </Row>
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((_, values) => {
      values = { ...values, pageNo: 1 }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryUseRecord/search',
        payload: values
      })
    });
  };
  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              展开 <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}
const UseAssetsRecordSearchForm = Form.create()(RecordSearchForm);
export default UseAssetsRecordSearchForm;
