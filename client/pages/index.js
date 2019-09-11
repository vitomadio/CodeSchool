import React from 'react';
import Navbar from '../components/Navbar';
import Head from '../components/Head';
import Page from '../components/page';
import { withRouter } from 'next/router';
import Slider from '../components/Slider';
import { connect } from 'react-redux';
import { getCourses, addToCart, getCart } from '../store/actions';
import { MdSearch, MdLaptop, MdSchedule } from 'react-icons/md'
import { FaAward } from 'react-icons/fa';
import FooterWidget from '../components/FooterWidget';
import Footer from '../components/Footer';

class page extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			alertMessage: null,
			token: null,
			searchResults: []
		}
	}

	componentDidMount() {
		this.props.getCourses();

		const paramString = window.location.search;
		const searchParams = new URLSearchParams(paramString);
		const message = searchParams.get("message")
		this.setState(prevState => {
			return {
				...prevState,
				alertMessage: message,
			}
		})
		setTimeout(() => {
			this.setState(prevState => {
				return {
					...prevState,
					alertMessage: null
				}
			});
			if (!this.props.currentUser) {

			}
		}, 5000)
	}

	// Handles search box.
	onSearchCourses = (e) => {
		let searchResults = [];

		if (e.target.value !== "") {
			searchResults = this.props.courses.filter(course => {
				return course.title.toLowerCase().includes(e.target.value.toLowerCase());
			});
		}

		const results = searchResults.slice(0, 5);
		this.setState({
			searchResults: results
		});
	}

	//Add to cart handler
	addToCartHandler = (course, e) => {
		this.props.addToCart(course._id)
	}

	render() {
		const searchResults = this.state.searchResults.map((item, i) => {
			return (
				<li key={i} className="list-group-item "><p className="mb-0 text-secondary">{item.title}</p></li>
			)
		});
		const { alertMessage, token } = this.state;
		const { courses } = this.props

		return (
			<div style={{ position: 'relative', paddingBottom: '3em' }}>
				<Head />
				<Navbar />
				<style>
					{
						`
							.header-wrapper{
								background:url("/static/images/home-BG.jpg") center center no-repeat;
								background-size: cover;
								height:40vh;
							}
							@media (max-width:599px) {
								.header-wrapper{
									height:100vh;
								}
							}
	        			`
					}
				</style>
				{this.props.alert || alertMessage ?
					<div style={{ position: 'absolute', zIndex: 998, width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)' }}>
						<div style={styles.alert}>
							<h3 className="text-center text-white mb-0">{this.props.alert || alertMessage}</h3>
						</div>
					</div>
					: null}
				<div className="header-wrapper">
					<div className="container" style={{ height: '100%', maxWidth: 1920 }}>
						<div className="row align-items-center justify-content-start" style={{ height: '100%' }}>
							<div className="col-12 col-md-8 col-lg-6">
								<div className="row justify-content-center justify-content-md-around">
									<div className="col-10 col-xl-8">
										<h1 className="text-white mb-3" style={styles.title}>Discover our new courses</h1>
										<h5 className="text-white mb-4"
											style={styles.subTitle}>Increase your experience and get more job
											opportunities with our courses starting from $9.99.
										</h5>
										<div className="input-group mt-3" style={styles.imputSearch}>
											<input type="text" className="form-control form-control-lg text-secondary" placeholder="What do you want to learn?"
												onChange={this.onSearchCourses.bind(this)}
											/>
											<div className="input-group-append">
												<div className="btn btn-danger"><MdSearch size="35" color="#fff" /></div>
											</div>
											<ul className="list-group" style={styles.searchDropDown}>
												{searchResults}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="container-fluid" style={{ background: '#2C374E' }}>
					<div className="container" style={styles.containerFeatures}>
						<div className="row align-items-center justify-content-center">
							<div className="col-12 col-md-10">
								<div className="row justify-content-center">
									<div className="col-12 col-md-4 mt-1 mt-md-0" >
										<div className="row align-items-center justify-content-center">
											<div className="col-auto"><MdLaptop color="#fff" size={80} /></div>
											<div className="col-12 col-md-8">
												<h5 className="text-white font-weight-normal mb-0 text-center text-md-left">Hundreds of courses to choose</h5>
												<p style={styles.paragraph} className="text-center text-md-left">Look for the course you want and start right away.</p>
											</div>
										</div>
									</div>
									<div className="col-12 col-md-4 mt-2 mt-md-0">
										<div className="row align-items-center justify-content-center">
											<div className="col-auto"><MdSchedule color="#fff" size={80} /></div>
											<div className="col-12 col-md-8">
												<h5 className="text-white font-weight-normal mb-0 text-center text-md-left">Manage your time to learn</h5>
												<p style={styles.paragraph} className="text-center text-md-left">Lifetime access that allows you to schedule your time as you want.</p>
											</div>
										</div>
									</div>
									<div className="col-12 col-md-4 mt-2 mt-md-0">
										<div className="row align-items-center justify-content-center">
											<div className="col-auto"><FaAward color="#fff" size={80} /></div>
											<div className="col-12 col-md-8">
												<h5 className="text-white font-weight-normal mb-0 text-center text-md-left">Get certified</h5>
												<p style={styles.paragraph} className="text-center text-md-left">At the end of each course you'll got a certification.</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*Courses carousel*/}
				<Slider
					courseList={courses}
					onAddToCartHandler={(course) => this.addToCartHandler.bind(this, course)}
				/>
				{/*Testimonials*/}

				<div class="container-fluid bg-light" style={{ border: '1px solid #ddd' }} >
					<div className="container" style={{ maxWidth: 1920 }}>
						<div className="row justify-content-center py-3 py-md-5">
							<div className="col-12 col-md-12 col-lg-10 col-xl-9">
								<div className="row pl-5"><h3 className="text-secondary font-weight-light mb-4">What people say about us</h3></div>
								<div className="row">
									<div className="col-12 col-md-4 mt-3 mt-lg-0">
										<div className="card bg-white shadow  border-white py-5 px-3 px-lg-5">
											<div className="ml-auto mr-auto mb-3 shadow-sm" style={{ ...{ background: 'url("/static/images/profile-1.jpg")', ...styles.profileImg } }}></div>
											<h5 className="text-center text-dark font-weight-normal">Stephany Jacobson</h5>
											<p className="text-center text-dark font-weight-light">Thank you Udemy! You've renewed my passion for learning and my dream of becoming a web developer.</p>
										</div>
									</div>
									<div className="col-12 col-md-4 mt-3 mt-lg-0">
										<div className="card bg-white shadow  border-white py-5 px-3 px-lg-5" style={{ height: '100%' }}>
											<div className="ml-auto mr-auto mb-3 shadow-sm" style={{ ...{ background: 'url("/static/images/profile2.jpg")', ...styles.profileImg } }}></div>
											<h5 className="text-center text-dark font-weight-normal">Jhon Doe</h5>
											<p className="text-center text-dark font-weight-light">Thank you Udemy! You've renewed my passion for learning and my dream of becoming a web developer.</p>
										</div>
									</div>
									<div className="col-12 col-md-4 mt-3 mt-lg-0">
										<div className="card bg-white shadow  border-white py-5 px-3 px-lg-5" style={{ height: '100%' }}>
											<div className="ml-auto mr-auto mb-3 shadow-sm" style={{ ...{ background: 'url("/static/images/avatar3.jpg")', ...styles.profileImg } }}></div>
											<h5 className="text-center text-dark font-weight-normal">Jane Doe</h5>
											<p className="text-center text-dark font-weight-light">Thank you Udemy! You've renewed my passion for learning and my dream of becoming a web developer.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/*Footer widget*/}
				<FooterWidget />
				{/*Footer*/}
				<Footer />
			</div>
		)
	}
}

const styles = {
	title: {
		fontWeight: '300',
		textShadow: '3px 3px 5px #111'
	},
	subTitle: {
		fontWeight: '200',
		textShadow: '3px 3px 5px #000'
	},
	imputSearch: {
		boxShadow: '3px 3px 5px rgba(0,0,0,.4)',
		fontSize: '12px !important'
	},
	containerFeatures: {
		padding: '1em',
		width: '100%',
		maxWidth: 1920,

	},
	paragraph: {
		fontSize: '.85em',
		lineHeight: '1.3em',
		color: 'white',
		fontWeight: 200
	},
	carouselContainer: {
		paddingTop: '4em',
		paddingBottom: '4em'
	},
	profileImg: {
		height: 100,
		width: 100,
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		position: 'relative',
		borderRadius: 50
	},
	alert: {
		position: 'absolute',
		zIndex: 999,
		left: '50%',
		marginLeft: -300,
		width: 600,
		marginTop: '30%',
		padding: '1em',
		background: '#19B079',
		borderRadius: 10
	},
	searchDropDown: {
		position: 'absolute',
		width: '100%',
		background: '#fff',
		boxShadow: '0px 4px 5px rgba(0,0,0,0.6)',
		top: '103%',
		zIndex: 999
	}

}


const mapStateToProps = state => {
	return {
		alert: state.ui.alertMessage,
		currentUser: state.user.currentUser,
		courses: state.course.courses
	}
}

const mapDispatchToProps = dispatch => {
	return {

		getCart: () => dispatch(getCart()),
		getCourses: () => dispatch(getCourses()),
		addToCart: (courseId) => dispatch(addToCart(courseId))
	}
}


export default withRouter(Page(connect(mapStateToProps, mapDispatchToProps)(page)));
