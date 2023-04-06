//2、引入redux和引入reducer
import {createStore, applyMiddleware, compose} from 'redux';
//import reducer from './reducers';
import rootReducer from './combineReducers';
import thunk from 'redux-thunk';

//3、创建store

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = null;

if(process.env.NODE_ENV === 'development'){
    store = createStore(rootReducer, composeEnhancers(
        applyMiddleware(thunk)
    ));
}else{
    store = createStore(rootReducer, applyMiddleware(thunk))
}

export default store;