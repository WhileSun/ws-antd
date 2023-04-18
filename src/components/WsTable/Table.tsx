import { Table, Form, message, Button, Tooltip, Pagination } from 'antd';
import { SettingOutlined, ReloadOutlined, SearchOutlined, MinusSquareOutlined, PlusSquareOutlined, OrderedListOutlined } from '@ant-design/icons';
import { WsTableProps, ApiResp } from './types';
import React, { useMemo, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { paramIsset, getRandStr, parseFormParamsTools, toTreeTools, arrayColumnTools, filterNameTools } from './utils/tools';
import HeaderSearchForm from './components/HeaderSearchForm';
import ColumnShowTool from './components/ColumnShowTool';
import HeaderButton from './components/HeaderButton';
import initColumnFunc from './func/initColumn';
import initShowColumnFunc from './func/initShowColumn';
import WsModal from '../WsModal';
import './Table.less';

const InternalWsTable: React.ForwardRefRenderFunction<any, WsTableProps<any>> = (props, ref) => {
  const [formRef] = Form.useForm();
  const {
    size = "small",
    rowKey = "id",
    display = "fluid",
    showMode = "normal",
    checkbox = false,
    treeTable = false,
    tableId = getRandStr('table'),
    page = 1,
    pageSize = 50,
    otherFormParams = {},
    // scroll = { x: 2000 },
    scroll = {x:0},
    searchs,
    searchConfig
  } = props;

  useEffect(() => {
    console.log('storeModel', props.storeModel?.params);
  }, [props.storeModel?.params])



  const [apiresp, setApiresp] = useState<ApiResp>({}); //api原生数据
  const [apiData, setApiData] = useState<Array<any>>([]); //api经过内部转化数据
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedIds, setCheckedIds] = useState<Array<React.Key>>([]); //表格选中的ID
  const [modalShow, setModalShow] = useState<boolean>(paramIsset(props.modalShow, true)); //弹出框是否显示
  //tree table
  const [expandedRowKeys, setExpandedRowKeys] = useState<Array<React.Key>>([]); //展开的节点ID
  const [rowKeys, setRowKeys] = useState<Array<React.Key>>([]); //当前所有节点ID
  const [treeTableshow, setTreeTableshow] = useState(true);  //是否是树形表
  //列设置
  const initShowColumn = useMemo(() => { return initShowColumnFunc(!props.th ? [] : props.th) }, []); //表格字段的字段和值
  const [showColumns, setShowColumns] = useState(initShowColumn.allKeys); //表格展示的字段,默认全部
  const [searchFormShow, setSearchFormShow] = useState(true); //是否显示搜索框

  //table column等配置信息
  const tableColumn = useMemo(() => {
    return initColumnFunc(!props.th ? [] : props.th, showColumns)
  }, [showColumns]);


  /** merge defalut params and other params*/
  const defaultFormParams = { 'pageSize': pageSize, 'page': page, otherFormParams };
  const [formParams, setFormParams] = useState<{ [key: string]: any }>(defaultFormParams);

  /**  set form params */
  const setFormParamsFunc = (newParam: { [key: string]: any }, mode: 'page' | 'submit' | 'init') => {
    let params = {};
    if (mode == 'page') {
      /** 只改变page参数 */
      params = { ...formParams, ...newParam };
    } else if (mode == 'submit') {
      /**  默认参数+now page+ newParam**/
      let newDefaultFormParams = { ...defaultFormParams, page: formParams.page };
      params = { ...newDefaultFormParams, ...newParam };
    } else if (mode == 'init') {
      /** 默认参数+（{} or storeModel.params） */
      params = { ...defaultFormParams, ...newParam };
    }
    setFormParams(params);
    return params;
  }

  /**  set StoreModel params */
  const setStoreModelParamsFunc = (values: { [key: string]: any }) => {
    props.storeModel?.setParams({ ...props.storeModel?.params, [props.storeModel.name]: values });
  }

  /** change page */
  const handleChangePage = (page: number) => {
    console.log('handleChangePage');
    let params = setFormParamsFunc({ page: page }, 'page');
    getData(params);
  };

  /** form rest search*/
  const handleFormReset = () => {
    console.log('handleFormReset');
    setStoreModelParamsFunc({});
    formRef.resetFields();
    let params = setFormParamsFunc({}, 'init');
    getData(params);
  };

  /** form submit */
  const handleFormSubmit = (values: { [key: string]: any }) => {
    console.log('handleFormSubmit');
    /** 针对本地数据筛选，一般针对tree table使用 */
    if (props.onLocalFilter) {
      props.onLocalFilter(parseFormParamsTools(values))
    } else {
      setStoreModelParamsFunc(values);
      console.log('old_values', values);
      let params = setFormParamsFunc(parseFormParamsTools(values), 'submit');
      console.log('values', params);
      getData(params);
    }
  };

  /** table reload  */
  const handleTableReload = () => {
    if (loading) {
      return;
    }
    getData(formParams);
  }

  /** trans table data */
  /** key need parent_id */
  const transTableDataFunc = (data: Array<any>) => {
    if (treeTable) {
      setRowKeys(arrayColumnTools(data, rowKey) as Array<React.Key>);
      return toTreeTools(data);
    }
    return data;
  }

  /** set data */
  const setDataFunc = (resp: ApiResp) => {
    setApiresp(resp);
    setApiData(transTableDataFunc(resp.data));
  }

  /** get data  */
  const getData = async (apiParams = {}) => {
    setLoading(true);
    if (props.selfApi !== undefined) {
      let data = props.selfApi.call(this, apiParams);
      setDataFunc(data);
      setLoading(false);
      return;
    }

    if (props.api !== undefined) {
      let api: Promise<ApiResp> = props.api.call(this, apiParams)
      api.then(function (resp) {
        setDataFunc(resp)
        setLoading(false);
        if (resp.code != 0) {
          message.error(resp.msg);
        }
      }).catch(function (error) {
        setLoading(false);
        message.error("列表获取异常，请联系管理员处理！");
        console.log('error', error);
      });
      return
    }

    setLoading(false);
  };


  useEffect(() => {
    /** 初始化查询参数，开启storeModel会加载历史查询数据 */
    let initParams = props.storeModel?.params[props.storeModel.name]
    let params = setFormParamsFunc(parseFormParamsTools(initParams), 'init');
    getData(params);
    //初始化设置字段数据
    formRef.setFieldsValue(initParams);
  }, []);

  /** table 映射func*/
  if (props.table !== undefined) {
    var tableInstance = props.table;
    tableInstance.reload = () => { console.log('reload'); handleTableReload(); };
    tableInstance.getCheckedIds = () => { return checkedIds; };
    tableInstance.getDataList = () => { return apiresp.data };
    tableInstance.filterName = (dataIndex: string, val: any) => {
      if (val) {
        setApiData(filterNameTools(transTableDataFunc(apiresp.data), dataIndex, val))
      } else {
        setApiData(transTableDataFunc(apiresp.data))
      }
    };
    useImperativeHandle(ref, () => tableInstance);
  }

  //header Form
  const headerSearchForm = useMemo(() => {
    return (
      <>
        <HeaderSearchForm
          formRef={formRef}
          searchConfig={searchConfig}
          searchs={searchs}
          handleFormSubmit={handleFormSubmit}
        >
          <div className="header-search-form-button">
            <Button type="primary" onClick={() => { formRef.submit(); }} style={{ marginRight: '10px' }} loading={loading}>
              查询
            </Button>
            <Button htmlType="button" onClick={handleFormReset} loading={loading}>
              重置
            </Button>
          </div>
        </HeaderSearchForm >
      </>
    );
  }, [searchs, searchConfig, loading]);

  // header toolbar left 
  const headerToolbarLeft = useMemo(() => {
    return (
      <>
        {props.toolbars !== undefined ? props.toolbars
          .filter((toolbar) => toolbar.align == 'left')
          .map((toolbar, index) => {
            console.log(toolbar);
            return (
              <div key={index}>
                {toolbar.render()}
              </div>
            );
          }) : ""}
        <HeaderButton btns={props.btns} align="left" />
      </>
    );
  }, [])


  // header toolbar righttoolbars
  const headerToolbarRight = useMemo(() => {
    return (
      <>
        {props.toolbars !== undefined ? props.toolbars
          .filter((toolbar) => toolbar.align == 'right')
          .map((toolbar, index) => {
            console.log(toolbar);
            return (
              <div key={index}>
                {toolbar.render()}
              </div>
            );
          }) : ""}
        <HeaderButton btns={props.btns} align="right" />
      </>
    )
  }, [])

  /** toolbar icon  */
  const iconStyle = { fontSize: '16px', marginRight: '15px' };
  const treeTableIconRight = useMemo(() => {
    const treeFunc = () => {
      if (treeTableshow) {
        setExpandedRowKeys(rowKeys);
      } else {
        setExpandedRowKeys([]);
      }
      setTreeTableshow(!treeTableshow)
    }
    return (<Tooltip placement="top" title='Tree Table 展开/隐藏'>
      {treeTableshow ? <PlusSquareOutlined style={iconStyle} onClick={treeFunc} /> :
        <MinusSquareOutlined style={iconStyle} onClick={treeFunc} />}
    </Tooltip>
    )
  }, [treeTableshow, rowKeys])

  const formShowIconRight = useMemo(() => {
    return (<Tooltip placement="top" title='搜索框显示/隐藏'>
      <SearchOutlined style={iconStyle} onClick={() => {
        setSearchFormShow(!searchFormShow);
      }} />
    </Tooltip>)
  }, [searchFormShow])

  const reloadIconRight = useMemo(()=>{
    return (<Tooltip placement="top" title='刷新'>
    <ReloadOutlined style={iconStyle} onClick={handleTableReload} />
  </Tooltip>)
  },[loading])

  const columnShowIconRight =useMemo(()=>{
    return (<ColumnShowTool
      data={initShowColumn}
      showColumns={showColumns}
      setShowColumns={(keys: string[]) => { setShowColumns(keys) }}
      solt={(<Tooltip placement="top" title='列设置'><SettingOutlined style={{ fontSize: '16px' }} /></Tooltip>)}
    />)
  },[showColumns])


  const tableHtml = (
    <>
      <div style={{ position: 'relative', height: '100%', minWidth: '0px' }}>
        <div className={tableId + " ws-table " + (display == 'fixed' ? 'ws-table-fixed' : '')}>
          <div className="ws-table-header">
            <div className="header-search-form" style={{ display: searchFormShow ? "block" : 'none' }}>
              {headerSearchForm}
            </div>
            <div className="header-toolbar">
              <div className="header-toolbar-left">{headerToolbarLeft}</div>
              <div className="header-toolbar-right">
                {headerToolbarRight}
                <div className='header-toolbar-right-items'>
                  {treeTable ? treeTableIconRight : ""}
                  {formShowIconRight}
                  {reloadIconRight}
                  {columnShowIconRight}
                </div>
              </div>
            </div>
          </div>
          <div className="ws-table-container">
            <Table
              rowSelection={checkbox ? {
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                  setCheckedIds(selectedRowKeys);
                }
              } : undefined}
              columns={tableColumn}
              dataSource={apiData}
              bordered={true}
              size={size}
              rowKey={rowKey}
              scroll={scroll}
              loading={loading}
              // expandRowByClick={true}
              onExpandedRowsChange={(expandedRows) => {
                setExpandedRowKeys(expandedRows);
              }}
              expandedRowKeys={expandedRowKeys}
              pagination={false}
              onChange={(paginate, filters, sorter, extra) => {
                if (extra.action === 'paginate') {
                  handleChangePage(paginate.current!);
                }
              }}
            // onRow={(record, index) => {
            //   return {
            //     onClick: event => {
            //       // console.log(event);
            //       if (event.target.dataset.act !== undefined && props.rowBtnsClick !== undefined) {
            //         props.rowBtnsClick(event.target.dataset.act, record);
            //       }
            //     },
            //   };
            // }}
            />
          </div>
          <div className="ws-table-footer">
            <Pagination
              size='small'
              current={formParams.page}
              pageSize={formParams.pageSize}
              showSizeChanger={false}
              total={apiresp.total}
              showTotal={total => `共 ${total} 条`}
              onChange={(page, pageSize) => { handleChangePage(page) }}
            />
          </div>
        </div>
      </div>
    </>
  );
  //输出样式
  if (showMode == 'modal') {
    return (
      <WsModal
        content={tableHtml}
        open={modalShow}
        fixed={true}
        fullVisible={true}
        footer={[]}
        width={paramIsset(props.width, 1000)}
        title={paramIsset(props.title, '列表')}
        onCancel={() => { setModalShow(false); props.onCancel && props.onCancel() }}
      />
    )
  } else {
    return tableHtml;
  }
}

const WsTable = forwardRef(InternalWsTable)
export default WsTable;