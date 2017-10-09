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
    }`,
  getAllPositionsForUser: gql`
    query releventPositionsQuery ($corporationId: Uuid, $brandId: Uuid, $userId: Uuid) {
      allPositions (condition: { corporationId: $corporationId, brandId: $brandId }) {
        nodes {
          id
          positionName
          traineeHours
          jobsByPositionId (condition: { isPositionActive: true, userId: $userId }) {
            nodes {
              id
              isPositionActive
              primaryJob
              rating
              userId
              numTraineeHoursCompleted
            }
          }
        }
      }
    }`
};

function getRelevantPositions(workplaceId) {
  const brandId = localStorage.getItem('brandId');
  const corporationId = localStorage.getItem('corporationId');
  if (!workplaceId) workplaceId = localStorage.getItem('workplaceId');

  if (!workplaceId || !corporationId || !brandId) return Promise.reject({ message: 'required data are missing' });

  const positionsKey = `relevantPositions-${brandId}-${corporationId}-${workplaceId}`;
  const relevantPositions = sessionStorage.getItem(positionsKey);
  if (relevantPositions) return Promise.resolve(JSON.parse(relevantPositions));

  return client.query({
    query: queries.getRelevantPositions,
    variables: { brandId, corporationId, workplaceId }
  }).then((res) => {
    if (res.data && res.data.fetchRelevantPositions) {
      sessionStorage.setItem(positionsKey, JSON.stringify(res.data.fetchRelevantPositions.nodes));
      return res.data.fetchRelevantPositions.nodes;
    }
  }).catch(err => Promise.reject(err));
}

function getAllPositionsForUser(userId) {
  const brandId = localStorage.getItem('brandId');
  const corporationId = localStorage.getItem('corporationId');

  if (!corporationId || !brandId || !userId) return Promise.reject({ message: 'required data are missing' });

  const positionsKey = `userPositions-${brandId}-${corporationId}-${userId}`;
  const userPositions = sessionStorage.getItem(userPositions);
  if (userPositions) return Promise.resolve(JSON.parse(userPositions));

  return client.query({
    query: queries.getAllPositionsForUser,
    variables: { brandId, corporationId, userId }
  }).then((res) => {
    if (res.data && res.data.allPositions) {
      sessionStorage.setItem(positionsKey, JSON.stringify(res.data.allPositions.nodes));
      return res.data.allPositions.nodes;
    }
  }).catch(err => Promise.reject(err));
}

export default { getRelevantPositions, getAllPositionsForUser };
