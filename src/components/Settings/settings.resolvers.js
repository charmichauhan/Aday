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
  `,
  updatePasswordMutation: gql`
  mutation ($data: UpdatePasswordInput!){
        updatePassword(input: $data ) {
          boolean
        }
  }`
};

export const workplaceResolvers = {
  allWorkplacesQuery: gql`
    query allWorkplaces ($corporationId: Uuid!) {
      allWorkplaces (condition: { corporationId: $corporationId, isActive: true }) {
        edges {
          node {
            id
            workplaceName
            brandId
            address
            isActive
            address
            dateActivated
            dateDeactivated
            workplaceImageUrl
            brandByBrandId {
              id
              brandName
              brandIconUrl
            }
            shiftsByWorkplaceId {
              nodes {
                id
                startTime
              }
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
          isUnion
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
  `
};

export const brandResolvers = {
  allBrandsQuery: gql`
    query ($corporationId: Uuid!) {
      allBrands {
        edges {
          node {
            id
            brandName
            brandIconUrl
            workplacesByBrandId {
              edges {
                node {
                  id
                  workplaceName
                }
              }
            }
          }
        }
      }
      allCorporationBrands (condition: { corporationId: $corporationId }){
        nodes {
          corporationId
          brandId
          brandByBrandId {
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
