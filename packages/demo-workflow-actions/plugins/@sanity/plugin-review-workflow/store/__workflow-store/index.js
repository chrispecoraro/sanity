import client from 'part:@sanity/base/client'

export * from './workflowDocument'
export * from './workflowDocumentList'

export function setWorkflowState(id, state) {
  return client
    .patch(id)
    .set({state})
    .commit()
}

export function deleteWorkflowState(id) {
  return client.delete(id)
}

export function getVirtualWorkflowDocument(props) {
  let state = 'draft'

  if (!props.draft) state = 'published'

  return {_virtual: true, state}
}

export function createWorkflowState(documentId, state = 'draft') {
  return client
    .transaction()
    .create({
      _type: 'workflow.metadata',
      _id: `workflow.${documentId}`,
      state,
      documentId
    })
    .commit()
}
