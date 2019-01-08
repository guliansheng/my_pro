import { stringify } from 'qs';
import request from '../../../utils/request';

// 资产类型
export async function getType(params) {
  params = params ? params : {}
  return request(`/api/assetType/getAssetTypeList.json?${stringify(params)}`);
}

export async function addT(params) {
  params = params ? params : {}
  return request(`/api/assetType/addAssetType.json`, {
    method: 'POST',
    body: params
  });
}

export async function changeT(params) {
  params = params ? params : {}
  return request(`/api/assetType/updateAssetTypeState.json`, {
    method: 'POST',
    body: params
  });
}

export async function deleteT(params) {
  params = params ? params : {}
  return request(`/api/assetType/deleteAssetType.json`, {
    method: 'POST',
    body: params
  });
}
// 资产目录
export async function getDirectory(params) {
  params = params ? params : {}
  return request(`/api/assets/queryAssetsDirectory.json?${stringify(params)}`);
}

export async function deleteD(params) {
  params = params ? params : {}
  return request(`/api/assets/deleteAssetsDirectory.json`, {
    method: 'POST',
    body: params
  });
}

export async function addD(params) {
  params = params ? params : {}
  return request(`/api/assets/addAssetsDirectory.json`, {
    method: 'POST',
    body: params
  });
}
// 入库
export async function handelStorage(params) {
  return request('/api/assets/storeAssets.json', {
    method: 'POST',
    body: params
  });
}