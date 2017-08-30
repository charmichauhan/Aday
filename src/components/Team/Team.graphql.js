import { gql } from 'react-apollo';

export const userQuery = gql `
 query UserById($id: Uuid!){
  userById(id: $id){
    id
    firstName
    lastName
    zipCode
    userPhoneConfirmed
    userPhoneNumber
    aboutMeText
    userReferenceNonDemosByUserId{
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
    userAvailabilityNonDemosByUserId {
      nodes {
        id
        userId
        hourRange
      }
    }
  }
}`;
