//参数是否存在
export const paramIsset = (param: any | undefined, defaultValue: any) => {
    if  (param === undefined){
      return defaultValue
    }
    return param;
  };
  