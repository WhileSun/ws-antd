import React from 'react';
import { useMemo } from 'react';
import { Form, Input, Select, DatePicker, Button, Divider, Row, Col} from 'antd';
import { SearchField, WsTableSearchProps,searchConfig } from '../types'
import { paramIsset} from '../utils/tools';

const { RangePicker } = DatePicker;
const { Option } = Select;


const HeaderSearchForm: React.FC<WsTableSearchProps> = (props) => {
  console.log("initSearchForm");
  const searchs = paramIsset(props.searchs, []);
  const searchConfig:searchConfig = paramIsset(props.searchConfig,{});
  const formRef = props.formRef;
  const handleFormSubmit = paramIsset(props.handleFormSubmit, () => { })
  
  const config = useMemo(()=>{
    let conf: searchConfig = {}
    conf.gutter = paramIsset(searchConfig.gutter,[16,16]);
    conf.colSize = paramIsset(searchConfig.colSize,{xl:6})
    conf.labelWidth = paramIsset(searchConfig.labelWidth,undefined)
    return conf
  },[searchConfig]);

  return (
    <>
      <Form
        layout="horizontal"
        form={formRef}
        initialValues={{}}
        onFinish={handleFormSubmit}
      >
        <Row gutter={config.gutter}>
          {searchs.map((field: SearchField, index: number) => initFields(field, index, config))}
        </Row>
      </Form>
    </>
  );
};

const initFields = (field: SearchField, index: number, config:searchConfig): React.ReactElement => {
  let htmls = (<></>);
  let styles: React.CSSProperties = {};
  let fieldName = field.name;
  if (field.width !== undefined) {
    styles.width = field.width + 'px';
  }
  if (field.type === 'input') {
    htmls = (
      <Input
        placeholder={field.placeholder}
        style={{ ...styles }}
      />
    );
  } else if (field.type === 'select') {
    htmls = (
      <Select
        placeholder={field.placeholder}
        style={{ ...styles }}
      >
        <Option value="" key="">
          {field.oneShowMode === true ? field.label : '全部'}
        </Option>
        {Object.keys(field.listData).map((selectKey, selectIndex) => {
          return (
            <Option value={selectKey} key={selectIndex.toString()}>
              {field.listData[selectKey]}
            </Option>
          );
        })}
      </Select>
    );
  } else if (field.type === 'selectInput') {
    let keyName = 'selectInput_' + index;
    let keys = Object.keys(field.listData);
    htmls = (
      <Input.Group compact style={{display:'flex'}}>
        <Form.Item name={[keyName, 'key']} noStyle initialValue={keys[0]}>
          <Select>
            {keys.map((selectKey, selectIndex) => {
              return (
                <Option value={selectKey} key={selectIndex.toString()}>
                  {field.listData[selectKey]}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name={[keyName, 'val']} noStyle>
          <Input style={{flex:1}} placeholder="搜索" />
        </Form.Item>
      </Input.Group>
    );
  } else if (field.type === 'dateRange') {
    fieldName = 'dateRange_' + field.name;
    htmls = <RangePicker style={{display:'flex'}}/>;
  } else {
    if (field.render !== undefined) {
      htmls = field.render;
    }
  }
  if (field.oneShowMode === true) {
    delete field.label;
  }

  /** 删除自定义值 */
  const { render,oneShowMode, listData, ...fieldRest } = field;

  return (
    <Col {...config.colSize} key={index}>
      <Form.Item
        {...fieldRest}
        style={{marginBottom:'0px'}}
        label={config.labelWidth === undefined ? field.label: <span style={{width:config.labelWidth.toString()+'px'}}>{field.label}</span>}
        name={fieldName}
        initialValue={field.defaultValue === undefined ? '' : field.defaultValue}
        key={index}
      >
        {htmls}
      </Form.Item>
    </Col>
  );
};

export default HeaderSearchForm;