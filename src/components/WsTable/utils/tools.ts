import moment from 'moment';
import $ from 'jquery';

//参数是否存在
export const paramIsset = (param: any | undefined, defaultValue: any) => {
  if (param === undefined) {
    return defaultValue
  }
  return param;
};


function S4(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export const getRandStr = (prefix: string): string => {
  var uuid = prefix + S4() + S4() + S4();
  return uuid;
}

/** 转化为文字date */
const momentDate = (momentObj: moment.MomentInput, type = 'date'): string => {
  let datestr = '';
  switch (type) {
    case 'date':
      datestr = moment(momentObj).format('YYYY-MM-DD');
      break;
    case 'datetime':
      datestr = moment(momentObj).format('YYYY-MM-DD hh:mm:ss');
      break;
  }
  return datestr;
};

/**解析form参数 */
export const parseFormParamsTools = (params: { [key: string]: any } | undefined) => {
  console.log('parseFormParamsTools', params);
  let newParams: { [key: string]: any } = {};
  for (let field in params) {
    let val: any = params[field];
    if (field.indexOf('selectInput_') > -1) {
      if (!!$.trim(val['val'])) {
        newParams[val['key']] = val['val'];
      }
    } else if (field.indexOf('dateRange_') > -1) {
      if (val != "") {
        newParams[field.replace('dateRange_', "")] = momentDate(val[0]) + '~' + momentDate(val[1]);
      }
    } else {
      if (!!$.trim(val)) {
        newParams[field] = val;
      }
    }
  }
  return newParams;
}

/** 根据parent_id转换为tree */
export const toTreeTools = (rows: Array<any> | undefined, parent_id = 0, parent_ids = []) => {
  if (rows == undefined) {
    return [];
  }
  let node: Array<any> = [];
  let filterRows = rows.filter(row => row.parent_id === parent_id)
  if (filterRows.length) {
    filterRows.forEach(filterRow => {
      if (parent_id == 0) {
        filterRow.parent_ids = parent_ids
      } else {
        filterRow.parent_ids = [...parent_ids, parent_id]
      }
      let n = toTreeTools(rows, filterRow.id, filterRow.parent_ids)
      if (n.length) {
        filterRow.children = n;
      }
      node.push(filterRow)
    })
  }
  return node
}

/** 二维数组中提取某个值 */
export const arrayColumnTools = (arr: Array<any>, v: string, k = ""): Array<React.Key> | { [key: string]: any } => {
  let lists: Array<React.Key> = [];
  let objs: { [key: string]: any } = {};
  arr.forEach(val => {
    if (k == "") {
      lists.push(val[v]);
    } else {
      objs[val[k]] = val[v];
    }
  })
  if (k == "") {
    return lists;
  } else {
    return objs;
  }
}


export const filterNameTools = (rows:Array<any>, index:string, val:any, new_rows = [] as any[]) => {
  rows.forEach(row => {
    if (row[index].toString().includes(val)) {
      new_rows.push(row);
    } else {
      //存在子集的情况
      if (row?.children && row?.children?.length > 0) {
        filterNameTools(row.children, index, val, new_rows)
      }
    }
  })
  return new_rows;
}