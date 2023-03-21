import type { ButtonProps } from "antd";
export interface WsButtonProps extends ButtonProps{
    /** 通过按钮文字内部定义的一些样式 */
    colorClassName?: string,
    /** 是否弹出Popconfirm */
    popStatus?: boolean,
    /**  是否弹出Popconfirm的title*/
    popTitle?: string,
}