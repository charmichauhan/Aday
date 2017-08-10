import { gql } from 'react-apollo';

export const updateHoliday = gql`
  mutation updateHolidayById($data:UpdateHolidayByIdInput!){
    updateHolidayById(input:$data){
      holiday{
          id
          holidayDay
          holidayName
          workplaceId
          isPyramid
          payMultiplier
     }  
    }
  }
`
export const createHoliday = gql`
  mutation createHoliday($data: CreateHolidayInput!){
    createHoliday(input:$data)
    {
      holiday{
        id
        holidayDay
        holidayName
        workplaceId
        isPyramid
        payMultiplier
      }
    }
  }
`
export const allHolidays = gql`
  query allHolidays{
    allHolidays{
      edges{
        node{
          id
          holidayDay
          holidayName
          workplaceId
          isPyramid
          payMultiplier
        }
      }
    }
  }
`
export const deleteHolidaysById = gql`
  mutation deleteHolidayById($data:DeleteHolidayByIdInput!){
    deleteHolidayById(input:$data){
        holiday{
          id
        }
    }
  }
`
