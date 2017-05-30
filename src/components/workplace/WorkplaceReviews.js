import React, { Component } from 'react';
import { Header, Rating, Label, Grid } from 'semantic-ui-react'
import Avatar from '../helpers/Avatar'

import './workplace.css'

export default class WorkplaceReviews extends Component {
	constructor(){
		super()
		this.state = {
			reviews: [
				{
					user: {
						first_name: "ADELE",
						last_name: "TRAVIS",
						avatar: "http://www.cazenovecapital.com/sysglobalassets/wmmediaassets/sng/imgs/people/angela_tan_160x160.jpg"
					},
					date: "May 23, 2017",
					rate: 4,
					total_ratings: 1,
					tags: [
						"TEAM MEMBERS",
						"CLEANLINESS"
					]
				}
			]
		}
	}
	render() {
		console.log(Date())
		return (
			<div className="workplace">
				<Header as="h4">WORKPLACE REVIEWS</Header>
				<br/>
				{
					this.state.reviews.map((review, i) => (
							<Grid
								className="workplace-review"
								key={i}>
								<Grid.Column width={3}>
									<Avatar
										src={review.user.avatar}
										first_name={review.user.first_name}
										last_name={review.user.last_name}
									/>
									<small>
									<Rating size="tiny" default={1} maxRating={1} disabled/>
									{review.total_ratings} review
									</small>
								</Grid.Column>
								<Grid.Column width={13}>
									<Rating defaultRating={review.rate} maxRating={5} disabled/>
									<br/>
									<small>{review.date}</small>
									<br/>
									<br/>
									{
										review.tags.map((t,i)=>(
											<Label size="mini" key={i}>{t}</Label>
										))
									}
								</Grid.Column>
							</Grid>

						)
					)
				}
			</div>
		);
	}
}
