import {
	SET_CART, 
	REMOVE_ITEM_FROM_CART,
	SET_ORDER
		} from './actionTypes';
import axios from 'axios';
import configs from '../../env_config';
import { alertMessage } from '../actions';

const apiUrl = configs.api+"cart/";

//Get session's user cart
export const getCart = () => {
	return dispatch => {
		const token = localStorage.getItem('token')
		axios({
			method: 'get',
			url: apiUrl,
			headers: {
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(setCart(data.cart));
		})
		.catch(err => console.log(err))
	}
}

//Set Cart
const setCart = (cart) => {
	return {
		type:SET_CART,
		payload:cart
	}
}

//Add course to cart
export const addToCart = (courseId) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:'post',
			url:apiUrl+"add-to-cart",
			data: {
				courseId:courseId
			},
			headers:{
				'Content-Type':'application/json',
				Authorization: token
			}
		})
		.then(({data})=> {
			dispatch(setCart(data.cart))
			dispatch(alertMessage(data.message));
			setTimeout(() => {
				dispatch(alertMessage(null));
			},2500);
		})
		.catch(err => console.log(err));
	}
}

//Remove course from shopping cart
export const removeFromCart = (courseId) => {
	return dispatch => {
		axios({
			method:'put',
			url:apiUrl+"remove-item",
			data:{
				courseId:courseId
			},
			headers:{
				'Content-Type':'application/json',
				Authorization: localStorage.getItem('token')
			}
		})
		.then(({data}) => {
			dispatch(removeCourseFromStore(courseId))
		})
		.catch(err => console.log(err))
	}
}

//Remove course from cart in Store.
const removeCourseFromStore = (courseId) => {
	return {
		type:REMOVE_ITEM_FROM_CART,
		payload:courseId
	}
}

//Get order.
export const getOrder = () => {
	return dispatch =>{
		const token = localStorage.getItem('token');
		axios({
			method:'get',
			url: apiUrl+"get-order",
			headers: {
				Authorization: token
			}
		})
		.then(({data}) => {
			dispatch(setOrder(data.cart))
		})
		.catch(err => console.log(err));
	}
}

//Create order.
export const createOrder = (cart) => {
	return dispatch => {
		axios({
			method: "post",
			url:apiUrl+"create-order",
			data:{cart},
			headers: {
				'Content-Type':'application/json',
				Authorization: localStorage.getItem('token')
			}
		})
		.then(({data}) => {
			dispatch(setOrder(cart));
		})
		.catch((err) => console.log(err));
	}
}


//Set oreder in store
const setOrder = (order) => {
	return {
		type: SET_ORDER,
		payload: order
	}
}

//Remove order from DB.
export const removeOrder = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:"get",
			url:apiUrl+"remove-order",
			headers:{
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(setOrder(null));
		})
		.catch(err => console.log(err));
	}
}

export const removeCart = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:"get",
			url:apiUrl+"delete-cart",
			headers: {
				Authorization:token
			}
		})
		.then(({data}) => {
			console.log(data.message)
		})
		.catch(err => console.log(err));

	}
}







