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
} from '../actions/actionTypes';

const initialState = {
	featureUrl:"",
	videos:[],
	courses:[],
	categories:[],
	impartedCourses:[],
	currentCourse:null,
	purchasedCourses:null
}

const reducer = (state = initialState, action) => {
	switch(action.type) {
		case FEATURE_URL_SET: 
		return {
			...state,
			featureUrl: action.payload
		}

		case VIDEOS_SET:
		return {
			...state,
			currentCourse: {
				...state.currentCourse,
				videos:action.payload
			}
		}

		case SET_COURSES: 
		return {
			...state,
			courses:action.payload
		}

		case SET_COURSE: 
		return {
			...state,
			currentCourse:action.payload
		}

		case SET_NEW_COURSE: 
		return {
			...state,
			impartedCourses:[...state.impartedCourses, ...action.payload]
		}

		case SET_PURCHASED_COURSES:
		return {
			...state,
			purchasedCourses:action.payload
		}

		case SET_IMPARTED_COURSES: 
		return {
			...state,
			impartedCourses:action.payload
		}

		case SET_CATEGORIES:
		return {
			...state,
			categories:action.payload
		}

		case REMOVE_COURSE: 
		return {
			...state,
			impartedCourses:state.impartedCourses.filter(course => course._id !== action.payload)
		}

		case REMOVE_VIDEO:
		return {
			...state,
			currentCourse:{
				...state.currentCourse,
				videos:state.currentCourse.videos.filter(video => video.videoUrl !== action.payload)
			}
		}

		default: 
		return state;
	}
}

export default reducer;