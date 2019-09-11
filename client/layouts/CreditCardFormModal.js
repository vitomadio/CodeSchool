import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import Page from '../components/page';

const CreditCardModal = (props) => {

    const {modalOpen} = props
	const monthsList = [1,2,3,4,5,6,7,8,9,10,11,12];
	const date = new Date(Date.now());
	const y = date.getFullYear();
	const yearsList = [];

	let i=0
	while(i<5){
		yearsList.push(y+i)
		i++
	}

	const years = yearsList.map((year, i) => {
		return (
				<option key={i} value={year}>{year}</option>
			)
	});

	const months = monthsList.map((month, i) => <option key={i} value={month}>{month}</option>);

	return (
		
		<Modal 
		isOpen={modalOpen}
		centered={true}
		style={{borderRadius:'0px !important'}}
		>
		<ModalHeader 
		toggle={props.closeModal}
		style={{background:'#003087',color:'#fff',borderRadius:0}}
		>
		Credit Card Information
		</ModalHeader>
			<ModalBody className="px-4">
				<div>
					<input 
					name="name" 
					id="name" 
					onChange={props.onChangeHandler("name")} 
					className="form-control form-control-lg mt-3"
					
					placeholder="Name"
					/>
					<input 
					name="lastName" 
					type="input"
					id="lastName" 
					onChange={props.onChangeHandler("lastName")} 
					className="form-control form-control-lg mt-3"
					
					placeholder="Last Name"
					/>
					<FormGroup tag="fieldset" className="row mt-3 pl-4 no-gutters">
					<FormGroup check className="col-md-2">
					<Label check>
					  <Input 
					  type="radio" 
					  name="radio1"
					  onChange={props.onCheckboxChangeHandler.bind(this,'VISA')}
					  />{' '}
					  Visa
					</Label>
					</FormGroup>
					<FormGroup check className="col-md-3">
					<Label check>
					  <Input 
					  type="radio" 
					  name="radio1"
					  onChange={props.onCheckboxChangeHandler.bind(this,'MASTER')}
					  />{' '}
					  Master
					</Label>
					</FormGroup>
					</FormGroup>
					<input 
					name="ccnumber" 
					id="ccnumber"
					type="input" 
					onChange={props.onChangeHandler("ccnumber")} 
					className="form-control form-control-lg mt-3"
					placeholder="Credit Card Number"
					/>
					<div className="row mt-3 align-items-center no-gutters">
						<div className="col-md-4 text-center"><p className="mb-0">Expiration date</p></div>
						<div className="col-md-3 mr-2">
							<select className="custom-select" name="month" id="month"
							onChange={props.onSelect.bind(this, 'month')}
							>
							<option className="rounded-0">Month</option>
							{months}
							</select>
						</div>
						<div className="col-md-3">
							<select className="custom-select " name="year" id="year"
							onChange={props.onSelect.bind(this, 'year')}
							>
							<option className="rounded-0">Year</option>
							{years}
							</select>
						</div>
					</div>
					<input 
					name="cvv" 
					id="cvv"
					type="input" 
					onChange={props.onChangeHandler("cvv")} 
					className="form-control form-control-large mt-3 col-2"
					placeholder="CVV"
					/>
				</div>
			</ModalBody>
			<ModalFooter className="text-center">
			<button 
			className="btn btn-secondary btn-lg" 
			onClick={props.onCancelButton}
			>
			Cancel
			</button>
			<button 
			className="btn  btn-info btn-lg"
			onClick={props.onPayButton}
			>
			Pay
			</button>
			</ModalFooter>
		</Modal>
	
	);

	
};


export default CreditCardModal;


