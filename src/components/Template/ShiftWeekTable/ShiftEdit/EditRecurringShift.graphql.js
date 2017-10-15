import { gql } from 'react-apollo';

export const allUsersQuery = gql`
  query($positionId: Uuid!) {
    allJobs(condition: { positionId: $positionId, isPositionActive: true}) {
      edges {
        node {
          userByUserId {
            id
            firstName
            lastName
            avatarUrl
          }
        }
      }
    }
  }
`;

export const updateRecurringShift = gql`
  mutation updateRecurringShiftById($data:UpdateRecurringShiftByIdInput!){
    updateRecurringShiftById(input:$data)
    {
      recurringShift {
        id
        startTime
        endTime
      }
    }
  }`;

export const createRecurring = gql`
  mutation createRecurring($data: CreateRecurringInput!){
    createRecurring(input:$data)
    {
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

export const createRecurringShiftAssignee = gql`
  mutation createRecurringShiftAssignee($data: CreateRecurringShiftAssigneeInput!){
    createRecurringShiftAssignee(input:$data)
    {
      recurringShiftAssignee {
        recurringShiftId
        userId
        userByUserId{
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }`;

export const deleteRecurringShiftAssigneeById = gql`
  mutation deleteRecurringShiftAssigneeById($recurringShiftId: Uuid!, $userId: Uuid!){
    deleteRecurringShiftAssigneeByRecurringShiftIdAndUserId(
      input: {recurringShiftId: $recurringShiftId, userId: $userId}){
      recurringShiftAssignee{
        recurringShiftId
        userId
      }
    }
  }`;
