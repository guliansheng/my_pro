const data = [
  {
    assetTypeName: '笔记本',
    assetTypeCode: 'bjb',
    assetTypeDesc: '',
    assetTypeState: '启用',
    id: 'bijiben'
  },
  {
    assetTypeName: '小米',
    assetTypeCode: 'sj',
    assetTypeDesc: '小米手机',
    assetTypeState: '停用',
    id: 'xiaomi'
  },
  {
    assetTypeName: '苹果',
    assetTypeCode: 'dn',
    assetTypeDesc: '苹果电脑',
    assetTypeState: '启用',
  },
  {
    assetTypeName: '小米',
    assetTypeCode: 'sj',
    assetTypeDesc: '小米手机',
    assetTypeState: '停用',
  },
  {
    assetTypeName: '苹果',
    assetTypeCode: 'dn',
    assetTypeDesc: '苹果电脑',
    assetTypeState: '启用',
  },
  {
    assetTypeName: '小米',
    assetTypeCode: 'sj',
    assetTypeDesc: '小米手机',
    assetTypeState: '停用',
  },
  {
    assetTypeName: '苹果',
    assetTypeCode: 'dn',
    assetTypeDesc: '苹果电脑',
    assetTypeState: '启用',
  },
  {
    assetTypeName: '小米',
    assetTypeCode: 'sj',
    assetTypeDesc: '小米手机',
    assetTypeState: '停用',
  },
  {
    assetTypeName: '苹果',
    assetTypeCode: 'dn',
    assetTypeDesc: '苹果电脑',
    assetTypeState: '启用',
  },
  {
    assetTypeName: '小米',
    assetTypeCode: 'sj',
    assetTypeDesc: '小米手机',
    assetTypeState: '停用',
  },
  {
    assetTypeName: '苹果',
    assetTypeCode: 'dn',
    assetTypeDesc: '苹果电脑',
    assetTypeState: '启用',
  },
  {
    assetTypeName: '小米',
    assetTypeCode: 'sj',
    assetTypeDesc: '小米手机',
    assetTypeState: '停用',
  },
  {
    assetTypeName: '苹果',
    assetTypeCode: 'dn',
    assetTypeDesc: '苹果电脑',
    assetTypeState: '启用',
  },
];
const json = {
  data:{records:data},
  success: '获取成功'
}
function fun (req, res) {
  res.json(json);
}

export default {
  'get /api/assetType/getAssetTypeList.json': fun,
};