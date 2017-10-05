import { gql } from 'react-apollo';


const allTemplateShifts = gql`
  query recurringById ($id: Uuid!) {
    recurringById(id: $id){
          id
          workplaceByWorkplaceId{
            id
            workplaceName
          }
          recurringShiftsByRecurringId{
            edges{
              node{
                id
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
                      userByUserId{
                        firstName
                        lastName
                        avatarUrl
                      }
                    }
                  }
                }
              }
            }
          }
      }
}`


const findRecurring = gql`
  query  findRecurring($brandId: Uuid!, $workplaceId: Uuid!) {
    allRecurrings(condition: { brandId: $brandId, workplaceId: $workplaceId } ){
      edges{
        node{
          id
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


export { allTemplateShifts, allUsers, findRecurring }
