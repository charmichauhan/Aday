import { gql } from 'react-apollo';

const position_fragment = gql`
  fragment positionData on Position {
    id
    positionName
    positionDescription
    positionIconUrl
    minimumAge
    minimumLiftWeight
    traineeHours
    partTimeWage
    trainingUrl
    exchangeLevel
    jobsByPositionId(condition:{isPositionActive: true, isTrainer: true}) {
      totalCount
      nodes{
        userId
        workplaceId
      }
    }
    opportunitiesByPositionId {
      nodes{
        id
        isPublic
        workplaceId
      }
    }
  }
`

const all_positions= gql`
  query fetchRelevantPositions($corporationId: Uuid!, $brandId: Uuid!, $workplaceId: Uuid){
    fetchRelevantPositions(corporationid: $corporationId, brandid: $brandId, workplaceid: $workplaceId){
      nodes{
        ...positionData
      }
    }
  }
  ${position_fragment}
`;
const add_position=gql`
  mutation createPosition($input:CreatePositionInput!,$data: CreateCorporationBrandWideOpportunitiesInput!){
    createPosition(input:$input){
      position{
        ...positionData
      }
    }
    createCorporationBrandWideOpportunities(input: $data) {
      clientMutationId
    }
  }
  ${position_fragment}
`;
/*
const add_job=gql`
mutation createJob($input:CreateJobInput!){
  createJob(input:$input){
    job{
      id
    }
  }
}`
*/
const update_position=gql`
  mutation updatePosition($input:UpdateOpportunityByIdInput!,$data:UpdatePositionByIdInput!){
    updateOpportunityById(input:$input){
      opportunity{
        id
      }
    }
    updatePositionById(input:$data){
      position{
        ...positionData
      }
    }
  }
  ${position_fragment}
`

const delete_position=gql`
mutation deletePosition($input: DeletePositionByIdInput!) {
  deletePositionById(input: $input) {
    position {
      id
    }
  }
}
`

export { all_positions, add_position, update_position, delete_position };
