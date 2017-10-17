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
          shiftTagsByShiftId {
            nodes {
              tagId
              shiftId
              tagByTagId {
                id
                name
              }
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
