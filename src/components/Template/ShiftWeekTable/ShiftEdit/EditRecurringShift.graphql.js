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

export const createRecurringShift = gql`
  mutation createRecurringShift($data: CreateRecurringShiftInput!){
    createRecurringShift(input:$data)
    {
      recurringShift {
        id
        startTime
        endTime
      }
    }
  }`;

  export const createRecurringShiftAssignee = gql`
  mutation createRecurringShiftAssignee($data: CreateRecurringShiftAssigneeInput!){
    createRecurringShiftAssignees(input:$data)
    {
      recurringShiftAssignee {
        recurring_shift_id
        user_id
      }
    }
  }`;
