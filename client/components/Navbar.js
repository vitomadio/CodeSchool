import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
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
	DropdownItem,
} from 'reactstrap';
import Page from './page';
import Auth from './Auth';
import { connect } from 'react-redux';
import { logoutUser, getCart, getSessionUser, getPurchasedCourses, getCourse } from '../store/actions';
import { TiShoppingCart } from 'react-icons/ti';
import configs from '../env_config';


class page extends Component {

	constructor(props) {
		super(props)

		this.state = {
			isOpen: false,
			modalOpen: false, //login modal toggle.
			authMode: null,
			myCoursesDropdown: false, //Dropdown toogles.
			navbarWidth: null
		};
	};

	componentDidMount() {
		this.props.getCart();
		this.props.getCurrentUser();
		if (this.props.currentUser) {
			this.props.getPurchasedCourses();
		}

	}

	//Toggles dropdown button.
	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	//Open authentication modal.
	openModal = (key, e) => {
		if (key === "login") {
			return this.setState({
				authMode: "login",
				modalOpen: true
			})
		}
		this.setState({
			authMode: "signup",
			modalOpen: true
		});

	};

	//Toggles form tipes Signup/Login
	toggleForm = () => {
		this.setState(prevState => {
			return {
				...prevState,
				authMode: prevState.authMode === "login" ? "signup" : "login"
			}
		})
	}

	//Colse authentication modal.
	closeModalHandler = () => {
		this.setState({
			modalOpen: false
		});
	};

	//Become a teacher handler.
	onBecomeATeacher = () => {
		Router.push('/become-teacher')
	}

	//Opens My courses dropdown button.
	onMyCoursesHandler = (bool, e) => {
		this.setState({
			myCoursesDropdown: bool
		});
	};

	//Logout handler.
	onLogoutHandler = () => {
		localStorage.clear();
		this.props.onLogoutUser();
	};


	onClickPurchasedCourseHandler = (course, e) => {
		this.props.getCourse(course._id)
			.then(() => {
				Router.push('/courses?id=' + course._id);
			});
	}

	render() {
		const apiUrl = configs.api;
		const { currentUser, cart, purchasedCourses } = this.props;
		const { authMode, modalOpen, token, myCoursesDropdown } = this.state;
		let myCourses = null;
		if (purchasedCourses) {
			myCourses = purchasedCourses.map(course => {
				return (
					<div>
						<li
							className="list-group-item"
							key={course._id}
							style={{ borderRadius: 0, border: 'none', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
							onClick={this.onClickPurchasedCourseHandler.bind(this, course)}
						>
							<div className="row align-items-center">
								<div className="col-5 ">
									<img src={apiUrl + course.featureUrl.slice(22)} className="img-thumb" style={{ width: "100%", height: "auto" }} />
								</div>
								<div className="col-7" data-toggle="tooltip" data-placement="top" title={course.title}>{course.title.slice(0, 20)}...</div>
							</div>
						</li>
					</div>
				)
			});
		}

		let navBar = (
			<Nav className="ml-auto" navbar>
				<NavItem id="shopping-cart">
					<NavLink href="/"><TiShoppingCart size={30} color="#eee" style={{ stroke: '#00A86B', strokeWidth: .6 }} /></NavLink>
				</NavItem>
				<NavItem>
					<NavLink className="btn btn-light text-secondary mr-2 auth-btns" onClick={this.openModal.bind(this, "signup")}>
						Sign up
		    		</NavLink>
				</NavItem>
				<NavItem>
					<NavLink className="btn btn-outline-light btn-sm-primary text-white auth-btns" onClick={this.openModal.bind(this, "login")}>
						Log in
		    		</NavLink>
				</NavItem>
			</Nav>
		)

		if (currentUser) {
			navBar = (
				<Nav className="ml-auto" navbar>
					<UncontrolledDropdown nav inNavbar className="user-image-mobile">
						<DropdownToggle nav style={{ marginLeft: '50% !important' }}>
							<img src={currentUser.avatarUrl ? currentUser.avatarUrl : "/static/images/user.jpg"}
								className="d-inline"
								alt=""
								style={styles.avatar} />
							<p className="d-inline text-white ml-2 font-weight-light">{currentUser.username}</p>
						</DropdownToggle>
						<DropdownMenu right className="rounded-0 pl-4 px-0 bg-transparent border-0">
							<Link href="/profile" >
								<DropdownItem className="btn text-white font-weight-light">Profile</DropdownItem>
							</Link>
							<DropdownItem divider className="m-0" />
							<Link href="/dashboard" >
								<DropdownItem className="btn text-white font-weight-light">Dashboard</DropdownItem>
							</Link>
							<DropdownItem divider className="m-0" />
							<DropdownItem className="btn text-white font-weight-light" onClick={this.onLogoutHandler} >
								Logout
                  </DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
					<NavItem id="shopping-cart">
						<Link href={{ pathname: "/shopping-cart", props: { currentUser, cart } }}>
							<a className="btn btn-link" style={{ position: 'relative', padding: '.75em 0.5em' }}>
								<TiShoppingCart size={30} color="#eee" style={{ stroke: '#00A86B', strokeWidth: .6 }} />
								{cart && cart.courses.length >= 1 ?
									<div className="text-center" style={styles.shoppingCartNum}>{cart.courses.length}</div>
									: null}
							</a>
						</Link>
					</NavItem>

					{!currentUser.teacher ?
						<NavItem>
							<NavLink className="text-white" style={styles.navBtns} onClick={this.onBecomeATeacher.bind(this)}>Become a teacher</NavLink>
						</NavItem>
						: null}
					<NavItem
						style={{ position: 'relative' }}
						onMouseOver={this.onMyCoursesHandler.bind(this, true)}
						onMouseLeave={this.onMyCoursesHandler.bind(this, false)}
					>
						<NavLink
							className="text-white"
							style={styles.navBtns}
						>
							My Courses
		    		</NavLink>
						{

							myCourses ?
								myCourses.length >= 1 && myCoursesDropdown ?
									<ul
										className="list-group"
										style={styles.dropdownUl}
									>
										<div style={styles.dropdownTriangle}></div>
										{myCourses}
									</ul>
									: null
								: null
						}
					</NavItem>

					<UncontrolledDropdown nav inNavbar className="user-image" >
						<DropdownToggle nav>
							<img src={currentUser.avatarUrl ? currentUser.avatarUrl : "/static/images/user.jpg"} alt="" style={styles.avatar} />
						</DropdownToggle>
						<DropdownMenu right className="rounded-0 p-0">
							<Link href="/profile" >
								<DropdownItem className="btn btn-link">Profile</DropdownItem>
							</Link>
							{currentUser.teacher ?
								<div>
									<DropdownItem divider className="m-0" />
									<Link href="/dashboard" >
										<DropdownItem className="btn btn-link">Dashboard</DropdownItem>
									</Link>
								</div>
								: null}
							<DropdownItem divider className="m-0" />
							<DropdownItem className="btn btn-link" onClick={this.onLogoutHandler} >
								Logout
                  </DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>
			)
		}

		return (
			<div>
				<style>
					{
						`
					#toggler{
						border:none;
						outline:none;
					}
					
					@media (min-width:768px){
						#shopping-cart-xs{
							display:none;
						}
						.user-image-mobile{
							display:none;
						}
					}
					@media (max-width:767px) {
						#shopping-cart{
							display: none;
						}
						#colapse{
							background:#19b079;
						}
						.auth-btns{
							border:none !important;
							color:#fff !important;
							background:transparent;
							text-align:left;
							font-weight:200;
						}
						.auth-btns:active{
							background:#4cc297 !important;
						}
						.navbar-container{
							max-width:100%;
						}
						.nav-link{
							padding:8px 32px !important;
							margin: 0  !important;
						}
						.nav-link:hover{
							background:#4CC297;
						}
						.user-image{
							display:none;
						}
						.dropdown-divider{
							display:none;
						}
					}
	    			`
					}
				</style>
				<Navbar color="#bbb" dark expand="md" style={styles.navbar} className="shadow-sm px-0 pb-0 pb-md-1" id="navbar">
					<div className="container navbar-container">
						<NavbarToggler onClick={this.toggle.bind(this)} id="toggler" />
						<NavbarBrand href="/" className="ml-auto mr-auto">
							<img src="/static/images/logo1.png" alt="" style={styles.logo} />
						</NavbarBrand>
						{currentUser &&
							<div id="shopping-cart-xs">
								<Link href={{ pathname: "/shopping-cart", props: { currentUser, cart } }}>
									<a className="btn btn-link" style={{ position: 'relative', padding: '.75em 0.5em' }}>
										<TiShoppingCart size={30} color="#eee" style={{ stroke: '#00A86B', strokeWidth: .6 }} />
										{cart && cart.courses.length >= 1 ?
											<div className="text-center" style={styles.shoppingCartNum}>{cart.courses.length}</div>
											: null}
									</a>
								</Link>
							</div>
							||
							<div id="shopping-cart-xs">
								<NavLink href="/"><TiShoppingCart size={30} color="#eee" style={{ stroke: '#00A86B', strokeWidth: .6 }} /></NavLink>
							</div>
						}
						<Collapse isOpen={this.state.isOpen} navbar id="colapse">
							{navBar}
						</Collapse>
					</div>
				</Navbar>
				<Auth
					modalOpen={modalOpen}
					closeModal={this.closeModalHandler}
					authMode={authMode}
					toggleForm={this.toggleForm}
				/>
			</div>
		);
	};
};

const styles = {
	navbar: {
		background: '#00A86B',
		zIndex: 999
	},
	navBtns: {
		cursor: 'pointer',
		padding: '1em .5em',
		fontWeight: 200
	},
	logo: {
		width: 130
	},
	shoppingCartNum: {
		position: 'absolute',
		top: 3,
		fontSize: 10,
		right: 4,
		color: '#00A86B',
		lineHeight: 1,
		height: 13,
		width: 13,
		borderRadius: 8,
		border: '1px solid #fff',
		backgroundColor: '#fff',
	},
	avatar: {
		height: 40,
		width: 40,
		borderRadius: 20,
		border: '2px solid #fff'
	},
	dropdownTriangle: {
		position: 'absolute',
		height: 0,
		width: 0,
		borderTop: '10px solid transparent',
		borderRight: '10px solid transparent',
		borderLeft: '10px solid transparent',
		borderBottom: '10px solid #fff',
		marginTop: -20,
		right: 40
	},
	dropdownUl: {
		position: 'absolute',
		right: 0,
		width: 250,
		borderRadius: 0,
		marginTop: -10
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.currentUser,
		cart: state.cart.cart,
		purchasedCourses: state.course.purchasedCourses
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onLogoutUser: () => dispatch(logoutUser()),
		getCart: () => dispatch(getCart()),
		getCurrentUser: () => dispatch(getSessionUser()),
		getPurchasedCourses: () => dispatch(getPurchasedCourses()),
		getCourse: (courseId) => dispatch(getCourse(courseId))
	}
}

export default Page(connect(mapStateToProps, mapDispatchToProps)(page));
