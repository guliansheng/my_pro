import { Form, Row, Col, Input, Button, DatePicker, message } from 'antd';
import React from 'react';
import moment from 'moment'
import { connect } from 'dva'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ queryLog }) => ({
  queryLog
}))
class LogSearchForm extends React.Component {
  handleReset = () => {
    this.props.form.resetFields();
  };

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
    return <Row gutter={24}>
      <Col span={8}>
        <FormItem label='资产编号' {...formItemLayout}>
          {getFieldDecorator('assetCode')(<Input placeholder="请输入" />)}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label='操作日期' {...formItemLayout}>
          {getFieldDecorator('operateTime')(
            <RangePicker/>
          )}
        </FormItem>
      </Col>
    </Row>
  }

  handleSearch = e => {
    e.preventDefault();
    const formatDate = 'YYYY-MM-DD HH:mm:ss'
    this.props.form.validateFields((_, values) => {
      const operateTime = this.props.form.getFieldValue('operateTime') || ''
      values = { ...values, pageNo: 1, start: operateTime ? moment(operateTime[0]).format(formatDate) : null, end: operateTime ? moment(operateTime[1]).format(formatDate) : null }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryLog/search',
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
          </Col>
        </Row>
      </Form>
    );
  }
}
const LedgerLogSearchForm = Form.create()(LogSearchForm);
export default LedgerLogSearchForm;
