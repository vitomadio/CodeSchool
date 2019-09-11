import { 
	FEATURE_URL_SET, 
	VIDEOS_SET, 
	SET_COURSES, 
	SET_CATEGORIES,
	SET_IMPARTED_COURSES,
	SET_COURSE,
	REMOVE_COURSE,
	REMOVE_VIDEO,
	SET_PURCHASED_COURSES,
	SET_NEW_COURSE
} from './actionTypes';
import axios from 'axios';
import {alertMessage, spinnerLoaderOn, spinnerLoaderOff} from '../actions';
import configs from '../../env_config';

const apiUrl = configs.api+"course/";

//Get all courses.
export const getCourses = () => {
	return dispatch => {
		axios({
			method:'get',
			url: apiUrl
		})
		.then(({data}) => {
			const courses = [];
			for (const course of data.courses){
				courses.push(course)
			}
			dispatch(setCourses(courses));
		})
		.catch(err => {
			console.log(err);
		});
	};
};

//Get Course 
export const getCourse = (courseId) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		return axios({
			method:'post',
			url:apiUrl+"course",
			data:{courseId},
			headers:{
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(setCourse(data.course))
		})
		.catch(err => console.log(err));
	};
};

//Get purchased courses.
export const getPurchasedCourses = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:'get',
			url:apiUrl+'my-courses',
			headers:{
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(setPurchasedCourses(data.courses));
		})
		.catch(err => {
			console.log(err);
		})
	};
};

//Set courses to store.
const setCourses = (courses) => {
	return {
		type:SET_COURSES,
		payload: courses
	};
};

//Set purchased Courses to store.
const setPurchasedCourses = (courses) => {
	return {
		type:SET_PURCHASED_COURSES,
		payload:courses
	}
}

//Set current course in store.
export const setCourse = (course) => {
	return {
		type: SET_COURSE,
		payload: course
	};
};

//Get all courses categories.
export const getCategories = () => {
	return dispatch => {
		axios({
			method:'get',
			url:apiUrl+"categories",
		})
		.then(({data}) => {
			dispatch(setCategories(data.categories));
		})
		.catch(err => console.log(err));
	};
};

//Set Categories
const setCategories = (categories) => {
	return {
		type: SET_CATEGORIES,
		payload: categories
	};
};

//Get imparted courses of current user
export const getImpartedCourses = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		return axios({
			method:'get',
			url: apiUrl+"imparted-courses",
			headers: {
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(setImpartedCourses(data.courses));
		})
		.catch(err => console.log(err));
	};
};

//Set imparted courses in store.
const setImpartedCourses = (courses) => {
	return {
		type: SET_IMPARTED_COURSES,
		payload: courses
	};
};

//Upload Feature Image.
export const uploadFeature = (file, config, body) => {
	return dispatch => {
		axios({
			method:'post',
			url:apiUrl+'upload-course',
			data:file,
			headers: {
				'Content-Type':'multipart/form-data'
			}
		})
		.then(({data}) => {
			body['featureUrl'] = data.featureUrl;
			dispatch(uploadCourse(body));

		})
		.catch(err => {
			console.log(err);
		});
	};
};

//Upload multiple videos.
export const uploadVideos = (formData) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		return axios({
			method:'post',
			url:apiUrl+'upload-videos',
			data:formData,
			headers: {
				'Content-Type':'multipart/form-data',
				'Authorization':token
			}
		})
		.then(({data}) => {
			dispatch(setNewVideo(data.course.videos));
		})
		.catch(err => {
			console.log(err);
		});
	};
};

//Upload single video.
export const uploadVideo = (formData) => {
	return dispatch => {
		dispatch(spinnerLoaderOn());
		const token = localStorage.getItem('token');
		return axios({
			method:'post',
			url:apiUrl+'upload-video',
			data:formData,
			headers: {
				'Content-Type':'multipart/form-data',
				'Authorization':token
			}
		})
		.then(({data}) => {
			dispatch(setNewVideo(data.course.videos));
			dispatch(spinnerLoaderOff());
		})
		.catch(err => {
			console.log(err)
		});
	};
};

//Set videos to store. 
const setNewVideo = (videos) => {
	return {
		type:VIDEOS_SET,
		payload:videos
	};
};

//Upload course.
export const uploadCourse = (formData) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:'post',
			url:apiUrl+'upload-course',
			data:formData,
			headers: {
				'Content-Type':'multipart/form-data',
				'Authorization':token
			}
		})
		.then(({data}) => {
			dispatch(alertMessage(data.message));
			setTimeout(() =>{
				dispatch(alertMessage(null))
			},3000);
			dispatch(setNewCourse([data.course]));
			dispatch(setCourse(data.course));
		})
		.catch(err => {
			console.log(err)
		});
	};
};

// Set new course to store.
const setNewCourse = (course) => {
	return {
		type: SET_NEW_COURSE,
		payload: course
	}
}

// Save course changes 
export const saveCourseChanges = (formData) => {
	return dispatch =>{
		const token = localStorage.getItem('token');
		axios({
			method: "post",
			url:apiUrl+"edit-course",
			data:formData,
			headers: {
				'Content-Type':'multipart/form-data',
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(alertMessage(data.message))
			setTimeout(() =>{
				dispatch(alertMessage(null))
			},3000);
		})
		.catch((err) => console.log(err));
	};
};

// Remove uploaded video. 
export const removeUploadedVideo = (videoUrl, idx, courseId) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method: "post",
			url:apiUrl+"remove-video", 
			data:{
				videoUrl,idx,courseId
			},
			headers:{
				'Content-Type':'application/json',
				Authorization:token
			}
		})
		.then(({data}) => {
			dispatch(removeVideoFromStore(videoUrl));
		})
		.catch((err) => console.log(err));
	};
};

// Remove video from store.
const removeVideoFromStore = (videoUrl) => {
	return{
		type:REMOVE_VIDEO,
		payload: videoUrl
	}
}


//  Delete course.
export const deleteCourse = (courseId) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:"post",
			url:apiUrl+"delete",
			data:{courseId: courseId},
			headers:{
				'Content-Type':'application/json',
				'Authorization':token
			}
		})
		.then(({data}) => {
			dispatch(alertMessage(data.message));
			setTimeout(() =>{
				dispatch(alertMessage(null));
			},3000);
			dispatch(removeCourseFromStore(courseId));
		})
		.catch(err => console.log(err));
	};
};

// Remove course from reducer.
const removeCourseFromStore = (courseId) => {
	return {
		type: REMOVE_COURSE,
		payload: courseId
	};
};

// Play Video.
export const playVideo = (videoPath) => {
	return dispatch => {
		const token = localStorage.getItem('token');
		axios({
			method:"get",
			url:apiUrl+"video",
			headers: {
				Authorization: token,
				'Content-Type':'video/mp4'
			}
		})
		.then(res => {
			console.log(res)
		})
		.catch(err => console.log(err));
	};
};










