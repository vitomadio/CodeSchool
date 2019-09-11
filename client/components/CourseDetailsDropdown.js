import React from 'react';


const CourseDetailsDropdown = (props) => {
	const {left, cardIndex, offset, currentCourse, dropdownOpen, wrapperWidth} = props;
    return (	
    	dropdownOpen !== 'false' && currentCourse === props.course._id ? 
        <div 
        className="wrapper-details"
        >
        <style>
        {
        	`
				.wrapper-details{
					width:260px;
					height:410px;
					background:#fff;
					padding:1em;
					position:absolute;
					top:50%;
					margin-top:-205px;
					border:1px solid #ccc;
					display:flex;
					flex-direction:column;
					justify-content:space-between;
					z-index:999;
					left:${((260 * cardIndex)) - ((offset)-(54-(cardIndex * 4))) <= (wrapperWidth - 260) ?
							((260 * cardIndex)) - ((offset)-(54-(cardIndex * 4))) : (wrapperWidth - 340)
						}px;
				}
				@media (max-width:1199px){
					.wrapper-details{
						width:260px;
						height:410px;
						background:#fff;
						padding:1em;
						position:absolute;
						top:50%;
						margin-top:-205px;
						border:1px solid #ccc;
						display:flex;
						flex-direction:column;
						justify-content:space-between;
						z-index:999;
						left:${((260 * cardIndex)) - ((offset)-(54-(cardIndex * 4))) <= (wrapperWidth - 270) ?
							((260 * cardIndex)) - ((offset)-(54-(cardIndex * 4))) : (wrapperWidth - 270)
						}px;
						margin-right:0px;
						
					}
				}

        	`
        }
        </style>
        <small className="text-secondary">Last update: 7/2018</small>
        <h4 className="my-1">{props.course.title}</h4>
        <small className="mb-2 text-secondary">{props.course.category} > {props.course.subCategory}</small>
        <p className="mt-1 text-secondary">{props.course.description.substr(0,200)+"..."}</p>
        <div 
        className="btn btn-primary float-right align-self-end"
        onClick={props.onClick}
        >
        Add to cart</div>
        <div style={styles.triangle}>
        <div style={styles.borderTriangle}></div>
        </div>
        </div>
    	: null 
    );
};


const styles = {
	triangle:{
		height:0,
		width:0,
		borderTop: '8px solid transparent',
		borderBottom: '8px solid transparent',
		borderRight:'8px solid #fff',
		position:'absolute',
		top:'50%',
		left:-8
	},
	borderTriangle: {
		height:10,
		width:10,
		position:'absolute',
		top:-5,
		left:2,
		borderWidth:'1px 0px 0px 1px',
		borderStyle:'solid',
		borderColor:'#ccc',
		MozTransform:'rotate(45deg)',
    	webkiTransform:'rotate(45deg)',
    	transform:'rotate(-45deg)',
    	zIndex:'999'
	}

}

export default CourseDetailsDropdown;
