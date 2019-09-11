import axios from 'axios';
import { SET_CURRENT_USER, SET_NEW_AVATAR} from './actionTypes';
import { setAuthToken } from './authTokenActions';
import { alertMessage, removeCart, removeOrder, getPurchasedCourses } from '../actions';
import configs from '../../env_config';

const apiUrl = configs.api+'user';

//Gets current user session.
export const getSessionUser = () => {
	return dispatch => {
		return axios({
			url: apiUrl+'/',
			method:'get',
			headers: {
				Authorization:localStorage.getItem('token')
			}
		})
		.then(({data}) => {
			dispatch(setCurrentUser(data.user));
			dispatch(getPurchasedCourses());
			return data
		})
		.catch(err => {
			return err
		})
	};
};

//Sets current user to store.
export const setCurrentUser = (user) => {
	return {
		type: SET_CURRENT_USER,
		payload: user
	};
};

//Uploads avatar image.
export const uploadAvatarPicture = (formData) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:'post',
			url:apiUrl+'/upload-file',
			data:formData,
			headers: {
				'Content-Type':'multipart/form-data',
				'Authorization':token
			}
		})
		.then(({data}) => {
			dispatch(setNewAvatarToStore(data.avatarUrl))
		})
		.catch(err => {
			console.log(err)
		});
	};
};

//Adds avatar to store.
export const setNewAvatarToStore = (avatarUrl) => {
	return {
		type:SET_NEW_AVATAR,
		payload:avatarUrl
	}
};

//Become Teacher function.
export const becomeTeacher = (name, lastName, summary) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:'post',
			url:apiUrl+'/become-teacher',
			data:{
				name:name,
				lastName:lastName,
				summary:summary
			},
			headers: {
				'Content-Type':'application/json',
				'Authorization':token
			}
		})
		.then(({data}) => {
			dispatch(setCurrentUser(data.user))
			console.log(data.user)
		})
		.catch(err => {
			console.log(err);
		});
	};
};

//Save user profile changes.
export const saveProfileChanges = (body) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		return axios({
			method:'post',
			url:apiUrl+'/edit-profile',
			data:body,
			headers:{
				'Content-Type':'application/json',
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(setCurrentUser(data.user));
			dispatch(alertMessage(data.message));
			setTimeout(() => {
				dispatch(alertMessage(null))
			},3000)
		})
		.catch(err => console.log(err))
	};
};

export const addPurchasedCourses = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:"get",
			url:apiUrl+"/add-purchased-course",
			headers:{
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(removeCart());
			console.log(data.message)
		})
		.catch(err => console.log(err));
	}
}



