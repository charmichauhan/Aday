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
          workplaceName
          brandId
        }
      }
    }
  `,
  deleteWorkplaceMutation: gql`
    mutation ($id: Uuid!) {
      deleteWorkplaceById (input: { id: $id }) {
        deletedWorkplaceId
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
  `,
  createBrandMutation: gql`
    mutation ($input: CreateBrandInput!) {
      createBrand (input: $input) {
        brand {
          id
          brandName
          brandIconUrl
        }
      }
    }
  `,
  updateBrandMutation: gql`
    mutation ($id: Uuid!, $brandInfo: BrandPatch!) {
      updateBrandById (input: { id: $id, brandPatch: $brandInfo }) {
        brand {
          id
        }
      }
    }
  `,
  deleteBrandMutation: gql`
    mutation ($id: Uuid!) {
      deleteBrandById (input: { id: $id }) {
        deletedBrandId
      }
    }
  `
};

export const corporationResolvers = {
  getCorporationQuery: gql`
    query ($id: Uuid!) {
      corporationById (id: $id  ) {
        id
        corporationName
        corporationIconUrl
        isActive
        corporationAddress
      }
    }
  `,
  updateCorporationMutation: gql`
    mutation ($id: Uuid!, $corporationInfo: CorporationPatch!) {
      updateCorporationById (input: { id: $id, corporationPatch: $corporationInfo }) {
        corporation {
          id
        }
      }
    }
  `
};
