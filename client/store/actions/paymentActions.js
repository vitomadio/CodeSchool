import axios from 'axios';
import { ALERT_MESSAGE } from './actionTypes';
import { spinnerLoaderOn, spinnerLoaderOff, alertMessage, addPurchasedCourses } from '../actions';
import Router from 'next/router';
import configs from '../../env_config';

const apiUrl = configs.api+"checkout/";

// Pay with credit card 
export const payWithCard = (body) => {
	return dispatch => {
		dispatch(spinnerLoaderOn());
		const token = localStorage.getItem('token');
		return axios({
			method: "post", 
			url:apiUrl+"tdc",
			data:body,
			headers:{
				'Content-Type':'application/json'
			}
		})
		.then(({data}) => {
			if(data.state === "approved"){
				dispatch(alertMessage(data.message));
				dispatch(addPurchasedCourses());
				setTimeout(() => {
					dispatch(alertMessage(null));
				},3000);
				dispatch(spinnerLoaderOff());
			}else{
				dispatch(alertMessage("Your payment couldn't be proccessed, please try again."));
				setTimeout(() => {
					dispatch(alertMessage(null));
				},3000);
			}
		})
		.catch(err => console.log(err));
	}
}

//Pay with paypal.
export const paypalPayment = (total, order) => {
	return dispatch => {
		dispatch(spinnerLoaderOn());
		const token = localStorage.getItem('token');
		axios({
			method:"post",
			url:apiUrl,
			data:{
				total:total,
				order:order
			},
			headers:{
				'Content-Type':'application/json',
				Authorization:token
			}
		})
		.then(({data}) => {
			location.replace(data.url);
		})
		.catch(err => console.log(err));
	}
}

// Execute some actions if payment was success after paypal payment.
export const successPayment = (query) => {
	return dispatch => {
		axios({
			method:"get",
			url: apiUrl+"success?"+query
		})
		.then(({data}) => {
			if(data.state === "approved"){
				dispatch(alertMessage(data.transactions[0].description));
				dispatch(addPurchasedCourses());
				setTimeout(() => {
					Router.push('/');
					dispatch(alertMessage(null));
				},3000);
			}
			else{
				dispatch(alertMessage(data.message));
				setTimeout(() => {
					
					dispatch(alertMessage(null));
				},3000);
			}
		})
		.catch(err => console.log(err));
	}
}



