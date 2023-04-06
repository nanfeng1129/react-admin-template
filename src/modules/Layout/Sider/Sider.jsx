import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
import util from '../../../utils/util';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import './sider.less'


const Sider = (props) => {
  // items 的数据格式 { label, key, icon, children, type: 'group' }
  const { menuData, history } = props
  const [ selectedKeys, setSelectedKeys ] = useState([])
  const [ openKeys, setOpenKeys ] = useState([])

  const onClick = (e) => {
    console.log('menuclick ', e);
    history.push(e.key)
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
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