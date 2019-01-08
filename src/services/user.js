import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/getUser').then((obj)=>{
    if(obj){
      if(obj.data){
        return obj.data
      }else{
        return {}
      }
    }else{
      return {}
    }
    
  });
}
