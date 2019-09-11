import React, { Component } from 'react';
import { IoIosTrash, IoMdCreate } from 'react-icons/io';
import { getImpartedCourses } from '../store/actions';
import { withRouter } from 'next/router';

class Course extends Component {

	constructor(props){
		super(props)

		this.state = {
			color: '#bbb',
			icon: "",
			iconId:"",
			courses:[]
		}
	}

	componentDidMount(){
		this.setState(prevState => {
			return {
				...prevState,
				courses:this.props.courses
			}
		})
	}


	//On mouse over icon
	onMouseOverHandler = (key, id, e) => {
		this.setState({
			color:'#777',
			icon: key,
			iconId:id
		})
	}

	//On mouse leave Icon
	onMouseLeaveHandler = () => {
		this.setState({
			color:'#bbb', 
			icon:"",
			iconId:""
		})
	}

	render(){
		const { color, icon, iconId } = this.state;
		const coursesList = this.state.courses.map(course => {
			return (
				<li className="list-group-item mb-2 mb-md-3 py-1 py-md-0 d-flex flex-row justify-content-between align-items-center courses" key={course._id} >
					
						<div className="flex-grow"><h5 className="text-secondary font-weight-light">{course.title.slice(0,25)+'...'}</h5></div>
						<div className="d-flex flex-row justify-content-between">
							<div 
							className="" 
							data-toggle="tooltip" 
							data-placement="top" 
							title="Edit Course"

							>
								<IoMdCreate 
								size={30} 
								color={icon === 'edit' && iconId === course._id ? color : '#bbb'}
								onMouseOver={this.onMouseOverHandler.bind(this, 'edit', course._id)}
								onMouseLeave={this.onMouseLeaveHandler}
								onClick={this.props.onEditCourseHandler(course)}							
								/>
							</div>

							<div  
							className="ml-3"
							data-toggle="tooltip" 
							data-placement="top" 
							title="Remove Course"
							>
								<IoIosTrash 
								size={30} 
								color={icon === 'trash' && iconId === course._id ? color : '#bbb'}
								onMouseOver={this.onMouseOverHandler.bind(this, 'trash', course._id)}
								onMouseLeave={this.onMouseLeaveHandler}
								onClick={this.props.onDeleteCourseHandler(course._id)}
								/>
							</div>
						</div>
					
				</li>
			)
		})


	    return (
	        <div className="container-fluid">
	        <style>
	        	{
	        		`
						li.courses{
							height:60px;
						}
						@media (max-width:767px) {
							li.courses{
								height:auto;
							}
						}
	        		`
	        	}
	        </style>
	        	<div className="row">
	        		<div className="col-12 col-md-8">
	        			<h2 className="text-secondary mt-2 mt-md-3 ml-md-3 text-center text-md-left">Imparted Courses</h2>
	        			<ul className="list-group mt-2 mt-md-3">
							{coursesList}
	        			</ul>
	        		</div>
	        	</div>
	        </div>
	    );
	
	};
};



export default Course;
