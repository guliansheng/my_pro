import { getType, addT, changeT, deleteT } from '../services/api';
import { message } from 'antd';
export default {
  namespace: 'queryType',

  state: {
    visible: false,
    data: {}
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const pageNo = typeof (payload) === 'undefined' ? 1 : payload
      const page = { pageSize: 10, pageNo }
      const res = yield call(getType, page);
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
    *addType({ payload }, { call, put }) {
      const res = yield call(addT, payload);
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('添加成功');
        }
        else{
          message.error('添加失败')
        }
      }
      return null;
    },
    *changeState({ payload }, { call, put }) {
      const res = yield call(changeT, { assetTypeId: payload.assetTypeId, assetTypeState: payload.assetTypeState });
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('操作成功')
        }
        else{
          message.error('操作失败')
        }
      }
      return null;
    },
    *deleteType(payload, { call, put }) {
      const res = yield call(deleteT, { assetTypeId: payload.payload.assetTypeId });
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('删除成功');
        }
        else{
          message.error('删除失败')
        }
      }
      return null;
    }
  },

  reducers: {
    queryData(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    changeVisible(state, action) {
      return { ...state, visible: action.payload };
    }
  },
};
