import { handelStorage } from '../services/api';
import router from 'umi/router';
import { message } from 'antd'

export default {
  namespace: 'storage',
  state: {
  },
  effects: {
    *toStorage({ payload }, { call }) {
      const res = yield call(handelStorage, payload);
      if (res) {
        if (res.success) {
          message.success('入库成功')
          router.push('/basic-management/assets-directory');
        }
      } else {
        message.error('入库失败')
      }
      return null
    }
  },
  reducers: {
  },
};