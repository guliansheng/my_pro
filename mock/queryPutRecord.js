const records = [
  {
    assetNumber: 2121212,
    assetType: '租赁',
    brand: '戴尔',
    model: 'hi',
    serialNumber: '423423423',
    source: '公司',
    supplier: '戴尔',
    assetPurchaseOrRentTime:'2018',
    rentEndTime:'2019',
    price:'2000',
    activateDate: '2018',
    manager: 'gu',
    operateTime:'2018'
  },
  {
    assetNumber: 2344,
    assetType: '发放',
    brand: '华为',
    model: 'hi',
    serialNumber: '354545545',
    source: '公司',
    supplier: '戴尔',
    assetPurchaseOrRentTime:'2018',
    rentEndTime:'2019',
    price:'2000',
    activateDate: '2018',
    manager: 'gu',
    operateTime:'2018'
  },
];
const obj = {
  data: {records},
  success: '获取成功'
}
function fun (req, res) {
  res.json(obj);
}

export default {
  
  'get /api/assetRecord/getPutAssetRecord.json': fun,
};
