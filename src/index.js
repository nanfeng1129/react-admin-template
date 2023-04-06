import React from 'react';
import ReactDOM from 'react-dom';
// import '@babel/polyfill';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import store from './modules/VRedux/store';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.suppressDeprecationWarnings = true;
moment('zh-cn');

// const saveState = (state) => {
//     try {
//         if (localStorage.getItem('authorization')){
//             const serializedState = JSON.stringify(state);
//             sessionStorage.setItem('persist:state', serializedState);
//         } else{
//             localStorage.setItem('authorization', "");
//             sessionStorage.clear();
//         }
//     } catch (err) {
//         // ...错误处理
//     }
// };
// store.subscribe(() => {
//     const state = store.getState();
//     saveState(state);
// });

const app = (
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <App></App>
        </ConfigProvider>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

