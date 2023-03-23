import moment from 'moment';
import { FormField, ctype } from './../types';

/** 参数是否存在 */
export const paramIsset = (param:any, defaultValue :any) => {
  return param === undefined ? defaultValue : param;
};

/** 生成 name=>field */
export const getNameToFieldTools = (fields: FormField[]) => {
  let row: { [key: string]: FormField } = {};
  for (let field of fields) {
    if(!field.name){
      continue;
    }
    row[field.name] = field;
  }
  return row;
};


export const validateMessages = {
  required: '[${label}]是必填字段',
  whitespace: '[${label}]不能是空字段',
};


/** 获取Form的规则 */
export const getFormRulesTools = (field:FormField) => {
  let rules = [];
  if (field.ctype == 'input') {
    field.required === true ? rules.push({ required: true }, { whitespace: true }) : '';
  } else {
    field.required === true ? rules.push({ required: true }) : '';
  }
  field.rules === undefined ? '' : rules.push.apply(field.rules);
  return rules;
};

//对form提交的数据进行清洗
export const formValueCleanTools = (nameTofield:{[key: string]: FormField}, values:{[key:string]:any}) => {
  for (let name in nameTofield) {
    let field = nameTofield[name];
    if (values[name] === undefined || values[name] === "" || values[name] === null) {
      values[name] = ""
    } else {
      switch (field.ctype) {
        case 'datePicker':
          values[name] = moment(values[name]).format('YYYY-MM-DD');
          break;
        case 'rangePicker':
          values[name] = moment(values[name]).format('YYYY-MM-DD HH:mm:ss');
          break;
      }
    }
  }
  return values;
};

/** 表单初始化转化  */
export const formDefaultDataTools = (nameTofield:{[key: string]: FormField}, defaultData:{[key:string]:any}) => {
  let values = Object.assign({}, defaultData);
  for (let name in nameTofield) {
    if (nameTofield[name] !== undefined && values[name] !== undefined) {
      values[name] = _fieldTrans(nameTofield[name]?.ctype, values[name]);
    }
  }
  return values;
};

//表单单行转化
export const formFieldTransTools = (ctype:ctype|undefined, defaultValue:any) => {
  if (defaultValue === undefined) {
    return;
  } else {
    return _fieldTrans(ctype, defaultValue);
  }
};

const _fieldTrans = (ctype:ctype|undefined, val:any) => {
  let newVal:any = "";
  switch (ctype) {
    case 'datePicker':
    case 'rangePicker':
      if (val === null) {
        newVal = "";
      } else {
        newVal = moment(val);
      }
      break;
    case 'select':
    case 'input':
    case 'radio':
      //默认value需要转为字符，不然显示会有问题
      newVal = val.toString();
      break;
    // case 'searchSelect':
    //   if (Array.isArray(val)) {
    //     newVal = val.filter(v => v != "")
    //   } else {
    //     newVal = val.toString();
    //   }
    //   break;
    default:
      newVal = val;
      break;
  }
  return newVal;
}

export const delArrValTools = (arr:Array<any>, val:any) => {
  let index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// const loadPromise = (api, params, callback, onError) => {
//   return api.call(this, params).then((resp) => {
//     if (resp.code == 0) {
//       if (callback) {
//         return callback(resp.data);
//       }
//     } else {
//       if (onError) {
//         onError(resp.msg)
//       }
//     }
//   }).catch(function (error) {
//     if (onError) {
//       onError(error)
//     }
//   });
// }