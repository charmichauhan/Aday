import { gql } from 'react-apollo';

export const userQuery = gql `
 query userById($id: Uuid!, $corporationId: Uuid!){
  userById(id: $id){
    id
    firstName
    lastName
    avatarUrl
    zipCode
    userPhoneConfirmed
    userPhoneNumber
    userEmail
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
    jobsByUserId(condition: {isPositionActive: true}){
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
    employeesByUserId(condition: { corporationId: $corporationId }){
    edges{
      node{
        id
        wage
        hireDate
        deletionDate
        payrollNum
        primaryWorkplace
        dayHourLimit
        weekHourLimit
        monthHourLimit
        workplaceByPrimaryWorkplace{
          id
          workplaceName
        }
      }
    }
  }



  }
}`

export const releventPositionsQuery = gql`
  query releventPositionsQuery($corporationId: Uuid, $brandId: Uuid, $userId: Uuid) {
    allPositions(condition: { corporationId: $corporationId, brandId: $brandId} ){
      nodes {
        id
        positionName
        traineeHours
        jobsByPositionId (condition: { userId: $userId, isPositionActive: true }) {
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

export const fetchPrimaryLocation = gql`
query fetchPrimaryLocation ($corporationId: Uuid!) {
      allWorkplaces (condition: { corporationId: $corporationId, isActive: true }) {
        edges {
          node {
            id
            workplaceName
            brandId
            address
            isActive
          }
        }
      }
    }
`

export const updateEmployeeById = gql`
mutation ($id: Uuid!, $employeeInfo: EmployeePatch!) {
  updateEmployeeById (input: { id: $id, employeePatch: $employeeInfo }) {
  employee {
      id
      wage
      hireDate
      deletionDate
      payrollNum
      primaryWorkplace
      dayHourLimit
      weekHourLimit
      monthHourLimit
      workplaceByPrimaryWorkplace{
            id
            workplaceName
      }
    }
  }
}
`
