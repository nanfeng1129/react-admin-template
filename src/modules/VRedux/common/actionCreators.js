import { SET_LOADING, SET_TABS, SET_SIDER_MENU } from "./actionTypes";

// 控制loading
export const setLoading = value => ({ type:SET_LOADING, value });
// 控制标签页数据
export const setTabs = value => ({ type:SET_TABS, value });
// 侧边栏菜单数据
export const setSiderMenu = value => ({ type:SET_SIDER_MENU, value });