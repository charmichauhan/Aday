import { gql } from 'react-apollo';

const workplaceInfo = gql`
	query($workplaceId: Uuid!){
		workplaceById(id:$workplaceId){
			workplaceName
			brandByBrandId{
				brandName
				brandIconUrl
			}
			address
			workplaceImageUrl
			isRatingsPublic
			opportunitiesByWorkplaceId (condition: {isPublic: true}){
				nodes{
					positionByPositionId{
						positionName
						positionIconUrl
					}
				}
			}
			ratingsByWorkplaceId{
				nodes{
				rating
				ratingDate
				comment
				userByRaterId{
					firstName
					lastName
					avatarUrl
				}
			}
			}
		}
	}
`

export { workplaceInfo };
