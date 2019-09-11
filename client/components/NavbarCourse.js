import React from 'react';
import { IoIosSpeedometer, IoIosHome, IoIosMenu } from 'react-icons/io';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import Link from 'next/link';
import { useState } from 'react';

const Component = (props) => {

	let [isOpen, setIsOpen] = useState(false)
	
	const toggle = () =>{
		setIsOpen(!isOpen);
	}

	return (
		<nav className="navbar navbar-expand-md shadow-sm" style={styles.container}>
			<div className="navbar-brand text-white  ml-md-5">
				{props.courseTitle}
				<p id="current-video" class="font-weight-light">{props.currentVideo}</p>
			</div>
			<NavbarToggler onClick={() => toggle()}>
				<IoIosMenu color="#fff" size={40} />
			</NavbarToggler>

				<style>
					{`
						@media (max-width: 767px){
							#current-video{
								display: block;
								font-size: 1rem;
							}
							.current-video{
								display: none;
							}
							.nav-item{
								text-align: center;
							}
							.nav-item:hover{ 
								background: rgba(255,255,255,0.3)
							}
							.collapse{
								margin: -.5em -1em;
							}
						}
						@media (min-width: 768px){
							#current-video{
								display: none;
							}
							.current-video{
								display: block;
							}
						}
						`}
				</style>
			<Collapse isOpen={isOpen} navbar>
				<div className="text-white font-weight-lighter ml-auto mr-auto current-video">{props.currentVideo}</div>
				<ul className="navbar-nav ml-auto p-0 ">
					<li className="nav-item active px-3 py-1">
						<Link hfer="dashboard" className="nav-link py-0 mr-2"><IoIosSpeedometer color="#fff" size={30} /></Link>
					</li>
					<li className="nav-item active px-3 py-1" style={{ cursor: 'pointer' }}>
						<Link href="/" className="nav-link py-0" ><IoIosHome color="#fff" size={30} /></Link>
					</li>
				</ul>
			</Collapse>
		</nav>
	);
};

const styles = {
	container: {
		background: '#19B079',
	}
}


export default Component;
