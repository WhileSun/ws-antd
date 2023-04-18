import React from "react";
import { Table } from "antd";
import type { TableColumnType, FormItemProps, ColProps,TableProps } from 'antd';
import { WsButtonProps } from "../WsButton/types";

/** table props */
export interface WsTableProps<RecordType> extends TableProps<RecordType>{
    /** ref */
    // ref?: React.Ref<HTMLDivElement>,
    /** table ref */
    table?:WsTableInstance,
    /** 列表column字段 */
    th?: ColumnField<any>[],
    /** 全局保存form查询字段 name table名称需防止重名 */
    storeModel?: { params: { [key: string]: any }, setParams: React.Dispatch<any>, name: string },
    /** 尺寸 */
    size?: 'large' | 'middle' | 'small',
    /** 主键ID，选中返回的参数 */
    rowKey?: string,
    /** 展示方式fixed:固定高度;fluid:不固定 */
    display?: 'fixed' | 'fluid',
    /** 接口api promise */
    api?: (params:{[key:string]:any})=>Promise<ApiResp>,
    /** 接口 selfApi 自己处理数据 优先*/
    selfApi?:(params:{[key:string]:any})=>ApiResp,
    /** 模式 normal 常规 model 弹出框 */
    showMode?: 'normal' | 'modal',
    /** modal宽度 */
    width?: number,
    /** modal标题 */
    // title?: React.ReactNode,
    /** modal返回事件 */
    onCancel?: Function,
    /** 是否开启选择框 */
    checkbox?: boolean,
    /** 是否开启tree table */
    treeTable?: boolean,
    /** fixed展示，底部的高度 */
    footHeight?: number,
    /** table的ID */
    tableId?: string,
    /** 自定义按钮 */
    btns?: HeaderWsButtonProps[] ,
    /** 自定义tool */
    toolbars?: Array<{align:'left'|'right', render: ()=>React.ReactNode }>,
    /** 搜索的参数 */
    store?: { [key: string]: any },
    /** 对本地数据筛选 */
    onLocalFilter?: (valuies: { [key: string]: any }) => void,
    /** 第几页 */
    page?: number,
    /** 每页数 */
    pageSize?: number,
    /** 其他form搜索参数 */
    otherFormParams?: { [key: string]: any },
    /** 弹出框是否显示 */
    modalShow?: boolean
    /** 搜索框 */
    searchs?: SearchField[],
    /** searchs 组件全局配置 */
    searchConfig?: searchConfig,

}

/** table search form */
export interface WsTableSearchProps {
    handleFormSubmit?: (values: any) => void,
    searchs?: SearchField[],
    searchConfig?: searchConfig,
    formRef: any,
    children: React.ReactNode
}

/** search 父级配置 类似form */
export interface searchConfig {
    /** label的宽度 */
    labelWidth?: number,
    /** field宽高 */
    gutter?: [number, number],
    colSize?: ColProps | undefined,
}


/** search 字段 */
export interface SearchField extends FormItemProps {
    /** 宽度 */
    width?: number | string,
    /** search 类型 */
    type: 'input' | 'select' | 'selectInput' | 'dateRange' | 'html',
    /** select|input等等备注 */
    placeholder?: string,
    /** 开启后隐藏label 目前只针对select*/
    oneShowMode?: boolean,
    /** 默认值 */
    defaultValue?: any,
    /** 自定义form组建数据传输 */
    listData?: any,
    render?: ()=>React.ReactNode,
}


export interface ColumnField<RecordType> extends TableColumnType<RecordType> {
    /** 数据源key */
    name?: string,
    // /** 等同于name */
    dataIndex?: string,
}


/** 接口返回参数 */
export interface ApiResp {
    code?: number,
    msg?: string,
    data?: any,
    total?: number,
    time?: number
}

export interface HeaderWsButtonProps extends WsButtonProps{
    align?:"left"|"right"
}

export interface HeaderButtonProps{
    btns?:HeaderWsButtonProps[] 
    align?:"left"|"right"
}


export interface WsTableInstance<Values = any>{
    reload: ()=>void
    getCheckedIds:()=>React.Key[]
    filterName:(dataIndex:string, val:any)=>void
    getDataList:()=>any
}


