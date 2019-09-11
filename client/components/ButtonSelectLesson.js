/*Button Component
	Props: 
	-bgColor: Background Color of the button.
	-textStyle: Pass styles for the text.
	-txtColor: Pass text color.
	-text: Pass the text content.
	-icon: Pass Icon to include.
*/


import React, {Component} from 'react';

class ButtonSelectLesson extends Component {
	constructor(props){
		super(props)

		this.state = {
			class:'btnBg',
			pressed:false
		}
	}

	onChangeClassHandler = (key, e) => {
		e.preventDefault();
		if(key==="hover"){
			return this.setState({
					class: 'btnBgPressed',
					pressed: true
				})
		}
		this.setState({
			class: 'btnBg',
			pressed:false
		})
	}

	render(){

	    return (
	        <div 
	        style={{...styles[this.state.class],backgroundColor:this.props.bgColor,cursor:'pointer',borderLeft:'3px solid #19B079'}}
	        onMouseOver={this.onChangeClassHandler.bind(this, "hover")}
	        onMouseLeave={this.onChangeClassHandler.bind(this, "out")}
	        onClick={this.props.onClick}
	        >
	        <div className="row">
		        <div className="col-1">{this.props.icon ? this.props.icon : null}</div>
				<div className="col-9"><h4 className="mb-0 font-weight-light text-center text-md-left" style={{color:this.props.txtColor,...this.props.textStyle}}>{this.props.text}</h4></div>
	        </div>
			{ this.props.overlay && this.state.pressed && <div style={styles.overlay}></div>}
			</div>
	    );
	};
}

const styles = {
	btnBg: {
		padding:'12px 0px',
		boxShadow:'0px 3px 10px rgba(0,0,0,.4)',
		position:'relative'
	},
	btnBgPressed: {
		padding:'12px 0px',
		boxShadow:'0px 1px 5px rgba(0,0,0,.4)',
		position:'relative'
	},
	overlay:{
		position:'absolute',
		height:'100%',
		width:'100%',
		background:'rgba(255,255,255,0.3)',
		zIndex:999,
		top:0
	}	
}

export default ButtonSelectLesson;