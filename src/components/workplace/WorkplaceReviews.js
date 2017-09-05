import React, { Component } from 'react';
import { Rating, Label, Grid } from 'semantic-ui-react'
import Avatar from '../helpers/Avatar'
import { gql, graphql} from 'react-apollo';
import './MyWorkplace.css';
import moment from 'moment';

class WorkplaceReviews extends Component {
	constructor(){
		super()
		this.state = {
			nodes: [
				{
					rating: 4,
					ratingDate: moment("May 23, 2017"),
					comment: "Clean",
					userByRateeId: {
		        firstName: "ADELE",
		        lastName: "TRAVIS",
		        avatarUrl: "http://www.cazenovecapital.com/sysglobalassets/wmmediaassets/sng/imgs/people/angela_tan_160x160.jpg"
		      }
				},
				{
					rating: 4,
					ratingDate: moment("May 23, 2017"),
					comment: "Clean",
					userByRateeId: {
		        firstName: "ANNE",
		        lastName: "TRINKLE",
		        avatarUrl: "http://www.cazenovecapital.com/sysglobalassets/wmmediaassets/sng/imgs/people/angela_tan_160x160.jpg"
		      }
				}
			]
		}
	}
	render() {
		console.log(this.props.data);
		let reviews = this.state.nodes;
		return (
			<div className="workplace">
				<div className="reviews-header">WORKPLACE REVIEWS</div>
				<br/>
				{



					reviews.map((review, i) => (

						
							<Grid
								className="workplace-review"
								key={i}>
								<Grid.Column width={3}>
									<Avatar
										src={review.userByRateeId.avatarUrl}
										first_name={review.userByRateeId.firstName}
										last_name={review.userByRateeId.lastName}
									/>
								</Grid.Column>

								<Grid.Column width={13}>
									<Rating defaultRating={review.rating} maxRating={5} disabled/>
									<br/>
									<small>{review.ratingDate.format('MMMM Do YYYY')}</small>
									<br/>
									<div>{review.comment}</div>
								</Grid.Column>
							</Grid>

						)
					)
				}
			</div>
		);
	}
}

const reviewsQuery = gql`
	query($workplaceId: Uuid!){
	  allRatings(condition:{workplaceId:$workplaceId}){
	    nodes{
	      rating
	      ratingDate
	      comment
	      userByRateeId{
	        firstName
	        lastName
	        avatarUrl
	      }
	    }
	  }
	}
`

export default graphql(reviewsQuery, {
	options: (ownProps) => ({
		variables: {
			workplaceId: localStorage.getItem('workplaceId') ,
		}
	}),
})(WorkplaceReviews);
