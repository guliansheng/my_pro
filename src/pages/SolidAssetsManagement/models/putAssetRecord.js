import request from '../../../utils/request'
import { message } from 'antd';
export default {
  namespace: 'queryPutRecord',

  state: {
    data: {}
  },

  effects: {
    *fetch({payload}, { call, put }) {
      const pageNo = typeof (payload) === 'undefined' ? 1 : payload
      const res = yield call(request, '/api/assetRecord/getPutAssetRecord.json?pageSize=10&pageNo=' + pageNo);
      if(res){
        yield put({
          type: 'queryData',
          payload: res.data
        })
      }else{
        message.error('获取列表失败')
      }
      return null;
    },
    *search({payload}, { call, put }) {
      const searchData = payload
      let str = '/api/assetRecord/getPutAssetRecord.json?pageSize=10&'
      for (let i in searchData) {
        if (searchData[i]) {
          str += `${i}=${searchData[i]}&`
        }
      }
      const res = yield call(request, str)
      if(res){
        if (res.success) {
          yield put({
            type: 'queryData',
            payload: res.data
          })
        } else{
          message.error('失败')
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
    }
  }
};
