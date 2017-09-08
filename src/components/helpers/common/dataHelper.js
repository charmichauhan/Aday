import { gql } from 'react-apollo';
import { client } from '../../../index';

const queries = {
  getWorkplaces: gql`
    query ($brandId: Uuid!, $corporationId: Uuid!) {
      allWorkplaces (condition: {brandId: $brandId, corporationId: $corporationId}) {
        nodes {
          id
          workplaceName
          brandId
          isActive
        }
      }
    }`
};

/**
 *
 */
function getCurrentWorkplaces(brandId = localStorage.getItem('brandId'), corporationId = localStorage.getItem('corporationId')) {
  return client.query({
    query: queries.getWorkplaces,
    variables: { corporationId, brandId }
  }).then((res) => {
    if (res.data && res.data.allWorkplaces) return res.data.allWorkplaces.nodes;
  }).catch(err => err);
}

export default { getCurrentWorkplaces };
