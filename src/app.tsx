import React from "react";
import { WsTable,WsForm } from "./components/index";
import { Input } from "antd";
const App = () => {
    const table  = (
        <WsTable
        // searchConfig={{colSize:{xl:8}}}
        searchs={[
            {type:"input",label:"张三",name:"username"},
            // {type:"input",label:"张三",name:"username"},
            // {type:"input",label:"张三",name:"username"},
            // {type:"dateRange",label:"张三",name:"username"},
            // {type:"selectInput",name:"selectInput",listData:{'name':'名称哈','name21':'名成哈哈哈哈'}},
            // {type:"select",label:"张三",name:"select",listData:{'name':'名称哈哈哈哈哈'},width:200},
            // {type:"html",label:"张三",name:"username",render:()=>{return (123123)}},
        ]}
        size = "small"
        th = {[
            {name:"id",title:"ID"},
            {name:'username',title:'姓名'},
            {name:'age',title:'年龄'},
            {name:'sex',title:'性别'},
        ]}
        selfApi = {()=>{
            return {total:100,data:[{id:1,username:'张三',age:18,sex:'男',parent_id:0},{id:2,username:'张三',age:18,sex:'男',parent_id:1}]}
        }}
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
        defaultData={{mdEditor:'12313',menuTree:[1]}} 
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
          {name:"menuTree",label:"menuTree",ctype:"menuTree",listData:[{key:1,title:'1',children:[{key:2,title:'2'}]}],menuTreeProps:{titleRender:(a:any)=>{
           
          return  a.title+'_1';
          }}},

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
        onSucc={()=>{
          // tableRef.reload();
        }}
      />
    );

    return (<>
    {form}
    </>);
}

export default App;