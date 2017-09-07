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
    employeesByUserId{
    edges{
      node{
        workplaceByPrimaryWorkplace
        {
          id
          workplaceName
        }
      }
    }
  }
  
 
  
  }
}`

export const releventPositionsQuery = gql`
  query ($corporationId: Uuid, $brandId: Uuid, $userId: Uuid) {
    allPositions(condition: { corporationId: $corporationId, brandId: $brandId} ){
      nodes {
        id
        positionName
        traineeHours
        jobsByPositionId (condition: { userId: $userId }) {
          nodes {
            id
            isPositionActive
            primaryJob
            rating
            numTraineeHoursCompleted
          }
        }
      }
    }
  }`;

export const updateJobPrimaryPosition = gql`
  mutation ($id: Uuid!, $jobInfo: JobPatch!) {
    updateJobById (input: { id: $id, jobPatch: $jobInfo }) {
      job {
        id
      }
    }
  }
`
