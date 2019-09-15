'use strict'

import React, { Component } from 'react';
import {
	TextInput,
	Button,
	Select,
	Textarea,
	DatePicker,
	Preloader
} from 'react-materialize';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "react-fontawesome";
import Api from '../../utils/api';
import './style.css';

// TODO: store data in localStorage to send to Api later
// TODO: polish up credentials screen

class Register extends Component {
	constructor(props) {
		super(props);

		this.data = {};

		this.state = {
			stage: 0
		};

		this.nextStage = this.nextStage.bind(this);

		this.components = [
			<Credentials nextStage={this.nextStage} />,
			<Preferences nextStage={this.nextStage} />,
			<Profile nextStage={this.nextStage} />,
			<LoadingBarUntilUserIsRegistered />
		];
	}

	nextStage(data) {
		this.setState({
			stage: this.state.stage+1
		});

		this.data = Object.assign(this.data, data);
	}

	render() {
		const component = [this.components[this.state.stage]];
		const renderProgressCounter = ( ) => {
			 let progressCircles = [];
			 for (let i = 0; i<=this.components.length-1; ++i) {
				 let _class = `progress_counter ${i===this.state.stage?"selected":""}`;
				 progressCircles.push(<div key={i} className={_class}></div>)
			 }
			 return progressCircles;
		}
		return (
			<div className="page">
				{component}
				<div className="progress_counter_container">
					{renderProgressCounter( )}
				</div>
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

		this.state = {
			passwordType: "password",
			iconClass: "eye",
			form: {
				"username": {},
				"email": {},
				"password": {},
				"password2": {}
			}
		};

		this.updateForm = this.updateForm.bind(this);
		this.allValid   = this.allValid.bind(this);
		this.nextStage  = this.nextStage.bind(this);
	}

	updateForm(e, isValid) {
		this.setState({
			form: {
				...this.state.form,
				[e.name]: {
					value: e.value,
					isValid: isValid
				}
			}
		});
	}

	allValid( ) {
		const values = Object.values(this.state.form);
		return !!(
			!values.map(elem => Object.keys(elem).length).includes(0) &&
			!values.map(elem => elem.isValid).includes(false)
		)
	}

	nextStage( ) {
		let form = this.state.form;
		Object.keys(form).map(elem => form[elem] = form[elem].value);
		this.props.nextStage(form);
	}

	render( ) {
		return (
				<div className="container">

					<span className="login_form_title">
						Welcome
					</span>

					<Credential
						name="username"
						placeholder="Username"
						unique={true}
						requirements={this.username_requirements}
						updateForm={this.updateForm}/>

					<Credential
						name="email"
						placeholder="Email"
						unique={true}
						requirements={this.email_requirements}
						updateForm={this.updateForm}/>

					<Credential
						name="password"
						placeholder="Password"
						requirements={this.password_requirements}
						type={this.state.passwordType}
						updateForm={this.updateForm}/>

					<Credential
						name="password2"
						placeholder="Re-enter your password"
						requirements={this.password_2_requirements}
						type="password"
						updateForm={this.updateForm}/>


					<Button
						waves="light"
						className="login_button"
						onClick={this.nextStage}
						disabled={!this.allValid()}>
						Continue
					</Button>

					<div class="separator">
						<Button waves="light" className="login_button" style={{"marginBottom": "15px"}}>
							<i className="fa fa-google"></i> Register with Google
						</Button>

						<Button waves="light" className="login_button">
							<i className="fa fa-facebook-f"></i> Register with Facebook
						</Button>
					</div>

					<div className="separator">
						<span className="info_txt">
							Already have an account? <a href="/login">Login</a>
						</span>
					</div>

				</div>
		);
	}
}

class Credential extends Component {
	constructor(props) {
		super(props);

		this.type = this.props.type || "text";

		this.state = {
			errMsg: "",
			hasValidated: false,
			value: "",
		};

		this.validClass = "";

		window[this.props.name] = "";

		this.onChange 		= this.onChange.bind(this);
		this.validate 		= this.validate.bind(this);
		this.onBlur   		= this.onBlur.bind(this);
		this.isTaken 		  = this.isTaken.bind(this);
	}

	onChange(e) {
		const value = e.target.value;
		const name  = e.target.name;
		window[this.props.name] = value;
		this.setState({value: value}, ( ) => {
			this.validate(value, name);
		});
	}

	validate(value, name) {
		this.setState({errMsg: this.props.requirements.map((item) => {
				if (!item.validate(this.state.value)) return item.msg
			}).find(elem => typeof elem === "string"), hasValidated: true
		}, ( ) => {
			this.props.updateForm({
				name: name,
				value: value
			}, !this.state.errMsg);
		});
	}

	isTaken( ) {
		if (!this.props.unique || !this.state.value) return;

		Api.get(`/api/user/${this.props.name}/${this.state.value}/isTaken`)
			.then((data) => {
				this.setState({
					errMsg: data.data.isTaken ? "That username is already taken": ""
				});
			})
			.catch(function(error) {
				console.log(error);
			});
	}

	onBlur(e) {
		if (!this.state.errMsg) this.isTaken( );

	}

	render( ) {
		if (this.state.hasValidated) {
			this.validClass = this.state.errMsg ? "invalid" : "valid";
		}

		return (
			<div>
				<TextInput
					placeholder={this.props.placeholder}
					onChange={this.onChange}
					onBlur={this.onBlur}
					className={this.validClass}
					error={this.state.errMsg}
					name={this.props.name}
					type={this.type}/>
			</div>
		);
	}
}


class SexualPreferences extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allDisabled: "",
			allSelected: false,
			man: false,
			woman: false,
			nonbinary: false
		}

		this.selectAll = this.selectAll.bind(this);
		this.checkBoxHandler = this.checkBoxHandler.bind(this);
	}

	selectAll( ) {
		this.setState({
			man: !this.state.man,
			woman: !this.state.woman,
			nonbinary: !this.state.nonbinary,
			allSelected: !this.state.allSelected,
			allDisabled: this.state.allDisabled ? "" : "disabled"
		});
	}

	checkBoxHandler(e) {
		const val = e.target.value;
		this.setState({[val]: !this.state[val]}, ( ) => {
			this.props.updateSexualPreferences({
				man: this.state.man,
				woman: this.state.woman,
				nonbinary: this.state.nonbinary
			});
		});
	}

	render( ) {
		return (
			<div className="sexual_preferences">

				<p>
		      <label>
		        <input
							name="preference"
							type="checkbox"
							className="filled-in"
							value="man"
							checked={this.state.allSelected || this.state.man}
							disabled={this.state.allDisabled}
							onChange={this.checkBoxHandler} />
		        <span>Man</span>
		      </label>
		    </p>

		    <p>
		      <label>
		        <input
							name="preference"
							type="checkbox"
							className="filled-in"
							value="woman"
							checked={this.state.allSelected || this.state.woman}
							disabled={this.state.allDisabled}
							onChange={this.checkBoxHandler} />
		        <span>Woman</span>
		      </label>
		    </p>

		    <p>
		      <label>
		        <input
							name="preference"
							type="checkbox"
							className="filled-in"
							value="nonbinary"
							checked={this.state.allSelected || this.state.nonbinary}
							disabled={this.state.allDisabled}
							onChange={this.checkBoxHandler} />
		        <span>Non-Binary person</span>
		      </label>
		    </p>

		    <p>
		      <label>
		        <input
							name="preference"
							type="checkbox"
							className="filled-in"
							onChange={this.selectAll}/>
		        <span>Anyone</span>
		      </label>
		    </p>

			</div>
		);
	}
}

class Preferences extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showGenderInput: false,
			gender: "",
			form: {
				gender: "",
				man: false,
				woman: false,
				nonbinary: false
			}
		};

		this.updateUserGender 			 = this.updateUserGender.bind(this);
		this.nextStage        			 = this.nextStage.bind(this);
		this.updateSexualPreferences = this.updateSexualPreferences.bind(this);
		this.allValid                = this.allValid.bind(this);
	}

	updateUserGender(e) {
		const value = e.target.value;
		this.setState({
			showGenderInput: value==="O",
			form: {
				...this.state.form,
				gender: value
			}
		});
	}

	updateSexualPreferences(preferences) {
		this.setState(Object.assign(this.state.form, preferences));
	}

	nextStage( ) {
		this.props.nextStage(this.state.form);
	}

	allValid( ) {
		return !(
			this.state.form.gender.length &&
			Object.values(this.state.form).find(elem => elem === true)
		);
	}

	render( ) {
		return (
			<div className="container">

				<span className="headline_text">I am a...</span>

				<Select name="Gender" onChange={this.updateUserGender}>
					<option disabled defaultSelected>Gender</option>
					<option value="M">Man</option>
					<option value="W">Woman</option>
					<option value="N">Non-Binary</option>
					<option value="O">Other</option>
				</Select>

				{this.state.showGenderInput &&
					<TextInput
						placeholder="Enter custom gender"
						onChange={this.updateUserGender}/>
				}

				<span className="headline_text bottom_space">Looking for a...</span>

				<SexualPreferences
					updateSexualPreferences={this.updateSexualPreferences}/>

				<Button
					waves="light"
					className="login_button"
					onClick={this.nextStage}
					disabled={this.allValid()}>
					Continue
				</Button>
			</div>
		);
	}
}

class File extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selctedFile: null,
			profilePictureUploaded: false
		};

		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		const file = event.target.files[0];
		this.setState({
			selectedFile: file,
			previewImage: URL.createObjectURL(file),
			profilePictureUploaded: true
		});
	}

	render() {
		return (
			<div>
				<div class="file-field input-field">
					<div class="btn">
						<span>File</span>
						<input
							type="file"
							onChange={this.onChange} />
					</div>
					<div class="file-path-wrapper">
						<input
							class="file-path validate"
							type="text"
							placeholder="Upload Profile Picture" />
					</div>
				</div>
					{this.state.profilePictureUploaded &&
						<div className="preview_image_container">
							<img className="preview_image" src={this.state.previewImage} />
						</div>
					}
			</div>
		);
	}
}

class Birthday extends Component {
	constructor(props) {
		super(props);

		this.opts = {
			autoClose: true,
			minDate: new Date("01/01/1900"),
			maxDate: new Date( ),
			onOpen: ( ) => console.log("heere")
		};

		this.state = {
			userIsOldEnough: true,
			dateOfBirth: ""
		};

		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		let d = new Date(e);
		const mili = Date.now( ) - d;
		const userAgeInYears = Math.floor(mili / 1000 / 60 / 60 / 24 / 365);
		const dateISOString = d.toISOString( ).substring(0,10);
		this.setState({
			userIsOldEnough: userAgeInYears >= 18,
			dateOfBirth: dateISOString
		});
		this.props.updateValue(e, dateISOString, "dateOfBirth");
	}

	render() {
		return (
			<div>
				<DatePicker
					placeholder="Date of Birth"
					className={this.state.userIsOldEnough ? "" : "invalid"}
					options={this.opts}
					onChange={this.onChange}
					error="You have to be over 18 to use this site"/>
			</div>
		);
	}
}

class FavouriteAnimes extends Component {
	constructor(props) {
		super(props);

		this.state = {
			favouriteAnimes: ["", "", ""]
		};

		this.saveData = this.saveData.bind(this);
	}

	saveData(e) {
		let favouriteAnimes = this.state.favouriteAnimes;
		favouriteAnimes[parseInt(e.target.name)-1] = e.target.value;
		this.setState({
			favouriteAnimes: favouriteAnimes
		}, ( ) => this.props.updateValue(
			e,
			this.state.favouriteAnimes,
			"favouriteAnimes"
		));
	}

	render() {
		const numberOfAnimes = this.props.numberOfAnimes;
		const animes = Array.from({length: numberOfAnimes}, (v,k)=>k+1).map(elem =>
			<li key={elem}>
				<TextInput
					data-length={this.props.length}
					name={elem}
					onChange={this.saveData}/>
			</li>
		)

		return (
			<div>
				<span class="header_text_relative">
					Enter your three favourite animes
				</span>
				<ol>{animes}</ol>
			</div>
		);
	}
}

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			description: "",
			dateOfBirth: "",
			favouriteAnimes: ["", "", ""]
		};

		this.updateValue = this.updateValue.bind(this);
		this.nextStage = this.nextStage.bind(this);
	}

	updateValue(e, inputFieldValue="", key="") {
		let formKey = key || e.target.name;
		let value = inputFieldValue || e.target.value;
		this.setState({
			[formKey]: value
		});
	}

	nextStage( ) {
		this.props.nextStage(this.state);
	}

	render() {
		return (
			<div className="container">

				<File />

				<Textarea
	 				placeholder="Description"
					data-length={160}
					name="description"
					onChange={this.updateValue}/>

				<Birthday
					updateValue={this.updateValue}/>

				<div class="separator">
					<FavouriteAnimes
						numberOfAnimes={3}
						length={20}
						updateValue={this.updateValue} />
				</div>

				<Button waves="light" className="login_button" onClick={this.nextStage}>
					Finish
				</Button>

			</div>
		);
	}
}

class LoadingBarUntilUserIsRegistered extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataHasBeenSentAndRecieved: false,
			userHasBeenCreatedSuccessfully: false
		};
	}

	componentDidMount( ) {
		const updateUserHasBeenCreated = (creationSuccessful) => this.setState({
			dataHasBeenSentAndRecieved: true,
			userHasBeenCreatedSuccessfully: creationSuccessful
		});

		Api.post("/api/user/register", this.props.data)
			.then(res => updateUserHasBeenCreated(res.err))
			.catch(updateUserHasBeenCreated(false));
	}

	render( ) {
		const userCreatedMessage = this.state.userHasBeenCreatedSuccessfully ? (
			"User has been created successfully"
		) : (
			"There was a problem creating your user, please try again"
		);

		return (
			<div>
				{this.state.dataHasBeenSentAndRecieved ? (
					<p>{userCreatedMessage}</p>
				) : (
					<Preloader flashing />
				)}
			</div>
		);
	}
}

export default Register;
