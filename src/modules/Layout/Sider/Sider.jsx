// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import util from '../../../utils/util';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { useAliveController } from 'react-activation'
// import './sider.less'


const Sider = (props) => {
  // items 的数据格式 { label, key, icon, children, type: 'group' }
  const { menuData, history, location } = props
  const [ selectedKeys, setSelectedKeys ] = useState([])
  const [ openKeys, setOpenKeys ] = useState([])
  const { refreshScope } = useAliveController()

  // 设置菜单的展开及选中状态
  useEffect(() => {
    menuData.map(item => {
      if (item.children && item.children.length > 0) {
        item.children.map(item2 => {
          if (item2.key === location.pathname) {
            setSelectedKeys([item2.key])
            setOpenKeys([item.key])
          }
        })
      } else if (item.key === location.pathname) {
        setSelectedKeys([item.key])
        setOpenKeys([item.key])
      }
    })
  }, [location.pathname, menuData])

  const onClick = (e) => {
    console.log('menuclick ', e);
    refreshScope(e.key)
    history.push(e.key)
  };

  const onOpenChange = (_openKeys) => {
    console.log("_openKeys", _openKeys)
    setOpenKeys([..._openKeys])
  }

  // const findMenuItem = (data, lastItemData) => {
  //   data.some(item => {
  //     if (item.children && item.children.length > 0) {
  //       findMenuItem(item.children, lastItemData)
  //     } else if (item.key === location.pathname) {
  //       setSelectedKeys([item.key])
  //       setOpenKeys([item.key])
  //     }
  //   })
  // }

  return (
    <Menu
      onClick={onClick}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      mode="inline"
      items={menuData}
      className="page-sider"
    />
  );
};

const mapStateToProps = state => ({
  menuData: state.commReducers.siderMenuData
});

export default withRouter(connect(mapStateToProps, null)(Sider));