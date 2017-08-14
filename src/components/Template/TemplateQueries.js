import { gql } from 'react-apollo';

const allTemplates = gql`
  query allTemplates {
    allTemplates {
        edges{
            node{
              id
              templateName
            }
        }
    }
}`

const allWeekPublisheds = gql
  `query allWeekPublisheds($brandid: Uuid!){
        allWeekPublisheds(condition: { brandId: $brandid }){
            nodes{
            id
            published
            start
            end
        }
    }
}`


const editTemplateNameMutation = gql`
  mutation ($id: Uuid!,  $templateName: String!){
    updateTemplateById (input: {id: $id, templatePatch: {templateName:$templateName}}){
      template{
        id
        templateName
      }
    }
  }`

const allTemplateShifts = gql`
  query allTemplateShifts($id: Uuid!){
    templateById(id: $id) {
              id
              templateName
              workplaceByWorkplaceId{
                workplaceName
              }
                templateShiftsByTemplateId{
                    edges{
                      node{
                        id
                        dayOfWeek
                        startTime
                        endTime
                        workerCount
                        positionByPositionId{
                            positionName
                        }
                        templateShiftAssigneesByTemplateShiftId{
                            edges{
                              node{
                                userByUserId {
                                  firstName
                                  lastName
                                  avatarUrl
                                }
                              }
                            }
                        }
                      }
                    }
            }
    }
}`

  const allUsers = gql`
      query allUsers {
          allUsers{
              edges{
                  node{
                      id
                      firstName
                      lastName
                      avatarUrl
                  }
              }
          }
      }
      `

  const createWeekPublishedMutation = gql`
   mutation createWeekPublished($data:CreateWeekPublishedInput!){
    createWeekPublished(input:$data)
      {
      weekPublished{
        id
        start
        end
        published
      }
    }
  }`

  const deleteTemplateMutation = gql`
    mutation ($templateId: Uuid!){
      deleteTemplateById(input: {id: $templateId}){
        template{
    			id
          templateName
          templateShiftsByTemplateId{
            nodes{
              id
            }
          }
        }
        deletedTemplateId
      }
    }`

export { allTemplates, allWeekPublisheds, editTemplateNameMutation,
         allTemplateShifts, allUsers, createWeekPublishedMutation, deleteTemplateMutation}
