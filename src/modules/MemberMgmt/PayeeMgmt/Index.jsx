import React from "react";
import CommonSearch from "../../../components/Common/CommonSearch";
import { FORM_TYPE } from "../../../constants/common";
import CommonTable from "../../../components/Common/CommonTable";
import { useState } from "react";
import { Table } from "antd";

const PayeeMgmt = () => {

  const optionsForms = [
    {
      type: FORM_TYPE.INPUT,
      value: '',
      key: 'demo1',
      title: '输入框',
    },
    {
      type: FORM_TYPE.SELECT,
      value: '',
      key: 'demo2',
      title: '选择框',
    },
    {
      type: FORM_TYPE.RANGE_PICKER,
      value: '',
      key: 'demo3',
      title: '时间选择框',
    },
    {
      type: FORM_TYPE.DATE_PICKER,
      value: '',
      key: 'demo4',
      title: '时间选择框',
    },
    {
      type: FORM_TYPE.DATE_PICKER,
      value: '',
      key: 'demo5',
      title: '时间选择框',
    },
  ]

  const queryData = (_data) => {
    console.log("这里是查询函数", _data)
  }

  const columns = [
    { title: 'demo1',dataIndex: 'dsgsdf' },
    { title: 'demo1',dataIndex: 'aaawf' },
    { 
      title: 'demo1',dataIndex: 'fgdas'
    },
    { title: 'demo1',dataIndex: 'ghfgh' },
    { title: 'demo1',dataIndex: 'a' },
    { 
      title: 'demo1',dataIndex: 'b'
    },
    { title: 'demo1',dataIndex: 'we' },
    { title: 'demo1',dataIndex: 'wqa' },
    { 
      title: 'demo1',dataIndex: 'b'
    },
    { title: 'demo1',dataIndex: 'wfgge' },
    { title: 'demo1',dataIndex: 'wqdfgdnba' },
    { 
      title: 'demo1',dataIndex: 'bcbdsfd'
    },
    { title: 'demo1',dataIndex: 'sdfs' },
    { title: 'demo1',dataIndex: 'wqdfggfghddnba' },
    { 
      title: 'demo1',dataIndex: 'dfsfds'
    },
    { title: 'demo1',dataIndex: 'userid', width: '200px' },
    {
      title: '操作',
      dataIndex: 'operation',
      // width: '170px',
      width: '150px',
      // openOp: true,
      fixed: 'right',
      renderList: [
        {
          title: '操作',
          isShow: true,
          handleClick: (text, record) => {
            console.log("这是操作噢")
          }
        },
      ]
    }
  ];
  const handleTableChange = (page) => {
    console.log("page", page)
  }

  const [ tableData, setTableData ] = useState([{userid: '1'}, {userid: '22222222222222222222222222222222222222222222222222222222222222222222222'}])
  const [ pagination, setpagination ] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const [aaa, setAaa] = useState(true)
  // setTimeout(() => {
  //   setAaa(true)
  // }, 5000)

  const optionsFnButtons = [
    {
      title: 'demo1按钮',
      isShow: () => aaa,
      handleFn: () => {
        console.log("这里是按钮")
      }
    }
  ]

  return (
    <div>
      <CommonSearch 
        optionsForms={optionsForms}
        queryData={queryData}
      />
      <CommonTable
        optionsFnButtons={optionsFnButtons}
        handleTableChange={handleTableChange}
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        rowKey={record => record.userid}
      />
    </div>
  )
}

export default PayeeMgmt