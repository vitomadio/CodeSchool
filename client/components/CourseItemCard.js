import React, { Component } from 'react';
import {
	Carousel,
	CarouselItem,
	CarouselControl
} from 'reactstrap';
import StarRatings from 'react-star-ratings';
import CourseDetailsDropdown from './CourseDetailsDropdown';
import configs from '../env_config';


class CourseItemCard extends Component{
	constructor(props) {
		super(props);
		this.state = { 
			activeIndex: 0,
			rating:2.4,
			dropdownOpen:'false',
			currentCourse: null
		};
	}

	changeRating = ( newRating, name ) => {
      this.setState({
        rating: newRating
      });
    }

	//Carousel stuff
    onExiting() {
    	this.animating = true;
	}

	onExited() {
	    this.animating = false;
	}

	next = () => {
		if (this.animating) return;
		const nextIndex = this.state.activeIndex === 0 ? this.state.activeIndex + 1 : this.state.activeIndex;
		this.setState({ activeIndex: nextIndex });
	}

	previous = () => {
		if (this.animating) return;
		const nextIndex = this.state.activeIndex === 0 ? this.state.activeIndex : this.state.activeIndex - 1;
		this.setState({ activeIndex: nextIndex });
	}
	//end of carousel stuff

	//toggles details
	openDetails = (value, courseId, e) => {
		this.setState(prevState => {
			return {
				...prevState,
				dropdownOpen: value,
				currentCourse: courseId
			}
		});
	}

	closeDetails = (value, e) => {
		this.setState(prevState => {
			return {
				...prevState,
				dropdownOpen: value,
				currentCourse: null
			}
		});
	}

	render(){
		const baseUrl = configs.api;
		const { activeIndex, dropdownOpen, currentCourse } = this.state;
		const courseList = this.props.courses.slice(0,8);
		const arr = [];
		for(let i=0;i<(courseList.length/4);i++){
			arr.push(i);
		}

		const arrForHolders = [0,1,2,3,4,5,6,7];

		
		let	courses = arrForHolders.map(item => {
			return (
				<div 
				key={item}
				className="col-md-4 col-lg-3">
				<style>
					{
						`
						.card{
							height:400px;
						}
						.card-holders{
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

						@media (max-width:600px) {
							.card{
								height:200;
							}
						}
						`
					}
				</style>
				<div className="card shadow-sm rounded-0 card-holders" style={styles.card}>
					
				</div>
				</div>
				)
			});

		if(courseList.length >= 1 ){
			courses = courseList.map((course,i) => {
				return (
					<div 
					key={course._id}
					className="col-md-4 col-lg-3" 
					onMouseOver={this.openDetails.bind(this, 'true', course._id)} 
					onMouseLeave={this.closeDetails.bind(this, 'false')}
					>
					<div className="card shadow-sm rounded-0" >
						<img src={baseUrl} className="card-img-top rounded-0" style={styles.image}/>
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
						<small style={{textDecoration: 'line-through'}}>$199,00</small>
						<h5 className="ml-2 mb-0">$9,99</h5>
						</div>
						</div>
					</div>
					<CourseDetailsDropdown
					course={course}
					id="details"
					dropdownOpen={dropdownOpen}
					currentCourse={currentCourse}
					onClick={this.props.onAddToCartHandler(course)}
					/>
					</div>
				)
			});
		}

		const carouselItems = [];
		
		for(var i=0;i<courses.length;i+=4)	{
			const carouselItem = (
				<CarouselItem
				onExiting={this.onExiting.bind(this)}
		        onExited={this.onExited.bind(this)} 
				key={i}
				>
				<div className="row">
					{courses.slice(i,i+4)}
				</div>
				</CarouselItem>
				)

			carouselItems.push(carouselItem);
		}

		return (
			<div style={styles.container}>
			<style>
				{
					`
					.carousel{
						position: static;
						display: flex;
						align-items:center;
					}
					.carousel-inner{
						position: static;
						padding:0em 1em;
						overflow:visible;
					}
					.prev-chevron{
						position:static;
						background: #19B079;
						opacity:1;
						height:60px;
						width:60px;
						border-radius:30px;
						z-index:998;
						margin-left:-20px;
						margin-right:-10px;
					}
					.carousel-control-prev-icon{
						height:30px;
						width:30px;
					}
					.next-chevron{ 
						position:static;
						background: #19B079;
						opacity:1;
						height:60px;
						width:60px;
						border-radius:30px;
						box-shadow:0px 3px 8px #888;
						z-index:999;
						margin-right:-20px;
						margin-left:-10px
					}
					.carousel-control-next-icon{
						height:30px;
						width:30px;
					}

					@media (max-width:600px) {
						.carousel-control-next-icon,.carousel-controle-prev-icon,
						.next-chevron,.prev-chevron{
							display:none;
						}
					}

					`
				}
			</style>
				<Carousel
				activeIndex={activeIndex}
				next={this.next}
				previous={this.previous}
				interval={false}
				slide={true}
				style={{overflowX:'hidden'}}
				>
				{activeIndex !== 0 ?
				<CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} className="prev-chevron shadow-sm"/>
				: null }
					{carouselItems}
				{activeIndex === 0 ? 
				<CarouselControl direction="next" directionText="Next" onClickHandler={this.next} className="next-chevron"/>
				: null }
				</Carousel>
			</div>

			);
	}
}

const styles = {
	container: {
		width:'100%',
	},
	image:{
		width:'100%'
	}

}

export default CourseItemCard;
