import {SET_CART, REMOVE_ITEM_FROM_CART, SET_ORDER} from '../actions/actionTypes';

const initialState = {
	cart:null,
	order:null
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case SET_CART:
		return {
			...state,
			cart: action.payload
		}

		case REMOVE_ITEM_FROM_CART:
		return {
			...state,
			cart: {
				...state.cart,
				courses:state.cart.courses.filter(course => course._id !== action.payload)
			}
		}

		case SET_ORDER:
		return {
			...state,
			order: action.payload
		}

		default: 
		return state;
	}
}

export default reducer;