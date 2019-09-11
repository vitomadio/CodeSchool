import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class FooterWidget extends Component {
	constructor(props){
		super(props)

		this.state = {
			dropdownOpen:false
		}
	}

	//Toggles footer dropdown
	toggle = () => {
		console.log('executed toggle')
		this.setState(prevState => {
			return{
				...prevState,
				dropdownOpen: !prevState.dropdownOpen
			}
		});
	}
	
	render(){
	    return (
	        <div className="container pt-1 pt-md-5" style={{padding:'3em 1em'}}>
				<div className="row justify-content-center">
				<div className="col-10 col-md-10">
				<div className="row">
					<div className="col-7 col-md-4">
						<button className="btn btn-clear bg-white " style={styles.btnFooter}>Become an Instructor</button><br/>
						<button className="btn btn-clear bg-white " style={styles.btnFooter}>Code School App</button><br/>
						<button className="btn btn-clear bg-white font-weight-light" style={styles.btnFooter}>About us</button><br/>
					</div>
					<div className="col-5 col-md-2">
						<button className="btn btn-clear bg-white font-weight-light" style={styles.btnFooter}>Careers</button><br/>
						<button className="btn btn-clear bg-white font-weight-light" style={styles.btnFooter}>Blog</button><br/>
						<button className="btn btn-clear bg-white font-weight-light" style={styles.btnFooter}>Topics</button><br/>
					</div>
					<div className="col-7 col-md-3">
						<button className="btn btn-clear bg-white font-weight-light" style={styles.btnFooter}>Support</button><br/>
						<button className="btn btn-clear bg-white font-weight-light" style={styles.btnFooter}>Afiliate</button><br/>
					</div>
					<div className="col-5 col-md-3">
						<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle.bind(this)}>
				        <DropdownToggle caret className="bg-transparent text-secondary">
				          English
				        </DropdownToggle>
				        <DropdownMenu>
				          <DropdownItem>Italian</DropdownItem>
				          <DropdownItem divider />
				          <DropdownItem>Spanish</DropdownItem>
				          <DropdownItem divider />
				          <DropdownItem>German</DropdownItem>
				        </DropdownMenu>
				      </Dropdown>
					</div>
				</div>
				</div>
				</div>
			</div>
	    );
	}
};

const styles = {
	btnFooter:{
		color:'#0B9C86'
	}
}

export default FooterWidget;
