import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import React from 'react';
import {connect} from 'dva';
const FormItem = Form.Item;

@connect(({ queryDirectory}) => ({
  queryDirectory
}))
class SearchForm extends React.Component {
  state = {
    expand: false,
  };
  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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
    const count = this.state.expand ? 6 : 3;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    const searchList = [
      { label: '目录类型', name: 'directoryType' },
      { label: '品牌', name: 'brand' },
      { label: '型号', name: 'model' },
      { label: '目录编号', name: 'directoryNumber' }
    ];
    const {directoryType} = this.props;
    for (let i = 0; i < searchList.length; i++) {
      if (i === 0) {
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
              {getFieldDecorator(`${searchList[i].name}`)(
                <Select placeholder="请选择">
                {
                  directoryType?directoryType.map((val,index)=>(
                    <Select.Option key = {index} value={val}>{val}</Select.Option>
                  )) : null
                }
                </Select>)}
            </FormItem>
          </Col>
        );
        continue;
      }
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={`${searchList[i].label}`} {...formItemLayout}>
            {
              i === 3 ?
                (getFieldDecorator(`${searchList[i].name}`, {
                  rules: [{ pattern: /^[a-zA-z1-9]*$/, message: '请输入数字或字母' }]
                })(<Input placeholder="请输入" />)) : (
                  getFieldDecorator(`${searchList[i].name}`)(<Input placeholder="请输入" />)
                )
            }
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err){
        return ;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryDirectory/search',
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
const AssetsDirectorySearchForm = Form.create()(SearchForm);
export default AssetsDirectorySearchForm;
