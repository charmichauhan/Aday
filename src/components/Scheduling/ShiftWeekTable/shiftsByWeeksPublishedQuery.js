import React, { Component } from 'react'
import { gql} from 'react-apollo';

const allShiftsByWeeksPublished = gql `query allShiftsByWeeksPublished($publishId: Uuid!){
		        allShifts(condition: {weekPublishedId: $publishId}){
		                    edges {
		                        node {
		                            id
		                            startTime
		                            endTime
		                            workersInvited
		                            workersAssigned
		                            workersRequestedNum
		                            positionByPositionId{
		                            positionName
		                            positionIconUrl
		                                brandByBrandId {
		                                    brandName
		                                }
		                            }
		                            workplaceByWorkplaceId{
		                                workplaceName
		                            }
		                        }
		                    }
		            }
		}`

export default allShiftsByWeeksPublished