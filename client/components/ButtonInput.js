import React, {Component} from 'react';

class ButtonInput extends Component {
	constructor(props){
		super(props)

		this.state = {
			class:'inputBtnBg'
		}
	}

	onChangeClassHandler = (key, e) => {
		if(key==="hover"){
			return this.setState({
					class: 'inputBtnBgPressed'
				})
		}
		this.setState({
			class: 'inputBtnBg'
		})
	}

	render(){

	    return (
	        <div 
	        className="custom-file mb-2" 
	        style={{...styles[this.state.class],backgroundColor:this.props.bgColor}}
	        onMouseOver={this.onChangeClassHandler.bind(this, "hover")}
	        onMouseOut={this.onChangeClassHandler.bind(this, "out")}
	        >
				<input
				multiple 
				type="file" 
				style={styles.input} 
				className="custom-file-input" 
				onChange={this.props.onChange}
				/>
				<h4 className="text-center font-weight-light" style={{...styles.text, color:this.props.txtColor}}>{this.props.text}</h4>
			</div>
	    );
	};
}

const styles = {
	input:{
		width:'100%',
		height:'100%',
		position:'absolute',
		top:0

	},
	inputBtnBg: {
		position:'relative',
		padding:'12px 0px',
		boxShadow:'0px 5px 10px #888',
		height:'3em'
	},
	inputBtnBgPressed: {
		position:'relative',
		padding:'12px 0px',
		boxShadow:'0px 1px 10px #888',
		height:'3em'
	},
	text:{
		fontSize:'1.7em',
		marginTop:-5
	}		
}

export default ButtonInput;

