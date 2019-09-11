import React, { Component } from 'react';
import Router from 'next/router'
import { withRouter } from 'next/router';
import Head from '../components/Head';
import Navbar from '../components/Navbar';
import Page from '../components/page';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import { getSessionUser, uploadAvatarPicture, saveProfileChanges } from '../store/actions';

class page extends Component {

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			lastName: "",
			username: "",
			email: "",
			avatarUrl: "",
			files: [],
			selectedFile: null,
			tmpPath: null,
			prevUrl: null,
			summary: ""
		};
	}

	componentDidMount() {
		//Checks if session exists.
		if (localStorage.getItem('token') !== null) {
			this.props.getCurrentUser()
				.then(res => {
					console.log(res);
					if (!this.props.currentUser) {
						Router.push('/');
					} else {
						const { name, lastName, username, email, summary, avatarUrl } = this.props.currentUser;
						this.setState({
							name: name,
							lastName: lastName,
							email: email,
							username: username,
							avatarUrl: avatarUrl,
							summary: summary
						});
					}
				})
				.catch(err => console.log(err));
		} else {
			Router.push('/');
		}
	}


	//Select avatar image handler.
	onSelectImageHandler = (files) => {
		const file = files[0];
		const path = URL.createObjectURL(file);
		const filesAccepted = [];

		filesAccepted.unshift({ url: path });
		this.setState({
			files: filesAccepted,
			selectedFile: file,
			tmpPath: path,
		})
	}
	//Upload avater handler.
	onUploadImageHandler = () => {
		const prevUrl = this.state.prevUrl;
		const file = this.state.selectedFile;
		const formData = new FormData();

		formData.append('file', file);
		formData.append('prevUrl', prevUrl);

		this.setState({
			selectedFile: null
		});

		this.props.onUploadAvatarPicture(formData);
	}
	//Changes state when input change.
	onChangeHandler = (key, e) => {
		this.setState({
			[key]: e.target.value
		})
	}
	//Save profile changes.
	onSaveChangesHandler = () => {
		const { name, lastName, email, username, summary } = this.state;
		this.props.onSaveProfileChanges({ name, lastName, email, username, summary })
	}

	render() {
		const { avatarUrl } = this.state;
		const { username, email, tmpPath, selectedFile } = this.state;
		let teacherProfile = null;

		if (this.props.currentUser && this.props.currentUser.teacher) {
			const { name, lastName, summary } = this.state;
			teacherProfile = (

				<div className="col-md-12">
					<div className="form-group row">
						<label htmlFor="name" className="col-md-3 col-form-label text-secondary">Name:</label>
						<div className="col-md-9">
							<input
								className="form-control"
								id="name"
								type="text"
								placeholder={name}
								onChange={this.onChangeHandler.bind(this, "name")}
							/>
						</div>
					</div>

					<div className="form-group row">
						<label htmlFor="lastName" className="col-md-3 col-form-label text-secondary">Last Name:</label>
						<div className="col-md-9">
							<input
								className="form-control"
								id="lastName"
								type="text"
								placeholder={lastName}
								onChange={this.onChangeHandler.bind(this, "lastName")}
							/>
						</div>
					</div>

					<label htmlFor="summary" className="text-secondary">Resume: </label>
					<textarea
						id="summary"
						className="form-control"
						rows="10"
						style={{ resize: 'none' }}
						placeholder={summary}
						onChange={this.onChangeHandler.bind(this, "summary")}
					/>
				</div>

			)
		}

		return (
			<div style={{ height: '100vh', overflow: 'hidden', background: '#eee' }}>
				<Head />
				<Navbar />
				<div style={styles.container}>
					<div className="container-fluid py-5">
						<div className="row justify-content-center">
							<div className="col-12 col-md-7">
								{this.props.message &&
									<div className="alert alert-info">{this.props.message}</div>
								}
								<h3 className="text-secondary text-center">My Profile</h3>
							</div>
						</div>

						<div className="row mt-4 justify-content-center">
							<div className="col-12 col-sm-9 col-md-7 col-lg-6 mt-4">
								<div className="row justify-content-center align-items-center">
									<div className="col-12 col-md-6 text-center">
										<img
											className="img-thumbnail rounded-circle shadow"
											src={
												tmpPath ? tmpPath : avatarUrl || "/static/images/user.jpg"
											}
											alt=""
											style={styles.image}
										/>
									</div>
									<div className="col-12 col-md-6 mt-3 mt-md-0">
										<div className="custom-file">
											<div className="input-group mb-3">
												<div className="custom-file">
													<label className="custom-file-label" htmlFor="inputGroupFile01">
														{selectedFile ? selectedFile.name : "Chose file"}
													</label>
													<input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"
														onChange={(e) => this.onSelectImageHandler(e.target.files)}
													/>
												</div>
											</div>
											<div>
												<button
													className="btn btn-primary btn-block"
													onClick={this.onUploadImageHandler}
												>Upload</button>
											</div>
										</div>
									</div>
									<div className="col-md-12 mt-4">
										<div className="form-group row">
											<label htmlFor="username" className="col-md-3 col-form-label text-secondary">Username:</label>
											<div className="col-md-9">
												<input
													className="form-control"
													id="username"
													type="text"
													placeholder={username}
													onChange={this.onChangeHandler.bind(this, "username")}
												/>
											</div>
										</div>
									</div>
									<div className="col-md-12">
										<div className="form-group row">
											<label htmlFor="email" className="col-md-3 col-form-label text-secondary">Email:</label>
											<div className="col-md-9">
												<input
													className="form-control"
													id="email"
													type="text"
													placeholder={email}
													onChange={this.onChangeHandler.bind(this, "email")}
												/>
											</div>
										</div>
									</div>
									{teacherProfile}
									<div className="col-md-12 text-secondary mt-3">
										<small className="">* In order to edit your info, write in the fields normaly and click save.</small>
										<button
											className="btn btn-primary float-right"
											onClick={this.onSaveChangesHandler.bind(this)}
										>
											Save
									</button>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

const styles = {
	container: {
		height: '88%',
		background: '#eee',
		overflowY: 'auto',
		paddingBottom: '1em'
	},
	image: {
		maxWidth: 150,
		maxHeight: 150
	},
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.currentUser,
		message: state.ui.alertMessage
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getCurrentUser: () => dispatch(getSessionUser()),
		onUploadAvatarPicture: (formData) => dispatch(uploadAvatarPicture(formData)),
		onSaveProfileChanges: (body) => dispatch(saveProfileChanges(body))
	}
}

export default Page(connect(mapStateToProps, mapDispatchToProps)(page));
