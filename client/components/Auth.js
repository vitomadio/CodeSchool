import React, { Component } from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import Head from '../components/Head';
import SigninFormModal from './SigninFormModal';
import validate from '../utils/formValidations';
import { authenticateUser } from '../store/actions/index';
import { Alert } from 'reactstrap';

class Auth extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	message:"",
        	btnDisabled: true,
        	modalOpen:false,
        	authMode:null,
        	controls:{
	    		username:{
	    			value:"",
	    			valid:false,
	    			touched:false,
	    			validationRules:{
	    				notEmpty: true
	    			}
	    		},
	    		email: {
	    			value:"",
	    			valid:false,
	    			touched:false,
	    			validationRules:{
	    				isEmail: true
	    			}
	    		},
	    		password:{
	    			value:"",
	    			valid:false,
	    			touched:false,
	    			validationRules:{
	    				minLength: 6
	    			}
	    		},
	    		confirm:{
	    			value:"",
	    			valid:false,
	    			touched:false,
	    			validationRules:{
	    				equalTo: "password"
	    			}
	    		}
        	}
        }
    }

	//Takes care of fields validations
    onChangeHandler = (key, e) => {
    	e.preventDefault()
    	const value = e.target.value
      	const equalValue = this.state.controls.password.value; //password value

      	let connectedValue = {
	      ...connectedValue,
	      equalTo: equalValue
	    };
	   
	    if (key === "password") {
	      connectedValue = {
	        ...connectedValue,
	        equalTo: value
	      };
	    }

		this.setState(prevState => {
			return {
				controls:{
					...prevState.controls,
					confirm:{
						...prevState.controls.confirm,
				            valid:
				              key === "password"
				                ? validate(
				                    prevState.controls.confirm.value,
				                    prevState.controls.confirm.validationRules,
				                    connectedValue
				                  )
				                : prevState.controls.confirm.valid
					},
					[key]:{
						...prevState.controls[key],
						value: value,
						touched: true,
						valid: validate(value, prevState.controls[key].validationRules, connectedValue)
					}
				}
			}
		});
    }

    componentDidMount(){
    	const authMode = this.props.authMode
    	if(authMode!==null){
    		this.setState({
    			authMode: authMode,
    			modalOpen: true
	    	})

    	}
    }

    //Submit Handler
    onSubmitFormHandler = () => {
    	const {email, password, username} = this.state.controls;
    	const {authMode} = this.props;
    	const credentials = {
    		email: email.value,
    		password: password.value, 
    		username: username.value
    	}
		this.props.submitForm(authMode, credentials)
		this.props.closeModal()

    }

	

    render() {
    	const { message, authMode, modalOpen} = this.props
    	const { username, email, password, confirm } = this.state.controls
        return (
        	<div>
       			<SigninFormModal 
       			authMode={authMode}
       			onChangeHandler={this.onChangeHandler}
       			toggleForm={this.props.toggleForm}
				username={username}
				email={email}
				password={password} 
				confirm={confirm}
				modalOpen={modalOpen}
				closeModal={this.props.closeModal}
				onSubmitForm={this.onSubmitFormHandler}
				btnDisabled={(!confirm.valid && authMode === "signup") || !email.valid || !password.valid }
				headerTextColor="#fff"
				headerColor="#19B079"
       			/>
			</div>
        );
    }
}

const mapStateToProps = state => {
	return {
		alert: state.ui.alertMessage
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitForm: (authMode, credentials) => dispatch(authenticateUser(authMode, credentials)) 
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
