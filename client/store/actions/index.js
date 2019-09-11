export {
	authenticateUser,
	logoutUser
} from './authActions';

export {
	getSessionUser,
	setCurrentUser,
	uploadAvatarPicture,
	becomeTeacher,
	saveProfileChanges,
	addPurchasedCourses
} from './userActions';

export {
	setAuthToken
} from './authTokenActions';

export {
	getCourses,
	uploadVideo,
	uploadCourse,
	getCategories,
	uploadVideos,
	getImpartedCourses,
	setCourse,
	deleteCourse,
	saveCourseChanges,
	removeUploadedVideo,
	getPurchasedCourses,
	getCourse,
	playVideo
	} from './courseActions';

export {
	addToCart,
	getCart,
	removeFromCart,
	createOrder,
	getOrder,
	removeOrder,
	removeCart
} from './cartActions';

export {
	payWithCard,
	paypalPayment,
	successPayment
} from './paymentActions';

export {
	alertMessage,
	spinnerLoaderOn,
	spinnerLoaderOff
} from './uiActions';
