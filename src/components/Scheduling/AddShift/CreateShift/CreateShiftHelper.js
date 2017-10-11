import { gql } from 'react-apollo';
import { client } from '../../../../index';
import uuidv1 from 'uuid/v1';

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
    }`,
  getAllTags: gql`
    query allTags {
      allTags {
        nodes {
          id
          name
        }
      }
    }`
};

const mutations = {
  createTag: gql`
    mutation createTag ($input: CreateTagInput!) {
      createTag (input : $input) {
        tag {
          id
          name
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

function getAllTags() {
  const tagsKey = 'aday-tags';
  const allTags = sessionStorage.getItem(tagsKey);
  if (allTags) return Promise.resolve(JSON.parse(allTags));

  return client.query({
    query: queries.getAllTags
  }).then((res) => {
    if (res.data && res.data.allTags) {
      sessionStorage.setItem(tagsKey, JSON.stringify(res.data.allTags.nodes));
      return res.data.allTags.nodes;
    }
  }).catch(err => Promise.reject(err));
}

function createTag(tagName) {
  if (!tagName) return Promise.reject({ error: 'Tag name is required' });

  return client.mutate({
    mutation: mutations.createTag,
    variables: { input: { tag: { id: uuidv1() , name: tagName }}}
  }).then((res) => {
    if (res.data && res.data.createTag) {
      // sessionStorage.setItem(tagsKey, JSON.stringify(res.data.allTags.nodes));
      return res.data.createTag.tag;
    }
  }).catch(err => Promise.reject(err));
}

export default { getRelevantPositions, getAllPositionsForUser, getAllTags, createTag };
