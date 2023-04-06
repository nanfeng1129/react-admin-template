import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Tabs, Button } from "antd";
import util from "@/utils/util";
import { routes } from "../../../routers";
import { setSiderMenu } from "@m/VRedux/common/actionCreators";
import { CloseOutlined } from '@ant-design/icons'
const HeaderMenu = (props) => {

  const { history, setSiderMenu, location } = props
  const [ activeKey, setActiveKey ] = useState('1');
  const [ items, setItems ] = useState([
    {
      label: '首页',
      // children: 'Content of Tab 1',
      key: '/',
      path: '/'
    }
  ]);
  // const getItem = util.getItem;

  // activeKey 统一走这里
  useEffect(() => {
    console.log("history", history)
    if (!checkInTabs(location.pathname)) {
      routes.some(item => {
        if (item.key === location.pathname) {
          setItems(pre => ([
            ...pre, 
            {
              key: item.key,
              label: item.label,
              path: location.pathname + location.search
            }
          ]))
          return true
        } else {
          return false
        }
      })
    } else {
      changeTabData(location.pathname, location.pathname + location.search)
    }
    setActiveKey(location.pathname)
  }, [location.pathname])

  const remove = (e, targetKey) => {
    e.stopPropagation()
    let newActiveKey = activeKey;
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      newActiveKey = newPanes[newPanes.length - 1].key
      history.push(newPanes[newPanes.length - 1].path)
    }
    setItems(newPanes);
  };

  const tabBtnClick = (itemData) => {
    if (itemData.key !== location.pathname) {
      // 这里要改成path
      history.push(itemData.path)
    }
  }

  const checkInTabs = (key) => {
    let isSetTabs = false
    items.map(item => {
      if (item.key === key) {
        isSetTabs = true
      }
    })
    return isSetTabs
  }

  const changeTabData = (key, path) => {
    let arr = []
    items.map((item, index) => {
      if (item.key === key) {
        arr[index] = { ...item }
        arr[index].path = path
      } else {
        arr[index] = { ...item }
      }
    })
    setItems([...arr])
  }

  return (
    <div
      className="page-header-tabs"
    >
      {
        items.map((item, index) => (
          <Button
            tab-isactive={activeKey === item.key ? 'true' : 'false'}
            key={item.key} 
            style={index > 0 ? { marginLeft: '10px', borderRadius: '6px' } : {borderRadius: '6px'}}
            onClick={() => tabBtnClick(item)}
          >
            <div className="header-tab-btn">
              <div className="header-tab-btn-text">{ item.label }</div>
              <div className="header-tab-btn-close"><CloseOutlined onClick={(e) => remove(e, item.key)}/></div>
            </div>
          </Button>
        ))
      }
    </div>
    // <Tabs 
    //   type="editable-card"
    //   onChange={onChange}
    //   activeKey={activeKey}
    //   onEdit={onEdit}
    //   items={items}
    //   hideAdd
    //   className="page-header-tabs"
    // />
  )
}

const mapDispatchToProps = dispatch => ({
  setSiderMenu: (data) => dispatch(setSiderMenu(data))
});

export default withRouter(connect(null, mapDispatchToProps)(HeaderMenu))