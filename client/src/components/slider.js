import React, { Component } from 'react';
import Profile from './profile/profile';

class Slider extends Component {
	constructor(props) {
		super(props);

		//just to start off with when the page loads we should load around 5 profiles
		const profiles = this.getProfiles(5); 

		this.state = {
			profiles: profiles,
			currentProfile: profiles.shift()

		}

		this.getProfiles    = this.getProfiles.bind(this);
		this.swipeLeft      = this.swipeLeft.bind(this);
		this.updateProfiles = this.updateProfiles.bind(this);
	}

	getProfiles(num=1) {
		const profiles = [];
		for (let i = 0; i<num; ++i) {
			profiles.push({
				firstName: Math.random(),
				lastName: "Rice",
				bio: "My name is Tristan and I like anime",
				favAnime: "Full Metal Alchemist"
			});
		}

		return profiles;
	}

	updateProfiles(profile) {
		this.state.profiles.push(profile);
		this.setState({
			currentProfile: this.state.profiles.shift()
		});
	}

	swipeLeft( ) {
		//first tell the server that they like this person
		const profile = this.getProfiles(1)[0];
		this.updateProfiles(profile);

	}

	render() {
		return (
			<div>
				<Profile profile={this.state.currentProfile} />
				<button onClick={this.swipeLeft}>aaaaa</button>
			</div>
		);
	}
}

export default Slider;