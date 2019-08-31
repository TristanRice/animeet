import React, { Component } from 'react';
import M from 'react-materialize';
import { TextInput } from 'react-materialize';

class Register extends Component {
	render() {
		return (
			<div>
				<Credentials />
			</div>
		);
	}
}

/*
requirements:

Username
between 3 and 15 characters
must be alphanumeric (ReGex: /^[a-z0-9]+$/i)
*/

class Credentials extends Component {
	constructor(props) {
		super(props);

		this.username_requirements = [
			{validate: value => value.length >= 3 && value.length <= 15,
			 msg: "Username must be between 3 and 15 characters long"
			},
			{validate: value => /^[a-z0-9]+$/i.test(value),
			 msg: "Username can only contain letters and numbers"
			}
		];

		this.email_requirements = [
			{validate: value => /\S+@\S+\.\S+/.test(value),
			 msg: "You must enter a valid email"
			}
		];

		this.password_requirements = [
			{validate: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_(=)])(?=.{8,})/.test(value),
			 msg: "Your password must contain a lowercase letter, an uppercase letter, a number, and a special character"
			}
		];

		this.password_2_requirements = [
			{validate: value => value === window.password,
			 msg: "Passwords must match"
			}
		];
	}

	render() {
		return (
			<div>
				<Input
					name="username"
					placeholder="Username"
					length={15}
					requirements={this.username_requirements}
				/>
				<Input
					name="email"
					placeholder="Email"
					requirements={this.email_requirements}
				/>
				<Input 
					name="password"
					placeholder="Password"
					requirements={this.password_requirements}
				/>
				<Input
					name="password2"
					placeholder="Re-enter your password"
					requirements={this.password_2_requirements}
				/>
			</div>
		);
	}
}

class Input extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isValid: true,
			errMsg: "",
			hasValidated: false
		}

		this.validClass = "";

		window[this.props.name] = ""

		this.onChange = this.onChange.bind(this);
		this.validate = this.validate.bind(this);
		this.onBlur   = this.onBlur.bind(this);
	}

	onChange(e) {
		window[this.props.name] = e.target.value;
		this.setState({value: e.target.value});
	}

	validate( ) {
		this.setState({hasValidated: true, errMsg: ""});
		let isValid = true;
		const requirements = this.props.requirements;
		for (let i = 0; i<requirements.length; ++i) {
			if (!requirements[i].validate(this.state.value)) {
				isValid = false;
				this.setState({errMsg: requirements[i].msg});
			}
		}
		this.setState({isValid: isValid});
	}

	onBlur(e) {
		this.validate( );

	}	

	render( ) {
		if (this.state.hasValidated) {
			this.validClass = this.state.isValid ? "valid" : "invalid";
		}
		return (
			<div>
				{this.props.length ? (
					<TextInput 
						placeholder={this.props.placeholder} 
						data-length={this.props.length}
						onChange={this.onChange}
						onBlur={this.onBlur}
						className={this.validClass}
						error={this.state.errMsg}
					/>
				) : (
					<TextInput 
						placeholder={this.props.placeholder} 
						onChange={this.onChange}
						onBlur={this.onBlur}
						className={this.validClass}
						error={this.state.errMsg}
					/>
				)}
			</div>
		);
	}
}

class Profile extends Component {
	render() {
		return (
			<div></div>
		);
	}
}

class Preferences extends Component {
	render() {
		return (
			<div></div>
		);
	}
}

export default Register;