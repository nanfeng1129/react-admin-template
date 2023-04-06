import { combineReducers } from 'redux';
import commReducers from './common/reducers';
const rootReducers = combineReducers({
    commReducers,
});

export default rootReducers;
