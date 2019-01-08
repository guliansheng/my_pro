export default {
  namespace: 'template',
  state: {
    data: [
    ],
  },
  effects: {
    *queryInitData(_, sagaEffects) {
      const { call, put } = sagaEffects;
      const endPointURI = '/api/template/queryAllTemplate.json';
      const puzzle = yield call(request, endPointURI);
      console.log(puzzle);
      yield put({
        type: 'queryAllData',
        payload: puzzle,
      });
    },
    *deleteData({ payload: body }, sagaEffects) {
      const { call, put } = sagaEffects;
      const endPointURI = '/api/template/deleteTemplateById.json';
      const puzzle = yield call(request, endPointURI, { method: 'POST', body});
      console.log(puzzle);
      yield put({
        type: 'queryInitData',
      });
    },
  },
  reducers: {
    addNewData(state, { payload: newData }) {
      const nextData = state.data.concat(...newData);
      console.log(newData, nextData);
      return {
        data: nextData,
      };
    },
    queryAllData(state, { payload: allData }) {
      return {
        data: allData.data,
      };
    },
  },
};