import { gql } from 'react-apollo';


const allTemplateShifts = gql`
  query recurringById ($id: Uuid!) {
    recurringById(id: $id){
          id
          workplaceByWorkplaceId{
            id
            workplaceName
          }
          recurringShiftsByRecurringId(condition: { expired: false }){
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


const allRecurrings = gql`
  query  allRecurrings($brandId: Uuid!) {
    allRecurrings(condition: { brandId: $brandId } ){
      edges{
        node{
          id
          workplaceId
          brandId
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


export { allTemplateShifts, allUsers, allRecurrings }
