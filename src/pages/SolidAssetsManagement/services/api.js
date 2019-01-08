import { stringify } from 'qs';
import request from '../../../utils/request';

export async function getUseRecord(params) {
  params = params ? params : {}
  return request(`/api/assetRecord/getAcceptRecord.json?${stringify(params)}`);
}
export async function importE(params) {
  params = params ? params : {}
  return request(`/api/importExcelData.json`, {
    method: 'POST',
    body: params
  })
}
export async function exportE(params) {
  params = params ? params : {}
  return request(`/api/exportToExcel.json?${stringify(params)}`);
}