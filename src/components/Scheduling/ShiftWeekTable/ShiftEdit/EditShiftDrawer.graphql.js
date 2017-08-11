import { gql } from 'react-apollo';

export const allUsersQuery = gql`
  query($positionId: Uuid!) {
    allJobs(condition: { positionId: $positionId}) {
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

export const deleteShiftMutation = gql`
  mutation($clientMutationId: String,$id: Uuid!){
    deleteShiftById(
      input: {clientMutationId: $clientMutationId,
        id: $id}){
      shift{
        id
      }
    }
  }`;

export const updateShiftMutation = gql`
  mutation updateShiftById($data:UpdateShiftByIdInput!){
    updateShiftById(input:$data)
    {
      shift{
        id
        startTime
        endTime
        workersInvited
        workersAssigned
        workersRequestedNum
        instructions
        traineesRequestedNum
        managersOnShift
        unpaidBreakTime
        positionByPositionId{
          id
          positionName
          positionIconUrl
          brandByBrandId {
            id
            brandName
          }
        }
        workplaceByWorkplaceId{
          id
          workplaceName
        }
      }
    }
  }`;
