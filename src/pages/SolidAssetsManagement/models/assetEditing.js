import request from '../../../utils/request'
import router from 'umi/router';
import { message } from 'antd';

export default {
  namespace: 'assetEditing',

  state: {
  },

  effects: {
    *inset({ payload }, { put, call }) {
      const res = yield call(request, '/api/assetLedger/editAssetLedger.json', { method: 'POST', body: payload })
      if (res) {
        if (res.success) {
          message.success('编辑成功');
          router.push('/solid-assets-management/assets-ledger');
        }else{
          message.error('编辑失败')
        }
      }
    },
  },

  reducers: {
  }
};