import React, { PureComponent } from 'react';
import { Popconfirm, Breadcrumb, Table, Divider, Button, Input, Modal, Form, Select } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

import AssetsDirectorySearchForm from './AssetsDirectorySearchForm';
import style from './Assets.less';

// 新增目录表单
const FormItem = Form.Item;
const { TextArea } = Input;
const CollectionCreateForm = Form.create()(
  class extends React.Component {
    handleSubmit = () => {
      this.props.form.validateFields((err, val) => {
        if (err) {
          return;
        }
        this.props.form.resetFields();
      });
    }
    render() {
      const { visible, onCancel, onCreate, form, directoryType } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} title="新增目录" okText="添加" onCancel={onCancel} onOk={onCreate}>
          <Form>
            <FormItem label="类型">
              {getFieldDecorator('directoryType', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Select placeholder="请选择资产类型" >
                  {
                    directoryType?directoryType.map((val, index) => (
                      <Select.Option key={index} value={val}>{val}</Select.Option>
                    )):null
                  }
                </Select>
              )}
            </FormItem>
            <FormItem label="品牌">
              {getFieldDecorator('brand', {
                rules: [{ required: true, message: '请输入品牌' }],
              })(<Input placeholder="请输入品牌" />)}
            </FormItem>
            <FormItem label="型号">
              {getFieldDecorator('model', {
                rules: [{ required: true, message: '请输入型号' }],
              })(<Input placeholder="请输入型号" />)}
            </FormItem>
            <FormItem labelAssetsDirectory="备注">
              {getFieldDecorator('remark')(<TextArea rows={5} />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);


@connect(({ global, queryDirectory, storage }) => ({
  global,
  queryDirectory,
  storage
}))
// 资产目录组件
class AssetsDirectory extends PureComponent {
  state = {
    visible: false,
    dataType: []
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
      render: (val, record, index) => <span>{(this.props.queryDirectory.data.current - 1) *10 + index + 1}</span>
    },
    {
      title: '目录编号',
      dataIndex: 'directoryNumber',
    },
    {
      title: '类型',
      dataIndex: 'directoryType',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 120,
      className: 'remark',
      render: val => (<span title={val}>{val ? val : '-'}</span>),
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (val, result) => (
        <span>
          <Link to={{
            pathname:'/basic-management/assets-storage',
            state: result
          }}
          >
            资产入库
          </Link>
          <Divider type="vertical" />
          <Popconfirm title="确定删除该类型？" onConfirm={() => this.handleDelete(result)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ]
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
  showModal = () => {
    this.setState({ visible: true })
  };

  handleCancel = () => {
    this.setState({ visible: false })
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      //添加成功在此处处理表单数据值 
      if (err) {
        return;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryDirectory/addDirectory',
        payload: values
      })
      form.resetFields();
      this.setState({ visible: false })
    });
  };
  handleDelete = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryDirectory/delete',
      payload: val
    })
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryDirectory/fetch'
    })
    dispatch({
      type: 'global/fetchType',
      callback: dataType =>{
        this.setState({dataType})
      }
    })
  }

  //分页回调
  pageChange (page){
    const { dispatch } = this.props;
    let formData = this.form.props.form.getFieldsValue()
    let pageNo = {pageNo: page}
    formData = {...formData,...pageNo}
    dispatch({
      type: 'queryDirectory/search',
      payload: formData
    });
  }
  render() {
    const { visible ,dataType, type} = this.state;
    const { data } = this.props.queryDirectory;
    const records = data.records?data.records:[]
    // 分页器设置
    const pagination = {
      onChange: this.pageChange.bind(this),
      current: data.current,
      pageSize: data.size,
      total: data.total,
      showQuickJumper: true,
      showTotal: (total, range) => `共${total}条记录 第${range[0]}-${range[1]}条 `,
    };

    // 获取资产类型
    let addType = dataType?dataType.map((val) => {
      if(val.assetTypeState === '启用'){
        return val.assetTypeName
      }
      return null
    }) : []
    let directoryType = dataType?dataType.map((val) => {
        return val.assetTypeName
    }) : []
    addType = addType.filter(val => val )
    addType = this.unique(addType)
    directoryType = this.unique(directoryType)
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>基础管理</Breadcrumb.Item>
              <Breadcrumb.Item>资产目录</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>资产目录</h2>
          </div>
        </div>
        <div className={style.assetTypeList}>
          <div className={style.tool}>
            {/* 查询表单 */}
            <AssetsDirectorySearchForm directoryType={directoryType} wrappedComponentRef={(form) => this.form = form}/>
          </div>
          <div style={{marginLeft: '20px' }}>
            <Button type="primary" onClick={this.showModal}>
              + 新增目录
            </Button>
          </div>

          {/* 新增目录 */}
          <CollectionCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            directoryType={addType}
          />
          <Table
            rowKey="directoryId"
            bordered
            pagination={pagination}
            columns={this.columns}
            dataSource={records}
            scroll={{ x: 1500 }}
            style={{ padding: '20px', boxSizing: 'border-box' }}
          />
        </div>
      </div>
    );
  }
}

export default AssetsDirectory;
