import React, { Component } from 'react';
import { Row, Col, CardTitle, Card } from 'react-materialize';
import Image from './sample-1.jpg';
import ThumbsUp from './thumbs_up.png';
import ThumbsDown from './thumbs_down.jpg';
import './style.css';

class Profile extends Component {
	constructor(props) {
		super(props);
	}

	render( ) {
		this.profile = this.props.profile;
		return (
			<div className="cont">
				<Card header={<CardTitle image={Image}>Tristan Rice, 18</CardTitle>} actions={<a />}>
					<div className="overflow_auto">
						<ul>
							<li>Lives in: Manchester, UK</li>
							<li>favuorite anime: Full Metal Alchemist</li>
							<li>
							</li>
							<li>
								<img src={ThumbsUp} className="circle_image circle_image_left" />
								<img src={ThumbsDown} className="circle_image circle_image_right" />
							</li>
						</ul>
					</div>
				</Card>
			</div>

		);
	}
}

export default Profile;