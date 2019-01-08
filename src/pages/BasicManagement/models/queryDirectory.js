import { getDirectory, deleteD, addD } from '../services/api'
import { message } from 'antd';
export default {
  namespace: 'queryDirectory',

  state: {
    data: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const pageNo = typeof (payload) === 'undefined' ? 1 : payload
      const page = { pageSize: 10, pageNo }
      const res = yield call(getDirectory, page);
      if (res) {
        if (res.success) {
          yield put({
            type: 'queryData',
            payload: res.data
          })
        }
      }else{
        message.error('获取列表失败')
      }
      return null;
    },
    *delete({ payload }, { call, put }) {
      const res = yield call(deleteD, { directoryId: payload.directoryId })
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('删除成功');
        }else{
          message.error('删除失败')
        }
      }
      return null;
    },
    *search({ payload }, { call, put }) {
      let str = '/api/assets/queryAssetsDirectory.json?pageSize=10&'
      const page = { ...payload, pageSize: 10 }
      const res = yield call(getDirectory, page)
      if (res) {
        if (res.success) {
          yield put({
            type: 'changeData',
            payload: res.data
          })
        }else{
          message.error('失败')
        }
      }
      return null;
    },
    *addDirectory({ payload }, { call, put }) {
      const res = yield call(addD, payload)
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('添加成功');
        }else{
          message.error('添加失败')
        }
      }
      return null;
    }
  },

  reducers: {
    queryData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeData(state, action) {
      return {
        data: action.payload,
      };
    }
  },
};
