import { gql } from 'react-apollo';

const requestFragment = gql`
  fragment RequestData on TimeOffRequestsConnection {
    edges{
      node{
        userByRequestorId{
          firstName
          lastName
        }
        id
        startDate
        endDate
        submissionDate
        requestType
        minutesPaid
        payDate
        notes
        decisionStatus
      }
    }
  }
`

const corporationTimeOffRequestQuery = gql`
  query ($corporationId: Uuid!){
    allTimeOffRequests(
        condition: {corporationId: $corporationId}
        orderBy: START_DATE_DESC){
      ...RequestData
    }
  }
  ${requestFragment}
`

const approveTimeOffRequestMutation = gql`
  mutation ($clientMutationId: String!, $id: Uuid!, $decision: TimeOffDecisionStatus!, $approverId: Uuid){
    updateTimeOffRequestById(
      	input: {clientMutationId: $clientMutationId,
    		id: $id,
    		timeOffRequestPatch: {decisionStatus: $decision, approverId: $approverId}}){
      timeOffRequest{
        id
        decisionStatus
      }
    }
  }
`

export { corporationTimeOffRequestQuery, approveTimeOffRequestMutation };
