import { SET_CURRENT_USER, SET_NEW_AVATAR } from '../actions/actionTypes';

const initialState = {
	currentUser: null
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case SET_CURRENT_USER:
		return {
			...state,
			currentUser: action.payload
		}
		case SET_NEW_AVATAR: 
		return {
			...state,
			currentUser:{
				...state.currentUser,
				avatarUrl:action.payload
			}
		}
		default: 
		return state;
	}
}

export default reducer;