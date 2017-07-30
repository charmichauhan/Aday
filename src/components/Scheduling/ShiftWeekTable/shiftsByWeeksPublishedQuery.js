import React, { Component } from 'react'
import { gql} from 'react-apollo';

const allShiftsByWeeksPublished = gql `query allShiftsByWeeksPublished($brandid: Uuid!, $day: Datetime!){
		        weekPublishedByDate(brandid: $brandid, day: $day){
		            nodes{
		            id
		            shiftsByWeekPublishedId{
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
		            }
		        }
		}`

export default allShiftsByWeeksPublished