import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Menu } from "antd";
import util from "@/utils/util";
import { menuData } from "../../../routers";
import { setSiderMenu } from "@m/VRedux/common/actionCreators";
const HeaderMenu = (props) => {

  const { history, setSiderMenu, location } = props
  // const getItem = util.getItem;

  useEffect(() => {
    // routes.map(item => {
    //   setMenuItems(pre => ([
    //     ...pre,
    //     {
    //       ...item,
    //       children: undefined
    //     }
    //   ]))
    // })
    // onClick({...routes[0]})
  }, [])

  useEffect(() => {
    let arr = location.pathname.split('/')
    setCurrent(`/${arr[1]}`)
    setSiderMenu(menuChildrenData[`/${arr[1]}`])
  }, [location.pathname])

  const [ current, setCurrent ] = useState('')
  const menuItems = []
  const menuChildrenData = {}
  menuData.map(item => {
    menuItems.push({...item, children: undefined})
    if (item.children) {
      menuChildrenData[item.key] = [
        {
          ...item,
          children: util.deepClone(item.children),
          type: 'group'
        }
      ]
    } else {
      menuChildrenData[item.key] = []
    }
  })
  const onClick = (e) => {
    console.log("onClick", e, menuChildrenData);
    console.log("history", history)
    setCurrent(e.key)
    history.push(e.key)
    setSiderMenu(menuChildrenData[e.key])
  }

  return (
    <Menu 
      onClick={(obj) => onClick(obj)} 
      selectedKeys={[current]} 
      mode="horizontal" 
      items={menuItems} 
      className="page-header-menu"
    />
  )
}

const mapDispatchToProps = dispatch => ({
  setSiderMenu: (data) => dispatch(setSiderMenu(data))
});

export default withRouter(connect(null, mapDispatchToProps)(HeaderMenu))