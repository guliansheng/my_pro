import React, { PureComponent } from 'react';
import { Popconfirm, Breadcrumb, Table, Divider, Button, Input, Modal, Form, Tag } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

import style from './Assets.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const TypeForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新增类型"
          okText="添加"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="类型名称">
              {getFieldDecorator('assetTypeName', {
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="类型编码">
              {getFieldDecorator('assetTypeCode', {
                rules: [
                  { pattern: /^[A-Z]{2,5}$/, required: true, message: '由2-4个大写字母组成' },
                ],
              })(<Input placeholder="由2-4个大写字母组成" />)}
            </FormItem>
            <FormItem label="类型描述">
              {getFieldDecorator('assetTypeDesc', {
                rules: [{ min: 5, required: false, message: '至少输入5个字符' }],
              })(<TextArea placeholder="至少输入5个字符" rows={5} />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);
@connect(({ queryType }) => ({
  queryType
}))
class AssetsType extends PureComponent {
  state = {
    visible: false,
  };
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (val,record,index) => <span>{(this.props.queryType.data.current - 1) *10 + index + 1}</span>
    },
    {
      title: '类型名称',
      dataIndex: 'assetTypeName',
    },
    {
      title: '类型编码',
      dataIndex: 'assetTypeCode',
    },
    {
      title: '状态',
      dataIndex: 'assetTypeState',
      render: tag => (
        <span>
          {tag === '启用' ? (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ) : (
              <Tag color="red" key={tag}>
                {tag}
              </Tag>
            )}
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'assetTypeDesc',
      render: val => (<span title={val}>{val ? val : '-'}</span>),
    },
    {
      title: '操作',
      render: (val, result) => (
        <span>
          <a href="javascript:;" onClick={() => this.handelChangeState(result)}>
            {val.assetTypeState === '启用' ? '停用' : '启用'}
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除该类型？" onConfirm={() => this.handleDelete(result)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ]

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryType/addType',
        payload: values
      })
      this.setState({ visible: false });
    });
  };
  handelChangeState = result => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryType/changeState',
      payload: result
    })
  }
  handleDelete = result => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryType/deleteType',
      payload: result
    })
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryType/fetch'
    })
  }
  //分页回调
  pageChange(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryType/fetch',
      payload: page
    });
  }
  render() {
    let { data } = this.props.queryType
    data.records = data.records || []
    // 分页器设置
    const pagination = {
      onChange: this.pageChange.bind(this),
      current: data.current,
      pageSize: data.size,
      total: data.total,
      showQuickJumper: true,
      showTotal: (total, range) => `共${total}条记录 第${range[0]}-${range[1]}条 `,
    };
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>基础管理</Breadcrumb.Item>
              <Breadcrumb.Item>资产类型</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>资产类型</h2>
          </div>
        </div>
        <div className={style.assetTypeList}>
          <div className={style.tool}>
            <Button type="primary" onClick={this.showModal}>
              + 新增类型
            </Button>
          </div>
          <TypeForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <Table
            rowKey={'assetTypeId'}
            className={style.typeTable}
            bordered
            pagination={pagination}
            columns={this.columns}
            dataSource={data.records}
            style={{ padding: '20px', boxSizing: 'border-box' }}
          />
        </div>
      </div>
    );
  }
}

export default AssetsType;
