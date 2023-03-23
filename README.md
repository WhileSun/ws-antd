# ws-ant

this is antd components

## Installation

```sh
npm install ws-20230317-test
```


## WsTable
``` tsx
    import {WsTable} from 'ws-20230317-test';
    <WsTable
        // searchConfig={{colSize:{xl:8}}}
        searchs={[
            {type:"input",label:"张三",name:"username"},
            // {type:"dateRange",label:"张三",name:"username"},
            // {type:"selectInput",name:"selectInput",listData:{'name':'名称哈','name21':'名成哈哈哈哈'}},
            // {type:"select",label:"张三",name:"select",listData:{'name':'名称哈哈哈哈哈'},width:200},
            // {type:"html",label:"张三",name:"username",render:()=>{return (123123)}},
        ]}
        th = {[
            {name:"id",title:"ID"},
            {name:'username',title:'姓名'},
            {name:'age',title:'年龄'},
            {name:'sex',title:'性别'},
        ]}
        {/* api = {()=>{return new Promise()}} */}
        selfApi = {()=>{
            return {total:100,data:[{id:1,username:'张三',age:18,sex:'男',parent_id:0},{id:2,username:'张三',age:18,sex:'男',parent_id:1}]}
        }}
    />
```