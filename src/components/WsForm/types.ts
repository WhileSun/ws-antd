import React from "react"
import type { FormInstance, FormItemProps, InputProps, CascaderProps, InputNumberProps, RadioGroupProps, SelectProps,DatePickerProps,TransferProps,TreeProps} from 'antd';
import { TextAreaProps, PasswordProps } from 'antd/lib/input';
import { RangePickerProps } from 'antd/es/date-picker/';
import {EditorProp} from 'md-editor-rt';
export interface WsFormProps {
    /** 尺寸 */
    size?: 'large' | 'middle' | 'small',
    /** 主键ID */
    idKey?: string,
    /** 修改传入数据 */
    defaultData?: { [key: string]: any },
    /** form 字段 */
    fields?: FormField[],
    /** 弹出框是否显示 */
    showMode?: "normal" | "modal" | "drawer"
    /** 提取name生成的 name => field */
    fieldToObj?: { [key: string]: any },

    /** 返回操作 */
    onCancel?: Function,
    /** 成功操作 */
    onSucc?: Function,

    /*** 自己提交并且访问api */
    onSelfSubmit?: Function,
    /** 提交api前修改params */
    onBeforeSubmit?: (params: { [key: string]: any }, cb: () => void) => void,
    /** 弹出框title */
    title?: React.ReactNode,
    /** 弹出框宽度 */
    width?: number,
    /** 弹出框初始化全屏 */
    fullStatus?: boolean,
    /** 表单宽度在row中的col宽度 */
    fieldCol?: number,

    updateApi?: Function,
    api?: Function
}

export interface ItemFieldProps {
    /** field 参数 */
    field?: FormField,
    /** 遍历的index */
    index?: number,
    /** 默认值 */
    defaultData?: { [key: string]: any },
    /** ref */
    formRef?: FormInstance<any>,
}

export type ctype = 'input' | 'inputNumber' | 'inputPasswd' | 'text' | 'textarea' | 'radio' | 'select' |
'datePicker' |'rangePicker'| 'mdEditor' | 'cascader' | 'menuTree' | 'transfer' | 'uploadFile' | 'br' |'html'


export interface FormField  extends FormItemProps {
    name?: string,
    /** field类型 */
    ctype?: ctype,
    /** field 默认数据 */
    defaultValue?: any,
    /** field col */
    col?: number,
    /** field col */
    offset?: number,
    /** 移除 */
    remove?: boolean,
    /** input 备注 */
    placeholder?: string,
    /** select的list */
    listData?: any,
    /** input 是否不可修改 */
    disabled?: boolean,
    /** change 事件 */
    onChange?: (value: any) => void,
    /** render */
    render ?: ()=>React.ReactNode


    /** input props */
    inputProps?: InputProps,
    /** InputNumber props */
    inputNumberProps?: InputNumberProps,
    /** inputPassWd props */
    inputPassWdProps?: PasswordProps,
    /** textArea props */
    textAreaProps?: TextAreaProps,
    /**  radioGroup  Props */
    radioGroupProps?: RadioGroupProps,
    /** select props */
    selectProps?: SelectProps,
    /** datePicker props */
    datePickerProps ?: DatePickerProps,
    /** rangePicker props */
    rangePickerProps ?: RangePickerProps,
    /** mdEditor props */
    mdEditorProps ?: MdEditorProps,
    /** cascader props */
    cascaderProps ?: CascaderProps,
    /** menuTree props */
    menuTreeProps ?: MenuTreeProps,
    /** Transfer props */
    tansferProps ?: TransferProps<any>,
}


export type mdEditorApi = (file: File) => { data: { url: string } }

export interface MenuTreeProps extends TreeProps {
    listData?: any,
    initCheckedKeys?: Array<React.Key>,
    /** 设置form值 */
    setFormData?: (value: Array<React.Key>) => void,
}

export interface MdEditorProps extends EditorProp{
    /** 设置form值 */
    setFormData?: (value: string) => void,
    /** 解析file 图片 */
    imgApi?: mdEditorApi
}