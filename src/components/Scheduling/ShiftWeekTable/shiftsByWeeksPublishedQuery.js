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
          marketsByShiftId {
            nodes {
              id
              workerId
              shiftId
              shiftExpirationDate
              isTexted
              isCalled
              isBooked
              isEmailed
              isPhoneAnswered
              workerResponse
              marketRulesByMarketId {
                nodes {
                  ruleByRuleId {
                    ruleName
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

export default allShiftsByWeeksPublished
