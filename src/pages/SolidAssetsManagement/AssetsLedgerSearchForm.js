import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import React from 'react';
import { connect } from 'dva'

const FormItem = Form.Item;
@connect(({ queryLedger }) => ({
  queryLedger
}))
class SearchForm extends React.Component {
  state = {
    expand: false
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
    const count = this.state.expand ? 9 : 3;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    const searchList = [
      { label: '资产编号', name: 'assetNumber' },
      { label: '固资类型', name: 'assetType' },
      { label: '状态', name: 'assetState' },
      { label: '来源', name: 'source' },
      { label: '领用人', name: 'acceptUser' },
      { label: '所属部门', name: 'department' },
      { label: '供应商', name: 'supplier' },
      { label: '流转类型', name: 'transferType' },
    ];
    for (let i = 0; i < searchList.length; i++) {
      // 状态
      if (i === 2) {
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
              {getFieldDecorator(`${searchList[i].name}`, { initialValue: '全部' })(
                <Select>
                  <Select.Option value="全部">全部</Select.Option>
                  <Select.Option value="已发放">已发放</Select.Option>
                  <Select.Option value="未发放">未发放</Select.Option>
                </Select>)}
            </FormItem>
          </Col>
        );
        continue;
      } 
      // 来源
      else if (i === 3) {
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
              {getFieldDecorator(`${searchList[i].name}`, { initialValue: '全部' })(
                <Select>
                  <Select.Option value="全部">全部</Select.Option>
                  <Select.Option value="公司资产">公司资产</Select.Option>
                  <Select.Option value="租赁资产">租赁资产</Select.Option>
                </Select>)}
            </FormItem>
          </Col>
        );
        continue;
      }
      // 领用人
      else if (i === 4) {
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
              {getFieldDecorator(`${searchList[i].name}`)(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        );
        continue;
      }
      // 所属部门
      else if (i === 5) {
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
              {getFieldDecorator(`${searchList[i].name}`)(
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
        );
        continue;
      }
      // 流转类型
      else if (i === 7) {
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
              {getFieldDecorator(`${searchList[i].name}`, { initialValue: '全部' })(
                <Select>
                  <Select.Option value='全部'>全部</Select.Option>
                  <Select.Option value="资产发放">资产发放</Select.Option>
                  <Select.Option value="资产借用">资产借用</Select.Option>
                </Select>)}
            </FormItem>
          </Col>
        );
        continue;
      }
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
            {getFieldDecorator(`${searchList[i].name}`)(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  handleSearch = e => {
    const pageNo = { pageNo: 1 }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values = { ...values, ...pageNo }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryLedger/search',
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
const AssetsLedgerSearchForm = Form.create()(SearchForm);
export default AssetsLedgerSearchForm;
