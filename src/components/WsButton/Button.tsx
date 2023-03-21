import { Button, Popconfirm } from 'antd';
import React, { useMemo } from 'react';
import { titleColorClassName } from './func/color';
import { paramIsset } from './utils/tools';
import { WsButtonProps } from './types';
import './Button.less';


const WsButton: React.FC<WsButtonProps> = (props) => {
  const conf = useMemo(()=>{
    const conf: WsButtonProps = { ...props };
    conf.name = paramIsset(props.name, '按钮'); //按钮名称
    conf.colorClassName = paramIsset(props.colorClassName, titleColorClassName(props.name));
    conf.popStatus = paramIsset(props.popStatus, false);
    conf.popTitle = paramIsset(props.popTitle, '您确定删除选中的数据吗?');
    return conf;
  },[props])
  

  const {colorClassName,popStatus,popTitle,...buttonConf} = conf;
  let html = (
    <Button
      {...buttonConf}
      className={'ws-btn-' + conf.colorClassName}
      onClick={(event:any) => {
        if (conf.popStatus !== true) {
          conf?.onClick?.call(this, event)
        }
      }}
    >
      {conf.name}
    </Button>
  );

  if (conf.popStatus === true) {
    html = (
      <Popconfirm
        title={conf.popTitle}
        onConfirm={(event:any) => { conf?.onClick?.call(this,event) }}
        // onCancel={cancel}
        okText="确定"
        cancelText="取消"
      >
        {html}
      </Popconfirm>
    )
  }
  return (
    <>
      {html}
    </>
  );
};
export default WsButton;