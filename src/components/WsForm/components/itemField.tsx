import {
  Form,
  Col,
  Input,
  Select,
  DatePicker,
  Space,
  Cascader,
  InputNumber,
  Radio,
  Tree,
  Checkbox,
  Transfer,
  Upload,
  Button
} from 'antd';
import { LockOutlined, UploadOutlined } from '@ant-design/icons';
const { Option } = Select;
import { paramIsset, getFormRulesTools, formFieldTransTools } from '../utils/tools';
import React, { useState } from 'react';
import { ItemFieldProps, FormField } from '../types';
import MdEditor from './mdEditor';
import MenuTree from './menuTree';
import { render } from 'react-dom';

const ItemField: React.FC<ItemFieldProps> = (props): React.ReactElement => {

  const {
    index = 0,
    defaultData = {},
    formRef
  } = props;
  let htmls: React.ReactNode = (<></>);

  if (!props.field) {
    return htmls;
  }
  const field = props.field;

  if (field.remove === true) {
    return htmls;
  }

  const {
    ctype,
    disabled,
    render,
    onChange,
    col = 24,
    offset,
    defaultValue,
    listData,

    inputProps,
    inputNumberProps,
    inputPassWdProps,
    textAreaProps,
    radioGroupProps,
    selectProps,
    datePickerProps,
    rangePickerProps,
    mdEditorProps={modelValue:""},
    cascaderProps,
    menuTreeProps={},
    tansferProps,
    ...newfield
  } = field;

  const rules = getFormRulesTools(field);
  const name = field.name as string;
  const placeholder = '请输入' + field.label;

  switch (ctype) {
    case 'input':
      console.log('---input---');
      htmls = (
        <Input
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          {...inputProps}
        />
      );
      break;
    case 'inputNumber':
      console.log('---inputNumber---');
      htmls = (
        <InputNumber
          placeholder={placeholder}
          onChange={onChange}
          style={{ width: '100%' }}
          {...inputNumberProps}
        />
      );
      break;
    case 'inputPasswd':
      console.log('---inputPasswd---');
      htmls = (
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={placeholder}
          type="password"
          {...inputPassWdProps}
        />
      );
      break;
    case 'textarea':
      console.log('---textarea---');
      htmls = (
        <Input.TextArea
          placeholder={placeholder}
          {...textAreaProps}
        />
      );
      break;
    case 'radio':
      console.log('---radio---');
      htmls = (<Radio.Group
        options={listData}
        disabled={disabled}
        onChange={onChange}
        {...radioGroupProps}
      />);
      break;
    case 'select':
      console.log('---select---');
      htmls = (<Select
        options={listData}
        disabled={disabled}
        onChange={onChange}
        {...selectProps}
      />);
      break;
    case 'datePicker':
      console.log('---datePicker---');
      htmls = <DatePicker
        style={{ width: '100%' }}
        {...datePickerProps}
      />;
      break;
    case 'rangePicker':
      console.log('---rangePicker---');
      htmls = <DatePicker.RangePicker
        style={{ width: '100%' }}
        {...rangePickerProps}
      />;
      break;
    case 'mdEditor':
      console.log('---mdEditor---');
      mdEditorProps.modelValue = !defaultData[name] ? '' : defaultData[name];
      const setMdEditorData = (value: string) => {
        const values: { [key: string]: any } = {};
        values[name] = value;
        formRef?.setFieldsValue(values);
      };
      htmls = (
        <MdEditor
          setFormData={setMdEditorData}
          {...mdEditorProps}
        />
      );
      break;
    case 'cascader':
      console.log('---cascader---');
      htmls = (
        <Cascader
          placeholder={placeholder}
          options={listData}
          onChange={onChange}
          {...cascaderProps}
        />
      );
      break;
    case 'menuTree':
      menuTreeProps.initCheckedKeys = !defaultData[name] ? [] : defaultData[name];
      const setMenuTreeData = (value: Array<React.Key>) => {
        const values: { [key: string]: any } = {};
        values[name] = value;
        formRef?.setFieldsValue(values);
      };
      htmls = (
        <MenuTree
          listData={listData}
          setFormData={setMenuTreeData}
          {...menuTreeProps}
        />
      );
      break;
    case 'transfer':
      //目录选择
      let defaultTargetKeys = !defaultData[name] ? [] : [...defaultData[name]];
      const [targetKeys, setTargetKeys] = useState(defaultTargetKeys);
      const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
      const onTransferChange = (nextTargetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => {
        setTargetKeys(nextTargetKeys);
      };
      const onTransferSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
      };
      htmls = (<Transfer
        dataSource={listData}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onTransferChange}
        onSelectChange={onTransferSelectChange}
        render={(item:any) => item.title}
        {...tansferProps}
      />)
      break;
    case 'uploadFile':
      // const customRequest = (customData) => {
      //   const param = new FormData();
      //   param.append(paramIsset(field.uploadName, 'file'), customData.file);
      //   loadPromise(field.customRequest, param, (data) => {
      //     field.customRequestSucc === undefined ? customData.onSuccess(data) : field.customRequestSucc.call(this, data, customData);
      //   }, (error) => {
      //     customData.onError(error);
      //   });
      // }
      // htmls = (<Upload
      //   action={field.action}
      //   name={paramIsset(field.uploadName, 'file')}
      //   multiple={paramIsset(field.multiple, false)}
      //   beforeUpload={field.beforeUpload}
      //   onChange={onChange}
      //   customRequest={field.customRequest === undefined || field.customRequest == '' ? '' : customRequest}
      //   {...paramIsset(field.props, {})}
      // >
      //   <Button icon={<UploadOutlined />}>Upload</Button>
      // </Upload>)
      break;
    case 'br':
      break;
    case 'html':
      if(render !== undefined){
        htmls = render()
      }
      break;
  }

  if (ctype !== 'br') {
    htmls = (
      <Form.Item
        // labelCol={{ span: 6 }}
        // wrapperCol={{ span: 18 }}
        required={field.hidden === true ? false : field.required}
        rules={rules}    
        initialValue={formFieldTransTools(ctype,defaultValue)}
        {...newfield}
      >
        {htmls}
      </Form.Item>
    );
  }
  return (
    <Col
      span={col}
      offset={offset}
      key={index}
    >
      {htmls}
    </Col>
  );
};
export default ItemField;
