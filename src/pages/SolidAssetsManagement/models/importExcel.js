import { importE ,exportE} from '../services/api'
import { message } from 'antd';
export default {
  namespace: 'importExcel',
  state: {
  },
  effects: {
    *import({ payload }, { call,put }) {
      const loading = message.loading('正在导入...',0)
      const res = yield call(importE, payload);
      if (res) {
        if (res.success) {
          message.success('导入成功')
          setTimeout(loading, 0);
          yield put({
            type: 'queryLedger/fetch'
          })
        }
      } else {
        setTimeout(loading, 0);
        message.error('导入失败')
      }
      return null
    },
    *export({callback, payload}, { call}) {
      const res = yield call(exportE, payload);
      if (res) {
        if (res.success) {
          if(callback) callback(res.data)
        }
      } else {
        message.error('导出失败')
      }
      return null
    }
  },
  reducers: {
    setData(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  },
};