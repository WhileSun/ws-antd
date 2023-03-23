import React,{ useState } from "react";
import Editor,{UploadImgEvent} from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import {MdEditorProps} from '../types';


const MdEditor:React.FC<MdEditorProps>= (props) => {
  
  const {
    setFormData = (value:string)=>{},
    modelValue,
    ...newProps
  } = props;

  const [text, setText] = useState<string>(props.modelValue);

  const onUploadImg:UploadImgEvent = async (files, callback)=>{
    if(props.imgApi !==undefined){
      const res = await Promise.all(
        Array.from(files).map((file) => {
          return props.imgApi?.call(this,file)
        })
      );
      callback(res.map((item) => { return !item?.data ? '' : item.data.url}));
    }
  }
  
  return (
    <>
    <Editor
      preview = {false}
      onUploadImg ={onUploadImg}
      toolbars={[
        'revoke',
        'next',
        '-',
        'bold',
        'underline',
        'italic',
        // '-',
        'strikeThrough',
        'title',
        // 'sub',
        // 'sup',
        'quote',
        'unorderedList',
        'orderedList',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        // 'save',
        '-',
        // 'fullscreen',
        'pageFullscreen',
        'preview',
      ]}
      {...newProps}
      modelValue={text}
      onChange={(modelValue) => {
        setText(modelValue)
        setFormData(modelValue)
      }}
    />
    </>
  );
};

export default MdEditor;
