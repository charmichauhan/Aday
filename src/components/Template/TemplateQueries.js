import { gql } from 'react-apollo';


const allTemplateShifts = gql`
  query allRecurrings ($brandId: Uuid!, $workplaceId: Uuid!) {
    allRecurrings(condition: { brandId: $brandId, workplaceId: $workplaceId } ){
      edges{
        node{
          id
          workplaceByWorkplaceId{
            id
            workplaceName
          }
          recurringShiftsByRecurringId{
            edges{
              node{
                startTime
                endTime
                workerCount
                isTraineeShift
                unpaidBreakTime
                instructions
                days
                positionByPositionId{
                  id
                  positionName
                  positionIconUrl
                }
                recurringShiftAssigneesByRecurringShiftId {
                  edges{
                    node{
                      userId
                    }
                  }
                }
              }
            }
          }
        }
      }
      }
}`

  const allUsers = gql`
      query allUsers {
          allUsers{
              edges{
                  node{
                      id
                      firstName
                      lastName
                      avatarUrl
                  }
              }
          }
      }
      `


export { allTemplateShifts, allUsers }
