import React from "react";
import { WsTable } from "./components/index";
import { Input } from "antd";
const App = () => {
    return (<>
        <WsTable
        searchs={[
            {type:"input",label:"张三",name:"username"},
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
    </>)
}

export default App;