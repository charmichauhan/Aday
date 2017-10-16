import React, { Component } from 'react'
import { gql } from 'react-apollo';

const allShiftsByWeeksPublished = gql`
  query allShiftsByWeeksPublished ($publishId: Uuid!) {
    allShifts(condition: { weekPublishedId: $publishId }) {
      edges {
        node {
          id
          startTime
          endTime
          workersInvited
          workersAssigned
          workersRequestedNum
          managersOnShift
          unpaidBreakTime
          instructions
          traineesRequestedNum
          traineesAssigned
          recurringShiftId
          weekPublishedId
          recurringShiftId
          positionByPositionId {
            id
            positionName
            positionIconUrl
            brandByBrandId {
              id
              brandName
            }
          }
          workplaceByWorkplaceId {
            id
            workplaceName
            address
          }
        }
      }
    }
  }`;

export default allShiftsByWeeksPublished
