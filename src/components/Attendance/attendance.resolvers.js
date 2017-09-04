import { gql } from 'react-apollo';

export const timeOffRequestResolvers = {
  corporationTimeOffRequestQuery: gql`
    query ($corporationId: Uuid!) {
      allTimeOffRequests (condition: { corporationId: $corporationId }, orderBy: START_DATE_DESC) {
        nodes {
          id
            startDate
            endDate
            submissionDate
            requestType
            minutesPaid
            payDate
            notes
            decisionStatus
            userByRequestorId {
              firstName
              lastName
            }
        }
      }
    }`,
  corporationTimeOffRequestQueryOld: gql`
    query ($corporationId: Uuid!, $cursor: Cursor) {
      allTimeOffRequests (first: 25, after: $cursor, condition: { corporationId: $corporationId }, orderBy: START_DATE_DESC) {
        edges {
          node {
            id
            startDate
            endDate
            submissionDate
            requestType
            minutesPaid
            payDate
            notes
            decisionStatus
            userByRequestorId {
              firstName
              lastName
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`,
  approveTimeOffRequestMutation: gql`
    mutation ($clientMutationId: String!, $id: Uuid!, $decision: TimeOffDecisionStatus!, $approverId: Uuid) {
      updateTimeOffRequestById (input: {
       clientMutationId: $clientMutationId,
       id: $id,
       timeOffRequestPatch: {
         decisionStatus: $decision,
         approverId: $approverId
       }
       }) {
        timeOffRequest {
          id
          decisionStatus
        }
      }
    }`
};

export const shiftHistoryResolvers = {
  shiftHistoryQuery: gql`
    query ($workplaceId: Uuid!) {
      allShifthistories (condition: { workplaceId: $workplaceId }) {
        nodes {
          workerId
          positionId
          workplaceId
          startTime
          endTime
          rating
          positionName
          firstName
          lastName
          id
          avatarUrl
          wage
          corporationId
        }
      }
    }`,
  updateJobRatingMutation: gql`
    mutation ($id: Uuid!, $jobInfo: JobPatch!) {
      updateJobById (input: { id: $id, jobPatch: $jobInfo }) {
        job {
          id
        }
      }
    }
  `
};
