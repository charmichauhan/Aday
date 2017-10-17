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
    }`,
  getRecurringShiftDetails: gql`
    query recurringShiftById ($id: Uuid!) {
      recurringShiftById (id: $id) {
        startDate
        expiration
      }
    }
  `
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
    }`,
  createShiftTag: gql`
    mutation createShiftTag ($shiftTag: ShiftTagInput!) {
      createShiftTag (input: { shiftTag: $shiftTag }) {
        shiftTag {
          tagId
          shiftId
        }
      }
    }
  `
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

function getRecurringShiftById(recurringShiftId) {
  const recurringKey = `recurring-shift-${recurringShiftId}`;
  const recurringShift = sessionStorage.getItem(recurringKey);
  if (recurringShift) return Promise.resolve(JSON.parse(recurringShift));

  return client.query({
    query: queries.getRecurringShiftDetails,
    variables: { id: recurringShiftId }
  }).then((res) => {
    if (res.data && res.data.recurringShiftById) {
      sessionStorage.setItem(recurringKey, JSON.stringify(res.data.recurringShiftById));
      return res.data.recurringShiftById;
    }
  }).catch(err => Promise.reject(err));
}

function createTag(id, name) {
  if (!id || !name) return Promise.reject({ error: 'Name and id property are required' });
  if (typeof name !== 'string') return Promise.reject({ error: 'Name property must be string' });
  name = name.trim().toLowerCase();
  return client.mutate({
    mutation: mutations.createTag,
    variables: { input: { tag: { id, name }}}
  }).then((res) => {
    if (res.data && res.data.createTag) {
      return res.data.createTag.tag;
    }
  }).catch(err => Promise.reject(err));
}

function createShiftTags(tags, shiftId) {
  if (!tags || !shiftId) return Promise.reject({ error: 'Tags and shiftId property are required' });
  if (!Array.isArray(tags)) tags = [tags];
  const promises = tags.map(tag => {
    return client.mutate({
      mutation: mutations.createShiftTag,
      variables: { shiftTag: { tagId: tag.id, shiftId }}
    })
  });
  return Promise.all(promises).then((res) => {
      return res.data;
  }).catch(err => Promise.reject(err));
}

export default { getRelevantPositions, getAllPositionsForUser, getAllTags, getRecurringShiftById, createTag, createShiftTags };
