import { ALERT_MESSAGE, LOADER_SPINNER_ON, LOADER_SPINNER_OFF } from '../actions/actionTypes';

const initialState = {
	alertMessage:null,
	loaderSpinner:false,
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case ALERT_MESSAGE:
		return {
			...state,
			alertMessage: action.payload
		}

		case LOADER_SPINNER_ON: 
		return {
			...state,
			loaderSpinner:true
		}

		case LOADER_SPINNER_OFF: 
		return {
			...state,
			loaderSpinner:false
		}

		default: 
		return state;
	}
}

export default reducer;