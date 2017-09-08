import { gql } from 'react-apollo';
import { client } from '../../../../index';

const queries = {
  getRelevantPositions: gql`
    query fetchRelevantPositions ($workplaceId: Uuid, $brandId: Uuid!, $corporationId: Uuid!) {
      fetchRelevantPositions (workplaceid: $workplaceId, brandid: $brandId, corporationid: $corporationId) {
        nodes {
          positionName
          id
          exchangeLevel
          workplaceId
        }
      }
    }`
};

function getRelevantPositions(workplaceId) {
  const brandId = localStorage.getItem('brandId');
  const corporationId = localStorage.getItem('corporationId');
  if (!workplaceId) workplaceId = localStorage.getItem('workplaceId');
  return client.query({
    query: queries.getRelevantPositions,
    variables: { brandId, corporationId, workplaceId }
  }).then((res) => {
    if (res.data && res.data.fetchRelevantPositions) return res.data.fetchRelevantPositions.nodes;
  }).catch(err => Promise.reject(err));
}

export default { getRelevantPositions };
