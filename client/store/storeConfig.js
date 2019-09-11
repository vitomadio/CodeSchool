import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import uiReducer from './reducers/uiReducer';
import userReducer from './reducers/userReducer';
import courseReducer from './reducers/courseReducer';
import cartReducer from './reducers/cartReducer';

const reducers = combineReducers({
	auth: authReducer,
	ui: uiReducer,
	user: userReducer,
	course: courseReducer,
	cart: cartReducer
});

const configureStore = () => {
	return createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
};

export default configureStore;

