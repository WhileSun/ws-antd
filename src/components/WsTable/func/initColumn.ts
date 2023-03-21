import { Input, Space, Button } from 'antd';
import { ColumnField } from '../types';


const filterIndex = (record:any, dataIndex:string, value:string) => {
    let res = record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    if (!res && record.children) {
        if (record.children.some(item => item[dataIndex].toString()
            .toLowerCase()
            .includes(value.toLowerCase()))) {
            res = true;
        } else {
            for (let i = 0; i < record.children.length; i++) {
                res = filterIndex(record.children[i], dataIndex, value);
                if (res) {
                    break;
                }
            }
        }
    }
    return res;
}
/**
 * 初始化column
 * @param {Array} fields table的字段
 * @param {Array} showColumns table展示的字段
 * @returns 
 */
const initColumnFunc = (fields: ColumnField<any>[], showColumns: Array<string>) => {
    console.log('initColumn');
    let columns: ColumnField<any>[] = [];
    var sumWidth = 0;
    var tableScroll = {};
    for (var i = 0, len = fields.length; i < len; i++) {
        let column: ColumnField<any> = {};
        var d = fields[i];
        let showColumnKey = d.name + '_' + i.toString();
        // 默认超过宽度自动省略
        column.ellipsis = true;
        //赋值重组
        column = d;
        column.dataIndex = d.name;
        if (showColumns.includes(showColumnKey)) {
            // console.log(d.width);
            // if(d.width instanceof Number){
            //     sumWidth += d.width;
            // }
            columns.push(column);
        }
    }
    //防止撑大
    // columns.push({});
    // sumWidth += 0;
    //设置table宽高
    // tableScroll = { x: sumWidth, y: 5000 };
    return { 'columns': columns, 'tableScroll': tableScroll };
};

export default initColumnFunc;