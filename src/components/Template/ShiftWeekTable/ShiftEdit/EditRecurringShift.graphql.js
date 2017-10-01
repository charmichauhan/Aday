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
  mutation updateRecurringShiftById($data:UpdateShiftByIdInput!){
    updateRecurringShiftId(input:$data)
    {
      recurringShift {
        id
        startTime
        endTime
      }
    }
  }`;
