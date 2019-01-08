const data = [
  {
    directoryId: 1,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
  },
  {
    directoryId: 2,
    directoryNumber: 'ML000002',
    directoryType: '手机',
    brand: '小米',
    model: 'xiaomi',
    remark: '',
  },
  {
    directoryId: 3,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '',
  },
  {
    directoryId: 4,
    directoryNumber: 'ML000002',
    directoryType: '手机',
    brand: '小米',
    model: 'xiaomi',
    remark: '',
  },
  {
    directoryId: 5,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '',
  },
  {
    directoryId: 6,
    directoryNumber: 'ML000002',
    directoryType: '手机',
    brand: '小米',
    model: 'xiaomi',
    remark: '',
  },
  { 
    directoryId: 7,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '',
  },
  {
    directoryId: 8,
    directoryNumber: 'ML000002',
    directoryType: '手机',
    brand: '小米',
    model: 'xiaomi',
    remark: '',
  },
  {
    directoryId: 9,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '',
  },
  {
    directoryId: 10,
    directoryNumber: 'ML000002',
    directoryType: '手机',
    brand: '小米',
    model: 'xiaomi',
    remark: '',
  },
  {
    directoryId: 11,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '',
  },
  {
    directoryId: 12,
    directoryNumber: 'ML000002',
    directoryType: '手机',
    brand: '小米',
    model: 'xiaomi',
    remark: '',
  },
  {
    directoryId: 13,
    directoryNumber: 'ME000001',
    directoryType: '笔记本',
    brand: '苹果',
    model: 'Mac',
    remark: '',
  },
];
const obj = {
  data:{records:data},
  success: '获取成功'
}
function fun1 (req, res) {
  res.json(obj);
}
// function fun (req){
//   console.log(req)
//   return req
// }

export default {
  // 'post /api/assets/queryAssetsDirectory.json' :fun,
  'get /api/assets/queryAssetsDirectory.json': fun1,
};
