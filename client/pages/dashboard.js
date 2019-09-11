import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getImpartedCourses, getSessionUser, setCourse, deleteCourse } from '../store/actions';
import Head from '../components/Head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { IoIosApps, IoIosCloudUpload } from 'react-icons/io';
import Router from 'next/router';
import UploadCourse from '../layouts/UploadCourse';
import Page from '../components/page';
import Courses from '../layouts/Courses';

class page extends Component {

	constructor(props) {
		super(props);

		this.state = {
			page: null
		}
	}

	componentDidMount() {
		this.props.getImpartedCourses()
			.then(res => {
				this.setState({
					page: <Courses
						courses={this.props.courses}
						onEditCourseHandler={(course) =>
							this.onEditCourseHandler.bind(this, <UploadCourse />, course)
						}
						onDeleteCourseHandler={(courseId) =>
							this.onDeleteCourseHandler.bind(this, courseId)
						}
					/>
				})
			})
		//Checks if session exists.
		if (localStorage.getItem('token') !== null) {
			this.props.getCurrentUser()
				.then(res => {
					if (!this.props.currentUser) {
						return Router.push('/');
					}
				})
				.catch(err => console.log(err));
		} else {
			Router.push('/');
		}

	}

	//Sidebar buttons actions.
	onClickHandler = (page, key, e) => {
		if (key === 'upload new course') {
			this.props.setCourse(null);
		}
		this.setState({ page: page });

	}

	//Edit course handler.
	onEditCourseHandler = (page, course, e) => {
		this.props.setCourse(course);
		this.setState({
			page: page
		});
	}

	//Delete course.
	onDeleteCourseHandler = (courseId, e) => {
		this.props.deleteCourse(courseId);
		this.onClickHandler(
			<Courses
				courses={this.props.courses.filter(course => course._id !== courseId)}
				onEditCourseHandler={(course) =>
					this.onEditCourseHandler.bind(this, <UploadCourse />, course)
				}
				onDeleteCourseHandler={(courseId) =>
					this.onDeleteCourseHandler.bind(this, courseId)
				}
			/>, null)
	}

	render() {

		const { courses, message } = this.props

		return (
			<div style={{ height: '100%', overflow: 'hidden' }}>
				<Head />
				<Navbar />
				<style>{
					`
					#dashboard-side{
						height:100%;
						background:#2C374E;
					}
					@media (max-width:767px) {
						#dashboard-side{
							height:auto;
							padding-bottom:2em;
							background:#2C374E;
						}
						
					}
					`
				}</style>
				<div className="container-fluid" style={styles.container}>
					<div className="row" style={{ height: '100%', background: '#eee' }}>
						<div className="col-12 col-md-2 px-0" id="dashboard-side">
							<ul className="list-group mt-2 mt-md-3 ">
								<li className="list-group-item pb-0" style={styles.sideMenuItems}>
									<Button
										icon={<IoIosApps color="#888" size={25} className="float-left ml-2" />}
										bgColor="#fff"
										text="Courses"
										txtColor="#888"
										onClick={this.onClickHandler.bind(this,
											<Courses
												courses={courses}
												onEditCourseHandler={(course) =>
													this.onEditCourseHandler.bind(this, <UploadCourse />, course)
												}
												onDeleteCourseHandler={(courseId) =>
													this.onDeleteCourseHandler.bind(this, courseId)
												}
											/>)}
									/>
								</li>
								<li className="list-group-item pb-0 mt-2" style={styles.sideMenuItems}>
									<Button
										icon={<IoIosCloudUpload color="#888" size={25} className="float-left ml-2" />}
										bgColor="#fff"
										text="Upload New Course"
										txtColor="#888"
										textStyle={{ fontSize: 22 }}
										onClick={this.onClickHandler.bind(this, <UploadCourse />, 'upload new course')}
									/>
								</li>
							</ul>
						</div>
						<div className="col-12 col-md-10 px-0 px-md-1" style={styles.workingArea}>
							{message && <div className="alert alert-warning mt-2 rounded-0">{message}</div>}
							{this.state.page}
						</div>
					</div>
				</div>
				<Footer id="dashboard-footer" />
			</div>
		);
	}
}

const styles = {
	container: {
		height: '100%',
		overflowY: 'auto'
	},
	sideMenuItems: {
		background: 'transparent',
		border: 0
	},
	workingArea: {
		overflowY: 'auto',
		height: '87%'
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.currentUser,
		courses: state.course.impartedCourses,
		message: state.ui.alertMessage
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getImpartedCourses: () => dispatch(getImpartedCourses()),
		setCourse: (course) => dispatch(setCourse(course)),
		deleteCourse: (courseId) => dispatch(deleteCourse(courseId)),
		getCurrentUser: () => dispatch(getSessionUser())
	}
}

export default Page(connect(mapStateToProps, mapDispatchToProps)(page));
