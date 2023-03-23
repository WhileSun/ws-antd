import { useRef } from 'react';
const useForm = (form:any) => {
  const instance = {
    reload:()=>{},
    getCheckedIds: ()=>{return []},
    filterName:(dataIndex:string, val:any)=>{},
    getDataList:()=>{return []}
  };
  return instance;
};

export default useForm;
