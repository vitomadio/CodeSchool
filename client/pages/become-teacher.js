import React, { Component } from 'react';
import { withRouter } from 'next/router';
import Router from 'next/router';
import Navbar from '../components/Navbar';
import Head from '../components/Head';
import Page from '../components/page';
import {connect} from 'react-redux';
import { becomeTeacher } from '../store/actions';
import Footer from '../components/Footer';


class page extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	controls:{
        		name:{
        			value:"",
        			touched: false
        		},
        		lastName:{
        			value:"",
        			touched: false
        		},
        		summary:{
        			value:"",
        			touched: false
        		}
        	}
        }
    };

    componentDidMount(){
        if(this.props.user){
            if(this.props.user.teacher !== false){
                return Router.push('/');
            }
            return null
        }
        Router.push('/');
    };

    onChangeHandler = (key, e) => {
		const value = e.target.value;
		this.setState(prevState => {
			return {
				controls:{
				...prevState.controls,
					[key]:{
						...prevState.controls[key],
						touched:true,
						value:value
					}
				}

			}
		});
    }

    onBecomeTeacherHandler = () => {
        const name = this.state.controls.name.value;
        const lastName = this.state.controls.lastName.value;
        const summary = this.state.controls.summary.value;
        this.props.onBecomeTeacher(name, lastName, summary);
        Router.push('/profile');
    }

    render() {
        return (
            <div className="container-fluid p-0" style={{height:'90%'}}>
            	<Head />
            	<Navbar />
            	<div className="container-fluid bg-light" style={styles.wrapper}>
            		<div className="row justify-content-center">
            			<div className="col-md-6">
            			<h4 className="text-center text-secondary">Please, fill in the form in order to become one of our super teachers.</h4>
            				<div className="row">
            					<div className="col-md-6">
            						<input 
									name="name" 
									type="text"
									id="name" 
									onChange={this.onChangeHandler.bind(this, "name")} 
									className="form-control form-control-lg mt-3"
									placeholder="Name"
									/>
            					</div>
            					<div className="col-md-6">
            						<input 
									name="lastName" 
									type="text"
									id="lastName" 
									onChange={this.onChangeHandler.bind(this, "lastName")} 
									className="form-control form-control-lg mt-3"
									placeholder="Last Name"
									/>
            					</div>
            				</div>
							<textarea 
							rows="10"
							name="summary" 
							type="text"
							id="summary" 
							onChange={this.onChangeHandler.bind(this, "summary")} 
							className="form-control form-control-lg mt-3"
							placeholder="Summary"
							/>
            				<button 
                            className="btn btn-danger mt-3 float-right"
                            onClick={this.onBecomeTeacherHandler}
                            >
                            Become a Teacher</button>
							<button className="btn btn-outline-secondary float-right mt-3 mr-3 ">Cancel</button>
            			</div>
            		</div>
            	</div>
                <Footer />
            </div>
        );
    }
}

const styles = {
    wrapper:{
        padding:'2em',
        height:'100%'
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onBecomeTeacher: (name,lastName,summary) => dispatch(becomeTeacher(name,lastName,summary))
    };
};

export default Page(connect(mapStateToProps, mapDispatchToProps)(page));
