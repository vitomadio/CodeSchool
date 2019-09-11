import React, { Component } from 'react';
import Head from '../components/Head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Page from '../components/page';
import { connect } from 'react-redux';
import { getSessionUser, getCart, removeFromCart, createOrder } from '../store/actions';
import Button from '../components/Button';
import Router from 'next/router';
import { withRouter } from 'next/router';

class page extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (localStorage.getItem('token') !== null) {
			if (!this.props.currentUser) {
				this.props.getCurrentUser();
				this.props.getCart();
			}
		} else {
			Router.push('/')
		}
	}

	//Remove item from cart.
	onRemoveItemHandler = (item, e) => {
		this.props.removeFromCart(item._id);
	}

	//Continue shopping handler.
	onContinueShoppingHandler = (e) => {
		Router.push('/', { shalow: true });
	}

	//Checkout button.
	onCheckoutHandler = (e) => {
		const { cart } = this.props;
		this.props.onCreateOrder(cart);
		Router.push('/checkout');
	}

	render() {
		const { cart } = this.props;
		let total = 0;
		if (cart) {
			this.props.cart.courses.map(item => {
				return total = total + item.price
			});
		}

		let items = null;

		if (cart && cart.courses.length >= 1) {
			items = cart.courses.map(item => {
				return (
					<div
						className="col-12  px-5"
						key={item._id}
						style={styles.itemWrapper}
					>
						<div className="row justify-content-between">
							<div className="col-md-3" >
								<img src={item.featureUrl} alt="" style={styles.img} />
							</div>
							<div className="col-md-9 d-flex flex-column">
								<h4 className="text-dark text-right flex-1">{item.title}</h4>
								<div className="text-right text-secondary flex-1 mb-auto">
									Price
				    			<p className="text-dark d-inline ml-2">${item.price}</p>
								</div>
								<div
									className="btn btn-primary align-self-end float-right"
									onClick={this.onRemoveItemHandler.bind(this, item)}
								>
									Remove item
			    			</div>
							</div>

						</div>
						<div className="row p-3">
							<div className="col-md-12" style={{ height: 1, background: '#ccc' }}></div>
						</div>
					</div>
				)
			});
		}

		return (
			<div style={{ height: '100%' }}>
				<Head />
				<Navbar />
				<div className="container-fluid" style={styles.container}>
					<div className="row bg-white py-4">
						<div className="text-center col-md-12 mb-3">
							<h3 className="text-secondary">
								{cart && cart.courses.length >= 1 ? "Shopping Cart" : "Hey! your shopping cart is empty."}
							</h3>
						</div>
						{items}
						<div className="col-md-11 text-right"><h5 className="text-right d-inline text-secondary mr-2">Total: </h5><h4 className="d-inline text-dark"> ${total}</h4></div>
					</div>
					{cart && !cart.courses.length >= 1 &&
						<div className="row justify-content-center">
							<div className="col-md-4 pt-3">
								<Button
									bgColor="#4B5771"
									txtColor="#fff"
									text="Continue shopping"
									onClick={this.onContinueShoppingHandler.bind(this)}
								/>
							</div>
						</div>
					}
					{cart && cart.courses.length >= 1 &&
						<div className="row justify-content-around">
							<div className="col-md-4 pt-4">
								<Button
									bgColor="#4B5771"
									txtColor="#fff"
									text="Continue shopping"
									onClick={this.onContinueShoppingHandler.bind(this)}
								/>
							</div>
							<div className="col-md-4 pt-4">
								<Button
									bgColor="#00A86B"
									txtColor="#fff"
									text="Proceed to checkout"
									onClick={this.onCheckoutHandler.bind(this)}
								/>
							</div>
						</div>
					}
				</div>
				<Footer />
			</div>

		);
	}
}

const styles = {
	container: {
		height: '87%',
		background: '#ddd',
		padding: '3em 12em',
		overflowY: 'auto'
	},
	img: {
		width: '100%'
	}
}

const mapStateToProps = state => {
	return {
		cart: state.cart.cart,
		currentUser: state.user.currentUser
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getCurrentUser: () => dispatch(getSessionUser()),
		getCart: () => dispatch(getCart()),
		removeFromCart: (itemId) => dispatch(removeFromCart(itemId)),
		onCreateOrder: (cart) => dispatch(createOrder(cart))
	}
}

export default Page(connect(mapStateToProps, mapDispatchToProps)(page));

