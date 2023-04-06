import React from "react";
import { DownOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd'
import { withRouter } from "react-router";
import { connect } from "react-redux";

const PageAvatar = () => {

  const logout = () => {
    console.log("这里是退出登录")
  }

  const items = [
    { 
      key: '1',
      label: (
        <a href="#" onClick={e => { e.preventDefault(); logout() }}>
          退出登录
        </a>
      )
    }
  ]

  const userName = ''

  return (
    <Dropdown menu={{ items }}>
      <Space style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%' }}>
        <Avatar src={require('@/assets/images/boy.png')} />
        <div>{ userName || 'tyamin' }</div>
        <DownOutlined style={{ fontSize: '12px' }}/>
      </Space>
    </Dropdown>
  )
}


export default withRouter(connect(null, null)(PageAvatar))