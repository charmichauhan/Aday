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

export const allShiftMarkets = gql`
   query($shiftId: Uuid!) {
    allMarkets(condition: { shiftId: $shiftId}) {
      edges {
        node {
          id
          workerId
          isBooked
        }
      }
    }
  }
`;

export const updateShiftMarket = gql`
  mutation updateMarketById($data:UpdateMarketByIdInput!){
    updateMarketById(input:$data)
    {
      market{
        id
        workerId
        isBooked
      }
    }
  }`;

  

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

export const createShiftMarket = gql`
 mutation createMarket($data:CreateMarketInput!){
  createMarket(input:$data)
  {
    market{
        id
    }
  }
}`

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
