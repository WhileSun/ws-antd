import React, { useState } from "react";
import { WsTable, WsForm } from "./components/index";
import { Button, Form, Input, Select, Space, Tooltip, Typography, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;

const App = () => {
  const tableRef = WsTable.useTable();
  const list: any = [
    { type: "input", label: "input", name: "username" },
    { type: "dateRange", label: "张三张三张三", name: "date" },
    { type: "selectInput", name: "selectInput", listData: { 'name': '名称哈', 'name21': '名成哈哈哈哈' } },
    { type: "select", label: "select", name: "select", listData: { 'name': '名称哈哈哈哈哈' }, width: 200 },
    { type: "html", label: "html", name: "username1", render: () => { return (<Input />) } },
    // { type: "html", label: "html", name: "date1", render: () => { return (<RangePicker />) }},
  ]

  const [searchs, setSearchs] = useState(list);
  // const [searchConfig,setSearchConfig] = useState({Colsize:{xl:6}});
  const clickFunc = () => {
    // searchs.push( { type: "input", label: "input", name: "username1" });
    // setSearchs([...searchs])
    // searchConfig.colSize = {xl:8}
    // setSearchConfig({...searchConfig});
  }
  const data = (): Array<any> => {
    let lists: Array<any> = [];
    for (let i = 0; i < 10; i++) {
      lists.push({
        id: i, username: '张三asdfasfsafdsf123333333333333333', username1: '张三asdfasfsafdsf',
        username2: '张三asdfasfsafdsf', username3: '张三asdfasfsafdsf', username4: '张三asdfasfsafdsf',
        age: 18, sex: '男男男男男男男男男男男男', parent_id: 0
      });
    }
    return lists
  }
  /** 登录验证码 GET /v1/captcha/get */
  async function getCaptcha(options?: { [key: string]: any }) {
    console.log('options',options);
    return new Promise<{ [key: string]: any }>((resolve, reject) => {
      // setTimeout(()=>{
        resolve( 
          {code:0,data: data(),total:100})
      // }, 100) 
    });
  }


  const table = (
    <WsTable
      table={tableRef}
      // searchConfig={{}}
      searchs={searchs}
      checkbox = {true}
      btns={[
        {align:'left',name:"添加"},
        {align:'right',name:"编辑"}
      ]}
      toolbars={[
        {align: 'left', render: () => {return <Button>新增</Button>;}},
      ]}
      size="small"
      th={[
        { name: "id", title: "ID", width: 80 },
        { name: 'username', title: '姓名', width: 80 },
        { name: 'username1', title: '姓名', width: 200 },
        { name: 'username2', title: '姓名', width: 80 },
        { name: 'username3', title: '姓名', width: 80 },
        { name: 'username4', title: '姓名', width: 80 },
        { name: 'age', title: '年龄', width: 2000 },
        { name: 'sex', title: '性别', width: 80 },
      ]}
      api={getCaptcha}
      // selfApi={(param) => {
      //   console.log(param);
      //   let lists = data();
      //   return { total: 100, data: lists, code: 0, msg: "", time: 0 }
      // }}
    />
  );



  const form = (
    <WsForm
      showMode="modal"
      // form={formRef}
      // onCancel = {()=>{
      //   setFormShow(false);
      // }}
      size={'middle'}
      defaultData={{ mdEditor: '12313', menuTree: [1] }}
      fields={[
        // {name:"input",label:'input',ctype:'input',required:true},
        // {name:"inputNumber",label:'inputNumber',ctype:'inputNumber',required:true},
        // {name:"inputPasswd",label:'inputPasswd',ctype:'inputPasswd',required:true},
        // {name:"radio",label:'radio',ctype:'radio',listData:[{label:"man",value:"男士"},{label:"women",value:"女士"}],required:true},
        // {name:"select",label:'select',ctype:'select',listData:[{label:"man",value:"男士"},{label:"women",value:"女士"}],required:true},
        // {name:"selectserach",label:'selectserach',ctype:'select',listData:[{label:"man",value:"男士"},{label:"women",value:"女士"}],selectProps:{mode:'multiple'},required:true},
        // {name:"date",label:'date',ctype:'datePicker'},
        // {name:"datetime",label:'datetime',ctype:'rangePicker',rangePickerProps:{picker:"week"}},
        // {name:"textarea",label:'textarea',ctype:'textarea',textAreaProps:{maxLength:500,rows:10}},
        // {name:"mdEditor",label:"mdEditor",ctype:"mdEditor"},
        {
          name: "menuTree", label: "menuTree", ctype: "menuTree", listData: [{ key: 1, title: '1', children: [{ key: 2, title: '2' }] }], menuTreeProps: {
            titleRender: (a: any) => {

              return a.title + '_1';
            }
          }
        },

        // {name:"transfer",label:"transfer",ctype:"transfer",listData:[{key:'key',title:'title',description:'description',tag:'123'}],tansferProps:{render:(item)=>{
        //   return item.description
        // },}}
      ]}
      // api={addWorkProject}
      // updateApi = {updateWorkProject}
      onBeforeSubmit={(params, cb) => {
        console.log(params);
        cb();
      }}
      onSucc={() => {
        // tableRef.reload();
      }}
    />
  );

  return (<>
    <div onClick={clickFunc}>点击</div>
    {table}
  </>);
}

export default App;