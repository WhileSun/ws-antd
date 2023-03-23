import React, { useState, useRef, useMemo, useImperativeHandle, useEffect, forwardRef } from 'react';
import useForm from './hooks/useForm';
import ItemField from './components/itemField';
import { paramIsset, validateMessages, formValueCleanTools, formDefaultDataTools, getNameToFieldTools } from './utils/tools';
import { Form, Row, Col, Button, message } from 'antd';
import WsModal from '../WsModal';
// import WsDrawer from '../WsDrawer';
import { WsFormProps } from './types';
import './Form.less';


const InternalForm: React.ForwardRefRenderFunction<any, WsFormProps> = (props, ref) => {
  //使用Form ref
  const [formRef] = Form.useForm();

  const {
    showMode = 'normal',
    fields = [],
    defaultData = {},
    idKey = 'id',
    title = '',
    fullStatus = false,
    width = 600,
    fieldCol = 24,
    size = 'small',
  } = props;

  /** name->field */
  const nameTofield = useMemo(()=>{
    return getNameToFieldTools(fields); 
  },[fields])

  /** updateForm  */
  const updateForm = useMemo(()=>{
    return defaultData[idKey] !== undefined; 
  },[defaultData,idKey])


  const [loading, setLoading] = useState(false); //加载状态

  /** form cancel */
  const handleCancel = () => {
    if (props.onCancel !== undefined) {
      props.onCancel()
    };
  }

  /** form submit */
  const handleSubmit = (values:{[key:string]:any}) => {
    const params = formValueCleanTools(nameTofield, values);
    if (updateForm) {
      params[idKey] = defaultData[idKey];
    }
    if (props.onSelfSubmit) {
      props.onSelfSubmit.call(this, params, () => {
        handleCancel();
      });
      return;
    }
    if (props.onBeforeSubmit) {
      props.onBeforeSubmit.call(this, params, () => {
        getData(params);
      });
    } else {
      getData(params);
    }
  };

  const getData = async (apiParams = {}) => {
    setLoading(true);
    let api = updateForm ? props.updateApi : props.api;
    if(!api){
      return
    }
    api.call(this, apiParams).then(function (resp:any) {
      console.log('resp', resp);
      setLoading(false);
      if (resp.code == 0) {
        handleCancel();
        if (props.onSucc) {
          props.onSucc()
        }
        message.success(resp.msg);
      } else {
        message.error(resp.msg);
      }
    }).catch(function (error:any) {
      setLoading(false);
      message.error("表单提交异常，请联系管理员处理！");
      console.log('error', error);
    });
  };

  

  //form数据打入
  useEffect(() => {
    const initialValues = formDefaultDataTools(nameTofield, defaultData);
    formRef.setFieldsValue(initialValues);
  }, []);

  // var formInstance = useForm(props.form);
  // //支持原生ref
  // useImperativeHandle(ref, () => { return formInstance });

  const formHtml = useMemo(() => {
    console.log('initForm');
    return (
      <Form
        form={formRef}
        layout="horizontal"
        size={size}
        validateMessages={validateMessages}
        onFinish={handleSubmit}
      // labelCol={{ span: 6 }}
      // wrapperCol={{ span: 18 }}
      // onFinishFailed={onFormFinishFailed}
      >
        <Row gutter={24}>
          {fields.map((field, index) => (<ItemField field={field} index={index} key={index}
            formRef={formRef} defaultData={defaultData} />))}
          {showMode == 'normal' &&
            <Col span={24}>
              <Form.Item style={{ marginLeft: "110px" }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>}
        </Row>
      </Form>
    );
  }, [fields]);

  if (showMode == 'modal') {
    return (
      <WsModal
        content={formHtml}
        open={true}
        width={width}
        fullVisible={true}
        fullStatus={fullStatus}
        title={updateForm ? "编辑" + title : "添加" + title}
        loading={loading}
        onCancel={() => { formRef.resetFields(); handleCancel(); }}
        onOk={() => { formRef.submit(); }}
      />
    )
  } else if (showMode == 'normal') {
    return (
      <Row>
        <Col span={fieldCol}>
          {formHtml}
        </Col>
      </Row>
    )
  } else if (showMode == 'drawer') {
    // return (
    //   <WsDrawer
    //     content={formHtml}
    //     show={true}
    //     width={config.width}
    //     fullStatus={config.fullStatus}
    //     title={config.updateForm ? "编辑" + config.title : "添加" + config.title}
    //     loading={loading}
    //     onCancel={() => { formRef.resetFields(); handleCancel(); }}
    //     onSubmit={() => { formRef.submit(); }}
    //   />);
    return (<></>);
  } else {
    return (<></>);
  }
};
export default forwardRef(InternalForm);
