import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import React ,{ PureComponent } from 'react';
import { connect } from 'dva'
import moment from 'moment'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ queryPutRecord,global }) => ({
  queryPutRecord,
  global
}))
class RecordSearchForm extends PureComponent {
  state = {
    expand: false,
    dataType : []
  };
  // componentDidMount(){
  //   const {dispatch} = this.props
  //   dispatch({
  //     type: 'queryType/fetchType'
  //   })
  // }
  handleReset = () => {
    this.props.form.resetFields();
  };
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  handleFocus = ()=>{
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
            <Select placeholder="请选择物资类型" onFocus = {this.handleFocus}>
              <Select.Option value="全部">全部</Select.Option>
              {
                type?type.map((val, index) => (
                  <Select.Option key={index} value={val}>{val}</Select.Option>
                )) : null
              }
            </Select>
          )}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label='来源' {...formItemLayout}>
          {getFieldDecorator('source')(
            <Select placeholder="请选择">
              <Select.Option value="公司资产">公司资产</Select.Option>
              <Select.Option value="租赁资产">租赁资产</Select.Option>
            </Select>)}
        </FormItem>
      </Col>
      <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
        <FormItem label='供应商' {...formItemLayout}>
          {getFieldDecorator('supplier')(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
        <FormItem label='操作日期' {...formItemLayout}>
          {getFieldDecorator('operateTime')(
            <RangePicker onChange = {this.handleChange}/>
          )}
        </FormItem>
      </Col>
    </Row>
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((_, values) => {
      const operateTime = this.props.form.getFieldValue('operateTime') || ''
      values = { ...values, pageNo: 1, operateTimeBetween: operateTime?moment(operateTime[0]).format() : null, operateTimeAnd: operateTime?moment(operateTime[1]).format() : null }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryPutRecord/search',
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
const PutAssetsRecordSearchForm = Form.create()(RecordSearchForm);
export default PutAssetsRecordSearchForm;
