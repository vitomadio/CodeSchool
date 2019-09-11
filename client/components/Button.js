/*Button Component
	Props: 
	-bgColor: Background Color of the button.
	-textStyle: Pass styles for the text.
	-txtColor: Pass text color.
	-text: Pass the text content.
	-icon: Pass Icon to include.
*/


import React, {Component} from 'react';

class Button extends Component {
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
	        style={{...styles[this.state.class],backgroundColor:this.props.bgColor,cursor:'pointer'}}
	        onMouseOver={this.onChangeClassHandler.bind(this, "hover")}
	        onMouseLeave={this.onChangeClassHandler.bind(this, "out")}
	        onClick={this.props.onClick}
	        >
			<h4 className="text-center mb-0 font-weight-light" style={{color:this.props.txtColor,...this.props.textStyle}}>{this.props.icon ? this.props.icon : null}{this.props.text}</h4>
			{ this.props.overlay && this.state.pressed && <div style={styles.overlay}></div>}
			</div>
	    );
	};
}

const styles = {
	btnBg: {
		padding:'12px 0px',
		boxShadow:'0px 5px 10px rgba(0,0,0,.4)',
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

export default Button;