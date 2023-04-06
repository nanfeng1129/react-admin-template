import { SET_LOADING, SET_TABS, SET_SIDER_MENU } from "./actionTypes";
import { menuData } from '@/routers'
const defaultState = {
  loading: 0,
  tabsData: [],
  siderMenuData: [...menuData]
};

/**
 * reducer负责存储整个项目中的数据
 */

//1、导出reducer  这里的state，对应的是所有的数据
//同样reducer可以接受一个state,但是不能直接修改，需要自己copy一份出来。
export default function reducers(state = defaultState, action = {}){
  let newState = JSON.parse(JSON.stringify(state));//深copy   state里的数据
  switch (action.type) {
    case SET_LOADING:
      newState.loading = action.value;
      break;
    case SET_TABS:
      newState.tabsData = action.value;
      break;
    case SET_SIDER_MENU:
      newState.siderMenuData = action.value;
      break;
    default:
      break;
  }
  return newState;
}
