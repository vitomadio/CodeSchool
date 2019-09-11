import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Page from '../components/page';
import Head from '../components/Head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import CreditCardModal from '../layouts/CreditCardFormModal';
import { getOrder, removeOrder, payWithCard, paypalPayment, successPayment, removeCart } from '../store/actions';
import { MdPayment } from 'react-icons/md';
import { FaCcPaypal, FaSpinner } from 'react-icons/fa';

class page extends Component {

	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			type: "",
			ccnumber: "",
			month: "",
			year: "",
			cvv: "",
			name: "",
			lastName: ""
		}
	}

	componentDidMount() {
		this.props.getOrder();
		const urlParams = new URLSearchParams(location.search);
		if (urlParams.get('paymentId')) {
			const query = location.href.split('?')[1]
			this.props.onSuccessPayment(query, this.props.order);
		}
	}
	//Cancel order and go back to cart.
	onCancelOrderHandler = () => {
		Router.push('/shopping-cart')
		this.props.onRemoveOrder();
	}
	//Pay with credit card handler.
	onCreditCardPaymentHandler = (total, e) => {
		this.setState({
			modalOpen: true,
			totalAmt: total
		})
	}
	//Pay with Paypal handler.
	onPayPalPaymentHandler = (total, e) => {
		const { order } = this.props
		this.props.onPaypalPayment(total, order)

	}
	//Close Credit Card Modal .
	closeCreditCardModalHandler = () => {
		this.setState({
			modalOpen: false
		})
	}
	//Handles inputs changing content.
	onChangeHandler = (key, e) => {
		this.setState({
			[key]: e.target.value
		})
	}
	//Handles checkboxes selection.
	onCheckboxChangeHandler = (key, e) => {
		this.setState({ type: key })
	}
	onSelectChangeHandler = (key, e) => {
		this.setState({
			[key]: e.target.value
		})
	}
	//Handles Pay action.
	onPayButtonHandler = () => {
		const { name, lastName, type, ccnumber, month, year, cvv, totalAmt } = this.state;
		const body = {
			name: name,
			lastName: lastName,
			type: type,
			ccnumber: ccnumber,
			month: month,
			year: year,
			cvv: cvv,
			totalAmt: totalAmt
		}
		this.props.onPayWithCard(body);
		this.setState({ modalOpen: false });
		Router.push('/');
	}

	//Handles cancel action.
	onCancelButtonHandler = () => {
		this.setState({ modalOpen: false });
	}

	render() {
		const { modalOpen } = this.state;
		const { order, router } = this.props;
		let items = null;
		let total = 0;

		if (order) {
			items = order.courses.map(course => {
				return (
					<li className="list-group-item" style={styles.item} key={course._id}>
						<div className="row align-items-center justify-content-center justify-content-md-none">
							<div className="col-auto mb-1 mb-ml-0">
								<img src={course.featureUrl}
									style={styles.img} alt="" />
							</div>
							<div className="col-auto"><h4 className="mb-1 mb-md-0 text-secondary">{course.title}</h4></div>
							<div className="col-auto flex-grow ml-0 ml-md-auto mr-3">
								<h5 className="mb-0">
									<p className="d-inline text-secondary font-weight-light mr-3">price. </p>${course.price}
								</h5>
							</div>
						</div>
					</li>
				)
			});

			for (var i = 0; i < order.courses.length; i++) {
				total = total + order.courses[i].price
			}
		}

		return (
			<div style={styles.container}>
				<Head />
				<Navbar />
				<style>
					{
						`
							#loader{
									-webkit-animation:spin 4s linear infinite;
									-moz-animation:spin 4s linear infinite;
									animation:spin 4s linear infinite;
							}

							@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
							@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
							@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
					`
					}
				</style>
				<CreditCardModal
					modalOpen={modalOpen}
					closeModal={this.closeCreditCardModalHandler}
					onChangeHandler={(key) => this.onChangeHandler.bind(this, key)}
					onCheckboxChangeHandler={(key, e) => this.onCheckboxChangeHandler(key, e)}
					onSelect={(key, e) => this.onSelectChangeHandler(key, e)}
					onPayButton={this.onPayButtonHandler.bind(this)}
					onCancelButton={this.onCancelButtonHandler.bind(this)}
				/>
				{this.props.loader &&
					<div style={{ position: 'absolute', width: '100%', height: '90%', background: 'rgba(255,255,255,0.95)', zIndex: 998 }}>
						<div style={{ position: 'absolute', zIndex: 999, left: '50%', marginLeft: -50, top: '40%', maginTop: -50 }}>
							<FaSpinner size={100} color="#19B079" id="loader" />
						</div>
						<div style={{ position: 'absolute', top: '55%', left: '50%', marginLeft: -150, width: 300 }}><p className="text-secondary text-center">Your payment is being processing...</p></div>
					</div>
				}
				<div className="container pt-5" style={styles.wrapper}>
					<div className="row justify-content-center">
						{this.props.message &&
							<div className="alert alert-info "><h3>{this.props.message}</h3></div>
						}
						<div className="col-md-12">
							<ul className="group-list pt-5 bg-white px-3 pb-5">
								<h2 className="text-center text-secondary mb-4">Checkout Order</h2>
								{items ? items : null}
								<hr />
								<h4 className="text-right text-dark mr-5">Total. {total}</h4>

							</ul>
							<div className="row mt-3 justify-content-center align-items-center">
								<div className="col-md-3">
									<Button
										textStyle={{ fontSize: 22 }}
										bgColor="#003087"
										txtColor="#fff"
										text="Pay with Credit Card"
										icon={<MdPayment size={30} color="#fff" className="ml-2 float-left" />}
										onClick={this.onCreditCardPaymentHandler.bind(this, total)}
									/>
								</div>
								<div className="col-md-3 mt-md-0 mt-2">
									<Button
										textStyle={{ fontSize: 24 }}
										bgColor="#003087"
										txtColor="#fff"
										text="PayPal"
										icon={<FaCcPaypal size={30} color="#fff" className="ml-2 float-left" />}
										onClick={this.onPayPalPaymentHandler.bind(this, total)}
									/>
								</div>
							</div>
							<hr />
							<div className="row mt-4 justify-content-center">
								<div className="col-md-3">
									<Link href="/payment-form">
										<Button
											bgColor="#4B5771"
											txtColor="#fff"
											text="Cancel order"
											onClick={this.onCancelOrderHandler.bind(this)}
										/>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	};
}

const styles = {
	container: {
		height: '100%',
		background: '#ddd',
		position: 'relative'
	},
	wrapper: {
		height: '86vh'
	},
	img: {
		width: 100
	},
	item: {
		border: '0px'
	}
}

const mapStateToProps = state => {
	return {
		order: state.cart.order,
		loader: state.ui.loaderSpinner,
		message: state.ui.alertMessage
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getOrder: () => dispatch(getOrder()),
		onRemoveOrder: () => dispatch(removeOrder()),
		onPayWithCard: (body) => dispatch(payWithCard(body)),
		onPaypalPayment: (total, order) => dispatch(paypalPayment(total, order)),
		onSuccessPayment: (query) => dispatch(successPayment(query))
	}
}


export default withRouter(Page(connect(mapStateToProps, mapDispatchToProps)(page)));
