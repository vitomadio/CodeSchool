import React, { Component } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import StarRatings from 'react-star-ratings';
import CourseDetailsDropdown from './CourseDetailsDropdown';
import configs from '../env_config';

class test extends Component {

	constructor(props) {
		super(props);
		this.state = {
			left: 0,
			dropdownOpen: 'false',
			currentCourse: null,
			cardIndex: null,
			offset: 0,
			wrapperWidth: null
		}

		this.target = React.createRef();
	}

	componentDidMount() {
		const wrapper = document.getElementById('wrapper');
		this.setState({
			wrapperWidth: wrapper.offsetWidth
		})
	}

	//toggles details
	openDetails = (value, courseId, i, e) => {
		const target = this.target.current;
		this.setState(prevState => {
			return {
				...prevState,
				dropdownOpen: value,
				currentCourse: courseId,
				cardIndex: i + 1,
				offset: target.scrollLeft
			}
		});
	}

	closeDetails = (value, e) => {
		this.setState(prevState => {
			return {
				...prevState,
				dropdownOpen: value,
				currentCourse: null,
				offset: target.scrollLeft,
				cardIndex: null
			}
		});
	}

	// Slider controls actions
	onScrollHandler = (key, e) => {
		e.preventDefault();
		const target = document.getElementById('target');
		if (key === "next") {
			if (this.state.left >= 260) { return null }
			this.setState(prevState => {
				return {
					...prevState,
					left: prevState.left + 260
				}
			});
			target.scrollTo({
				left: this.state.left + 260,
				behavior: 'smooth'
			});

		} else {
			if (this.state.left == 0) { return null }
			this.setState(prevState => {
				return {
					...prevState,
					left: prevState.left - 260
				}
			});
			target.scrollTo({
				left: this.state.left - 260,
				behavior: 'smooth'
			});
		}
	}

	render() {
		console.log(configs.api);
		const apiUrl = configs.api;
		const arr = [0, 1, 2, 3, 4]
		const { dropdownOpen, currentCourse, left, cardIndex, offset, wrapperWidth } = this.state;

		let courses = arr.map(item => {
			return (
				<div key={item} id="card-loaders">
					<style>
						{
							`
						#card-loaders{
							height:400px;
							width:240px;
							margin-right:16px;
							border:1px solid #ddd;
							box-shadow:1px 2px 2px #ddd;
							position:static;
							background: linear-gradient(270deg, #fff, #eee, #fff);
							background-size: 200% 200%;
							-webkit-animation: AnimationName 2s ease infinite;
							-moz-animation: AnimationName 2s ease infinite;
							animation: AnimationName 2s ease infinite;
						}
						@-webkit-keyframes AnimationName {
						    0%{background-position:0% 50%}
						    100%{background-position:100%}
						}
						@-moz-keyframes AnimationName {
						    0%{background-position:0% 50%}
						    100%{background-position:100%}
						}
						@keyframes AnimationName { 
						    0%{background-position:0% 50%}
						    100%{background-position:100%}
						}
						`
						}
					</style>
				</div>
			)
		});

		if (this.props.courseList.length >= 1) {
			courses = this.props.courseList.map((course, i) => {
				return (

					<div
						key={course._id}
						style={styles.col}
						onMouseOver={this.openDetails.bind(this, 'true', course._id, i)}
						onMouseLeave={this.closeDetails.bind(this, 'false')}
					>

						<div className="card shadow-sm rounded-0" style={{ height: 400, width: 240 }}>
							<img src={apiUrl + course.featureUrl.slice(22)} className="card-img-top rounded-0" style={styles.image} />
							<div className="card-body d-flex flex-column">
								<h5 className="card-title flex-grow-1">{course.title}</h5>
								<p className="card-text">{course.author.name} {course.author.lastName}</p>
								<div className="row align-items-center mb-3">
									<div className="col-8 pr-0">
										<StarRatings
											rating={course.rating}
											starHoverColor="#FFA554"
											starRatedColor="#FFA554"
											changeRating={this.changeRating}
											numberOfStars={5}
											name='rating'
											starDimension="20px"
											starSpacing="1px"
										/>
									</div>
									<div className="col-4 p-0"><small>{course.rating} {`(${course.ratesQty})`}</small></div>
								</div>

								<div className="row justify-content-end align-items-center mr-2">
									<small style={{ textDecoration: 'line-through' }}>$199,00</small>
									<h5 className="ml-2 mb-0">$9,99</h5>
								</div>
							</div>
						</div>
						<CourseDetailsDropdown
							currentCourse={currentCourse}
							wrapperWidth={wrapperWidth}
							left={left}
							cardIndex={cardIndex}
							offset={offset}
							dropdownOpen={dropdownOpen}
							course={course}
							id="details"
							onClick={this.props.onAddToCartHandler(course)}
						/>
					</div>

				)
			});
		}
		return (
			<div
				style={{ overflow: 'hidden' }}
				id="wrapper"
			>
				<style>
					{
						`	
							.controls{
								position:absolute;
								top:50%;
								margin-top:-30px;
								right:300px;
								width:60px;
								height:60px;
								border-radius:30px;
								background:#19B079;
								z-index:999;
								padding-top:10px;
								cursor:pointer;
							}
							.controls:hover{
								background:#5EC7A1;

							}
							.wrapper{
								position:relative;
								min-width:1048px;
								padding:2em 0;
							}
							.frame{
								overflow-x:hidden;
								max-width:1030px;

							}
							@media (min-width:601px) and (max-width:1199px){
								.controls{
									display:none;
								}
								.wrapper{
									padding:2em 1em;
									min-width:100%;
								}
								.frame{
									max-width:90%;
									overflow-x:scroll;
									overflow-y:hidden;
								}
							}
							@media (max-width:600px) {
								.controls{
									display:none;
								}
								.wrapper{
									padding:1em 1em;
									min-width:100%;
								}
								.frame{
									max-width:90%;
									overflow-x:scroll;
									overflow-y:hidden;
								}

							}
        				`
					}
				</style>
				<div
					className="container wrapper"
				>
					{this.state.left !== 0 ?
						<div
							className="text-center shadow controls"
							style={{ left: -8 }}
							onClick={this.onScrollHandler.bind(this, 'prev')}
						>
							<IoIosArrowBack size={40} color="#fff" />
						</div>
						: null}
					{this.state.left <= 239 ?
						<div
							className="text-center shadow controls"
							style={{ right: -0 }}
							onClick={this.onScrollHandler.bind(this, 'next')}
						>
							<IoIosArrowForward size={40} color="#fff" />
						</div>
						: null}
					<div
						className="container frame"
						id="target"
						onScroll={this.onScrollEventHandler}
						ref={this.target}
					>
						<div className="row bg-white py-3" style={styles.row}>
							{courses}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const styles = {
	col: {
		height: 400,
		background: 'white',
		marginRight: '16px',
		width: 240,
		position: 'static'
	},
	row: {
		width: 1300,
		paddingLeft: 8
	},
	image: {
		width: '100%',
		maxHeight: '66.7%'
	}
}

export default test;
