import { gql } from 'react-apollo';

export const personalResolvers = {
  userInfoQuery: gql`
    query ($id: Uuid!) {
      userById (id: $id  ) {
        id
        firstName
        lastName
        avatarUrl
        userPhoneNumber
        userEmail
        userPasswordInfo
        userSettings
        zipCode
        userInfo
      }
    }
  `,
  updateUserMutation: gql`
    mutation ($id: Uuid!, $userInfo: UserPatch!) {
      updateUserById (input: { id: $id, userPatch: $userInfo }) {
        user {
          id
          firstName
        }
      }
    }
  `
};

export const workplaceResolvers = {
  allWorkplacesQuery: gql`
    query allWorkplaces ($corporationId: Uuid!) {
      allWorkplaces (condition: { corporationId: $corporationId }) {
        edges {
          node {
            id
            workplaceName
            brandId
            address
            isActive
            workplaceImageUrl
            address
            brandByBrandId {
              id
              brandName
              brandIconUrl
            }
          }
        }
      }
    } 
  `,
  createWorkplaceMutation: gql`
    mutation createWorkplace ($workplace: WorkplaceInput!) {
      createWorkplace (input: { workplace: $workplace }) {
        workplace {
          id
          workplaceName
          brandId
          address
          isActive
          workplaceImageUrl
          address
          brandByBrandId {
            id
            brandName
            brandIconUrl
          }
        }
      }
    }
  `,
  updateWorkplaceMutation: gql`
    mutation ($id: Uuid!, $workplaceInfo: WorkplacePatch!) {
      updateWorkplaceById (input: { id: $id, workplacePatch: $workplaceInfo }) {
        workplace {
          id
        }
      }
    }
  `
};

export const brandResolvers = {
  allBrandsQuery: gql`
    query {
      allBrands {
        edges {
          node {
            id
            brandName
            brandIconUrl
          }
        }
      }
    }
  `
};
