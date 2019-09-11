import { LOADER_SPINNER_ON, LOADER_SPINNER_OFF, ALERT_MESSAGE } from './actionTypes';


//Set Alert Message in store.
export const alertMessage = (message) => {
	return {
		type: ALERT_MESSAGE,
		payload: message
	}
}

//Turn on spinner loader.
export const spinnerLoaderOn = () => {
	return {
		type: LOADER_SPINNER_ON
	}
}

//Turn of spinner loader.
export const spinnerLoaderOff = () => {
	return {
		type: LOADER_SPINNER_OFF
	}
}