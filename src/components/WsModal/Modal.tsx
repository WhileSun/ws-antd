import React, { useState, useMemo, useEffect, useRef} from 'react';
import { Modal, Button } from 'antd';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { paramIsset } from './utils/tools';
import { WsModalProps } from './types';
import './Modal.less';

const WsModal = (props: WsModalProps) => {

  const config = useMemo(() => {
    let param: WsModalProps = { ...props };
    param.title = paramIsset(props.title, "提示");
    param.content = paramIsset(props.content, "");

    param.width = paramIsset(props.width, 600);
    param.fullVisible = paramIsset(props.fullVisible, true);
    param.fullStatus = paramIsset(props.fullStatus, false);
    param.loading = paramIsset(props.loading, false);
    param.open = paramIsset(props.open, false);
    param.forceRender = paramIsset(props.forceRender, false);
    param.okText = paramIsset(props.okText, '确定');
    param.footer = paramIsset(props.footer, null);

    param.onCancel = props.onCancel;
    param.onOk = props.onOk;
    param.fixed = paramIsset(props.fixed, false);
    return param;
  }, [props]);

  //model参数
  const stateObj = {
    modelMoveDisabled: true,
    modelMoveBounds: { left: 0, top: 0, bottom: 0, right: 0 },
  };
  const [modelState, setModelState] = useState(stateObj);
  const [fullStatus, setFullStatus] = useState(config.fullStatus);

  const updateModelState = (newState: { [key: string]: any }) => {
    setModelState({ ...modelState, ...newState })
  };

  //model拖拉
  const draggleRef = useRef<HTMLDivElement>(null);
  const handleModelMove = (event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    updateModelState({
      modelMoveBounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
      },
    });
  };

  //关闭
  const handleCancel = (e: any) => {
    if (config.onCancel) { config.open = false; config.onCancel(e) }
  };
  //提交
  const handleSubmit = (e: any) => {
    if (config.onOk) { config.onOk(e) }
  };

  const footer = () => {
    if (config.footer != null ) {
      return config.footer;
    } else {
      let btns = [<Button key="back" onClick={handleCancel}>取消</Button>,
      <Button key="submit" type="primary" onClick={handleSubmit} loading={config.loading}>{config.okText}</Button>];
      return btns;
    }
  }

  const toggleFullScreen = (e:any) => {
    setFullStatus(!fullStatus);
  }

  useEffect(() => {
    if (config.open) {
      document.querySelector('body')?.setAttribute('style', 'overflow:hidden;')
    } else {
      document.querySelector('body')?.removeAttribute('style')
    }

  }, [config.open])

  return (
    <>
      <Modal
        getContainer={false}
        forceRender={config.forceRender}
        wrapClassName={config.fullVisible && fullStatus ? "wsmodel-wrap-style wsmodal-wrap-fullscreen" : "wsmodel-wrap-style"}
        style={config.fixed ? { top: '12px', paddingBottom: '0px', ...config.style } : { top: '200px', ...config.style }}
        bodyStyle={config.fixed ? { maxHeight: (window.innerHeight - 130) + 'px', overflowY: "auto", ...config.bodyStyle } : { ...config.bodyStyle }}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (modelState.modelMoveDisabled) {
                updateModelState({ modelMoveDisabled: false });
              }
            }}
            onMouseOut={() => {
              updateModelState({ modelMoveDisabled: true });
            }}
          >
            {config.title}
            {config.fixed && config.fullVisible ? <button
              type="button"
              className="ant-modal-close"
              style={{ right: 42 }}
              onClick={toggleFullScreen}
            >
              <span className="ant-modal-close-x">
                {config.fullVisible ? (!fullStatus ? <ArrowsAltOutlined /> : <ShrinkOutlined />) : ''}
              </span>
            </button> : ''}
          </div>
        }
        modalRender={(modal) => (
          <Draggable
            disabled={modelState.modelMoveDisabled}
            bounds={modelState.modelMoveBounds}
            onStart={(event, uiData) => handleModelMove(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        open={config.open}
        width={config.width}
        onOk={handleSubmit}
        onCancel={handleCancel}
        keyboard={false}
        maskClosable={false}
        destroyOnClose={true}
        footer={footer()}
      // centered
      >
        {config.content}
      </Modal>
    </>)
}

export default WsModal;