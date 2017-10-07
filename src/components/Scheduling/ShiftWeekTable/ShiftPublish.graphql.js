import { gql } from 'react-apollo';

export const updateWeekPublishedNameMutation = gql`
  mutation updateWeekPublishedById($id: Uuid!, $date: Datetime!) {
    updateWeekPublishedById(input:{ id: $id, weekPublishedPatch:{published: true, datePublished: $date}}){
      weekPublished{
        id
        published
        start
        end
      }
    }
  }`;

export const createWeekPublishedMutation = gql`
  mutation createWeekPublished ($data: CreateWeekPublishedInput!) {
    createWeekPublished(input: $data) {
      weekPublished {
        id
        start
        end
        published
      }
    }
  }`;

export const createShiftMutation = gql`
  mutation createShift ($data: CreateShiftInput!) {
    createShift(input: $data) {
      shift {
        id
        startTime
        endTime
        workersInvited
        workersAssigned
        workersRequestedNum
        instructions
        managersOnShift
        traineesRequestedNum
        unpaidBreakTime
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
  }`;

export const createWorkplacePublishedMutation = gql`
mutation createWorkplacePublished($workplacePublished: WorkplacePublishedInput!) {
 createWorkplacePublished(input: {workplacePublished: $workplacePublished}){
   workplacePublished {   
     id
     published
     workplaceId
     weekPublishedId
   }
 }
}`

export const updateWorkplacePublishedIdMutation = gql`
mutation($id: Uuid!, $workplacePublishedPatch: WorkplacePublishedPatch!){
  updateWorkplacePublishedById(input:{id:$id, workplacePublishedPatch: $workplacePublishedPatch}){
    workplacePublished{
      id
      published
    }
  }
}`


// Recurring shifts

export const findRecurring = gql`
  query ($brandId: Uuid!, $workplaceId: Uuid!) {
    allRecurrings(condition: { brandId: $brandId, workplaceId: $workplaceId }) {
      edges {
        node {
          id
        }
      }
    }
  }`;

export const createRecurring = gql`
  mutation createRecurring($data: CreateRecurringInput!) {
    createRecurring(input:$data) {
      recurring {
        id
        brandId
        workplaceId
      }
    }
  }`;

export const createRecurringShift = gql`
  mutation createRecurringShift($data: CreateRecurringShiftInput!){
    createRecurringShift(input:$data)
    {
      recurringShift {
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
  }`;
