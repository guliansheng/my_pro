import request from '../../../utils/request'
import { message } from 'antd';
export default {
  namespace: 'queryLedger',

  state: {
    visible: false,
    data: {},
    list: [],
    allDept: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const pageNo = typeof (payload) === 'undefined' ? 1 : payload
      const res = yield call(request, '/api/assetLedger/getAssetLedgerList.json?pageSize=10&pageNo=' + pageNo);
      if (res) {
        if (res.success) {
          res.data = res.data || []
          yield put({
            type: 'queryData',
            payload: res.data
          })
        }
      } else {
        message.error('获取列表失败')
      }
      return null;
    },
    *withdrawal({ payload }, { call, put }) {
      const res = yield call(request, '/api/assetLedger/withdrawalRent.json', { method: 'POST', body: payload })
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('退租成功');
        } else {
          message.error('退租失败')
        }
      }
      return null;
    },
    *return({ payload }, { call, put }) {
      const res = yield call(request, '/api/assetLedger/returnRegistration.json', { method: 'POST', body: payload })
      if (res) {
        if (res.success) {
          yield put({
            type: 'fetch'
          })
          message.success('归还成功');
        } else {
          message.error('归还失败')
        }
      }
      return null;
    },
    *change({ payload }, { call, put }) {
      const res = yield call(() => {
        return payload;
      });
      if (res) {
        yield put({
          type: 'changeVisible',
          payload: res,
        });
      }
      return null;
    },
    *search({ payload }, { call, put }) {
      const searchData = payload;
      let str = '/api/assetLedger/getAssetLedgerList.json?pageSize=10&'
      for (let i in searchData) {
        if (searchData[i]) {
          str += `${i}=${searchData[i]}&`
        }
      }
      const res = yield call(request, str)
      if (res) {
        if (res.success) {
          yield put({
            type: 'queryData',
            payload: res.data
          })
        }
        else {
          message.error('失败')
        }
      }
      return null;
    },
    *findAllDept(payload, { call, put }) {
      const loading = message.loading('正在获取部门列表...',0)
      const res = yield call(request, '/api/findAllDept.json');
      if (res) {
        if (res.success) {
          setTimeout(loading, 0);
          yield put({
            type: 'changeAllDept',
            payload: res.data
          })
        }else{
          setTimeout(loading, 0);
          message.error('获取部门列表失败')
        }
      }else{
        setTimeout(loading, 0);
        message.error('获取部门列表失败')
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
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeAllDept(state, action) {
      return {
        ...state,
        allDept: action.payload,
      };
    },
    changeVisible(state, action) {
      return { ...state, visible: action.payload };
    },
  },
};
