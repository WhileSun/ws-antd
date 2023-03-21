import React from 'react';
import { WsTableInstance } from '../types';

const useTable = (): WsTableInstance => {
  const instance = {
    reload:()=>{},
    getCheckedIds: ()=>{return []},
    filterName:(dataIndex:string, val:any)=>{},
    getDataList:()=>{return []}
  };
  return instance;
};

export default useTable;