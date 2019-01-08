import React, { PureComponent } from 'react';
import { Breadcrumb, Table, Divider, Button, Input, Modal, Form, Select, DatePicker, Row, Col, message,Icon} from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment';
import * as XLSX from 'xlsx';

import style from '../BasicManagement/Assets.less';
import AssetsLedgerSearchForm from './AssetsLedgerSearchForm'
import styleLedger from './static/ledger.less';
import styleImport from './static/index.less';
import { deleteD } from '../BasicManagement/services/api';

// 归还表单
const FormItem = Form.Item;
const { TextArea } = Input;
const ReturnForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, returnObject, form } = this.props;
      const { getFieldDecorator } = form;
      const dateFormat = 'YYYY-MM-DD';
      return (
        <Modal
          okText="归还"
          title="归还登记"
          visible={visible}
          onOk={onCreate}
          onCancel={onCancel}
        >
          <div style={{ padding: '10px', lineHeight: '30px', background: 'rgb(240,240,240)', marginBottom: '20px' }}>
            【{returnObject.assetNumber}】 > {returnObject.assetType} > {returnObject.brand} > {returnObject.model} > {returnObject.serialNumber ? returnObject.serialNumber : 'null'} > {returnObject.source}
          </div>
          <Form layout="vertical">
            <FormItem label="归还日期">
              {getFieldDecorator('returnTime', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: moment(new Date(), dateFormat)
              })(<DatePicker placeholder="请选择归还日期" style={{ width: '80%' }} />)}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator('remark', {
                rules: [{ max: 300, required: false, message: '最多输入300个字符' }],
              })(<TextArea placeholder="最多输入300个字符" rows={5} />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);
// 退租表单
const WithdrawalForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, withdrawalObject, form } = this.props;
      const { getFieldDecorator } = form;
      const dateFormat = 'YYYY-MM-DD';
      return (
        <Modal
          okText="退租"
          title="租赁设备退租"
          visible={visible}
          onOk={onCreate}
          onCancel={onCancel}
        >
          <div style={{ padding: '10px', lineHeight: '30px', background: 'rgb(240,240,240)', marginBottom: '20px' }}>
            【{withdrawalObject.assetNumber}】 > {withdrawalObject.assetType} > {withdrawalObject.brand} > {withdrawalObject.model} > {withdrawalObject.serialNumber ? withdrawalObject.serialNumber : 'null'} > {withdrawalObject.source}
          </div>
          <Row style={{ margin: '30px 0' }}>
            <Col span={12}>租赁开始时间：{withdrawalObject.assetPurchaseOrRentTime}</Col>
            <Col span={12}>租赁结束时间：{withdrawalObject.rentEndTime}</Col>
            <Col span={12} style={{ marginTop: '10px' }}>租金：{withdrawalObject.price}</Col>
          </Row>
          <Form layout="vertical">
            <FormItem label="退租日期">
              {getFieldDecorator('returnTime', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: moment(new Date(), dateFormat)
              })(<DatePicker placeholder="请选择退租日期" style={{ width: '80%' }} />)}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator('remark', {
                rules: [{ max: 300, required: false, message: '最多输入300个字符' }],
              })(<TextArea placeholder="最多输入300个字符" rows={5} />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

@connect(({ queryLedger, loading, useLibrary, assetEditing, importExcel }) => ({
  queryLedger,
  importExcel,
  useLibrary,
  assetEditing,
  loading: loading.models.queryLedger,
}))
// 资产目录组件
class AssetsLedger extends PureComponent {
  state = {
    returnVisible: false,
    returnObject: {},
    withdrawalVisible: false,
    withdrawalObject: {},
    useLibraryState: false,
    selected: []
  };
  scroll = { x: 3600 }

  columns = [
    {
      title: '资产编号',
      dataIndex: 'assetNumber',
      render: (val, result) => (
        <span title={val}><Link to={{ pathname: '/solid-assets-management/assets-detail', state: result }}>{val}</Link></span>
      )
    },
    {
      title: '类型',
      dataIndex: 'assetType'
    },
    {
      title: '品牌',
      dataIndex: 'brand'
    },
    {
      title: '型号',
      dataIndex: 'model'
    },
    {
      title: '设备序列号',
      dataIndex: 'serialNumber',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '来源',
      dataIndex: 'source'
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '采购或租赁时间',
      dataIndex: 'assetPurchaseOrRentTime',
      render: (val) => val ? val : '-'
    },
    {
      title: '租用到期时间',
      dataIndex: 'rentEndTime',
      render: val => val ? val : '-'
    },
    {
      title: '租金/原值',
      dataIndex: 'price',
      render: (val) => val ? val : '-'
    },
    {
      title: '启用日期',
      dataIndex: 'activateDate'
    },
    {
      title: '领用审批编号',
      dataIndex: 'approvalNumber',
      render: val => (<span title={val}>{val ? val : '-'}</span>)
    },
    {
      title: '领用人',
      dataIndex: 'acceptUser',
      render: val => val ? val : '-'
    },
    {
      title: '岗位',
      dataIndex: 'station',
      render: val => val ? val : '-'
    },
    {
      title: '部门',
      dataIndex: 'department',
      render: val => val ? val : '-'
    },
    {
      title: '流转类型',
      dataIndex: 'transferType',
      render: val => val ? val : '-'
    },
    {
      title: '领用日期',
      dataIndex: 'acceptTime',
      render: val => val ? val : '-'
    },
    {
      title: '归还时间',
      dataIndex: 'returnTime',
      render: val => val ? val : '-'
    },
    {
      title: '状态',
      dataIndex: 'state',
      fixed: 'right',
      width: 100
    },
    {
      title: '操作',
      fixed: 'right',
      width: 180,
      render: (val, result) => {
        if (val.state === '已退租') {
          return <span> - </span>
        } else if (val.source === '公司资产') {
          if (val.state === '未发放') {
            return <span> - </span>
          } else {
            return <span>
              <Link to={{ pathname: '/solid-assets-management/assets-editing', state: result }}>编辑</Link>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => { this.handelReturn(result) }}>归还</a>
            </span>
          }
        } else {
          if (val.state === '未发放') {
            return <span>
              <a href="javascript:;" onClick={() => { this.handelWithdrawal(result) }}>退租</a>
            </span>
          } else {
            return <span>
              <Link to={{ pathname: '/solid-assets-management/assets-editing', state: result }}>编辑</Link>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => { this.handelReturn(result) }}>归还</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => { this.handelWithdrawal(result) }}>退租</a>
            </span>
          }
        }
      }
    },
  ]

  // 归还回调
  handelReturn = (result) => {
    this.setState({
      returnVisible: true,
      returnObject: result
    });
  }
  handleReturnCreate = () => {
    const form = this.formRef.props.form;
    const formatDate = 'YYYY-MM-DD HH:mm:ss'
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.returnTime = moment(values.returnTime).format(formatDate)
      values = { ...values, fixedAssetId: this.state.returnObject.assetId }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryLedger/return',
        payload: values
      })
      form.resetFields();
      this.setState({ returnVisible: false });
    });
  };
  handleReturnCancel = () => {
    this.setState({ returnVisible: false });
  }
  saveReturnFormRef = formRef => {
    this.formRef = formRef;
  };
  // 退租回调
  handelWithdrawal = (result) => {
    this.setState({
      withdrawalVisible: true,
      withdrawalObject: result
    });
  }
  handleWithdrawalCreate = () => {
    const form = this.withdrawalFormRef.props.form;
    const formatDate = 'YYYY-MM-DD HH:mm:ss'
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.returnTime = moment(values.returnTime).format(formatDate)
      values = { ...values, fixedAssetId: this.state.withdrawalObject.assetId }
      const { dispatch } = this.props;
      dispatch({
        type: 'queryLedger/withdrawal',
        payload: values
      })
      form.resetFields();
      this.setState({ withdrawalVisible: false });
    });
  };
  handleWithdrawalCancel = () => {
    this.setState({ withdrawalVisible: false });
  }

  saveWithdrawalFormRef = formRef => {
    this.withdrawalFormRef = formRef;
  };

  // 点击领用出库按钮时
  handelUseLibrary = () => {
    const data = this.state.selected;
    if (data.length > 0) {
      this.setState({ useLibraryState: true })
    } else {
      message.error('请选择出库项目')
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'queryLedger/fetch'
    });
  }
  //分页回调
  pageChange(page) {
    const { dispatch } = this.props;
    let formData = this.form.props.form.getFieldsValue()
    let pageNo = { pageNo: page }
    formData = { ...formData, ...pageNo }
    dispatch({
      type: 'queryLedger/search',
      payload: formData
    });
  }

  // 导入
  importExcelData = (e) => {
    const formatDate = 'YYYY-MM-DD HH:ss:mm'
    const { dispatch } = this.props;
    var wb; //读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串
    const obj = e.target
    ~function importf(obj) { //导入
      if (!obj.files) {
        return;
      }
      var f = obj.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(fixdata(data)), { //手动转化
            type: 'base64'
          });
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          });
        }
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        let array = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        let dataArray = [];
        //let name=设备序列号(sn);
        for (let i = 0; i < array.length; i++) {
          let resultData = {};
          let result = array[i];
          resultData.brand=result.品牌||'';
          resultData.model=result.型号||'';
          resultData.serialNumber=result.sn||'';
          resultData.acceptUser=result.领用人姓名||'';
          resultData.originalValue=result.原值||'';
          resultData.rent=result.租金||'';
          resultData.activateDate=result.启用时间||'';
          resultData.approvalNumber=result.领用审批编号||'';
          resultData.acceptTime=result.领用日期||'';
          resultData.remark=result.资产备注||'';
          resultData.recordRemark=result.领用备注||'';
          resultData.supplier=result.供应商||'';
          resultData.rentStartTime=result.租赁资产开始时间||'';
          resultData.rentEndTime=result.租赁资产到期时间||'';
          resultData.purchaseTime=result.公司资产采购时间|| '';
          resultData.state=result.状态||'';
          resultData.source=result.来源||'';
          resultData.transferType=result.流转类型||'';
          resultData.enclosure=result.附配件||'';
          resultData.assetType=result.类型||'';
          if (resultData.activateDate != '') {
            resultData.activateDate = (new Date(1900, 0, resultData.activateDate-1).toLocaleString()).replace(/\//g,'-');
          }
          if (resultData.acceptTime != '') {
            resultData.acceptTime = (new Date(1900, 0, resultData.acceptTime-1).toLocaleString()).replace(/\//g,'-');
          }
          if (resultData.purchaseTime != '') {
            resultData.purchaseTime = (new Date(1900, 0,resultData.purchaseTime-1).toLocaleString()).replace(/\//g,'-');
          }
          if(resultData.rentStartTime!=''){
            resultData.rentStartTime= (new Date(1900, 0, resultData.rentStartTime-1).toLocaleString()).replace(/\//g,'-');
          }
          if (resultData.rentEndTime!='') {
            resultData.rentEndTime=(new Date(1900, 0, resultData.rentEndTime-1).toLocaleString()).replace(/\//g,'-');
          }
          dataArray.push(resultData);
        }
        dispatch({
          type: 'importExcel/import',
          payload: {excelData: JSON.stringify(dataArray)}
        })
      };
      try{
        if (rABS) {
        reader.readAsArrayBuffer(f) || null;
      } else {
        reader.readAsBinaryString(f) || null;
      }
      }catch(e){
        console.log(e)
      }
    }(obj);
    function fixdata(data) { //文件流转BinaryString
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
        l * w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    }
  }
  //导出
  exportExcel = () =>{
    const {dispatch} = this.props
    let formData = this.form.props.form.getFieldsValue()
    dispatch({
      type: 'importExcel/export',
      payload: formData,
      callback: (data) => {
        const json = data
        function getCharCol(n) {
          let temCol = '',
          s = '',
          m = 0
          while (n > 0) {
              m = n % 26 + 1
              s = String.fromCharCode(m + 64) + s
              n = (n - m) / 26
          }
          return s
        }
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (let k in tmpdata) {
          const key = k;
          keyMap.push(k);
          if(k === 'brand') k = '品牌';
          else if(k == 'serialNumber') k = 'sn';
          else if(k == 'assetId') k = '资产ID';
          else if(k == 'assetNumber') k = '资产编号';
          else if(k == 'assetType') k = '类型';
          else if(k == 'acceptUser') k = '领用人姓名';
          else if(k == 'department') k = '部门';
          else if(k == 'acceptUserId') k = '领用人ID';
          else if(k == 'originalValue') k = '原值';
          else if(k == 'rent') k = '租金';
          else if(k == 'rentUnit') k = '租金单位';
          else if(k == 'returnTime') k = '归还时间';
          else if(k == 'model') k = '型号';
          else if(k == 'activateDate') k = '启用时间';
          else if(k == 'approvalNumber') k = '领用审批编号';
          else if(k == 'acceptTime') k = '领用日期';
          else if(k == 'remark') k = '资产备注';
          else if(k == 'station') k = '岗位';
          else if(k == 'recordRemark') k = '领用备注';
          else if(k == 'supplier') k = '供应商';
          else if(k == 'purchaseTime') k = '公司资产采购时间';
          else if(k == 'rentStartTime') k = '租赁资产开始时间';
          else if(k == 'rentEndTime') k = '租赁资产结束时间';
          else if(k == 'state') k = '状态';
          else if(k == 'source') k = '来源';
          else if(k == 'transferType') k = '流转类型';
          else if(k == 'enclosure') k = '附配件';
          else if(k == 'price') k = '租金或原值';
          else if(k == 'assetPurchaseOrRentTime') k = '采购或租赁日期';
          else if(k == 'acceptRecordRemark') k = '资产备注';
          else k = k
          json[0][key] = k;
        }
        // var tmpdata = [];//用来保存转换好的json 
        // json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        //     v: v[k],
        //     position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        // }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
        //     v: v.v
        // });
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(json, {header: keyMap, skipHeader:true});
        XLSX.utils.book_append_sheet(wb, ws, "sheetName");
        var s2ab = function (s) { // 字符串转字符流
          var buf = new ArrayBuffer(s.length)
          var view = new Uint8Array(buf)
          for (var i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF
          }
          return buf
        }
        // 创建二进制对象写入转换好的字节流
        let tmpDown =  new Blob([s2ab(XLSX.write(wb,{bookType: 'xlsx', bookSST: false, type: 'binary'} ))], {type: ''}) 
        let a = document.createElement('a');
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        a.href = URL.createObjectURL(tmpDown)  // 创建对象超链接
        a.download = '固资台账.xlsx';
        a.click();
      }
    })
  }
  render() {
    let { data, visible, allDept } = this.props.queryLedger;
    let { selected } = this.state;
    let { dispatch } = this.props
    // 分页器设置
    const pagination = {
      onChange: this.pageChange.bind(this),
      current: data.current,
      pageSize: data.size,
      total: data.total,
      showQuickJumper: true,
      showTotal: (total, range) => `共${total}条记录 第${range[0]}-${range[1]}条 `,
    };
    const rowSelection = {
      fixed: 'left',
      onChange: (selectedRowKeys, selectedRows) => {
        selected = selectedRows;
        this.setState({ selected })
        this.setState({ useLibraryState: true })
      },
      getCheckboxProps: record => ({
        disabled: record.state !== '未发放'
      }),
    };
    const { returnObject, withdrawalObject, useLibraryState } = this.state;
    return (
      <div>
        <div className={style.assetTypeHeader}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item>固资管理</Breadcrumb.Item>
              <Breadcrumb.Item>固资台账</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <h2>固资台账</h2>
          </div>
        </div>
        <div className={style.assetTypeList}>
          <div style={{ padding: '20px', boxSizing: 'border-box' }}>
            <AssetsLedgerSearchForm wrappedComponentRef={(form) => this.form = form} />
          </div>
          <div style={{ marginLeft: '20px' }}>
            <Button type="primary" onClick={this.handelUseLibrary}>
              {
                useLibraryState ? <Link to={{ pathname: '/solid-assets-management/use-library', state: this.state.selected }}>- 领用出库</Link> : <Link to='/solid-assets-management/assets-ledger'>- 领用出库</Link>
              }
            </Button>
            <div style={{ float: "right" }}>
                <Button className={styleImport['upload-wrap']}  type="dashed">
                  <Icon type='upload' />
                  <input className={styleImport['file-uploader']} type='file' accept='.xlsx, .xls' onChange={this.importExcelData} />
                  <span className={styleImport['upload-text']}>导入</span>
                </Button>
                <span className={styleImport['upload-tip']}>支持 .xlsx、.xls 格式的文件</span>
              <Button style={{ margin: '0 20px' }}  type="dashed" onClick = {this.exportExcel}>导出</Button>
            </div>
          </div>
          <Table
            rowKey={'assetId'}
            bordered
            pagination={pagination}
            rowSelection={rowSelection}
            columns={this.columns}
            dataSource={data.records}
            scroll={this.scroll}
            style={{ padding: '20px', boxSizing: 'border-box' }}
            className={styleLedger.ledgerTable}
          />
          <ReturnForm
            wrappedComponentRef={this.saveReturnFormRef}
            visible={this.state.returnVisible}
            onCancel={this.handleReturnCancel}
            onCreate={this.handleReturnCreate}
            returnObject={returnObject}
          />
          <WithdrawalForm
            wrappedComponentRef={this.saveWithdrawalFormRef}
            visible={this.state.withdrawalVisible}
            onCancel={this.handleWithdrawalCancel}
            onCreate={this.handleWithdrawalCreate}
            withdrawalObject={withdrawalObject}
          />
        </div>
      </div>
    );
  }
}

export default AssetsLedger;
