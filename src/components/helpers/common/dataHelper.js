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
    }`,
  getUsers: gql`
    query {
      allUsers {
        nodes {
          id
          firstName
          lastName
          avatarUrl
          userEmail
        }
      }
    }
  `,
  getManagers: gql`
  query {
    allManagers {
      nodes {
        id
        nodeId
        workplaceId
        userByUserId {
          id
          avatarUrl
          firstName
          lastName
          userEmail
          userPhoneNumber
        }
      }
    }
  }`
};

function getCurrentWorkplaces(brandId = localStorage.getItem('brandId'), corporationId = localStorage.getItem('corporationId')) {
  if (!corporationId || !brandId) return Promise.reject({ message: 'required data are missing' });
  return client.query({
    query: queries.getWorkplaces,
    variables: { corporationId, brandId }
  }).then((res) => {
    if (res.data && res.data.allWorkplaces) return res.data.allWorkplaces.nodes;
  }).catch(err => Promise.reject(err));
}

function getUsers() {
  return client.query({
    query: queries.getUsers
  }).then((res) => {
    if (res.data && res.data.allUsers) return res.data.allUsers.nodes;
  }).catch(err => Promise.reject(err));
}

function getAllManagers() {
  return client.query({
    query: queries.getManagers
  }).then((res) => {
    if (res.data && res.data.allManagers) return res.data.allManagers.nodes;
  }).catch(err => Promise.reject(err));
}

export default { getCurrentWorkplaces, getUsers, getAllManagers };
