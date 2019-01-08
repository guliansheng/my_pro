import request from '../../../utils/request'
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'useLibrary',

  state: {
    data: [],
    name: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const res = yield call(request, '/api/assetLedger/getAssetLedgerList.json');
      if (res) {
        yield put({
          type: 'queryData',
          payload: res.data
        })
      }
      return null;
    },
    *submit({ payload }, { call, put }) {
      const res = yield call(request, '/api/assetLedger/submitOutOfStorage.json', { method: 'POST', body: payload })
      if (res) {
        if (res.success) {
          message.success('提交成功');
          yield put({
            type: 'fetch'
          })
          router.push('/solid-assets-management/assets-ledger');
        }
        else {
          message.error('提交失败')
        }
      }
      return null
    },
    *getUser({ payload }, { call, put }) {
      const res = yield call(request, '/api/getUserInfoByNameOrUserId.json?name=' + payload)
      if (res) {
        if (res.success) {
          yield put({
            type: 'changeName',
            payload: res.data
          })
        } else {
          yield put({
            type: 'changeName',
            payload: {}
          })
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
    changeData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    changeName(state, action) {
      return {
        ...state,
        name: action.payload
      };
    }
  },
};