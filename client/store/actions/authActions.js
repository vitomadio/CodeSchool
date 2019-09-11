import axios from 'axios';
import Router from 'next/router';
import { 
	alertMessage, 
	getSessionUser, 
	setCurrentUser, 
	setAuthToken, 
	getCart, 
	getPurchasedCourses 
} from '../actions';
import configs from '../../env_config';

const apiUrl = configs.api+"auth";

// Authenticate user.
export const authenticateUser = (authMode, credentials) => {
	return dispatch => {
		const {username, email, password} = credentials;
		if(authMode === "signup"){
			return axios({
				method:'post',
				url:apiUrl+"/signup", 
				data:{
					username:username,
					email:email,
					password:password
				}
			})
			.then(({data}) => {
				dispatch(alertMessage(data.message))
				setTimeout(() => {
					dispatch(alertMessage(null))
				},5000)
			})
			.catch(err => {
				console.log(err)
			});
		}
		axios({
			method:'post',
			url:apiUrl+'/signin',
			data:{
				email: email,
				password:password
			}
		})
		.then(({data}) => {
			localStorage.setItem('token', data.token)
			setAuthToken(data.token);//set token as Authorization header on Axios requests
			dispatch(getSessionUser(data.token));
			dispatch(getCart());
			dispatch(getPurchasedCourses());
		})
		.catch(err => {
			console.log(err)
		});
	};
};


//Logout user
export const logoutUser = () => {
	return dispatch => {
		localStorage.clear();
		setAuthToken(false);
		dispatch(setCurrentUser(null));
		Router.push('/')

	};
};





