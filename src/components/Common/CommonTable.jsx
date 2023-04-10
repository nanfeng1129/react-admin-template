import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Dropdown } from 'antd'
import { cloneDeep, isFunction } from 'lodash'
import { DownSquareOutlined } from '@ant-design/icons'

const CommonTable = (props) => {

  const { 
    columns, dataSource, pagination, handleTableChange, size, 
    optionsFnButtons, customTitleRender, rowKey 
  } = props
  const columnsWidth = 180;
  
  const [ tableColumns, setTableColumns ] = useState([])
  const [ tOptionsFnButtons, setTOptionsFnButtons ] = useState([])

  useEffect(() => {
    setTOptionsFnButtons([])
    optionsFnButtons && optionsFnButtons.forEach(item => {
      if (isFunction(item.isShow)) {
        if (item.isShow()) {
          setTOptionsFnButtons(pre => ([
            ...pre,
            cloneDeep(item),
          ]))
        }
      } else if (item.isShow) {
        setTOptionsFnButtons(pre => ([
          ...pre,
          cloneDeep(item),
        ]))
      }
    })
  }, [optionsFnButtons])

  useEffect(() => {
    console.log("这里会执行吗")
    let __arr = columns ? cloneDeep(columns) : []
    // setTableColumns()
    __arr.forEach(item => {
      if (item.dataIndex === 'operation' || item.key === 'operation') {
        item.title = '操作';
        item.width = item.openOp && item.width ? item.width : '90px';
        item.align = item.openOp ? (item.align ? item.align : 'left') : 'center';
        // item.fixed = item.fixed;
        item.render= (text, record) => (
          item.renderList ?
            (
              item.openOp ?
                <span>
                  {
                    item.renderList.map((item2, index2) => (
                      showMenuItem(item2,record) !== 0 ?
                        <span 
                          style={{ color: '#1890ff', cursor: 'pointer', marginRight: '10px', lineHeight: '30px' }} 
                          key={index2} 
                          onClick={e => {
                            e.preventDefault();
                            if(item2.handleClick) item2.handleClick(text, record);
                          }}
                        >
                          {item2.title}
                        </span>
                        : null
                    ))
                  }
                </span> :
                <Dropdown
                  overlayClassName='common-table-op-dropdown'
                  menu={{
                    items: item.renderList.map((item2, index2) => (
                      showMenuItem(item2, record) !== 0 ?
                        {
                          key: index2,
                          label: (
                            <a>{item2.title}</a>
                          )
                        } : ''
                    )).filter(item2 => item2)
                  }}
                  placement='bottomLeft'
                >
                  <DownSquareOutlined className='common-table-op'/>
                </Dropdown>
            )
            : null
        )
      }
    })
    setTableColumns(cloneDeep(__arr))
  }, [columns])

  let scrollX = tableColumns.length >= 5 ? columnsWidth * tableColumns.length : false;

  const showMenuItem = (item2, record)=>{
    let showMenuItemCount = 0;
    if (isFunction(item2.isShow)) {
      if (item2.isShow(item2, record)) {
        ++showMenuItemCount;
      }
    } else if (item2.isShow) {
      ++showMenuItemCount;
    }
    return showMenuItemCount;
  };


  return (
    <div className='common-table'>
      <div className='common-table-header'>
        <div>
          {
            tOptionsFnButtons.map((item, index) => (
              <Button 
                onClick={() => {
                  if(item.handleFn) item.handleFn()
                }} 
                className='common-table-header-btn' 
                type={index === 0 ? 'primary' : 'default'} 
                key={index}
                style={index > 0 ? {marginLeft: '10px'} : {}}
              >
                {isFunction(item.title) ? item.title() : item.title}
              </Button>
            ))
          }
        </div>
        <div>
          {
            customTitleRender ? customTitleRender() : null
          }
          <span className='common-table-header-span'>
            总计&nbsp;
            <a className='common-table-header-total'>{pagination.total}</a>
            &nbsp;条&nbsp;&nbsp;
          </span>
        </div>
      </div>
      
      {/* scroll={{ x: scrollX }} */}
      <Table
        scroll={{x: scrollX}}
        columns={tableColumns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        size={size ? size : 'small'}
        rowKey={rowKey ? rowKey : 'id'}
      />
    </div>
  )
}

export default CommonTable