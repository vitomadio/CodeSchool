/*Sign in form modal:
Properties.
-modalOpen
-closeModal
-onChangeHandler
-headerTextColor
-headerColor
-btnDisable
-onSubmitForm
-toggleForm
-authMode
*/
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const SigninFromModal = (props) => {
	const loginForm = (
		<div>
		<input 
		name="email" 
		id="email" 
		type="email"
		onChange={props.onChangeHandler.bind(this, "email")} 
		className="form-control form-control-lg mt-3"
		value={props.email.value}
		placeholder="Email Address"
		/>
		<input 
		name="password" 
		id="pwd" 
		type="password"
		onChange={props.onChangeHandler.bind(this, "password")} 
		className="form-control form-control-lg mt-3"
		value={props.password.value}
		placeholder="Password"
		/>
		</div>
		)

	return (
		<div>
		<Modal 
		isOpen={props.modalOpen} 
		centered={true}
		style={{borderRadius:'0px !important'}}
		>
		<ModalHeader 
		toggle={props.closeModal}
		style={{background:props.headerColor,color:props.headerTextColor,borderRadius:0}}
		>
		{props.authMode==="signup"?"Signup":"Login"}
		</ModalHeader>
			<ModalBody 
			className="px-4"
			
			>
			{props.authMode === "signup" ? 
				<div>
					<input 
					name="username" 
					id="username" 
					onChange={props.onChangeHandler.bind(this, "username")} 
					className="form-control form-control-lg mt-3"
					value={props.username.value}
					placeholder="Username"
					/>
					<input 
					name="email" 
					type="email"
					id="email" 
					onChange={props.onChangeHandler.bind(this, "email")} 
					className="form-control form-control-lg mt-3"
					value={props.email.value}
					placeholder="Email Address"
					/>
					<input 
					name="password" 
					id="pwd"
					type="password" 
					onChange={props.onChangeHandler.bind(this, "password")} 
					className="form-control form-control-lg mt-3"
					value={props.password.value}
					placeholder="Password"
					/>
					<input 
					name="confirm" 
					id="confirm" 
					type="password"
					onChange={props.onChangeHandler.bind(this, "confirm")} 
					className="form-control form-control-lg mt-3"
					value={props.confirm.value}
					placeholder="Confirm your password"
					/>
				</div>
				: loginForm }
				<div className="text-center">
					{props.btnDisabled ? 
					<button 
					type="submit" 
					className="btn btn-block btn-primary btn-lg mt-3"
					disabled
					>
					Submit
					</button>
					:
					<button 
					type="submit" 
					className="btn btn-block btn-primary btn-lg mt-3"
					onClick={props.onSubmitForm}
					>
					Submit
					</button>
					}
				</div>
			</ModalBody>
			<ModalFooter className="text-center">
				<button 
				className="btn btn-link mr-auto ml-auto"
				onClick={props.toggleForm}
				>
				{props.authMode === "login" ? 
					"Don't you have a CodeSchool account yet?" : 
					"I have a CodeSchool account already!"}
				</button>
			</ModalFooter>
		</Modal>
	</div>
	);
};



export default SigninFromModal;
