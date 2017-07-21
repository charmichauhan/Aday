import { gql } from 'react-apollo';

const corporationTimeOffRequestQuery = gql`
  query ($corporationId: Uuid!){
    allTimeOffRequests(
        condition: {corporationId: $corporationId}){
      edges{
        node{
          userByRequestorId{
            firstName
            lastName
          }
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
  }
`

const approveTimeOffRequestMutation = gql`
  mutation ($id: Uuid!, $decision: TimeOffDecisionStatus!, $approverId: Uuid){
    updateTimeOffRequestById(
      	input: {clientMutationId: "",
    		id: $id,
    		timeOffRequestPatch: {decisionStatus: $decision, approverId: $approverId}}){
      clientMutationId
    }
  }
`

export { corporationTimeOffRequestQuery, approveTimeOffRequestMutation };
