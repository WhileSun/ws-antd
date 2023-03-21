import { ModalProps } from "antd";


export interface WsModalProps extends ModalProps {
    content?: React.ReactNode,
    /** 是否全局展示按钮 */
    fullVisible?: boolean,
    /** 全局状态 */
    fullStatus?:  boolean,
    /** 按钮状态 */
    loading ?:  boolean,
    /** 最高高度不超过页面 */
    fixed ?: boolean,
}