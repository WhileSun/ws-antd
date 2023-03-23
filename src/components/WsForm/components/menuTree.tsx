import React, { useCallback, useMemo } from "react";
import { useState } from "react";
import { Space, Checkbox, Tree } from "antd";
import { MenuTreeProps } from "../types";
import { delArrValTools } from "../utils/tools";

const MenuTree: React.FC<MenuTreeProps> = (props) => {
  const {
    initCheckedKeys = [],
    listData = [],
    ...newProps
  } = props;

  /** 展开的keys */
  let expandedKeys: Array<React.Key> = [];
  /** 选中的keys */
  let checkedKeys: Array<React.Key> = [];

  /** 遍历tree提取数据 */
  const menuTreeFunc = (data: Array<{ [key: string]: any }>) => {
    data.map((val: { [key: string]: any }) => {
      checkedKeys.push(val['key']);
      if (val['children'] !== undefined && val['children'].length > 0) {
        delArrValTools(initCheckedKeys, val['key']);
        expandedKeys.push(val['key']);
        menuTreeFunc(val['children']);
      }
    });
  };
  menuTreeFunc(props.treeData || listData);

  const [menuTreeExpandedKeys, setMenuTreeExpandedKeys] = useState<Array<React.Key>>([]);
  const [menuTreeCheckedKeys, setMenuTreeCheckedKeys] = useState<Array<React.Key>>(initCheckedKeys);
  /** check form表单数据绑定 */
  const menuTreeCheckFunc = (checkVal: Array<React.Key>, parentCheckVal: Array<React.Key>) => {
    setMenuTreeCheckedKeys(checkVal);
    if (props.setFormData) {
      props.setFormData.call(this, [...checkVal, ...parentCheckVal]);
    }
  };
  return (
    <>
      <Space className="menu-tree-top">
        <Checkbox
          onChange={(event) => {
            if (event.target.checked) {
              setMenuTreeExpandedKeys(expandedKeys);
            } else {
              setMenuTreeExpandedKeys([]);
            }
          }}
        >
          展开/折叠
        </Checkbox>
        <Checkbox
          onChange={(event) => {
            if (event.target.checked) {
              menuTreeCheckFunc(checkedKeys, []);
            } else {
              menuTreeCheckFunc([], []);
            }
          }}
        >
          全选/全不选
        </Checkbox>
      </Space>
      <Tree
        checkable
        showLine={{ showLeafIcon: false }}
        showIcon={true}
        selectable={false}
        expandedKeys={menuTreeExpandedKeys}
        onExpand={(expandVal) => {
          setMenuTreeExpandedKeys(expandVal);
        }}
        onCheck={(checkVal, { halfCheckedKeys }) => {
          menuTreeCheckFunc(checkVal as React.Key[], halfCheckedKeys as React.Key[]);
        }}
        checkedKeys={menuTreeCheckedKeys}
        treeData={listData}
        {...newProps}
      />
    </>
  );
};

export default MenuTree;
