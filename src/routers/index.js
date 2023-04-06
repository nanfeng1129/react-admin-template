import { lazy } from 'react';


// export const routes = [
//   {path: "/", name: "admin", component: Layout, auth: true},
//   {path: "/login", name: "Login", component: Login},
// ]


export const routes = [
  { key: '/', label: '首页', component: lazy(() => import('@m/HomePage/Home')) },
  { key: '/a/b', label: '收款方管理', component: lazy(() => import('@m/MemberMgmt/PayeeMgmt/Index')) },
  { key: '/a/c', label: '付款方管理', component: lazy(() => import('@m/MemberMgmt/PayerMgmt/Index')) }
]

// isshow 属性控制一级菜单的显隐
export const menuData = [
  { key: '/', label: '首页', },
  { 
    key: '/a', label: '会员管理',
    children: [
      { key: '/a/b', label: '收款方管理' },
      { key: '/a/c', label: '分账方管理' },
      // { key: '/a/d', label: '付款方管理' },
      // { key: '/a/e', label: '终端管理' },
      // { key: '/a/f', label: '码牌管理' },
    ]
  },
  { key: '/b', label: '收款管理', },
  { key: '/c', label: '账务管理', },
  { key: '/d', label: '员工管理',  },
]
