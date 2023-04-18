import React from 'react';
import { useMemo } from 'react';
import { Form, Input, Select, DatePicker, Space, Divider, Row, Col, Button } from 'antd';
import { SearchField, WsTableSearchProps, searchConfig } from '../types'
import { paramIsset } from '../utils/tools';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HeaderSearchForm: React.FC<WsTableSearchProps> = (props) => {
  console.log("reload-----HeaderSearchForm");
  const {
    searchs = [],
    searchConfig = {},
    formRef,
    children = "",
    handleFormSubmit = () => { }
  } = props;
  /** form config */
  const config = useMemo(() => {
    let conf: searchConfig = {}
    conf.gutter = paramIsset(searchConfig.gutter, [16, 16]);
    conf.colSize = paramIsset(searchConfig.colSize, {})
    conf.labelWidth = paramIsset(searchConfig.labelWidth, undefined)
    return conf
  }, [searchConfig]);

  /** form item */
  const itemList = useMemo(() => {
    return (<>
      {searchs.map((field: SearchField, index: number) => initFields(field, index, config))}
    </>)
  }, [searchs, config])

  return (
    <>
      <Form
        layout="horizontal"
        form={formRef}
        initialValues={{}}
        onFinish={handleFormSubmit}
      >
        <Row gutter={config.gutter} style={{ display: 'flex' }}>
          {itemList}
          {searchs.length>0 ? children:""}
        </Row>
      </Form>
    </>
  );
};

const initFields = (field: SearchField, index: number, config: searchConfig): React.ReactElement => {
  let htmls: React.ReactNode = (<></>);
  let styles: React.CSSProperties = {};

  /** 删除自定义值 */
  const {
    type,
    width,
    placeholder,
    oneShowMode = false,
    defaultValue = '',
    listData,
    render,
    ...fieldRest } = field;

  let fieldName = field.name;
  if (width !== undefined) {
    styles.width = width + 'px';
  }
  let fieldPlaceholder = paramIsset(placeholder, '请输入' + field.label)

  switch (type) {
    case 'input':
      htmls = (
        <Input
          placeholder={fieldPlaceholder}
          style={{ ...styles }}
        />
      );
      break;
    case 'select':
      htmls = (
        <Select
          placeholder={fieldPlaceholder}
          style={{ ...styles }}
        >
          <Option value="" key="">
            {oneShowMode === true ? field.label : '全部'}
          </Option>
          {Object.keys(listData).map((selectKey, selectIndex) => {
            return (
              <Option value={selectKey} key={selectIndex.toString()}>
                {listData[selectKey]}
              </Option>
            );
          })}
        </Select>
      );
      break;
    case 'selectInput':
      let keyName = 'selectInput_' + index;
      fieldName = undefined;
      let keys = Object.keys(listData);
      htmls = (
        <Space.Compact style={{ display: 'flex' }}>
          <Form.Item name={[keyName, 'key']} noStyle initialValue={keys[0]}>
            <Select style={{ width: 120, ...styles }}>
              {keys.map((selectKey, selectIndex) => {
                return (
                  <Option value={selectKey} key={selectIndex.toString()}>
                    {listData[selectKey]}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name={[keyName, 'val']} noStyle>
            <Input style={{ flex: 1 }} placeholder="搜索内容" />
          </Form.Item>
        </Space.Compact>
      );
      break;
    case 'dateRange':
      fieldName = 'dateRange_' + field.name;
      htmls = <RangePicker style={{ display: 'flex', ...styles }} />;
      break;
    case 'html':
      if (render !== undefined) {
        htmls = render();
      }
      break;
  }
  if (oneShowMode === true) {
    delete field.label;
  }
  return (
    <Col {...config.colSize} key={index}>
      <Form.Item
        {...fieldRest}
        style={{ marginBottom: '0px' }}
        label={config.labelWidth === undefined || field.label === undefined ? field.label : <span style={{ width: config.labelWidth.toString() + 'px' }}>{field.label}</span>}
        name={fieldName}
        initialValue={defaultValue}
        key={index}
      >
        {htmls}
      </Form.Item>
    </Col>
  );
};

export default HeaderSearchForm;