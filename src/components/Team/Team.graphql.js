import { gql } from 'react-apollo';

export const userQuery = gql `
 query UserById($id: Uuid!){
  userById(id: $id){
    id
    firstName
    lastName
    avatarUrl
    zipCode
    userPhoneConfirmed
    userPhoneNumber
    aboutMeText
    userReferencesByUserId{
      edges{
        node{
          id
          firstName
          lastName
          referencePhoneNumber
          referenceEmailAddress
          relationship
          userId
        }
      }
    }
    jobsByUserId{
      edges{
        node{
          id
          isTrainable
          workplaceId
          isVerified
          isPreTrainingComplete
          rating
          primaryJob
          positionByPositionId{
                positionName
          }
        }
    }
  }
    userEmployersByUserId{
      nodes{
         id
         userId
         employerName
         city
         state
         jobTitle
         jobDescription
         startDate
         endDate
      }
    }
  	userEducationsByUserId{
      nodes{
        id
        userId
        educationalInstitutionName,
        city
        state
        awardType
        fieldOfStudy
        startDate
        endDate
      }
    }
    userLanguagesByUserId {
      nodes {
        id
        userId
        languageName
      }
    }
    userAvailabilitiesByUserId {
      nodes {
        id
        userId
        hourRange
      }
    }
    
  }
}`;
